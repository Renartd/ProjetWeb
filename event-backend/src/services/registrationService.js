const registrationManager = require("../managers/registrationManager");
const eventManager = require("../managers/eventManager");

const registrationService = {
  async register(userId, eventId) {
    const event = await eventManager.getEventById(eventId);
    if (!event) throw new Error("Event not found");

    const existing = await registrationManager.findRegistration(
      userId,
      eventId
    );
    if (existing) throw new Error("Already registered");

    return registrationManager.insertRegistration(userId, eventId);
  },

  async unregister(userId, eventId) {
    const existing = await registrationManager.findRegistration(
      userId,
      eventId
    );
    if (!existing) throw new Error("Not registered");

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
