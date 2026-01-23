// Script interne permettant à un développeur de créer un utilisateur manuellement
// ------------------------------------------------------------------------------

// Importation des modules nécessaires
import readline from "readline";   // Pour lire les entrées clavier
import bcrypt from "bcryptjs";     // Pour hasher le mot de passe
import pool from "../db.js";       // Connexion PostgreSQL

// Interface pour lire les entrées utilisateur dans le terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Fonction utilitaire pour poser une question dans le terminal
function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function createUser() {
  console.log("=== Création d'un utilisateur ===");

  try {
    // Demande du username
    const username = await ask("Nom d'utilisateur : ");

    // Demande du mot de passe
    const password = await ask("Mot de passe : ");

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertion dans la base PostgreSQL
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );

    console.log("\n✔ Utilisateur créé avec succès !");
    console.log("ID :", result.rows[0].id);
    console.log("Username :", result.rows[0].username);
  } catch (err) {
    console.error("❌ Erreur lors de la création :", err.message);
  } finally {
    rl.close();   // Ferme l’interface terminal
    pool.end();   // Ferme la connexion PostgreSQL
  }
}

// Lancement du script
createUser();
