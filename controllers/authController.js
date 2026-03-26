const User = require("../models/userModel");
const jwt = require("jsonwebtoken");


// ============================
// LOGIN (SEND OTP)
// ============================
exports.login = async (req, res) => {
  try {
    const { phone, role } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let user = await User.findOne({ phone });

    // if new user → create
    if (!user) {
      user = await User.create({
        phone,
        role: role || "student"
      });
    }

    // update OTP
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins
    await user.save();

    // console (optional)
    console.log("OTP:", otp);

    // ✅ return OTP in response
    res.json({
      message: "OTP sent successfully",
      otp: otp   // 🔥 added
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================
// VERIFY OTP
// ============================
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP required" });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // clear OTP
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login success",
      token,
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};