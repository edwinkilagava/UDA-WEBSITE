
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { getActiveUserById } from "../services/auth.service.js";

export default async function authenticate(req, res, next) {
  try {
    const token = req.cookies?.uda_session;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please sign in to continue.",
      });
    }

    const decoded = jwt.verify(token, env.jwtSecret);

    if (!decoded.sub) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication session.",
      });
    }

    req.user = await getActiveUserById(decoded.sub);

    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError") {
      res.clearCookie("uda_session", {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: "lax",
        path: "/",
      });

      return res.status(401).json({
        success: false,
        message: "Your session is invalid or has expired. Please sign in again.",
      });
    }

    return next(error);
  }
}
