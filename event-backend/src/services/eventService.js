const eventManager = require("../managers/eventManager");

const eventService = {
  async listEvents() {
    return eventManager.getAllEvents();
  },

  async getEvent(id) {
    return eventManager.getEventById(id);
  },

  async getEventDetails(id) {
    return eventManager.getEventWithRemaining(id);
  },

  async createEvent(data, userId) {
    return eventManager.createEvent({ ...data, organizerId: userId });
  },

  async updateEvent(id, data, userId) {
    const isOrganizer = await eventManager.isOrganizer(id, userId);

    if (!isOrganizer) {
      const err = new Error("Vous n'êtes pas l'organisateur de cet événement.");
      err.status = 403;
      throw err;
    }

    return eventManager.updateEvent(id, data);
  },

  async deleteEvent(id, userId) {
    const isOrganizer = await eventManager.isOrganizer(id, userId);

    if (!isOrganizer) {
      const err = new Error("Vous ne pouvez pas supprimer cet événement.");
      err.status = 403;
      throw err;
    }

    return eventManager.deleteEvent(id);
  }
};

module.exports = eventService;
