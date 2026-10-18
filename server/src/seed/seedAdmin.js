
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import env from "../config/env.js";
import User from "../models/User.js";

async function seedAdmin() {
  const fullName = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!fullName || !email || !password) {
    throw new Error(
      "Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in server/.env."
    );
  }

  if (fullName.length < 2 || fullName.length > 100) {
    throw new Error("Admin name must contain 2–100 characters.");
  }

  if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
    throw new Error(
      "Admin password must contain 8–72 UTF-8 bytes."
    );
  }

  await mongoose.connect(env.mongoUri);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.authProvider !== "local") {
      throw new Error(
        "This email belongs to a Firebase account. " +
        "Do not convert it to a local account using this script."
      );
    }

    // Promote the existing local account without changing its password.
    existingUser.fullName = fullName;
    existingUser.role = "admin";
    existingUser.status = "active";

    await existingUser.save();

    console.log("Existing local account promoted to admin.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await User.create({
    fullName,
    email,
    passwordHash,
    authProvider: "local",
    role: "admin",
    status: "active",
    emailVerified: false,
  });

  console.log("Admin account created successfully.");
}

try {
  await seedAdmin();
} catch (error) {
  console.error("Admin seeding failed:", error.message);
  process.exitCode = 1;
} finally {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
