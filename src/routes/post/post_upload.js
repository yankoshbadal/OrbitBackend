const express = require("express");
const auth = require("../../middlewares/auth");

const Posts = require("../../models/posts");

const postUploadRouter = express.Router();

postUploadRouter.post("/post/upload", auth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const post = new Posts({
      ...req.body,
      author: loggedInUser,
    });

    await post.save();

    return res.status(201).json({
      success: true,
      message: "Post uploaded successfully",
      post,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});

module.exports = postUploadRouter;