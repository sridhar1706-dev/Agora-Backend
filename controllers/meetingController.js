const generateToken = require("../utils/generateAgoraToken");
const Meeting = require("../models/meetingModel");


// ============================
// CREATE MEETING
// ============================
exports.createMeeting = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teacher allowed" });
    }

    const { title, description } = req.body;

    const channelName = "class_" + Math.floor(Math.random() * 100000);

    // 🔥 Save meeting in DB
    const meeting = await Meeting.create({
      channelName,
      title,
      description,
      createdBy: req.user.id,
      role: req.user.role
    });

    res.json({
      channelName: meeting.channelName,
      createdBy: meeting.createdBy,
      role: meeting.role
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ============================
// JOIN MEETING
// ============================
exports.joinMeeting = async (req, res) => {
  try {
    const { channelName } = req.body;

    if (!channelName) {
      return res.status(400).json({ message: "Channel name required" });
    }

    // 🔥 Check meeting exists
    const meeting = await Meeting.findOne({ channelName });

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found"
      });
    }

    const uid = Math.floor(Math.random() * 100000);

    const token = generateToken(channelName, uid, req.user.role);

    res.json({
      appId: process.env.AGORA_APP_ID,
      token,
      channelName,
      uid,
      userId: req.user.id,
      role: req.user.role
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};