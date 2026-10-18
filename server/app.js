
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import memberRoutes from "./src/routes/member.routes.js";
import contributionRoutes from "./src/routes/contribution.routes.js";
import mpesaCallbackRoutes from "./src/routes/mpesa-callback.routes.js";
import newsRoutes from "./src/routes/news.routes.js";
import eventRoutes from "./src/routes/event.routes.js";
import resourceRoutes from "./src/routes/resource.routes.js";
import contactRoutes from "./src/routes/contact.routes.js";
import requestId from "./src/middleware/requestId.middleware.js";
import errorMiddleware from "./src/middleware/error.middleware.js";
import authRoutes from "./src/routes/auth.routes.js";

const app = express();

// Ensure the frontend URL is configured.
if (!process.env.CLIENT_URL) {
  throw new Error("CLIENT_URL is required.");
}

// Attach a unique ID to each request.
app.use(requestId);

// Add security headers.
app.use(helmet());

// Configure frontend access.
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Parse incoming JSON requests.
app.use(express.json({ limit: "10kb" }));

// Parse cookies.
app.use(cookieParser());

// Parse URL-encoded form submissions.
app.use(
  express.urlencoded({
    extended: false,
    limit: "10kb",
  })
);

// Limit repeated API requests.
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  })
);

// Member routes.
app.use("/api/members", memberRoutes);

// Contribution routes.
app.use("/api/contributions", contributionRoutes);

// M-PESA callback routes.
app.use("/api/mpesa/callback", mpesaCallbackRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
// Handle requests to unknown endpoints.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found.",
    requestId: req.requestId,
  });
});

// Centralized error handler must be last.
app.use(errorMiddleware);

export default app;
