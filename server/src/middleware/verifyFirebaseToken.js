
import { firebaseAdminAuth } from "../config/firebaseAdmin.js";

const verifyFirebaseToken = async (req, res, next) => {
  try {
    // Get the Authorization header from the request.
    const authHeader = req.headers.authorization;

    // Make sure the client sent a Bearer token.
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Extract the Firebase ID token.
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing.",
      });
    }

    // Verify the token with Firebase Admin.
  const decodedToken = await firebaseAdminAuth.verifyIdToken(token);

    // Make the verified Firebase user information
    // available to later middleware and controllers.
    req.firebaseUser = decodedToken;

    // Continue to the next middleware or controller.
    next();
  } catch (error) {
    // Reject invalid, expired, or revoked tokens.
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};

export default verifyFirebaseToken;
