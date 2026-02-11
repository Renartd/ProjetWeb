const registrationService = require("../services/registrationService");

const registrationController = {
  async register(req, res) {
    try {
      const userId = req.user.id;
      const eventId = req.params.eventId;

      const result = await registrationService.register(userId, eventId);
      res.status(201).json(result);
    } catch (err) {
      console.error("Register error:", err);

      const errors = {
        EVENT_NOT_FOUND: { status: 404, message: "Événement non trouvé." },
        ALREADY_REGISTERED: { status: 400, message: "Vous êtes déjà inscrit." },
        EVENT_FULL: { status: 400, message: "L'événement est complet." },
        EVENT_PAST: { status: 400, message: "Impossible de s'inscrire à un événement déjà passé." }
      };

      const e = errors[err.message];
      if (e) return res.status(e.status).json({ error: e.message });

      res.status(500).json({ error: "Erreur serveur." });
    }
  },

  async unregister(req, res) {
    try {
      const userId = req.user.id;
      const eventId = req.params.eventId;

      await registrationService.unregister(userId, eventId);
      return res.status(204).send();
    } catch (err) {
      console.error("Unregister error:", err);

      if (err.message === "NOT_REGISTERED") {
        return res.status(400).json({ error: "Vous n'êtes pas inscrit." });
      }

      if (err.message === "EVENT_NOT_FOUND") {
        return res.status(404).json({ error: "Événement non trouvé." });
      }

      res.status(500).json({ error: "Erreur serveur." });
    }
  },

  async getParticipants(req, res) {
    try {
      const eventId = req.params.eventId;
      const participants = await registrationService.getParticipants(eventId);
      res.json(participants);
    } catch (err) {
      console.error("Participants error:", err);
      res.status(500).json({ error: "Erreur serveur." });
    }
  },

  async getUserRegistrations(req, res) {
    try {
      const userId = req.user.id;
      const registrations = await registrationService.getUserRegistrations(userId);
      res.json(registrations);
    } catch (err) {
      console.error("User registrations error:", err);
      res.status(500).json({ error: "Erreur serveur." });
    }
  }
};

module.exports = registrationController;
