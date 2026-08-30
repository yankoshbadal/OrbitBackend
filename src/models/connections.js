const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
    {
        fromUserId:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        toUserId:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        status:{
            type: String,
            required: true,
            enum:{
                values : ["Pending", "Maybe", "Date", "Blocked", "Match"],
                message: "{VALUE} is not a valid request"
            }
        }
},
{
    timestamps: true,
    collection: "Connections",
  }
);

module.exports = mongoose.model("Connections", connectionSchema);