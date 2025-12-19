const bcrypt = require("bcryptjs");
const getUsersCollection = require("../db");
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