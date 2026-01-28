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
      res.status(400).json({ error: err.message });
    }
  },

  async unregister(req, res) {
    try {
      const userId = req.user.id;
      const eventId = req.params.eventId;

      const result = await registrationService.unregister(userId, eventId);
      res.json(result);
    } catch (err) {
      console.error("Unregister error:", err);
      res.status(400).json({ error: err.message });
    }
  },

  async getParticipants(req, res) {
    try {
      const eventId = req.params.eventId;
      const participants = await registrationService.getParticipants(eventId);
      res.json(participants);
    } catch (err) {
      console.error("Participants error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getUserRegistrations(req, res) {
    try {
      const userId = req.user.id;
      const registrations =
        await registrationService.getUserRegistrations(userId);
      res.json(registrations);
    } catch (err) {
      console.error("User registrations error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = registrationController;
