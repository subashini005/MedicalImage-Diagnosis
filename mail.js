const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "subashinig32@gmail.com",
    pass: "Subashini10@",
  },
});

module.exports = transporter;