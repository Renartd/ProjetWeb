const registrationManager = require("../managers/registrationManager");
const eventManager = require("../managers/eventManager");

const registrationService = {
  async register(userId, eventId) {
    const event = await eventManager.getEventById(eventId);
    if (!event) throw new Error("EVENT_NOT_FOUND");

    const existing = await registrationManager.findByUserAndEvent(userId, eventId);
    if (existing) throw new Error("ALREADY_REGISTERED");

    const participants = await registrationManager.countParticipants(eventId);
    if (participants >= event.capacity) {
      throw new Error("EVENT_FULL");
    }

    return registrationManager.insertRegistration(userId, eventId);
  },

  async unregister(userId, eventId) {
    const existing = await registrationManager.findByUserAndEvent(userId, eventId);
    if (!existing) throw new Error("NOT_REGISTERED");

    return registrationManager.deleteRegistration(userId, eventId);
  },

  async getParticipants(eventId) {
    return registrationManager.getParticipants(eventId);
  },

  async getUserRegistrations(userId) {
    return registrationManager.getUserRegistrations(userId);
  }
};

module.exports = registrationService;
