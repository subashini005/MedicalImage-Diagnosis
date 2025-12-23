const Loki = require("lokijs");
const dbPath = __dirname + "/Database/otp.db.json";
const db = new Loki(dbPath, { autoload: true, autosave: true, autosaveInterval: 3000, autoloadCallback: initDB });

let otps;
function initDB() {
  otps = db.getCollection("otps");
  if (!otps) {
    otps = db.addCollection("otps", {
      unique: ["email"],
    });
  }
  db.saveDatabase();
}

function insertOtp({ userId, email, otp }) {
  const now = new Date();
  return otps.insert({ userId, email, otp, validatedAt: 0, createdAt: now, updatedAt: now });
}

function getOtpByEmail(email) {
  return otps.findOne({ email });
}

function markOtpVerified(email) {
  const record = otps.findOne({ email });
  if (!record) return null;
  record.validatedAt = 1;
  record.updatedAt = new Date();
  return otps.update(record);
}

function deleteOtp(email) {
  return otps.findAndRemove({ email });
}

module.exports = { getOtpByEmail, insertOtp, markOtpVerified, deleteOtp };