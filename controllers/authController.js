const User = require("../models/userModel");
const jwt = require("jsonwebtoken");


// ============================
// LOGIN (SEND OTP)
// ============================
// exports.login = async (req, res) => {
//   try {
//     const { phone, role } = req.body;

//     if (!phone) {
//       return res.status(400).json({ message: "Phone number required" });
//     }

//     // generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     let user = await User.findOne({ phone });

//     // if new user → create
//     if (!user) {
//       user = await User.create({
//         phone,
//         role: role || "student"
//       });
//     }

//     // update OTP
//     user.otp = otp;
//     user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins
//     await user.save();

//     // console (optional)
//     console.log("OTP:", otp);

//     // ✅ return OTP in response
//     res.json({
//       message: "OTP sent successfully",
//       otp: otp   // 🔥 added
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { phone, role } = req.body;

    // =========================
    // VALIDATION
    // =========================
    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    if (!["teacher", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // =========================
    // FIND USER
    // =========================
    let user = await User.findOne({ phone });

    // =========================
    // NEW USER
    // =========================
    if (!user) {
      user = await User.create({
        phone,
        role
      });
    } else {
      // =========================
      // EXISTING USER ROLE CHECK
      // =========================
      if (user.role !== role) {
        return res.status(400).json({
          message: `This number is registered as ${user.role}. Please login as ${user.role}`
        });
      }
    }

    // =========================
    // GENERATE OTP
    // =========================
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    console.log("OTP:", otp);

    res.json({
      message: "OTP sent successfully",
      otp // (remove in production)
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

    const user = await User.findOne({ phone });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // 🔥 increment token version (invalidate old tokens)
    user.tokenVersion += 1;

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        tokenVersion: user.tokenVersion
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // 🔥 expiry added
    );

    res.json({
      message: "Login success",
      token,
      user: {
        id: user._id,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};