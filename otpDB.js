const Loki = require("lokijs");
const cron = require("node-cron");
const dbPath = __dirname + "/Database/otp.db.json";
const db = new Loki(dbPath, { autoload: true, autosave: true, autosaveInterval: 3000, autoloadCallback: initDB });

let otps;
function initDB() {
  otps = db.getCollection("otps");
  if (!otps) { otps = db.addCollection("otps", {
      unique: ["userId"],
    });
  }
  db.saveDatabase();
}

function insertOtp({ userId, otp }) {
  otps.findAndRemove({ userId });
  const now = new Date();
  return otps.insert({ userId, otp, validatedAt: 0, createdAt: now, updatedAt: now });
}

function getOtpByUserId(userId) {
  return otps.findOne({ userId });
}

function markOtpVerified(userId) {
  const record = otps.findOne({ userId });
  if (!record) return null;
  record.validatedAt = 1;
  record.updatedAt = new Date();
  return otps.update(record);
}

function deleteOtp(email) {
  return otps.findAndRemove({ email });
}

module.exports = { getOtpByUserId, insertOtp, markOtpVerified, deleteOtp, getOtpCollection: () => otps, };