// userManager.js — Accès exclusif à la base de données pour la table "users".
// Ce module ne contient *aucune* logique métier : uniquement des opérations SQL
// (CRUD) exécutées via le pool PostgreSQL.

// Import du pool de connexions PostgreSQL configuré dans db.js
import pool from "../db.js";

// Insère un nouvel utilisateur dans la base avec un mot de passe déjà hashé.
// Retourne l'id et le username du nouvel utilisateur.
export async function insertUser(username, hashedPassword) {
  return pool.query(
    // Requête SQL paramétrée pour éviter les injections
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
    // Tableau des valeurs substituées dans $1 et $2
    [username, hashedPassword]
  );
}

// Supprime un utilisateur en fonction de son username.
// Retourne la ligne supprimée (ou rien si aucun utilisateur ne correspond).
export async function deleteUserByUsername(username) {
  return pool.query(
    // DELETE avec clause RETURNING pour récupérer la ligne supprimée
    "DELETE FROM users WHERE username=$1 RETURNING *",
    // Paramètre de la requête
    [username]
  );
}

// Récupère tous les utilisateurs de la table "users".
export async function getAllUsers() {
  // Pas de paramètres ici, simple SELECT
  return pool.query("SELECT * FROM users");
}

// Recherche un utilisateur par son username.
// Retourne l'objet utilisateur ou null si aucun résultat.
export async function findUserByUsername(username) {
  // Exécution de la requête paramétrée
  const res = await pool.query(
    "SELECT * FROM users WHERE username=$1",
    [username]
  );

  // res.rows est un tableau : on renvoie la première ligne ou null
  return res.rows[0] || null;
}
