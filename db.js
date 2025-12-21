const Loki = require("lokijs");

const dbPath = __dirname + "/Database/users.json";

const db = new Loki(dbPath, {
  autoload: true,
  autosave: true,
  autosaveInterval: 4000,
  autoloadCallback: databaseInitialize,
});

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

function getNextSerialNumber() {
  const count = users.count();
  return count + 1;
}

function insertUser({ username, email, password }) {
  const now = new Date();

  return users.insert({
    serialNumber: getNextSerialNumber(), // ✅ AUTO SERIAL
    username,
    email,
    password,
    createdAt: now,
    updatedAt: now,
  });
}

function updateUser(user) {
  user.updatedAt = new Date();
  return users.update(user);
}

module.exports = {
  getUsers: () => users,
  insertUser,
  updateUser,
};