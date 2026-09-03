const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    targetType: {
      type: String,
      enum: ["Posts", "Comments"],
      required: true,
    },

    target: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "targetType",
      required: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Likes",
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "Comments",
  },
);

module.exports = mongoose.model("Comments", commentSchema);
