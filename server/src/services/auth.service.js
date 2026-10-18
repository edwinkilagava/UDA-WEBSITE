
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createAuthError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeEmail(email) {
  return typeof email === "string"
    ? email.trim().toLowerCase()
    : "";
}

function validatePassword(password) {
  if (typeof password !== "string") {
    throw createAuthError("Password is required.", 400);
  }

  const byteLength = Buffer.byteLength(password, "utf8");

  if (byteLength < 8 || byteLength > 72) {
    throw createAuthError(
      "Password must be between 8 and 72 UTF-8 bytes.",
      400
    );
  }
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    status: user.status,
    authProvider: user.authProvider,
    emailVerified: user.emailVerified,
  };
}

export async function registerLocalUser({ fullName, email, password }) {
  if (typeof fullName !== "string") {
    throw createAuthError("Full name is required.", 400);
  }

  fullName = fullName.trim();
  email = normalizeEmail(email);

  if (fullName.length < 2 || fullName.length > 100) {
    throw createAuthError(
      "Full name must contain between 2 and 100 characters.",
      400
    );
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    throw createAuthError("Enter a valid email address.", 400);
  }

  validatePassword(password);

  const existingUser = await User.findOne({ email }).lean();

  if (existingUser) {
    throw createAuthError(
      "An account with this email already exists.",
      409
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      authProvider: "local",
      role: "user",
      status: "active",
      emailVerified: false,
    });

    return publicUser(user);
  } catch (error) {
    // The unique database index also protects against
    // simultaneous registration attempts.
    if (error.code === 11000) {
      throw createAuthError(
        "An account with this email already exists.",
        409
      );
    }

    throw error;
  }
}

export async function verifyLocalCredentials({ email, password }) {
  email = normalizeEmail(email);

  if (!email || typeof password !== "string" || !password) {
    throw createAuthError("Email and password are required.", 400);
  }

  const user = await User.findOne({ email }).select("+passwordHash");

  // Use a generic response so we don't reveal whether an
  // email address has an account.
  if (!user || !user.passwordHash) {
    throw createAuthError("Invalid email or password.", 401);
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw createAuthError("Invalid email or password.", 401);
  }

  if (user.status !== "active") {
    throw createAuthError(
      "This account is not currently active.",
      403
    );
  }

  return publicUser(user);
}

export async function findOrCreateFirebaseUser(firebaseIdentity) {
  const {
    uid,
    email: rawEmail,
    name,
    email_verified: emailVerified,
    firebase,
  } = firebaseIdentity;

  const email = normalizeEmail(rawEmail);

  if (!uid || !email || !EMAIL_PATTERN.test(email)) {
    throw createAuthError(
      "Firebase did not provide a valid account identity.",
      401
    );
  }

  // This endpoint is intended for Google sign-in.
  if (firebase?.sign_in_provider !== "google.com") {
    throw createAuthError(
      "Please sign in using your Google account.",
      403
    );
  }

  if (emailVerified !== true) {
    throw createAuthError(
      "Please verify your Google account email before continuing.",
      403
    );
  }

  let user = await User.findOne({ firebaseUid: uid });

  if (!user) {
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      // Never automatically link identities just because
      // their email strings match.
      throw createAuthError(
        "An account already uses this email. Sign in using its existing method or complete a secure account-linking process.",
        409
      );
    }

    try {
      user = await User.create({
        fullName:
          typeof name === "string" && name.trim()
            ? name.trim().slice(0, 100)
            : email.split("@")[0].slice(0, 100),
        email,
        authProvider: "firebase",
        firebaseUid: uid,
        role: "user",
        status: "active",
        emailVerified: true,
      });
    } catch (error) {
      if (error.code === 11000) {
        // A concurrent request may have created this Firebase
        // identity. Resolve it without changing account roles.
        user = await User.findOne({ firebaseUid: uid });
        if (!user) {
          throw createAuthError(
            "An account already exists with this email.",
            409
          );
        }
      } else {
        throw error;
      }
    }
  }

  if (user.status !== "active") {
    throw createAuthError(
      "This account is not currently active.",
      403
    );
  }

  return publicUser(user);
}

export async function getActiveUserById(userId) {
  const user = await User.findById(userId);

  if (!user || user.status !== "active") {
    throw createAuthError(
      "Your account is not available. Please sign in again.",
      401
    );
  }

  return publicUser(user);
}
