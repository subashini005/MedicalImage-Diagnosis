const Loki = require("lokijs");
const { v4: uuidv4 } = require("uuid");
const dbPath = __dirname + "/Database/users.json";
const db = new Loki(dbPath, { autoload: true, autosave: true, autosaveInterval: 4000, autoloadCallback: databaseInitialize,});

let users;
function databaseInitialize() {
  users = db.getCollection("users");
  if (!users) {
    users = db.addCollection("users", {
      unique: ["userId", "email"],
    });
  }
  db.saveDatabase();
}

function getNextSerialNumber() {
  const count = users.count();
  return count + 1;
}

function insertUser({ username, email, password }) {
  const now = new Date();
  return users.insert({ serialNumber: getNextSerialNumber(), userId: uuidv4(), username, email, password, validatedAt: 0, createdAt: now, updatedAt: now,});
}

function markUserVerified(userId) {
  const record = users.findOne({ userId });
  if (!record) return null;
  record.validatedAt = 1;
  record.updatedAt = new Date();
  return users.update(record);
}

module.exports = { getUsers: () => users, insertUser, markUserVerified };