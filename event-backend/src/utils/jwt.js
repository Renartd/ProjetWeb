// jwt.js — utilitaires pour les tokens JWT
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Génère un token JWT pour un utilisateur
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Vérifie et décode un token JWT
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
