import axios from "axios";
import env from "../config/env.js";

const getMpesaBaseUrl = () => {
  return env.mpesa.environment === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
};

const getAccessToken = async () => {
  const { consumerKey, consumerSecret } = env.mpesa;

  if (!consumerKey || !consumerSecret) {
    throw new Error(
      "M-PESA consumer credentials are not configured."
    );
  }

  const credentials = Buffer.from(
    `${consumerKey}:${consumerSecret}`
  ).toString("base64");

  const response = await axios.get(
    `${getMpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      timeout: 15000,
    }
  );

  return response.data.access_token;
};

const getTimestamp = () => {
  const now = new Date();

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return (
    values.year +
    values.month +
    values.day +
    values.hour +
    values.minute +
    values.second
  );
};

const normalizePhoneNumber = (phone) => {
  const cleaned = String(phone).replace(/[\s+-]/g, "");

  if (/^0[17]\d{8}$/.test(cleaned)) {
    return `254${cleaned.slice(1)}`;
  }

  if (/^254[17]\d{8}$/.test(cleaned)) {
    return cleaned;
  }

  throw new Error(
    "Enter a valid Kenyan M-PESA phone number."
  );
};

export const initiateStkPush = async ({
  phone,
  amount,
  accountReference,
  transactionDesc,
}) => {
  const {
    shortcode,
    passkey,
    callbackUrl,
  } = env.mpesa;

  if (!shortcode || !passkey || !callbackUrl) {
    throw new Error(
      "M-PESA shortcode, passkey, and callback URL must be configured."
    );
  }

  if (
    !Number.isSafeInteger(amount) ||
    amount < 1
  ) {
    throw new Error(
      "Donation amount must be a whole number of at least KSh 1."
    );
  }

  if (!/^https:\/\//i.test(callbackUrl)) {
    throw new Error(
      "M-PESA callback URL must use HTTPS."
    );
  }

  const formattedPhone = normalizePhoneNumber(phone);
  const timestamp = getTimestamp();

  const password = Buffer.from(
    `${shortcode}${passkey}${timestamp}`
  ).toString("base64");

  const accessToken = await getAccessToken();

  const response = await axios.post(
    `${getMpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      timeout: 20000,
    }
  );

  return response.data;
};
