import Contribution from "../models/Contribution.js";

export const mpesaCallbackController = async (req, res, next) => {
  try {
    const callback = req.body?.Body?.stkCallback;

    if (
      !callback ||
      typeof callback.CheckoutRequestID !== "string" ||
      !callback.CheckoutRequestID
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid M-PESA callback payload.",
      });
    }

    const contribution = await Contribution.findOne({
      checkoutRequestId: callback.CheckoutRequestID,
    });

    if (!contribution) {
      console.warn(
        "M-PESA callback received for an unknown checkout request."
      );

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Callback received.",
      });
    }

    // Ignore callbacks for contributions already processed.
    if (contribution.status !== "pending") {
      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Callback already processed.",
      });
    }

    const resultCode = Number(callback.ResultCode);

    if (!Number.isInteger(resultCode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid M-PESA result code.",
      });
    }

    contribution.resultCode = resultCode;
    contribution.resultDescription =
      String(callback.ResultDesc || "Payment result received.").slice(0, 500);

    if (resultCode !== 0) {
      contribution.status =
        resultCode === 1032 ? "cancelled" : "failed";

      await contribution.save();

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Callback received.",
      });
    }

    const items = callback.CallbackMetadata?.Item;

    if (!Array.isArray(items)) {
      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Callback received; payment requires reconciliation.",
      });
    }

    const metadata = Object.fromEntries(
      items
        .filter((item) => item && typeof item.Name === "string")
        .map((item) => [item.Name, item.Value])
    );

    const receipt = metadata.MpesaReceiptNumber;
    const paidAmount = Number(metadata.Amount);
    const paidPhone = String(metadata.PhoneNumber ?? "");

    const digits = contribution.phone.replace(/\D/g, "");
    const expectedPhone = digits.startsWith("0")
      ? `254${digits.slice(1)}`
      : digits;

    if (
      typeof receipt !== "string" ||
      !receipt.trim() ||
      !Number.isSafeInteger(paidAmount) ||
      paidAmount !== contribution.amount ||
      paidPhone !== expectedPhone
    ) {
      contribution.resultDescription =
        "Payment details require reconciliation before confirmation.";

      await contribution.save();

      console.error(
        "M-PESA payment verification mismatch:",
        contribution._id.toString()
      );

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Callback received.",
      });
    }

    contribution.mpesaReceiptNumber = receipt.trim().toUpperCase();
    contribution.status = "successful";
    contribution.paidAt = parseMpesaDate(metadata.TransactionDate);

    try {
      await contribution.save();
    } catch (error) {
      if (error?.code === 11000) {
        console.error("Duplicate M-PESA receipt detected.");
        return res.status(200).json({
          ResultCode: 0,
          ResultDesc: "Callback received.",
        });
      }

      throw error;
    }

    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Callback received.",
    });
  } catch (error) {
    return next(error);
  }
};

const parseMpesaDate = (value) => {
  const dateString = String(value ?? "");

  if (!/^\d{14}$/.test(dateString)) {
    return new Date();
  }

  const year = Number(dateString.slice(0, 4));
  const month = Number(dateString.slice(4, 6));
  const day = Number(dateString.slice(6, 8));
  const hour = Number(dateString.slice(8, 10));
  const minute = Number(dateString.slice(10, 12));
  const second = Number(dateString.slice(12, 14));

  // Convert East Africa Time (UTC+3) to UTC.
  return new Date(
    Date.UTC(year, month - 1, day, hour - 3, minute, second)
  );
};
