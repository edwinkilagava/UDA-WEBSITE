
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Hooks/Auth.Hooks.js";

function RoleRoutes({ allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

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
            Checking your permissions...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RoleRoutes;
