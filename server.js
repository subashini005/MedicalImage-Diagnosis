const express = require("express");
const cors = require("cors");
const { signup } = require("./controllers/controls");
const { sendOtp } = require("./controllers/controls");
const app = express();

app.use(express.json());
app.use(cors());
app.post("/signup", signup);
app.post("/send-otp", sendOtp);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});