const express = require("express");
const auth = require("../../middlewares/auth");

const Posts = require("../../models/posts");
const Comments = require("../../models/comments");

const commentUploadRouter = express.Router();

commentUploadRouter.post(
  "/comment/upload/:targetType/:target",
  auth,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const targetType = req.params.targetType;
      const target = req.params.target;

      if (!["Posts", "Comments"].includes(targetType)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid target type" });
      }

      if (targetType === "Posts") {
        const post = await Posts.findById(target);
        if (!post) {
          return res.status(404).send("Post not found");
        }
      }
      if (targetType === "Comments") {
        const comment = await Comments.findById(target);
        if (!comment) {
          return res.status(404).send("Comment not found");
        }
      }
      const content = req.body?.content?.trim();
      if (!content) {
        return res
          .status(400)
          .json({ success: false, message: "Comment content is required" });
      }
      const comment = new Comments({
        author: loggedInUserId,
        content: content,
        targetType: targetType,
        target: target,
      });

      await comment.save();

      return res.status(201).json({
        success: true,
        message: "Comment added successfully",
        comment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },
);

module.exports = commentUploadRouter;
