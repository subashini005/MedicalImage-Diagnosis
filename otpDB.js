const Loki = require("lokijs");
const dbPath = __dirname + "/Database/otp.db.json";
const db = new Loki( dbPath, { autoload: true, autosave: true, autosaveInterval: 3000,autoloadCallback: initDB, });

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

module.exports = () => otps;