const express = require("express");
const router = express.Router();

const registrationController = require("../controllers/registrationController");

// Inscription
router.post("/events/:eventId/register", registrationController.register);

// Désinscription
router.delete("/events/:eventId/register", registrationController.unregister);

// Participants
router.get("/events/:eventId/participants", registrationController.getParticipants);

// Inscriptions de l’utilisateur
router.get("/me/registrations", registrationController.getUserRegistrations);

module.exports = router;
