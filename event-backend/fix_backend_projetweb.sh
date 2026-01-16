#!/bin/bash

###############################################################
# Script : fix_backend_projetweb
# Objet  : Réparer automatiquement le backend Projetweb
# Auteur : Renart (avec ton fidèle Copilot)
###############################################################

BACKEND_DIR="$HOME/Bureau/Projet_Web/event-backend"

echo "=== Vérification du dossier backend ==="
cd "$BACKEND_DIR" || { echo "❌ Dossier backend introuvable"; exit 1; }

echo "=== Suppression de index.js inutile ==="
if [ -f "index.js" ]; then
    rm index.js
    echo "✔ index.js supprimé"
else
    echo "✔ Aucun index.js à supprimer"
fi

echo "=== Création du fichier server.js si absent ==="
if [ ! -f "server.js" ]; then
    cat <<EOF > server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Projetweb opérationnel !");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(\`Serveur démarré sur http://localhost:\${PORT}\`);
});
EOF
    echo "✔ server.js créé"
else
    echo "✔ server.js existe déjà"
fi

echo "=== Vérification de nodemon local ==="
if [ ! -d "node_modules/nodemon" ]; then
    echo "→ Installation de nodemon local..."
    npm install --save-dev nodemon
else
    echo "✔ nodemon déjà installé localement"
fi

echo "=== Mise à jour du package.json ==="
# Ajout du script "dev" si absent
if ! grep -q "\"dev\"" package.json; then
    sed -i 's/"test":.*/"test": "echo \\"Error: no test specified\\" \&\& exit 1",\n    "dev": "nodemon server.js"/' package.json
    echo "✔ Script dev ajouté"
else
    echo "✔ Script dev déjà présent"
fi

echo "=== Test du backend ==="
npm run dev
