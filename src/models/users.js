const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      // select: false, // Don't return password by default
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },

    campus: {
      type: String,
      required: true,
      trim: true,
    },

    stream: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    homeTown: {
      type: String,
      trim: true,
    },

    hobbies: [
      {
        type: String,
        trim: true,
      },
    ],

    interestedIn: {
      type: String,
      enum: ["Girls", "Boys", "Everyone"],
      required: true,
    },

    bio: {
      type: String,
      maxlength: 500,
      trim: true,
    },

    profileImageUrl: {
      type: String,
      default: "https://www.google.com/imgres?q=profile%20default%20image%20url&imgurl=https%3A%2F%2Fuxwing.com%2Fwp-content%2Fthemes%2Fuxwing%2Fdownload%2Fpeoples-avatars%2Fman-user-circle-icon.svg&imgrefurl=https%3A%2F%2Fuxwing.com%2Fdefault-profile-picture-male-icon%2F&docid=4dYJsNXJ3jLinM&tbnid=4KA6vm06mLounM&vet=12ahUKEwifqoaPz6eWAxVAWHADHWqTHGQQnPAOegUI4gEQAA..i&w=774&h=800&hcb=2&ved=2ahUKEwifqoaPz6eWAxVAWHADHWqTHGQQnPAOegUI4gEQAA",
      trim: true,
    },

    relationshipStatus: {
      type: String,
      enum: ["Single", "Committed"],
      default: "Single",
    },
  },
  {
    timestamps: true,
    collection: "Users",
  }
);

module.exports = mongoose.model("Users", userSchema);