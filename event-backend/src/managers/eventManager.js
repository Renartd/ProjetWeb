const pool = require("../db");

const eventManager = {
  async getAllEvents() {
    const result = await pool.query("SELECT * FROM events ORDER BY date ASC");
    return result.rows;
  },

  async getEventById(id) {
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [
      id
    ]);
    return result.rows[0];
  },

  async createEvent(data) {
    const { title, description, date, capacity, location, organizerId } = data;

    const result = await pool.query(
      `INSERT INTO events (title, description, date, capacity, location, organizer_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, date, capacity, location, organizerId]
    );

    return result.rows[0];
  },

  async updateEvent(id, data) {
    const fields = [];
    const values = [];
    let index = 1;

    for (const key of ["title", "description", "date", "capacity", "location"]) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${index}`);
        values.push(data[key]);
        index++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id);

    const result = await pool.query(
      `UPDATE events SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`,
      values
    );

    return result.rows[0];
  },

  async deleteEvent(id) {
    const result = await pool.query(
      "DELETE FROM events WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rowCount > 0;
  },

  async isOrganizer(eventId, userId) {
    const result = await pool.query(
      "SELECT organizer_id FROM events WHERE id = $1",
      [eventId]
    );

    if (result.rows.length === 0) return false;
    return result.rows[0].organizer_id === userId;
  }
};

module.exports = eventManager;
