// userService.js — logique métier utilisateur
const bcrypt = require("bcryptjs");
const db = require("../db");
const {
  insertUser,
  findUserByUsername
} = require("../managers/userManager");

/**
 * Inscription utilisateur
 */
async function registerUser(username, password) {
  if (!username || !password) {
    throw new Error("Missing username or password");
  }

  const existing = await findUserByUsername(username);
  if (existing) {
    throw new Error("User already exists");
  }

  const hashed = await bcrypt.hash(password, 10);
  const result = await insertUser(username, hashed);

  return result.rows[0];
}

/**
 * Connexion utilisateur
 */
async function authenticateUser(username, password) {
  if (!username || !password) {
    throw new Error("Missing username or password");
  }

  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new Error("Invalid credentials");
  }

  return user;
}

/**
 * Récupérer un utilisateur par ID
 */
async function getUserById(id) {
  const result = await db.query(
    "SELECT id, username, avatar_url FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

/**
 * Modifier username / password
 */
async function updateProfile(id, data) {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.username) {
    fields.push(`username = $${index}`);
    values.push(data.username);
    index++;
  }

  if (data.password) {
    const hash = await bcrypt.hash(data.password, 10);
    fields.push(`password = $${index}`);
    values.push(hash);
    index++;
  }

  if (fields.length === 0) {
    throw new Error("Aucun champ valide à mettre à jour.");
  }

  values.push(id);

  const result = await db.query(
    `UPDATE users SET ${fields.join(", ")} WHERE id = $${index} RETURNING id, username, avatar_url`,
    values
  );

  return result.rows[0];
}

/**
 * Modifier l’avatar
 */
async function updateAvatar(id, avatarUrl) {
  const result = await db.query(
    `UPDATE users SET avatar_url = $2 WHERE id = $1 RETURNING id, username, avatar_url`,
    [id, avatarUrl]
  );
  return result.rows[0];
}

module.exports = {
  registerUser,
  authenticateUser,
  getUserById,
  updateProfile,
  updateAvatar
};
