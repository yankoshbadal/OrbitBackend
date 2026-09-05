//if you implement likes as comments, also add a field for no. of likes and comments
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    caption: {
      type: String,
      default: null,
      trim: true,
    },

    mediaUrl: {
      type: String,
      default: null,
      trim: true,
    },

    mediaType: {
      type: String,
      enum: ["Video", "Image"],
      default: null,
    },

    visibility: {
      type: String,
      enum: ["Public", "Connections", "Private", "Campus"],
      default: "Public",
    },

    commentsEnabled: {
      type: Boolean,
      default: true,
    },

    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: "Posts",
  },
);

module.exports = mongoose.model("Posts", postSchema);
