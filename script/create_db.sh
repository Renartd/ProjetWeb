#!/bin/bash

DB_NAME="Projetweb"
DB_USER="projetweb_user"
DB_PASS="SuperMotDePasse123"

echo "=== Vérification du service PostgreSQL ==="
sudo systemctl start postgresql

echo "=== Création de l'utilisateur PostgreSQL ==="
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"

echo "=== Création de la base de données ==="
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 || \
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

echo "=== Attribution des privilèges ==="
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo "=== Génération du fichier .env ==="
cat > .env <<EOF
DB_HOST=localhost
DB_PORT=5432
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASS=$DB_PASS
EOF

echo "=== Script terminé ==="
echo "Base créée : $DB_NAME"
echo "Utilisateur : $DB_USER"
echo "Mot de passe : $DB_PASS"
echo "Fichier .env généré dans : $(pwd)/.env"
