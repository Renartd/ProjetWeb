#!/bin/bash

###############################################
# Script : God_sql_connection
# Objet  : Connexion directe à la base Projetweb
###############################################

DB_NAME="projetweb"
DB_USER="projetweb_user"

# Déterminer le chemin du script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Chemin vers le .env du backend
ENV_FILE="$SCRIPT_DIR/../event-backend/.env"

echo "=== Connexion à PostgreSQL : base $DB_NAME ==="

# Vérifier que le .env existe
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Fichier .env introuvable : $ENV_FILE"
    exit 1
fi

# Récupérer le mot de passe
PGPASSWORD=$(grep DB_PASSWORD "$ENV_FILE" | cut -d '=' -f2)

if [ -z "$PGPASSWORD" ]; then
    echo "❌ Mot de passe introuvable dans $ENV_FILE"
    echo "Assure-toi que .env contient : DB_PASSWORD=projetweb"
    exit 1
fi

export PGPASSWORD

psql -h localhost -U "$DB_USER" -d "$DB_NAME"

unset PGPASSWORD
