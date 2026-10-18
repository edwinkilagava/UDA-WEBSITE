
import mongoose from "mongoose";

const eventsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Events title is required."],
      trim: true,
      minlength: [5, "Event title must be at least 5 characters."],
      maxlength: [200, "Event title cannot exceed 200 characters."],
    },

    excerpt: {
      type: String,
      required: [true, "Event excerpt is required."],
      trim: true,
      minlength: [10, "Event excerpt must be at least 10 characters."],
      maxlength: [500, "Event excerpt cannot exceed 500 characters."],
    },

    content: {
      type: String,
      required: [true, "Event content is required."],
      trim: true,
      minlength: [20, "Event content must be at least 20 characters."],
    },

    image: {
      type: String,
      required: [true, "Event image URL is required."],
      trim: true,
      maxlength: [2048, "Event image URL is too long."],
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: {
        values: ["draft", "published"],
        message: "Status must be draft or published.",
      },
      default: "draft",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Keep publishedAt consistent with the publication status.
eventsSchema.pre("validate", function () {
  if (this.status === "draft") {
    this.publishedAt = null;
  } else if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

const Events = mongoose.model("Events", eventsSchema);

export default Events;
