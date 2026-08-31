//USE .populate() FUNCTION
const Connections = require("../../models/connections");
const express = require("express");
const auth = require("../../middlewares/auth");

const myConnectionsListRouter = express.Router();

myConnectionsListRouter.get("/myConnections", auth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    //returns an array
    const allConnections = await Connections.find({
      $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
    })
      .populate({
        path: "fromUserId",
        select: "firstName lastName status",
        match: { _id: { $ne: loggedInUser } },
      })
      .populate({
        path: "toUserId",
        select: "firstName lastName status",
        match: { _id: { $ne: loggedInUser } },
      });

    if (allConnections.length === 0) {
      return res.status(400).json({
        message: "You have no connection yet!",
      });
    }
    return res.send(allConnections);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while fetching connections.",
    });
  }
});

module.exports = myConnectionsListRouter;
