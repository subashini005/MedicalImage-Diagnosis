const bcrypt = require("bcryptjs");
const getUsersCollection = require("../db");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const users = getUsersCollection();
    const existingUser = users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    users.insert({
      username,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getOtpCollection = require("../otpDB");
const transporter = require("../mail");

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }
    const otp = generateOTP();
    const expiresAt = Date.now() + "-" + 5 * 60 * 1000;

    const otps = getOtpCollection();
    otps.findAndRemove({ email });
    otps.insert({
      email,
      otp,
      expiresAt,
    });

    await transporter.sendMail({
      from: "subashinig32@gmail.com",
      to: email,
      subject: "Your OTP Verification Code",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};