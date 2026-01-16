#!/bin/bash

###########################################################
# Script : progwebhelp
# Objet  : Afficher la liste des commandes Projetweb
# Auteur : Renart (avec ton fidèle Copilot)
###########################################################

echo ""
echo "=============================================="
echo "         📘 Aide des commandes Projetweb"
echo "=============================================="
echo ""

echo "🔹 reset_frontend"
echo "   → Supprime l'ancien frontend et recrée un projet Vite React/TS propre."
echo "     Idéal pour repartir de zéro sans Rolldown."
echo ""

echo "🔹 create_db_projetweb"
echo "   → Crée la base PostgreSQL 'projetweb', l'utilisateur associé,"
echo "     et génère le fichier .env contenant les identifiants."
echo ""

echo "🔹 start_projetweb"
echo "   → Lance l'environnement complet :"
echo "       - PostgreSQL"
echo "       - Backend (Nodemon)"
echo "       - Frontend (terminal séparé)"
echo "     Affiche aussi un tableau de bord avec les URLs."
echo ""

echo "🔹 God_sql_connection"
echo "   → Connexion directe à la base PostgreSQL 'projetweb'"
echo "     en utilisant les identifiants du fichier .env."
echo "     Ouvre un shell SQL interactif."
echo ""

echo "=============================================="
echo "Pour installer ces commandes globalement :"
echo "  sudo cp <script> /usr/local/bin/<nom_commande>"
echo "  sudo chmod +x /usr/local/bin/<nom_commande>"
echo "=============================================="
echo ""
