
import axios from "axios";
import { auth } from "../firebase/firebase.js";

// Backend API URL from the Vite environment.
const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error(
    "VITE_API_URL is missing. Check your frontend .env file."
  );
}

// Shared API client.
const api = axios.create({
  baseURL,
  withCredentials: true,
  // Do not set Content-Type globally.
  // Axios will set the correct content type for JSON and FormData.
  timeout: 120000,
});

// Attach a Firebase ID token when Firebase has an authenticated user.
api.interceptors.request.use(
  async (config) => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      const token = await currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Remove a default JSON content type for FormData requests.
    if (config.data instanceof FormData) {
      if (typeof config.headers.delete === "function") {
        config.headers.delete("Content-Type");
      } else {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Centralized response and error handling.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.isNetworkError = true;
      error.message =
        "Unable to reach the server. Check your connection and try again.";

      return Promise.reject(error);
    }

    const data = error.response.data;

    error.message =
      data?.message ||
      data?.error ||
      "Something went wrong. Please try again.";

    error.status = error.response.status;
    error.data = data;

    return Promise.reject(error);
  }
);

export default api;
