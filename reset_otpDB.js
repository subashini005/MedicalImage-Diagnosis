const Loki = require("lokijs");
const dbPath = __dirname + "/Database/reset_otp.db.json";
const db = new Loki(dbPath, { autoload: true, autosave: true, autosaveInterval: 3000, autoloadCallback: initDB });

let resetOtps;
function initDB() {
  resetOtps = db.getCollection("reset_otps");
  if (!resetOtps) {
    resetOtps = db.addCollection("reset_otps", {
      unique: ["email"],
    });
  }
  db.saveDatabase();
}

function insertResetOtp({ email, otp }) {
  const now = new Date();
  return resetOtps.insert({ email, otp, createdAt: now, validatedAt: 0 });
}

function getResetOtpByEmail(email) {
  return resetOtps.findOne({ email });
}

function markResetOtpVerified(email) {
  const record = resetOtps.findOne({ email });
  if (!record) return null;
  record.validatedAt = 1;
  return resetOtps.update(record);
}

function deleteResetOtp(email) {
  return resetOtps.findAndRemove({ email });
}

module.exports = { insertResetOtp, getResetOtpByEmail, markResetOtpVerified, deleteResetOtp };