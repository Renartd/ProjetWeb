const express = require("express");
const router = express.Router();

const registrationController = require("../controllers/registrationController");
const { requireAuth } = require("../middleware/authMiddleware");

// Inscription (protégée)
router.post(
  "/events/:eventId/register",
  requireAuth,
  registrationController.register
);

// Désinscription (protégée)
router.delete(
  "/events/:eventId/register",
  requireAuth,
  registrationController.unregister
);

// Participants (public)
router.get(
  "/events/:eventId/participants",
  registrationController.getParticipants
);

// Inscriptions de l’utilisateur (protégée)
router.get(
  "/me/registrations",
  requireAuth,
  registrationController.getUserRegistrations
);

module.exports = router;
