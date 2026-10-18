
import jwt from "jsonwebtoken";
import env from "../config/env.js";

import {
  registerLocalUser,
  verifyLocalCredentials,
  findOrCreateFirebaseUser,
} from "../services/auth.service.js";

const COOKIE_NAME = "uda_session";
const SESSION_DURATION_MS = 30 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "lax",
  path: "/",
};

function createSession(res, user) {
  const token = jwt.sign(
    { sub: user.id },
    env.jwtSecret,
    { expiresIn: "30m" }
  );

  res.cookie(COOKIE_NAME, token, {
    ...cookieOptions,
    maxAge: SESSION_DURATION_MS,
  });
}

export async function registerController(req, res, next) {
  try {
    const user = await registerLocalUser(req.body);

    createSession(res, user);

    return res.status(201).json({
      success: true,
      message: "Your website account has been created.",
      data: { user },
    });
  } catch (error) {
    return next(error);
  }
}

export async function loginController(req, res, next) {
  try {
    const user = await verifyLocalCredentials(req.body);

    createSession(res, user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: { user },
    });
  } catch (error) {
    return next(error);
  }
}

export async function googleLoginController(req, res, next) {
  try {
    const user = await findOrCreateFirebaseUser(req.firebaseUser);

    createSession(res, user);

    return res.status(200).json({
      success: true,
      message: "Google sign-in successful.",
      data: { user },
    });
  } catch (error) {
    return next(error);
  }
}

export async function currentUserController(req, res) {
  return res.status(200).json({
    success: true,
    data: { user: req.user },
  });
}

export function logoutController(req, res) {
  res.clearCookie(COOKIE_NAME, cookieOptions);

  return res.status(200).json({
    success: true,
    message: "You have been logged out.",
  });
}
