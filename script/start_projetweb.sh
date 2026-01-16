#!/bin/bash

###############################################
# Script de démarrage du projet Projetweb
# Backend + Frontend + PostgreSQL + .env
###############################################

PROJECT_DIR="$HOME/Bureau/Projet_Web"
BACKEND_DIR="$PROJECT_DIR/event-backend"
FRONTEND_DIR="$PROJECT_DIR/event-frontend"
ENV_FILE="$PROJECT_DIR/.env"

echo "=== Vérification du dossier Projetweb ==="
cd "$PROJECT_DIR" || { echo "Erreur : dossier Projet_Web introuvable"; exit 1; }

echo "=== Vérification de PostgreSQL ==="
sudo systemctl start postgresql
sudo systemctl status postgresql --no-pager

echo "=== Chargement du fichier .env ==="
if [ -f "$ENV_FILE" ]; then
    export $(grep -v '^#' "$ENV_FILE" | xargs)
    echo ".env chargé"
else
    echo "⚠️ Aucun fichier .env trouvé. Pense à exécuter create_db.sh"
fi

echo "=== Nettoyage des caches npm ==="
npm cache verify >/dev/null 2>&1

echo "=== Lancement du backend ==="
cd "$BACKEND_DIR" || exit 1

# Vérifie si nodemon est installé
if ! command -v nodemon &> /dev/null; then
    echo "Installation de nodemon..."
    npm install -g nodemon
fi

# Vérifie si un script npm 'dev' existe
if grep -q "\"dev\"" package.json; then
    npm run dev &
else
    nodemon server.js &
fi

BACKEND_PID=$!

echo "=== Ouverture d'un terminal séparé pour le frontend ==="
cd "$FRONTEND_DIR" || exit 1

# Détection automatique du terminal graphique
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "npm run dev; exec bash"
elif command -v konsole &> /dev/null; then
    konsole -e bash -c "npm run dev; exec bash"
else
    echo "⚠️ Impossible d'ouvrir un terminal séparé. Lance manuellement :"
    echo "cd $FRONTEND_DIR && npm run dev"
fi

echo ""
echo "=============================================="
echo "        Projetweb — Environnement prêt"
echo "=============================================="
echo "Backend : http://localhost:3000"
echo "Frontend : http://localhost:5173"
echo "Base PostgreSQL : $DB_NAME"
echo "Utilisateur DB : $DB_USER"
echo "----------------------------------------------"
echo "Backend PID : $BACKEND_PID"
echo "Logs backend visibles dans ce terminal"
echo "Logs frontend dans le terminal séparé"
echo "=============================================="
