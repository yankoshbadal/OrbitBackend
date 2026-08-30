//"/connection/review/:status/:fromUserId"
const express = require("express");
const Connections = require("../../models/connections");
const auth = require("../../middlewares/auth");

const connectionReview = express.Router();

connectionReview.patch(
  "/connection/review/:status/:fromUserId",
  auth,
  async (req, res) => {
    try {
      const fromUserId = req.params.fromUserId;
      const toUserId = req.user._id;
      const status = req.params.status;

      const allowedStatus = ["Delete", "Maybe", "Date", "Blocked", "Match"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Not a valid status" });
      }

      const receivedConnection = await Connections.findOne({
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: { $ne: "Blocked" }, // do not consider received as block
      });

      const sentConnection = await Connections.findOne({
        fromUserId: toUserId,
        toUserId: fromUserId,
      });

      const allConnection = receivedConnection || sentConnection;

      if (!allConnection) {
        return res.status(400).json({
          message: "Connection request does not exist",
        });
      }

      if (status === "Delete") {
        await Connections.findByIdAndDelete(allConnection._id);
        return res.send("Connection Deleted");
      }

      if (receivedConnection?.status !== "Date" && status === "Match") {
        return res.send("Connection can not be up6a82f963d462244e0b8f90a2graded");
      } ////
      if (receivedConnection?.status !== "Date" && status === "Date") {
        await Connections.create({
          toUserId: fromUserId,
          fromUserId: toUserId,
          status: "Date",
        });
        return res.send("Connection request sent for upgrade");
      }

      if (sentConnection && status === "Match") {
        return res.send("Connection can not be upgraded");
      }
      if (
        sentConnection?.status === "Pending" &&
        status !== "Date" &&
        status !== "Delete"
      ) {
        //If the sent connection is Pending, reject every status except Date and Delete.
        return res.send("Connection can not be changed");
      }
      if (allConnection) {
        allConnection.status = status;
        await allConnection.save();
        return res.send("Connection updated");
      }

     
    } catch (error) {
      res.status(400).send(error.message);
    }
  },
);

module.exports = connectionReview;
 /*
      1.DO NOT ALLOW CONNECTION RECEIVED AS BLOCKED TO CHANGE TO ANYTHING (2.DONE)

      2.ALLOW ANY CONNECTION TO CHANGE TO -- MAYBE, BLOCK, DATE(MAKE DUPLICATE CONNECTION
      WITH REVERSED TO AND FROM (8.DONE),AND DELETE PRIVIOUS CONNECTION IF UPGRADED TO MATCH) (9.DONE in r/r/r.file)
 
      3.DO NOT ALLOW ANY CONNECTION TO CHANGE TO PENDING , (1.DONE)

      4.DO NOT ALLOW RECEIVED CONNECTION TO CHANGE TO MATCH IF STATUS IS NOT DATE (3.DONE)

      5.ALSO ALLOW TO DELETE CONNECTION (4.DONE)

      6.SENT CONNECTION CAN NOT BE CHANGED TO MATCH (5.DONE)

      8.Sent Pending can not be upgraded to anything except DELETE OR DATE (7.DONE)
      */