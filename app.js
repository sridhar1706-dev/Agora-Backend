const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db"); // ✅ ADD THIS

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const meetingRoutes = require("./routes/meetingRoutes");

const app = express();

connectDB(); // ✅ ADD THIS

// app.use(
//   cors({
//     origin: "https://myagoraapp.duckdns.org",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true
//   })
// );

const allowedOrigins = [
  "http://localhost:5173",
  "https://myagoraapp.duckdns.org"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/meeting", meetingRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});