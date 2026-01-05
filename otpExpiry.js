const cron = require("node-cron");
const { getOtpCollection } = require("./otpDB");

cron.schedule("*/5 * * * *", () => {
  const otps = getOtpCollection();
  const now = Date.now();
  otps.find({ validatedAt: 0 }).forEach((otp) => {
    const created = new Date(otp.createdAt).getTime();
    if (now - created > 5 * 60 * 1000) {
      otp.validatedAt = 2;
      otps.update(otp);
    }
  });
});