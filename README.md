📘 Projet Web — Gestion d’Événements

Application complète permettant de créer, gérer et rejoindre des événements, avec authentification sécurisée, interface moderne en React, et API Node.js/Express connectée à PostgreSQL.
🚀 Fonctionnalités (User Stories)
ID	Fonctionnalité	Statut
US‑01	Inscription utilisateur	✔
US‑02	Connexion utilisateur	✔
US‑03	Affichage de la liste des événements	✔
US‑04	Détail d’un événement + places restantes	✔
US‑05	Inscription à un événement	✔
US‑06	Affichage des participants	✔
US‑07	Création d’un événement	✔
US‑08	Modification d’un événement	✔
US‑09	Suppression d’un événement + confirmation	✔
US‑10	Désinscription d’un événement	✔

Toutes les fonctionnalités demandées dans le sujet sont implémentées.
🏗️ Architecture du projet
Code

Projet_Web/
├── event-backend/     → API Node.js + Express + PostgreSQL
├── event-frontend/    → Interface React (Vite)
└── db/                → Scripts de déploiement + dump PostgreSQL

Backend

    Node.js

    Express

    PostgreSQL

    JWT pour l’authentification

    Architecture propre : controllers / services / managers

Frontend

    React + Vite

    Context API pour l’auth

    Pages : Login, Signup, EventsList, EventDetail, CreateEvent, EditEvent

    Composants réutilisables

⚙️ Installation complète
1) Prérequis

    Node.js ≥ 18

    npm ≥ 9

    PostgreSQL ≥ 14

🗄️ Installation du backend

Dans :
Code

Projet_Web/event-backend/

Installer les dépendances
Code

npm install

Configurer le fichier .env

Créer :
Code

DATABASE_URL=postgres://projetweb_user:VOTRE_MDP@localhost:5432/projetweb
JWT_SECRET=un_secret_long
PORT=3000

Créer la base PostgreSQL
Code

sudo -u postgres createdb projetweb

Importer les tables
Code

sudo -u postgres psql -d projetweb -f sql/create_registrations_table.sql

Lancer le backend
Code

node src/server.js

🎨 Installation du frontend

Dans :
Code

Projet_Web/event-frontend/

Installer les dépendances
Code

npm install

Lancer le serveur de développement
Code

npm run dev

🔑 Configuration du .env backend
Code

DATABASE_URL=postgres://projetweb_user:motdepasse@localhost:5432/projetweb
JWT_SECRET=un_secret_long
PORT=3000

📡 Documentation API (résumé)
Auth

    POST /auth/signup — créer un utilisateur

    POST /auth/login — obtenir un token JWT

Events

    GET /events — liste des événements

    GET /events/:id — détail d’un événement

    POST /events — créer un événement

    PUT /events/:id — modifier un événement

    DELETE /events/:id — supprimer un événement

Registrations

    POST /events/:id/register — s’inscrire

    DELETE /events/:id/register — se désinscrire

🧠 Choix techniques
Pourquoi React ?

    Rapidité de développement

    Composants réutilisables

    Navigation fluide (SPA)

Pourquoi Node.js + Express ?

    Léger, rapide, simple

    Parfait pour une API REST

Pourquoi PostgreSQL ?

    Fiable, robuste

    Support JSON natif

    Idéal pour les relations (events ↔ users)

Pourquoi JWT ?

    Auth stateless

    Simple à intégrer côté frontend

Pourquoi une architecture en couches ?

    controllers → logique HTTP

    services → logique métier

    managers → accès DB

    Code propre, testable, maintenable

🔐 Sécurité

    Hash des mots de passe

    JWT signé côté backend

    Middleware d’authentification

    Vérification organisateur avant modification/suppression

    Validation des données

    Protection contre mise à jour de champs sensibles (remaining, organizer, etc.)

📏 Règles métier

    Impossible de créer un événement dans le passé

    Impossible de s’inscrire deux fois

    Impossible de s’inscrire si complet

    Impossible de modifier/supprimer si non organisateur

    Places restantes calculées dynamiquement

    Confirmation obligatoire avant suppression

🐞 Bugs corrigés

    Erreur SQL : column remaining does not exist

    Correction de la mise à jour d’événement

    Correction des routes register/unregister

    Correction du logout

    Correction des dates invalides

    Protection contre champs interdits dans updateEvent

🛠️ Scripts de déploiement PostgreSQL (Linux/macOS/WSL + Windows)

Le dossier :
Code

Projet_Web/db/

contient :

    deploy.sh → script Bash pour Linux, macOS et WSL

    deploy.ps1 → script PowerShell pour Windows natif

    projetweb.dump → dump PostgreSQL versionné

Fonctionnalités des scripts

    Création automatique de la base projetweb

    Import du dump (projetweb.dump)

    Export de la base

    Suppression de la base

    Compatible multi‑OS

Ces scripts permettent de déployer la base de données sur n’importe quelle machine sans configuration manuelle.
👤 Auteur

Projet réalisé par Eloi KRESS et son fidèle Copilote.