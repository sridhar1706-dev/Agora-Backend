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

    // 🔐 OTP fields
    otp: {
      type: String,
      default: null
    },

    otpExpiry: {
      type: Date,
      default: null
    },

    // 🔥 NEW: Token version (for invalidating old tokens)
    tokenVersion: {
      type: Number,
      default: 0
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);