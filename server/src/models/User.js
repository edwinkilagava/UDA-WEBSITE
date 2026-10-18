
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required."],
      trim: true,
      minlength: [2, "Full name must have at least 2 characters."],
      maxlength: [100, "Full name cannot exceed 100 characters."],
    },

    email: {
      type: String,
      required: [true, "Email address is required."],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    passwordHash: {
      type: String,
      select: false,
    },

    authProvider: {
      type: String,
      enum: ["local", "firebase"],
      required: true,
    },

    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
      immutable: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "suspended", "deactivated"],
      default: "active",
      required: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("validate", function validateAuthenticationFields() {
  if (this.authProvider === "local" && !this.passwordHash) {
    this.invalidate(
      "passwordHash",
      "A password is required for local accounts."
    );
  }

  if (this.authProvider === "firebase" && !this.firebaseUid) {
    this.invalidate(
      "firebaseUid",
      "A Firebase UID is required for Firebase accounts."
    );
  }
});

const User = mongoose.model("User", userSchema);

export default User;
