
import api from "./api.js";

/**
 * Retrieve the currently authenticated user.
 * The backend validates the HTTP-only uda_session cookie.
 */
export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data.data.user;
}

/**
 * Sign in using email and password.
 * The backend creates the uda_session cookie.
 */
export async function loginUser(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data.data.user;
}

/**
 * Sign in using a Firebase Google ID token.
 * The backend verifies the Firebase token and creates its session cookie.
 */
export async function loginWithGoogle(firebaseIdToken) {
  const response = await api.post(
    "/auth/google",
    {},
    {
      headers: {
        Authorization: `Bearer ${firebaseIdToken}`,
      },
    },
  );

  return response.data.data.user;
}

/**
 * Register a local account.
 * Registration does not grant administrator privileges.
 */
export async function registerUser(userData) {
  const response = await api.post("/auth/register", userData);
  return response.data.data.user;
}

/**
 * End the backend session and clear the session cookie.
 */
export async function logoutUser() {
  const response = await api.post("/auth/logout");
  return response.data;
}
