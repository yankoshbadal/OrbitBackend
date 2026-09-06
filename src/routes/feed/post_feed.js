//"/feed/post?page=2&limit=10"
const express = require("express");
const auth = require("../../middlewares/auth");
const Users = require("../../models/users");
const Connections = require("../../models/connections");
const Posts = require("../../models/posts");

const postFeedRouter = express.Router();

postFeedRouter.get("/feed/post", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const loggedInUser = req.user;

    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    ////////////////////////////////////////
    ////////////////////////////////////////
    const feedPost = await Users.find({
      /////////////////////////
    })
      .select("-password")
      .skip(skip) //skip-- no. of doc to skip
      .limit(limit) // limit-- no of docs in ecach retrieve
      .lean();

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
    return res.status(200).json({
      success: true,
      page,
      limit,
      users: feedPost,
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
});

module.exports = postFeedRouter;