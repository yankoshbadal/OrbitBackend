//"/postInteract/:postID"
const express = require("express");
const auth = require("../../middlewares/auth");
const Likes = require("../../models/likes");
const Posts = require("../../models/posts");

const postInteractRouter = express.Router();

postInteractRouter.post("/postInteract/:postID", auth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const postID = req.params.postID;

    const post = await Posts.findById(postID);
    if (!post) {
      return res.send("Post not found !");
    }

    const like = await Likes.findOne({
      author: loggedInUserId,
      targetType: "Posts",
      targetId: postID,
    });

    if (!like) {
      const like = new Likes({
        author: loggedInUserId,
        targetType: "Posts",
        targetId: postID,
      });
      await like.save();
      post.likesCount += 1;
      await post.save();
      return res.send("Like Sent Successfully");
    }

    await Likes.findByIdAndDelete(like._id);
    post.likesCount -= 1;
    await post.save();
    return res.status(200).json({
      message: "Like Removed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to like post",
      error: error.message,
    });
  }
});

module.exports = postInteractRouter;
