const express = require("express");
const router = express.Router();

const {
  login,
  verifyOtp
} = require("../controllers/authController");

// 🔥 Updated route
router.post("/login", login);

// verify OTP
router.post("/verify-otp", verifyOtp);

module.exports = router;