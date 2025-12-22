const bcrypt = require("bcryptjs");
const { getUsers, insertUser } = require("../db");
const { insertOtp, deleteOtp } = require("../otpDB");
const transporter = require("../mail");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

/* ======================
   SIGNUP
====================== */
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const users = getUsers();
    if (users.findOne({ email })) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    insertUser({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================
   SEND OTP (WITH MAPPING)
====================== */
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const users = getUsers();

    // 🔥 users.json mapping check
    const user = users.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email ID",
      });
    }

    const otp = generateOTP();

    // remove old OTP
    deleteOtp(email);

    // insert OTP with userId mapping
    insertOtp({
      userId: user.serialNumber, // 🔥 mapping key
      email,
      otp,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Verification Code",
      text: `Your OTP is ${otp}. It is valid for ${process.env.OTP_EXPIRY_MINUTES} minutes.`,
    });

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};
