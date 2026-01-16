import readline from "readline";
import bcrypt from "bcryptjs";
import pool from "././s./src/db.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(q) {
  return new Promise(resolve => rl.question(q, resolve));
}

async function createUser() {
  const username = await ask("Nom d'utilisateur : ");
  const password = await ask("Mot de passe : ");

  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [username, hashed]
    );
    console.log(`✔️ Utilisateur créé : ${username}`);
  } catch (err) {
    console.error("❌ Erreur :", err.message);
  }
}

async function deleteUser() {
  const username = await ask("Nom d'utilisateur à supprimer : ");

  try {
    const res = await pool.query(
      "DELETE FROM users WHERE username=$1 RETURNING *",
      [username]
    );

    if (res.rowCount === 0) {
      console.log("❌ Aucun utilisateur trouvé.");
    } else {
      console.log(`✔️ Utilisateur supprimé : ${username}`);
    }
  } catch (err) {
    console.error("❌ Erreur :", err.message);
  }
}

async function testUsers() {
  try {
    const res = await pool.query("SELECT username FROM users");

    if (res.rows.length === 0) {
      console.log("⚠️ Aucun utilisateur dans la base.");
      return;
    }

    console.log("\n=== Test des utilisateurs ===");

    for (const row of res.rows) {
      const username = row.username;
      const password = username.replace("user", "pass"); // logique simple

      const userRes = await pool.query(
        "SELECT * FROM users WHERE username=$1",
        [username]
      );

      const user = userRes.rows[0];
      const ok = await bcrypt.compare(password, user.password);

      if (ok) console.log(`✔️ Connexion OK : ${username}`);
      else console.log(`❌ Mot de passe incorrect : ${username}`);
    }
  } catch (err) {
    console.error("❌ Erreur :", err.message);
  }
}

async function mainMenu() {
  console.log(`
=========================================
   🧪 Gestion des utilisateurs Projetweb
=========================================
1) Créer un utilisateur
2) Supprimer un utilisateur
3) Tester les utilisateurs
4) Quitter
`);

  const choice = await ask("Choix : ");

  switch (choice.trim()) {
    case "1":
      await createUser();
      break;
    case "2":
      await deleteUser();
      break;
    case "3":
      await testUsers();
      break;
    case "4":
      console.log("Au revoir !");
      rl.close();
      process.exit(0);
    default:
      console.log("❌ Choix invalide.");
  }

  mainMenu();
}

mainMenu();

