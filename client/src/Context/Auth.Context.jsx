import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  loginWithGoogle,
  logoutUser,
} from "../services/auth.services.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /**
   * Check whether the backend session is still valid.
   * The backend validates the HTTP-only session cookie.
   */
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setAuthError(null);

      return currentUser;
    } catch (error) {
      setUser(null);

      if (error.response?.status !== 401) {
        setAuthError(error.message || "Unable to verify your session.");
      }

      return null;
    }
  }, []);

  /**
   * Check for an existing session when the provider mounts.
   */
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const currentUser = await getCurrentUser();

        if (mounted) {
          setUser(currentUser);
          setAuthError(null);
        }
      } catch (error) {
        if (mounted) {
          setUser(null);

          if (error.response?.status !== 401) {
            setAuthError(
              error.message || "Unable to verify your session.",
            );
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Sign in using email and password.
   */
  const login = useCallback(async (credentials) => {
    setAuthError(null);

    try {
      const authenticatedUser = await loginUser(credentials);
      setUser(authenticatedUser);

      return authenticatedUser;
    } catch (error) {
      setAuthError(error.message || "Login failed.");
      throw error;
    }
  }, []);

  /**
   * Complete backend login after Firebase Google authentication.
   * Pass the Firebase ID token obtained from the signed-in Firebase user.
   */
  const loginGoogle = useCallback(async (firebaseIdToken) => {
    setAuthError(null);

    try {
      const authenticatedUser = await loginWithGoogle(firebaseIdToken);
      setUser(authenticatedUser);

      return authenticatedUser;
    } catch (error) {
      setAuthError(error.message || "Google sign-in failed.");
      throw error;
    }
  }, []);

  /**
   * End the backend session.
   */
  const logout = useCallback(async () => {
    setAuthError(null);

    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      authError,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      login,
      loginGoogle,
      logout,
      refreshUser,
    }),
    [
      user,
      loading,
      authError,
      login,
      loginGoogle,
      logout,
      refreshUser,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}