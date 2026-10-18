import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,

  // Optional Firebase configuration.
  storageBucket: "udawebpage.firebasestorage.app",
  messagingSenderId: "470881455875",
  measurementId: "G-GK5XKB2PKD",
};

const requiredConfig = [
  "apiKey",
  "authDomain",
  "projectId",
  "appId",
];

const missingConfig = requiredConfig.filter(
  (key) => !firebaseConfig[key]
);

if (missingConfig.length > 0) {
  throw new Error(
    `Missing Firebase configuration: ${missingConfig.join(", ")}. ` +
      "Check your client/.env file."
  );
}

// Reuse an existing Firebase app when available.
const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

// Firebase Authentication used by the API request interceptor
// and Google sign-in components.
export const auth = getAuth(app);

// Analytics is optional and must never prevent authentication.
export let analytics = null;

isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  })
  .catch(() => {
    // Authentication remains available if Analytics fails.
  });

export default app;