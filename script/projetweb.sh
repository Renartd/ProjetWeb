#!/bin/bash

###########################################################
# Script : projetweb
# Objet  : Lancer l'environnement complet Projetweb
#          + ouvrir une connexion SQL à la base
###########################################################

echo "=============================================="
echo "     🚀 Lancement complet du projet Projetweb"
echo "=============================================="
echo ""

# Vérifie que les commandes globales existent
if ! command -v start_projetweb &> /dev/null; then
    echo "❌ La commande 'start_projetweb' n'est pas installée."
    echo "Installe-la avec : sudo cp start_projetweb.sh /usr/local/bin/start_projetweb"
    exit 1
fi

if ! command -v God_sql_connection &> /dev/null; then
    echo "❌ La commande 'God_sql_connection' n'est pas installée."
    echo "Installe-la avec : sudo cp God_sql_connection.sh /usr/local/bin/God_sql_connection"
    exit 1
fi

echo "=== 1) Lancement de l'environnement de développement ==="
start_projetweb

echo ""
echo "=== 2) Ouverture de la connexion SQL ==="
God_sql_connection

echo ""
echo "=============================================="
echo "Projetweb est lancé et connecté à PostgreSQL"
echo "=============================================="
