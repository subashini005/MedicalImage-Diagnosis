require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { signup, sendOtp } = require("./controllers/controls");

const app = express();

app.use(express.json());
app.use(cors());

app.post("/signup", signup);
app.post("/send-otp", sendOtp);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});