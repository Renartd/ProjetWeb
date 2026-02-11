const eventService = require("../services/eventService");

const eventController = {
  async list(req, res) {
    try {
      const events = await eventService.listEvents();
      res.json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur interne du serveur." });
    }
  },

  async get(req, res) {
    try {
      const event = await eventService.getEventDetails(req.params.id);

      if (!event) {
        return res.status(404).json({ error: "Événement non trouvé." });
      }

      res.json(event);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur interne du serveur." });
    }
  },

  async create(req, res) {
    try {
      const event = await eventService.createEvent(req.body, req.user.id);
      res.status(201).json(event);
    } catch (err) {
      console.error(err);

      // Erreurs essentielles de création
      if (err.message.includes("title")) {
        return res.status(400).json({ error: "Le titre est obligatoire." });
      }
      if (err.message.includes("description")) {
        return res.status(400).json({ error: "La description est obligatoire." });
      }
      if (err.message.includes("date")) {
        return res.status(400).json({ error: "La date est obligatoire." });
      }
      if (err.message.includes("location")) {
        return res.status(400).json({ error: "Le lieu est obligatoire." });
      }
      if (err.message.includes("capacity")) {
        return res.status(400).json({ error: "Le nombre de places est obligatoire." });
      }
      if (err.message.includes("past")) {
        return res.status(400).json({ error: "La date de l'événement ne peut pas être dans le passé." });
      }
      if (err.message.includes("positive")) {
        return res.status(400).json({ error: "Le nombre de places doit être un nombre positif." });
      }

      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const event = await eventService.updateEvent(
        req.params.id,
        req.body,
        req.user.id
      );

      if (!event) {
        return res.status(404).json({ error: "Événement non trouvé." });
      }

      res.json(event);
    } catch (err) {
      console.error(err);

      // Erreurs essentielles de modification
      if (err.message.includes("not organizer")) {
        return res.status(403).json({ error: "Vous n'êtes pas l'organisateur de cet événement." });
      }
      if (err.message.includes("past")) {
        return res.status(400).json({ error: "La date de l'événement ne peut pas être dans le passé." });
      }

      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const ok = await eventService.deleteEvent(req.params.id, req.user.id);

      if (!ok) {
        return res.status(404).json({ error: "Événement non trouvé." });
      }

      res.status(204).send();
    } catch (err) {
      console.error(err);

      // Erreurs essentielles de suppression
      if (err.message.includes("not organizer")) {
        return res.status(403).json({ error: "Vous ne pouvez pas supprimer cet événement." });
      }

      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = eventController;
