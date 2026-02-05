#!/bin/bash

# ============================================================
#  Script de déploiement avancé pour Projet_Web
#  Prépare PostgreSQL, installe backend + frontend
#  Auteur : Renart
# ============================================================

DB_NAME="projetweb"
DB_USER="projetweb_user"
BACKEND_DIR="event-backend"
FRONTEND_DIR="event-frontend"
SQL_FILE="$BACKEND_DIR/sql/create_registrations_table.sql"

# ------------------------------------------------------------
#  Fonctions utilitaires
# ------------------------------------------------------------

green() { echo -e "\e[32m$1\e[0m"; }
red()   { echo -e "\e[31m$1\e[0m"; }
yellow(){ echo -e "\e[33m$1\e[0m"; }

# ------------------------------------------------------------
#  Vérification des dépendances système
# ------------------------------------------------------------

check_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        red "❌ $1 n'est pas installé."
        exit 1
    else
        green "✔ $1 détecté"
    fi
}

echo "🔍 Vérification des dépendances..."
check_command node
check_command npm
check_command psql

# ------------------------------------------------------------
#  Vérification PostgreSQL
# ------------------------------------------------------------

echo "🔍 Vérification de PostgreSQL..."

if ! sudo -u postgres psql -c "\q" >/dev/null 2>&1; then
    red "❌ Impossible de se connecter à PostgreSQL en tant que postgres."
    exit 1
else
    green "✔ Connexion PostgreSQL OK"
fi

# ------------------------------------------------------------
#  Vérification / création de l'utilisateur PostgreSQL
# ------------------------------------------------------------

echo "🔍 Vérification de l'utilisateur PostgreSQL '$DB_USER'..."

USER_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'")

if [ "$USER_EXISTS" != "1" ]; then
    yellow "⚠ L'utilisateur n'existe pas, création..."
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD 'password';"
    green "✔ Utilisateur créé"
else
    green "✔ Utilisateur déjà existant"
fi

# ------------------------------------------------------------
#  Vérification / création de la base
# ------------------------------------------------------------

echo "🔍 Vérification de la base '$DB_NAME'..."

DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

if [ "$DB_EXISTS" != "1" ]; then
    yellow "⚠ Base inexistante, création..."
    sudo -u postgres createdb -O $DB_USER $DB_NAME
    green "✔ Base créée"
else
    green "✔ Base déjà existante"
fi

# ------------------------------------------------------------
#  Import SQL
# ------------------------------------------------------------

if [ -f "$SQL_FILE" ]; then
    echo "📥 Import du fichier SQL : $SQL_FILE"
    sudo -u postgres psql -d $DB_NAME -f "$SQL_FILE"
    green "✔ Import SQL terminé"
else
    yellow "⚠ Aucun fichier SQL trouvé à : $SQL_FILE"
fi

# ------------------------------------------------------------
#  Installation backend
# ------------------------------------------------------------

echo "📦 Installation du backend..."

if [ -d "$BACKEND_DIR" ]; then
    cd "$BACKEND_DIR"
    npm install
    cd ..
    green "✔ Backend installé"
else
    red "❌ Dossier backend introuvable"
    exit 1
fi

# ------------------------------------------------------------
#  Installation frontend
# ------------------------------------------------------------

echo "📦 Installation du frontend..."

if [ -d "$FRONTEND_DIR" ]; then
    cd "$FRONTEND_DIR"
    npm install
    cd ..
    green "✔ Frontend installé"
else
    red "❌ Dossier frontend introuvable"
    exit 1
fi

# ------------------------------------------------------------
#  Résumé final
# ------------------------------------------------------------

echo ""
green "============================================================"
green " Déploiement terminé avec succès !"
green "============================================================"
echo ""
echo "👉 Backend installé dans : $BACKEND_DIR"
echo "👉 Frontend installé dans : $FRONTEND_DIR"
echo "👉 Base PostgreSQL : $DB_NAME"
echo "👉 Utilisateur PostgreSQL : $DB_USER"
echo ""
echo "Pour lancer le backend :"
echo "  cd event-backend && node src/server.js"
echo ""
echo "Pour lancer le frontend :"
echo "  cd event-frontend && npm run dev"
echo ""
green "🎉 Tout est prêt !"
