
import { useContext } from "react";
import { AuthContext } from "../Context/Auth.Context.jsx";


/**
 * Access the authentication state and actions.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider.",
    );
  }

  return context;
}

