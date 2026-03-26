const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "User"
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: ["teacher", "student"],
      default: "student"
    },
    otp: {
      type: String
    },
    otpExpiry: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);