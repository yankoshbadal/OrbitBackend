//You may implement it like comments, I find that better

const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
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

    likesUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  {
    timestamps: true,
    collection: "Likes",
  }
);

module.exports = mongoose.model("Likes", likeSchema);