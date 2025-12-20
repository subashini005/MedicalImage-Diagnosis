const Loki = require("lokijs");
const dbPath = __dirname + "/Database/users.json";
const db = new Loki(dbPath, { autoload: true, autosave: true, autosaveInterval: 4000, autoloadCallback: databaseInitialize});

let users;
function databaseInitialize() {
  users = db.getCollection("users");
  if (!users) {
    users = db.addCollection("users", {
      unique: ["email"],
    });
  }
  db.saveDatabase();
}

module.exports = () => users;