
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "../../firebase/firebase.js";
import { useAuth } from "../../Hooks/Auth.Hooks.js";

function getLoginError(error) {
  const messages = {
    "auth/invalid-credential":
      "Incorrect email or password. Please try again.",
    "auth/user-not-found":
      "No account was found with this email address.",
    "auth/wrong-password":
      "Incorrect email or password.",
    "auth/invalid-email":
      "Please enter a valid email address.",
    "auth/too-many-requests":
      "Too many attempts. Please try again later.",
    "auth/network-request-failed":
      "Network error. Check your internet connection.",
    "auth/popup-closed-by-user":
      "Google sign-in was cancelled.",
    "auth/popup-blocked":
      "Your browser blocked the Google sign-in popup.",
    "auth/user-disabled":
      "This account has been disabled. Please contact support.",
    "auth/account-exists-with-different-credential":
      "An account already exists with this email using another sign-in method. Try that method first.",
  };

  return (
    messages[error.code] ||
    error.message ||
    "Login failed. Please try again."
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

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, loginGoogle } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function navigateAfterLogin(user) {
    const requestedPath = location.state?.from?.pathname;

    // Restore a protected page when one originally sent
    // the user to the login screen.
    if (requestedPath && requestedPath !== "/login") {
      navigate(requestedPath, { replace: true });
      return;
    }

    // Administrators go to the administration dashboard.
    // Regular members return to the public website.
    if (user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    navigate("/", { replace: true });
  }

  async function handleEmailLogin(event) {
    event.preventDefault();
    setError("");

    const email = form.email.trim().toLowerCase();

    if (!email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      // Uses AuthContext, which calls the backend service
      // and updates the application's authenticated user.
      const user = await login({
        email,
        password: form.password,
      });

      navigateAfterLogin(user);
    } catch (loginError) {
      setError(getLoginError(loginError));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);

    let firebaseUserSignedIn = false;

    try {
      // Step 1: Authenticate with Google through Firebase.
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);
      firebaseUserSignedIn = true;

      // Step 2: Obtain the Firebase ID token.
      const firebaseIdToken = await result.user.getIdToken();

      // Step 3: Ask our backend to verify the token,
      // establish its own session cookie, and return the user.
      const user = await loginGoogle(firebaseIdToken);

      // Step 4: Navigate only after backend authentication succeeds.
      navigateAfterLogin(user);
    } catch (loginError) {
      // Avoid leaving a Firebase-only session active when
      // our backend rejects the Google authentication.
      if (firebaseUserSignedIn) {
        try {
          await signOut(auth);
        } catch {
          // Preserve the original login error.
        }
      }

      setError(getLoginError(loginError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Log in to your UDA account.
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

        <form onSubmit={handleEmailLogin} className="space-y-4">
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
              required
              disabled={loading}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between gap-3">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-green-800 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-800 px-4 py-3 font-semibold text-white transition hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Please wait..." : "Log In"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-500">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleIcon />
          {loading ? "Please wait..." : "Continue with Google"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/Register"
            className="font-semibold text-green-800 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
