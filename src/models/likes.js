const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    targetType: {
      type: String,
      enum: ["Posts", "Comments"],
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "targetType",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Likes",
  },
);

module.exports = mongoose.model("Likes", likeSchema);
