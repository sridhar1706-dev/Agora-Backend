const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: true,
      unique: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);