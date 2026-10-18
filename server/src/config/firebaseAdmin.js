import "dotenv/config";

import {
  applicationDefault,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";

let firebaseApp;

if (getApps().length > 0) {
  firebaseApp = getApps()[0];
} else {
  firebaseApp = initializeApp({
    credential: applicationDefault(),
  });
}

export const firebaseAdminAuth = getAuth(firebaseApp);

export default firebaseApp;