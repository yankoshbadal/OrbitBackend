//"/feed/people?page=2&limit=10"
const Users = require("../../models/users");
const Connections = require("../../models/connections");
const auth = require("../../middlewares/auth");
const express = require("express");

const feedPeopleRouter = express.Router();

feedPeopleRouter.get("/feed/people", auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const loggedInUser = req.user._id;

    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;  

    //Find connections involving the current user
    const connections = await Connections.find({
      $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
    }).lean(); //.lean() converts mongoose to JS obj

    const excludedUserIds = connections //(contains only id)
      .filter((connection) => {
        if (
          connection.toUserId.equals(loggedInUser) &&
          connection.status === "Pending"
        ) {
          return false; // Incoming pending request is allowed
        }

        return true;
      })
      .map((connection) => {
        if (connection.fromUserId.equals(loggedInUser)) {
          return connection.toUserId; //add connections intiated by me in excluded 
        }

        return connection.fromUserId;
      });

    const feedUsers = await Users.find({
      _id: {
        $ne: loggedInUser, //not this id
        $nin: excludedUserIds, //id not in this
      },
    }).select("-password")
      .skip(skip)//skip-- no. of doc to skip
      .limit(limit)// limit-- no of docs in ecach retrieve
      .lean();

    return res.status(200).json({
      success: true,
      page,
      limit,
      users: feedUsers,
    });



  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
});
module.exports = feedPeopleRouter