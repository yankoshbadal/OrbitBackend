//"/request/received/review/:status/:fromUserId"
const express = require("express");
const Connections = require("../../models/connections");
const auth = require("../../middlewares/auth");

const requestReceivedReview = express.Router();

requestReceivedReview.patch(
  "/request/received/review/:status/:fromUserId",
  auth,
  async (req, res) => {
    try {
      const fromUserId = req.params.fromUserId;
      const toUserId = req.user._id;
      const status = req.params.status;

      //allowed status
      const allowedStatus = ["Delete", "Maybe", "Date", "Blocked", "Match"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Not a valid request update",
        });
      }

      const existingConnection = await Connections.findOne({
        fromUserId: fromUserId, // Only fetches received ---
        toUserId: toUserId, // --- requests
        status: { $in: ["Pending", "Date"] }, // status is either "Pending" OR "Date".
      });

      if (!existingConnection) {
        return res.status(400).json({
          message: "Connection request does not exist",
        });
      }

      if (status === "Delete") {
        await Connections.findByIdAndDelete(existingConnection._id);

        return res.status(200).json({
          message: "Connection request deleted",
        });
      }

      if (existingConnection.status === "Date" && status === "Match") {
        await Connections.findOneAndDelete({
          //Delete duplicate(reversed ie Original) if upgrading to date
          fromUserId: toUserId,
          toUserId: fromUserId,
          status: { $nin: ["Blocked", "Date"] },
        });
        existingConnection.status = status; // upgrade received connection to Match
        await existingConnection.save();
        return res.send("Connection updated");
      }

      // if received as Date allow all updates (maybe, date/match, block) except --pending--
      if (existingConnection.status === "Date" && status !== "Pending") {
        existingConnection.status = status;
        await existingConnection.save();

        return res.send("Connection updated");
      } // if received as Date and trying respond with pending throw error
      if (existingConnection.status === "Date" && status === "Pending") {
        return res
          .status(400)
          .send("Connection cannot be downgraded to Pending");
      }

      //  for Pending Match is not allowed , throw error
      if (existingConnection.status === "Pending" && status === "Match") {
        return res.status(400).send("Connection cannot be updated to Match");
      }

      // if received as Pending all other allowed (maybe, block,--except --date-- ) upper block throws error if responds with match
      if (existingConnection.status === "Pending" && status !== "Date") {
        existingConnection.status = status;
        await existingConnection.save();

        return res.send("Connection updated");
      }
      // if received as Pending and response is Date then reverse the to and from user and upgrade to date
      if (existingConnection.status === "Pending" && status === "Date") {
        existingConnection.status = status;
        existingConnection.toUserId = fromUserId;
        existingConnection.fromUserId = toUserId;
        await existingConnection.save();

        return res.send("You asked for Date");
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
);

module.exports = requestReceivedReview;
