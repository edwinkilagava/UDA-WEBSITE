import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema(
  {
    // Donor's name.
    donorName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "Anonymous",
    },

    // Donor's M-Pesa phone number.
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 15,
    },

    // Donation amount in Kenyan shillings.
    amount: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isSafeInteger,
        message: "Donation amount must be a whole number.",
      },
    },

    // Payment provider.
    paymentMethod: {
      type: String,
      enum: ["mpesa"],
      default: "mpesa",
      required: true,
    },

    // Payment lifecycle.
    status: {
      type: String,
      enum: ["pending", "successful", "failed", "cancelled"],
      default: "pending",
      required: true,
    },

    // Safaricom STK Push identifiers.
    merchantRequestId: {
      type: String,
      default: null,
    },

    checkoutRequestId: {
      type: String,
      default: null,
    },

    // M-Pesa receipt number, populated after verified payment.
    mpesaReceiptNumber: {
      type: String,
      default: null,
    },

    // Safaricom result code and description.
    resultCode: {
      type: Number,
      default: null,
    },

    resultDescription: {
      type: String,
      default: null,
      maxlength: 500,
    },

    // Timestamp when payment is confirmed.
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Used to find a donation using the Safaricom checkout identifier.
contributionSchema.index(
  { checkoutRequestId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      checkoutRequestId: { $type: "string" },
    },
  }
);

// Prevent the same M-Pesa receipt from being recorded twice.
contributionSchema.index(
  { mpesaReceiptNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      mpesaReceiptNumber: { $type: "string" },
    },
  }
);

const Contribution = mongoose.model(
  "Contribution",
  contributionSchema
);

export default Contribution;