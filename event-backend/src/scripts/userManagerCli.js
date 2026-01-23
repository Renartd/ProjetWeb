// userCli.js — Interface en ligne de commande pour gérer les utilisateurs.
// Ce script permet :
//   - de créer un utilisateur (avec hash du mot de passe)
//   - de supprimer un utilisateur
//   - de tester automatiquement les utilisateurs existants
//   - d'afficher un menu interactif
// Il utilise uniquement la logique métier minimale et délègue l'accès DB
// au userManager.js.

// Import du module readline pour interagir avec l'utilisateur dans le terminal
import readline from "readline";

// Import de bcryptjs pour hasher et comparer les mots de passe
import bcrypt from "bcryptjs";

// Import des fonctions d'accès à la base (aucune logique métier ici)
import {
  insertUser,
  deleteUserByUsername,
  getAllUsers,
  findUserByUsername
} from "../managers/userManager.js";

// Création d'une interface readline pour lire/écrire dans le terminal
const rl = readline.createInterface({
  input: process.stdin,   // flux d'entrée (clavier)
  output: process.stdout  // flux de sortie (console)
});

// Petite fonction utilitaire pour poser une question et attendre la réponse
function ask(q) {
  return new Promise(resolve => rl.question(q, resolve));
}

// Fonction utilitaire pour poser une question avec saisie masquée (mot de passe)
function askHidden(question) {
  return new Promise(resolve => {
    const stdin = process.openStdin();
    process.stdout.write(question);

    let input = "";

    const onData = char => {
      char = char + "";
      switch (char) {
        case "\n":
        case "\r":
        case "\u0004":
          stdin.removeListener("data", onData);
          process.stdout.write("\n");
          resolve(input);
          break;
        default:
          process.stdout.write("*");
          input += char;
          break;
      }
    };

    stdin.on("data", onData);
  });
}

// Fonction pour créer un utilisateur
async function createUser() {
  const username = await ask("Nom d'utilisateur : ");
  const password = await askHidden("Mot de passe : ");

  try {
    const hashed = await bcrypt.hash(password, 10);
    await insertUser(username, hashed);
    console.log(`✔️ Utilisateur créé : ${username}`);
  } catch (err) {
    console.error("❌ Erreur :", err.message);
  }
}

// Fonction pour supprimer un utilisateur
async function deleteUser() {
  const username = await ask("Nom d'utilisateur à supprimer : ");

  try {
    const res = await deleteUserByUsername(username);
    if (res.rowCount === 0) {
      console.log("❌ Aucun utilisateur trouvé.");
    } else {
      console.log(`✔️ Utilisateur supprimé : ${username}`);
    }
  } catch (err) {
    console.error("❌ Erreur :", err.message);
  }
}

// Fonction pour tester automatiquement les utilisateurs
async function testUsers() {
  try {
    const res = await getAllUsers();

    if (res.rows.length === 0) {
      console.log("⚠️ Aucun utilisateur dans la base.");
      return;
    }

    console.log("\n=== Test des utilisateurs ===");

    for (const row of res.rows) {
      const username = row.username;

      // Demande du vrai mot de passe
      const password = await askHidden(`Mot de passe pour ${username} : `);

      // Récupération du hash
      const user = await findUserByUsername(username);

      // Vérification
      const ok = await bcrypt.compare(password, user.password);

      if (ok) console.log(`✔️ Connexion OK : ${username}`);
      else console.log(`❌ Mot de passe incorrect : ${username}`);
    }
  } catch (err) {
    console.error("❌ Erreur :", err.message);
  }
}

// Menu principal interactif
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

// Lancement du menu au démarrage du script
mainMenu();
