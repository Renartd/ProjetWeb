#!/bin/bash

echo "=== Suppression de l'ancien frontend (Rolldown) ==="
rm -rf event-frontend

echo "=== Création d'un nouveau projet Vite React/TS sans Rolldown ==="
npm create vite@latest event-frontend -- --template react-ts <<EOF
n
EOF

echo "=== Installation des dépendances ==="
cd event-frontend
npm install

echo "=== Correction terminée ==="
echo "Tu peux maintenant lancer ton frontend avec :"
echo "  cd event-frontend && npm run dev"

