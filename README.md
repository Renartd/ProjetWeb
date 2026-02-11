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
US‑11	Upload d’image pour un événement	✔ (NOUVEAU)

Toutes les fonctionnalités demandées dans le sujet sont implémentées.
🖼️ Upload d’image (NOUVEAU)

Fonctionnalité ajoutée au backend + frontend :
✔ Fonctionnement

    L’organisateur peut uploader une image lors de la création ou modification d’un événement.

    L’image est optionnelle.

    L’image est affichée :

        en miniature responsive dans la liste des événements (EventCard)

        en grand dans la page de détail (EventDetail)

✔ Sécurité

    Seul l’organisateur peut uploader ou modifier l’image.

    Vérification côté backend via isOrganizer.

✔ Contraintes

    Taille maximale : 2 Mo

    Formats acceptés : uniquement image/*

    Stockage local dans :
    Code

    event-backend/uploads/

✔ Backend

    Route dédiée :
    Code

    POST /api/events/:id/image

    Utilisation de multer pour gérer l’upload.

    Le backend sert les images via :
    js

    app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

✔ Base de données

Ajout de la colonne :
sql

ALTER TABLE events ADD COLUMN IF NOT EXISTS image_url TEXT;

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

    Upload d’image sécurisé (multer + vérification organisateur)

Frontend

    React + Vite

    Context API pour l’auth

    Pages : Login, Signup, EventsList, EventDetail, CreateEvent, EditEvent

    Upload d’image via FormData

    Miniatures responsive

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

Installer multer (upload d’image)
Code

npm install multer

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

Ajouter la colonne image_url (si pas déjà faite)
Code

psql -U projetweb_user -d projetweb -c "ALTER TABLE events ADD COLUMN IF NOT EXISTS image_url TEXT;"

Lancer le backend
Code

npm run dev

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

    POST /events/:id/image — uploader une image (organisateur uniquement)

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

    Protection contre mise à jour de champs sensibles

    Protection upload : seul l’organisateur peut envoyer une image

    Limite de taille (2 Mo) + filtrage MIME

📏 Règles métier

    Impossible de créer un événement dans le passé

    Impossible de s’inscrire deux fois

    Impossible de s’inscrire si complet

    Impossible de modifier/supprimer si non organisateur

    Places restantes calculées dynamiquement

    Confirmation obligatoire avant suppression

    Image optionnelle, mais contrôlée (taille + type)

🐞 Bugs corrigés

    Erreur SQL : column remaining does not exist

    Correction de la mise à jour d’événement

    Correction des routes register/unregister

    Correction du logout

    Correction des dates invalides

    Protection contre champs interdits dans updateEvent

    Correction backend pour servir les images (/uploads)

    Ajout de multer + gestion des erreurs d’upload

🛠️ Scripts de déploiement PostgreSQL

Le dossier :
Code

Projet_Web/db/

contient :

    deploy.sh → script Bash (Linux/macOS/WSL)

    deploy.ps1 → script PowerShell (Windows)

    projetweb.dump → dump PostgreSQL versionné

Fonctionnalités :

    Création automatique de la base projetweb

    Import du dump

    Export de la base

    Suppression de la base

    Compatible multi‑OS

👤 Auteur

Projet réalisé par Eloi KRESS et son fidèle Copilote.