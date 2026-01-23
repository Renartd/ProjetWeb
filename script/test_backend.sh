#!/bin/bash

echo "=========================================="
echo "   TEST COMPLET DU BACKEND EVENT-BACKEND  "
echo "=========================================="

BASE_URL="http://localhost:5000"
BACKEND_DIR="$HOME/Bureau/Projet_Web/event-backend"

echo ""
echo "=== 0) Réinitialisation utilisateur test ==="

# Supprime l'ancien utilisateur
sudo -u postgres psql -d projetweb -c "DELETE FROM users WHERE username='test@test.com';"

# Génère un hash en utilisant le node_modules du backend
HASHED=$(cd "$BACKEND_DIR" && node -e "console.log(require('bcryptjs').hashSync('test', 10))")

# Insère l'utilisateur propre
sudo -u postgres psql -d projetweb -c "INSERT INTO users (username, password) VALUES ('test@test.com', '$HASHED');"

echo "✔ Utilisateur test@test.com recréé avec password = test"

echo ""
echo "=== 1) Vérification PostgreSQL ==="
sudo -u postgres psql -d projetweb -c "SELECT id, username FROM users;"

echo ""
echo "=== 2) Test LOGIN ==="
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test@test.com","password":"test"}')

echo "Réponse login : $LOGIN_RESPONSE"

TOKEN=$(echo $LOGIN_RESPONSE | grep -oP '(?<=\"token\":\")[^\"]+')

if [ -z "$TOKEN" ]; then
  echo "❌ Échec login — token introuvable"
  exit 1
fi

echo "✔ Token récupéré"

echo ""
echo "=== 3) Test GET /auth/me ==="
curl -s -X GET $BASE_URL/auth/me \
  -H "Authorization: Bearer $TOKEN"

echo ""
echo ""
echo "=== 4) Test création d’un event ==="
CREATE_EVENT=$(curl -s -X POST $BASE_URL/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Event Test","description":"Demo","date":"2025-05-12","capacity":50}')

echo "Réponse création event : $CREATE_EVENT"

EVENT_ID=$(echo $CREATE_EVENT | grep -oP '(?<=\"id\":)[0-9]+')

if [ -z "$EVENT_ID" ]; then
  echo "❌ Impossible de créer un event"
  exit 1
fi

echo "✔ Event créé avec ID : $EVENT_ID"

echo ""
echo "=== 5) Test GET /events ==="
curl -s $BASE_URL/events

echo ""
echo ""
echo "=== 6) Test GET /events/$EVENT_ID ==="
curl -s $BASE_URL/events/$EVENT_ID

echo ""
echo ""
echo "=== 7) Test UPDATE event ==="
curl -s -X PUT $BASE_URL/events/$EVENT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Event Modifié","description":"Updated","date":"2025-06-01","capacity":100}'

echo ""
echo ""
echo "=== 8) Test DELETE event ==="
curl -s -X DELETE $BASE_URL/events/$EVENT_ID \
  -H "Authorization: Bearer $TOKEN"

echo ""
echo "=========================================="
echo "   FIN DES TESTS — SI TOUT EST ✔ C’EST OK "
echo "=========================================="
