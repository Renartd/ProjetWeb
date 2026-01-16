#!/bin/bash

###############################################
# Script : God_sql_connection
# Objet  : Connexion directe à la base Projetweb
###############################################

DB_NAME="projetweb"
DB_USER="projetweb_user"

echo "=== Connexion à PostgreSQL : base $DB_NAME ==="

# Demande le mot de passe proprement
PGPASSWORD=$(grep DB_PASS .env | cut -d '=' -f2)

if [ -z "$PGPASSWORD" ]; then
    echo "⚠️  Mot de passe introuvable dans .env"
    echo "Assure-toi que .env contient : DB_PASS=tonmotdepasse"
    exit 1
fi

export PGPASSWORD

psql -h localhost -U "$DB_USER" -d "$DB_NAME"

unset PGPASSWORD
