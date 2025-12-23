const bcrypt = require("bcryptjs");
const { getUsers, insertUser, markUserVerified } = require("../db");
const transporter = require("../mail");
const { insertOtp, getOtpByEmail, markOtpVerified, deleteOtp } = require("../otpDB");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }
    const users = getUsers();
    if (users.findOne({ email })) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = insertUser({ username, email, password: hashedPassword });
    const otp = generateOTP();
    deleteOtp(email);
    insertOtp({ userId: user.serialNumber, email, otp });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      text: `Your OTP is ${otp}.It is valid for 5 minutes only.
      "Thank you for signing up."`
    });
    return res.status(201).json({
      message: "OTP sent to email successfully.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtp = (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email & OTP required" });
    }
    const users = getUsers();
    const user = users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const record = getOtpByEmail(email);
    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }
    const expiryTime = new Date(record.createdAt).getTime() + 5 * 60 * 1000;
    if (Date.now() > expiryTime) {
      return res.status(400).json({ message: "OTP expired" });
    }
    if (record.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    markOtpVerified(email);
    markUserVerified(email);
    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = getUsers();
    const user = users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const otpRecord = getOtpByEmail(email);
    if (!otpRecord || otpRecord.validatedAt !== 1) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    return res.status(200).json({ message: "Login successful" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};