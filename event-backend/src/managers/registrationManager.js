const db = require("../db");

const registrationManager = {
  async insertRegistration(userId, eventId) {
    return db.query(
      "INSERT INTO registrations (user_id, event_id) VALUES ($1, $2) RETURNING *",
      [userId, eventId]
    );
  },

  async deleteRegistration(userId, eventId) {
    return db.query(
      "DELETE FROM registrations WHERE user_id = $1 AND event_id = $2 RETURNING *",
      [userId, eventId]
    );
  },

  async findRegistration(userId, eventId) {
    const result = await db.query(
      "SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2",
      [userId, eventId]
    );
    return result.rows[0] || null;
  },

  async countRegistrations(eventId) {
    const result = await db.query(
      "SELECT COUNT(*) FROM registrations WHERE event_id = $1",
      [eventId]
    );
    return parseInt(result.rows[0].count, 10);
  },

  async getParticipants(eventId) {
    const result = await db.query(
      `SELECT users.id, users.username
       FROM registrations
       JOIN users ON users.id = registrations.user_id
       WHERE registrations.event_id = $1`,
      [eventId]
    );
    return result.rows;
  },

  async getUserRegistrations(userId) {
    const result = await db.query(
      `SELECT events.*
       FROM registrations
       JOIN events ON events.id = registrations.event_id
       WHERE registrations.user_id = $1`,
      [userId]
    );
    return result.rows;
  }
};

module.exports = registrationManager;
