const db = require("../db");

const eventManager = {
  async getAllEvents() {
    const result = await db.query("SELECT * FROM events ORDER BY date ASC");
    return result.rows;
  },

  async getEventById(id) {
    const result = await db.query("SELECT * FROM events WHERE id = $1", [id]);
    return result.rows[0] || null;
  },

  async getEventWithRemaining(eventId) {
    const query = `
      SELECT 
        e.*,
        (e.capacity - COUNT(r.user_id)) AS remaining
      FROM events e
      LEFT JOIN registrations r ON r.event_id = e.id
      WHERE e.id = $1
      GROUP BY e.id;
    `;
    const result = await db.query(query, [eventId]);
    return result.rows[0] || null;
  },

  async createEvent(event) {
    const { title, description, date, location, capacity, organizerId } = event;
    const result = await db.query(
      `INSERT INTO events (title, description, date, location, capacity, organizer_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, date, location, capacity, organizerId]
    );
    return result.rows[0];
  },

  async updateEvent(id, data) {
    const fields = [];
    const values = [];
    let index = 1;

    for (const key in data) {
      fields.push(`${key} = $${index}`);
      values.push(data[key]);
      index++;
    }

    values.push(id);

    const result = await db.query(
      `UPDATE events SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  },

  async deleteEvent(id) {
    const result = await db.query(
      "DELETE FROM events WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0] || null;
  },

  async isOrganizer(eventId, userId) {
    const result = await db.query(
      "SELECT organizer_id FROM events WHERE id = $1",
      [eventId]
    );
    if (result.rows.length === 0) return false;
    return result.rows[0].organizer_id === userId;
  }
};

module.exports = eventManager;
