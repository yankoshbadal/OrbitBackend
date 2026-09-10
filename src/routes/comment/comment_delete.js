//Author of the comment can delete it
//target author can delete it (but what about comment which is a reply) Replies can have reply (restrict in FE)
//when deleting a comment also delete all replies associated with it
const express = require("express");
const auth = require("../../middlewares/auth");
const Comments = require("../../models/comments");
const Posts = require("../../models/posts");

const commentDeleteRouter = express.Router();

commentDeleteRouter.delete(
  "/comment/delete/:commentId",
  auth,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const commentId = req.params.commentId;
      let authorizeToDelete = false;

      const comment = await Comments.findById(commentId);

      if (!comment) {
        return res.status(404).send("comment not found");
      }

      if (comment.targetType === "Posts") {
        const post = await Posts.findById(comment.target);
        if (post && post.author.equals(loggedInUserId) ) {
          authorizeToDelete = true;
        }
      }
      if (
        (comment.targetType === "Comments" || comment.targetType === "Posts") &&
        comment.author.equals(loggedInUserId)
      ) {
        authorizeToDelete = true;
      }

      if (!authorizeToDelete) {
        return res
          .status(404)
          .send("You are not authorized to delete this comment");
      }
      //delete replies then the main comment
      const replies = await Comments.find({
        targetType: "Comments",
        target: comment._id,
      });
      if (replies.length > 0) {
        await Comments.deleteMany({
          targetType: "Comments",
          target: comment._id,
        });
      }

      await Comments.findByIdAndDelete(commentId);
      return res.status(200).send("comment deleted");
      
    } catch (error) {
      return res.status(500).send("failed to delete comment");
    }
  },
);

module.exports = commentDeleteRouter;
