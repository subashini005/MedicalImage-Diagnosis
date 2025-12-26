require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { signup, verifyOtp, login, forgotPassword, resetPassword } = require("./controllers/controls");
const app = express();
app.use(express.json());
app.use(cors());
app.post("/signup", signup);
app.post("/verify-otp", verifyOtp);
app.post("/login", login);
app.post("/forgot-password", forgotPassword);
app.post("/reset-password", resetPassword);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});