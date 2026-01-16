#!/bin/bash

# Trouver automatiquement le dossier Projet_Web
PROJECT_ROOT=$(dirname "$(dirname "$(realpath "$0")")")

echo "🔍 Recherche des fichiers .env dans : $PROJECT_ROOT"
echo

# Recherche récursive de tous les fichiers nommés .env
env_files=$(find "$PROJECT_ROOT" -type f -name ".env")

if [ -z "$env_files" ]; then
    echo "❌ Aucun fichier .env trouvé."
    exit 0
fi

echo "📌 Fichiers .env trouvés :"
echo "$env_files"
echo

# Affichage du contenu de chaque .env
for file in $env_files; do
    echo "----------------------------------------"
    echo "📄 Contenu de : $file"
    echo "----------------------------------------"
    cat "$file"
    echo
done
