
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Hooks/Auth.Hooks.js";

function ProtectedRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until the backend session check has completed.
  if (loading) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center px-4"
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <div
            className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-700"
            aria-hidden="true"
          />
          <p className="mt-4 text-sm text-gray-600">
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }

  // Preserve the requested page so login can return the user there.
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoutes;
