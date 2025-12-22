const bcrypt = require("bcryptjs");
const { getUsers, insertUser } = require("../db");
const transporter = require("../mail");
const { insertOtp, getOtpByEmail, verifyOtp, deleteOtp } = require("../otpDB");

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
    insertUser({ username, email, password: hashedPassword });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const users = getUsers();

    const user = users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email ID" });
    }

    const otp = generateOTP();
    deleteOtp(email);
    insertOtp({ userId: user.serialNumber, email, otp });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Verification Code",
      text: `Your OTP is ${otp}.
      It is valid for ${process.env.OTP_EXPIRY_MINUTES} minutes."Thankyou for signing up."`,
    });
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

exports.verifyOtp = (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const record = getOtpByEmail(email);
    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    const expiryTime = new Date(record.createdAt).getTime() + process.env.OTP_EXPIRY_MINUTES * 60 * 1000;
    if (Date.now() > expiryTime) {
      deleteOtp(email);
      return res.status(400).json({ message: "OTP expired" });
    }
    if (record.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    verifyOtp(email);
    deleteOtp(email);
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};