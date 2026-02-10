#!/bin/bash

DB_NAME="projetweb"
DUMP_FILE="projetweb.dump"

detect_os() {
  case "$(uname -s)" in
    Linux*)   OS="linux" ;;
    Darwin*)  OS="mac" ;;
    *)        OS="unknown" ;;
  esac
}

psql_cmd() {
  if [ "$OS" = "mac" ]; then
    psql -U postgres "$@"
  else
    sudo -u postgres psql "$@"
  fi
}

createdb_cmd() {
  if [ "$OS" = "mac" ]; then
    createdb -U postgres "$@"
  else
    sudo -u postgres createdb "$@"
  fi
}

dropdb_cmd() {
  if [ "$OS" = "mac" ]; then
    dropdb -U postgres "$@"
  else
    sudo -u postgres dropdb "$@"
  fi
}

pg_restore_cmd() {
  if [ "$OS" = "mac" ]; then
    pg_restore -U postgres "$@"
  else
    sudo -u postgres pg_restore "$@"
  fi
}

pg_dump_cmd() {
  if [ "$OS" = "mac" ]; then
    pg_dump -U postgres "$@"
  else
    sudo -u postgres pg_dump "$@"
  fi
}

detect_os

echo ""
echo "----------------------------------------"
echo "   Gestion PostgreSQL pour ProjetWeb"
echo "----------------------------------------"
echo ""
echo "1) Créer la base (si absente) + Importer"
echo "2) Exporter la base"
echo "3) Supprimer la base"
echo "4) Quitter"
echo ""
read -p "Choix : " choice

case $choice in

  1)
    echo ""
    echo "📥 Import de la base PostgreSQL"
    echo ""

    if ! psql_cmd -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
      echo "➡ Création de la base $DB_NAME"
      createdb_cmd "$DB_NAME"
    else
      echo "✔ La base existe déjà"
    fi

    if [ ! -f "$DUMP_FILE" ]; then
      echo "❌ Fichier $DUMP_FILE introuvable"
      exit 1
    fi

    echo "➡ Import du dump..."
    pg_restore_cmd --clean --if-exists -d "$DB_NAME" "$DUMP_FILE"

    echo "✔ Import terminé"
    ;;

  2)
    echo ""
    echo "📤 Export de la base PostgreSQL"
    echo ""

    read -p "Nom du fichier (défaut: $DUMP_FILE) : " file
    file=${file:-$DUMP_FILE}

    pg_dump_cmd -F c -d "$DB_NAME" -f "$file"

    echo "✔ Export terminé : $file"
    ;;

  3)
    echo ""
    echo "⚠ Suppression de la base $DB_NAME"
    read -p "Confirmer (y/n) : " confirm

    if [ "$confirm" = "y" ]; then
      dropdb_cmd "$DB_NAME"
      echo "✔ Base supprimée"
    else
      echo "❌ Annulé"
    fi
    ;;

  4)
    echo "👋 Fin"
    exit 0
    ;;

  *)
    echo "❌ Choix invalide"
    ;;
esac
