
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "../../firebase/firebase.js";
import { useAuth } from "../../Hooks/Auth.Hooks.js";
import { registerUser } from "../../services/auth.services.js";

function getRegistrationError(error) {
  const messages = {
    "auth/email-already-in-use":
      "This email is already registered. Please log in instead.",
    "auth/invalid-email":
      "Please enter a valid email address.",
    "auth/weak-password":
      "Please choose a stronger password.",
    "auth/too-many-requests":
      "Too many attempts. Please try again later.",
    "auth/network-request-failed":
      "Network error. Check your internet connection.",
    "auth/operation-not-allowed":
      "This registration method is not enabled.",
    "auth/popup-closed-by-user":
      "Google sign-in was cancelled.",
    "auth/popup-blocked":
      "Your browser blocked the Google sign-in popup.",
    "auth/cancelled-popup-request":
      "Another sign-in popup is already open.",
    "auth/account-exists-with-different-credential":
      "An account already exists with this email using another sign-in method. Log in with that method first.",
  };

  return (
    messages[error.code] ||
    error.message ||
    "Registration failed. Please try again."
  );
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-5 w-5 shrink-0"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.05 13.22l7.98 6.19C12.93 13.72 18.01 9.5 24 9.5Z"
        transform="translate(0 4)"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.75 7.18l7.73 6C44.43 38.06 46.98 31.94 46.98 24.55Z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.53 10.78l8-6.19Z"
        transform="translate(1 0)"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.45-4.89 2.3-8.17 2.3-5.99 0-11.07-4.22-12.97-9.91l-8 6.19C6.51 43.62 14.62 48 24 48Z"
      />
    </svg>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { loginGoogle } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (!name || !email || !form.password || !form.confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (name.length < 2 || name.length > 100) {
      setError("Your name must contain between 2 and 100 characters.");
      return;
    }

    if (email.length > 254) {
      setError("Please use a shorter email address.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (new TextEncoder().encode(form.password).length > 72) {
      setError("Password must not exceed 72 UTF-8 bytes.");
      return;
    }

    setLoading(true);

    try {
      // Register through our Express backend, not directly
      // through Firebase email/password authentication.
      await registerUser({
        fullName: name,
        email,
        password: form.password,
      });

      setSuccess(
        "Your account has been created. You can now log in.",
      );

      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (registrationError) {
      setError(getRegistrationError(registrationError));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setSuccess("");
    setLoading(true);

    let firebaseUserSignedIn = false;

    try {
      // Authenticate with Google through Firebase.
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      firebaseUserSignedIn = true;

      // Exchange the Firebase ID token for our backend session.
      const firebaseIdToken = await result.user.getIdToken();
      await loginGoogle(firebaseIdToken);

      setSuccess("Google sign-in successful. Redirecting...");
      navigate("/", { replace: true });
    } catch (googleError) {
      // Avoid leaving a Firebase-only session when the backend
      // rejects the authentication request.
      if (firebaseUserSignedIn) {
        try {
          await signOut(auth);
        } catch {
          // Preserve the original authentication error.
        }
      }

      setError(getRegistrationError(googleError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create an Account
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Join our membership community.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            aria-live="polite"
            className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Full name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              minLength={2}
              maxLength={100}
              required
              disabled={loading}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              maxLength={254}
              required
              disabled={loading}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              required
              disabled={loading}
              placeholder="At least 8 characters"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your password again"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-800 px-4 py-3 font-semibold text-white transition hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Please wait..." : "Create Account"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-500">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleIcon />
          {loading ? "Please wait..." : "Continue with Google"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-green-800 hover:underline"
          >
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
