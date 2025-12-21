const Loki = require("lokijs");
const db = new Loki("otp.db.json", { autoload: true, autosave: true, autosaveInterval: 3000,autoloadCallback: initDB, });

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