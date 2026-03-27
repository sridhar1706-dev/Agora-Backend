const generateToken = require("../utils/generateAgoraToken");
const Meeting = require("../models/meetingModel");


// ============================
// CREATE MEETING + TOKEN
// ============================
exports.createMeeting = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teacher allowed" });
    }

    // better unique channel
    const channelName = "class_" + Date.now();

    // save in DB
    const meeting = await Meeting.create({
      channelName,
      createdBy: req.user.id,
      role: req.user.role
    });

    // 🔥 generate Agora token
    const uid = Math.floor(Math.random() * 100000);
    const token = generateToken(channelName, uid, req.user.role);

    res.json({
      appId: process.env.AGORA_APP_ID,
      token,
      channelName: meeting.channelName,
      uid,
      userId: req.user.id,
      role: req.user.role
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ============================
// GET RECENT MEETINGS
// ============================
exports.getRecentMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .sort({ createdAt: -1 }) // 🔥 latest first
      .limit(10); // optional limit

    res.json({
      count: meetings.length,
      meetings: meetings.map(m => ({
        channelName: m.channelName,
        createdBy: m.createdBy,
        role: m.role,
        createdAt: m.createdAt
      }))
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