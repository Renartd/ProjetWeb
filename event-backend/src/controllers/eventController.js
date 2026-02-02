const eventService = require("../services/eventService");

const eventController = {
  async list(req, res) {
    try {
      const events = await eventService.listEvents();
      res.json(events);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  async get(req, res) {
    try {
      const event = await eventService.getEventDetails(req.params.id);
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const event = await eventService.createEvent(req.body, req.user.id);
      res.status(201).json(event);
    } catch (err) {
      console.error(err);
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
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (err) {
      console.error(err);
      res.status(err.status || 400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const ok = await eventService.deleteEvent(req.params.id, req.user.id);
      if (!ok) return res.status(404).json({ error: "Event not found" });
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(err.status || 400).json({ error: err.message });
    }
  }
};

module.exports = eventController;
