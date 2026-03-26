const express = require("express");
const router = express.Router();

const verifyJWT = require("../middleware/authMiddleware");
const {
  createMeeting,
  joinMeeting
} = require("../controllers/meetingController");

router.post("/create", verifyJWT, createMeeting);
router.post("/join", verifyJWT, joinMeeting);

module.exports = router;