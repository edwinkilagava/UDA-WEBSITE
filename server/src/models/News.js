import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "News title is required."],
      trim: true,
      minlength: [5, "News title must be at least 5 characters."],
      maxlength: [200, "News title cannot exceed 200 characters."],
    },

    excerpt: {
      type: String,
      required: [true, "News excerpt is required."],
      trim: true,
      minlength: [10, "News excerpt must be at least 10 characters."],
      maxlength: [500, "News excerpt cannot exceed 500 characters."],
    },

    content: {
      type: String,
      required: [true, "News content is required."],
      trim: true,
      minlength: [20, "News content must be at least 20 characters."],
    },

    image: {
      type: String,
      required: [true, "News image URL is required."],
      trim: true,
      maxlength: [2048, "News image URL is too long."],
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
newsSchema.pre("validate", function () {
  if (this.status === "draft") {
    this.publishedAt = null;
  } else if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

const News = mongoose.model("News", newsSchema);

export default News;