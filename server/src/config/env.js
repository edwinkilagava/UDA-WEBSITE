
import "dotenv/config";

const requiredEnvVariables = [
  "PORT",
  "CLIENT_URL",
  "MONGO_URL",
  "NODE_ENV",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(
      `Missing required environment variable: ${variable}`
    );
  }
}

const port = Number(process.env.PORT);

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  throw new Error(
    "PORT must be a valid number between 1 and 65535"
  );
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error(
    "JWT_SECRET must be at least 32 characters long"
  );
}

// M-Pesa sandbox configuration.
const mpesaEnv = process.env.MPESA_ENV || "sandbox";

if (!["sandbox", "production"].includes(mpesaEnv)) {
  throw new Error(
    "MPESA_ENV must be either sandbox or production"
  );
}

const env = {
  port,
  nodeEnv: process.env.NODE_ENV,
  clientUrl: process.env.CLIENT_URL,
  mongoUri: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,

  // Cloudinary configuration.
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

  // M-Pesa configuration.
  mpesa: {
    environment: mpesaEnv,
    consumerKey: process.env.MPESA_CONSUMER_KEY || "",
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || "",
    passkey: process.env.MPESA_PASSKEY || "",
    shortcode: process.env.MPESA_SHORTCODE || "",
    callbackUrl: process.env.MPESA_CALLBACK_URL || "",
  },
};

export default env;
