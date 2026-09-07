//"/feed/post?page=2&limit=10"
const express = require("express");
const auth = require("../../middlewares/auth");
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

    //Get all connections (anything except Pending/Blocked) involving loggedinuser
    const connections = await Connections.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: { $nin: ["Pending", "Blocked"] },
    }).select("fromUserId toUserId");

    //Build a set of userIds the logged-in
    const connectedUserIds = new Set(
      connections.map((conn) =>
        conn.fromUserId.toString() === loggedInUser._id.toString()
          ? conn.toUserId.toString()
          : conn.fromUserId.toString(),
      ),
    );

    //Just a filter Object not a DB Querry
    const feedQuery = {
      $or: [
        { visibility: "Public" },
        { visibility: "Campus", campus: loggedInUser.campus },
        {
          visibility: "Connections",
          author: { $in: Array.from(connectedUserIds) },
        },
      ],
    };

    const feedPost = await Posts.find(feedQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

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