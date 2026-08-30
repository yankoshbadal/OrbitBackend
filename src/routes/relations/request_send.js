//"/request/send/:status/:toUserId"
const express = require("express");
const Connections = require("../../models/connections");
const auth = require("../../middlewares/auth");

const requestSendRouter = express.Router();

requestSendRouter.post(
  "/request/send/:status/:toUserId",
  auth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //Allowed params for sending(Pending, Date, block)
      if (status !== "Pending" && status !== "Blocked" && status !== "Date") {
        return res.status(400).json({
          message: "Invalid request",
        });
      }

      // Prevent sending request to yourself
      if (fromUserId.toString() === toUserId.toString()) {
        return res.status(400).json({
          message: "You cannot send a connection request to yourself",
        });
      }

      //check if connection is aleady there
      const existingConnection = await Connections.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnection) {
        return res.status(400).json({
          message: "Connection request already exists (Pending or Blocked)",
        });
      }

      //create connection
      const connection = new Connections({
        fromUserId,
        toUserId,
        status,
      });
      await connection.save();
      res.send("Request Sent Successfully");
    } catch (error) {
      res.status(500).send(error);
    }
  },
);

module.exports = requestSendRouter;
