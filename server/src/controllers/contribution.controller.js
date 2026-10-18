
import Contribution from "../models/Contribution.js";
import { initiateStkPush } from "../services/mpesa.service.js";

export const createContributionController = async (req, res, next) => {
  let contribution;

  try {
    const { donorName, phone, amount } = req.body;

    // 1. Validate the donation amount.
    const donationAmount = Number(amount);

    if (
      amount === undefined ||
      amount === null ||
      String(amount).trim() === "" ||
      !Number.isSafeInteger(donationAmount) ||
      donationAmount < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Donation amount must be a whole number of at least KSh 1.",
      });
    }

    // 2. Validate the phone number.
    if (typeof phone !== "string" || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "An M-PESA phone number is required.",
      });
    }

    // 3. Validate the optional donor name.
    if (
      donorName !== undefined &&
      (typeof donorName !== "string" || donorName.trim().length > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Donor name must be 100 characters or fewer.",
      });
    }

    // 4. Save a pending contribution before contacting Safaricom.
    contribution = await Contribution.create({
      donorName: donorName?.trim() || "Anonymous",
      phone: phone.trim(),
      amount: donationAmount,
      recipientName: "UDA",
      paymentMethod: "mpesa",
      status: "pending",
    });

    // 5. Request an STK Push from Safaricom.
    const stkResponse = await initiateStkPush({
      phone: contribution.phone,
      amount: contribution.amount,
      accountReference: `UDA${contribution._id.toString().slice(-8)}`,
      transactionDesc: "UDA contribution",
    });

    // 6. Store Safaricom's request identifiers.
    contribution.merchantRequestId =
      stkResponse.MerchantRequestID || null;

    contribution.checkoutRequestId =
      stkResponse.CheckoutRequestID || null;

    await contribution.save();

    // 7. Tell the frontend that the request was submitted.
    return res.status(202).json({
      success: true,
      message:
        stkResponse.ResponseDescription ||
        "Payment request submitted. Check your phone for the M-PESA prompt.",
      contributionId: contribution._id,
      customerMessage:
        stkResponse.CustomerMessage ||
        "Check your phone for the M-PESA payment prompt.",
    });
  } catch (error) {
    // Preserve the record for auditing if the payment request fails.
    if (contribution && !contribution.checkoutRequestId) {
      contribution.resultDescription =
        "Unable to confirm STK Push submission. Check payment status before retrying.";
      await contribution.save().catch(() => {});
    }

    return next(error);
  }
};
