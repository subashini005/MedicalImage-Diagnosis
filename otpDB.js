const Loki = require("lokijs");

const dbPath = __dirname + "/Database/otp.db.json";

const db = new Loki(dbPath, {
  autoload: true,
  autosave: true,
  autosaveInterval: 3000,
  autoloadCallback: initDB,
});

let otps;

function initDB() {
  otps = db.getCollection("otps");
  if (!otps) {
    otps = db.addCollection("otps", {
      unique: ["email"], // one active OTP per email
    });
  }
  db.saveDatabase();
}

/* 🔹 AUTO SERIAL NUMBER */
function getNextSerialNumber() {
  return otps.count() + 1;
}

/* 🔹 INSERT OTP */
function insertOtp({ userId, email, otp }) {
  const now = new Date();

  return otps.insert({
    serialNumber: getNextSerialNumber(), // ✅ auto
    userId,            // ✅ users.json mapping
    email,
    otp,
    validated: 0,      // 0 = not verified
    createdAt: now,    // auto
    updatedAt: now,    // auto
  });
}

/* 🔹 GET OTP */
function getOtpByEmail(email) {
  return otps.findOne({ email });
}

/* 🔹 VERIFY OTP */
function verifyOtp(email) {
  const record = otps.findOne({ email });
  if (!record) return null;

  record.validated = 1;
  record.updatedAt = new Date();
  return otps.update(record);
}

/* 🔹 DELETE OTP */
function deleteOtp(email) {
  return otps.findAndRemove({ email });
}

module.exports = {
  getOtps: () => otps,
  insertOtp,
  getOtpByEmail,
  verifyOtp,
  deleteOtp,
};
