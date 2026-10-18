
import api from "./api.js";

/**
 * Submit a donation request to the backend.
 * The backend is responsible for initiating M-PESA STK Push.
 */
export const createDonation = async ({
  donorName,
  phone,
  amount,
}) => {
  const response = await api.post("/contributions", {
    donorName,
    phone,
    amount,
  });

  return response.data;
};
