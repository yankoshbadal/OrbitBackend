const express = require("express");
const auth = require("../../middlewares/auth");
const Likes = require("../../models/likes");
const Comments = require("../../models/comments");

const commentInteractRouter = express.Router();

commentInteractRouter.comment("/commentInteract/:commentID", auth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const commentID = req.params.commentID;

    const comment = await Comments.findById(commentID);
    if (!comment) {
      return res.send("Comment not found !");
    }

    const like = await Likes.findOne({
      author: loggedInUserId,
      targetType: "Comments",
      targetId: commentID,
    });

    if (!like) {
      const like = new Likes({
        author: loggedInUserId,
        targetType: "Comments",
        targetId: commentID,
      });
      await like.save();
      comment.likesCount += 1;
      await comment.save();
      return res.send("Like Sent Successfully");
    }

    await Likes.findByIdAndDelete(like._id);
    comment.likesCount -= 1;
    await comment.save();
    return res.status(200).json({
      message: "Like Removed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to like comment",
      error: error.message,
    });
  }
});

module.exports = postInteractRouter;
