const bcrypt = require("bcryptjs");
const { getUsers, insertUser, markUserVerified } = require("../db");
const transporter = require("../mail");
const { insertOtp, getOtpByUserId, markOtpVerified } = require("../otpDB");

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
    insertOtp({ userId: user.userId, otp });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      text: `Your OTP is ${otp}.It is valid for 5 minutes only. "Thank you for signing up."`
    });
    return res.status(201).json({ message: "OTP sent to email successfully.", userId: user.userId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtp = (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      return res.status(400).json({ message: "User ID & OTP required" });
    }
    const users = getUsers();
    const user = users.findOne({ userId });
    if (!user) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const record = getOtpByUserId(userId);
    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }
    if (record.validatedAt === 2) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.validatedAt === 1) {
      return res.status(400).json({ message: "OTP already verified" });
    }
    if (record.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    markOtpVerified(userId);
    markUserVerified(userId);
    return res.status(200).json({ message: "Email verified successfully" });
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
    if (user.validatedAt !== 1) {
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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }
    const users = getUsers();
    const user = users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const existingOtp = getOtpByUserId(user.userId);
    if (existingOtp && existingOtp.validatedAt === 0) {
      return res.status(400).json({
        message: "OTP already sent. Please verify existing OTP.",
        userId: user.userId,
      });
    }
    const otp = generateOTP();
    insertOtp({ userId: user.userId, otp });
    user.validatedAt = 0;
    users.update(user);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your password reset OTP is ${otp}. It is valid for 5 minutes.`,
    });
    return res.status(200).json({ message: "Reset OTP sent to email", userId: user.userId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try { const { userId, otp, newPassword } = req.body;
    if (!userId || !otp || !newPassword) {
      return res.status(400).json({
        message: "User ID, OTP & new password required",
      });
    }
    const users = getUsers();
    const user = users.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const record = getOtpByUserId(userId);
    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (record.validatedAt === 2) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.validatedAt === 1) {
      return res.status(400).json({ message: "OTP already used" });
    }

    if (record.otp != otp) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.validatedAt = 1;
    user.updatedAt = new Date();
    users.update(user);
    markOtpVerified(userId);
    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};