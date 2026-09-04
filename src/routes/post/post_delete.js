//"/post/delete/:postId"
const express = require("express");
const auth = require("../../middlewares/auth");
const Posts = require("../../models/posts");

const postDeleteRouter = express.Router();

postDeleteRouter.delete("/post/delete/:postId", auth, async (req, res) => {
  try {
    const postId = req.params.postId;
    const loggedInUserId = req.user._id;

    const post = await Posts.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (post.author.toString() !== loggedInUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }

    await Posts.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });

    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});

module.exports = postDeleteRouter;