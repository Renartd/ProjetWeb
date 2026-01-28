const pool = require("../db");

async function insertUser(username, hashedPassword) {
  return pool.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
    [username, hashedPassword]
  );
}

async function findUserByUsername(username) {
  const res = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  return res.rows[0] || null;
}

async function deleteUserByUsername(username) {
  return pool.query(
    "DELETE FROM users WHERE username = $1 RETURNING *",
    [username]
  );
}

async function getAllUsers() {
  return pool.query("SELECT * FROM users");
}

module.exports = {
  insertUser,
  findUserByUsername,
  deleteUserByUsername,
  getAllUsers
};
