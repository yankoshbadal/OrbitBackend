const express = require("express");
const auth = require("../../middlewares/auth");
const Posts = require("../../models/posts");

const myPostsRouter = express.Router();

myPostsRouter.get("/myPost", auth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const allPosts = await Posts.find({
      author: loggedInUserId,
    });

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts: allPosts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});

module.exports = myPostsRouter;
