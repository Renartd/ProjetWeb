// userService.js — logique métier utilisateur
import bcrypt from "bcryptjs";
import {
  insertUser,
  findUserByUsername
} from "../managers/userManager.js";

/**
 * Inscription utilisateur
 * -----------------------
 * - Vérifie les champs
 * - Vérifie si l'utilisateur existe déjà
 * - Hash le mot de passe
 * - Insère dans la base via userManager
 */
export async function registerUser(username, password) {
  if (!username || !password) {
    throw new Error("Missing username or password");
  }

  // Vérifier si l'utilisateur existe déjà
  const existing = await findUserByUsername(username);
  if (existing) {
    throw new Error("User already exists");
  }

  // Hash du mot de passe
  const hashed = await bcrypt.hash(password, 10);

  // Insertion en base
  const result = await insertUser(username, hashed);

  return result.rows[0]; // { id, username }
}

/**
 * Connexion utilisateur
 * ---------------------
 * - Vérifie les champs
 * - Vérifie si l'utilisateur existe
 * - Compare le mot de passe
 */
export async function authenticateUser(username, password) {
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

  return user; // { id, username, password: hash }
}
