const db = require("../db");

const eventManager = {
  async getAllEvents() {
    const query = `
      SELECT 
        e.*,

        json_build_object(
          'id', u.id,
          'username', u.username
        ) AS organizer,

        COALESCE(
          json_agg(r.user_id) FILTER (WHERE r.user_id IS NOT NULL),
          '[]'
        ) AS participants

      FROM events e
      LEFT JOIN users u ON u.id = e.organizer_id
      LEFT JOIN registrations r ON r.event_id = e.id
      GROUP BY e.id, u.id
      ORDER BY e.date ASC;
    `;

    const result = await db.query(query);
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
        (e.capacity - COUNT(r.user_id)) AS remaining,

        json_build_object(
          'id', u.id,
          'username', u.username
        ) AS organizer,

        COALESCE(
          json_agg(
            json_build_object(
              'id', p.id,
              'username', p.username
            )
          ) FILTER (WHERE p.id IS NOT NULL),
          '[]'
        ) AS participants

      FROM events e
      LEFT JOIN users u ON u.id = e.organizer_id
      LEFT JOIN registrations r ON r.event_id = e.id
      LEFT JOIN users p ON p.id = r.user_id

      WHERE e.id = $1
      GROUP BY e.id, u.id;
    `;

    const result = await db.query(query, [eventId]);
    return result.rows[0] || null;
  },

  async createEvent(event) {
    const { title, description, date, location, capacity, organizerId } = event;

    // 🔒 Sécurité : empêcher les dates passées
    const now = new Date();
    const eventDate = new Date(date);
    if (eventDate < now) {
      throw new Error("La date de l'événement ne peut pas être dans le passé.");
    }

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

    // ❌ Champs calculés ou non modifiables
    const forbidden = ["remaining", "organizer", "participants", "id"];

    for (const key in data) {
      if (forbidden.includes(key)) continue; // ← Ignore les champs interdits

      fields.push(`${key} = $${index}`);
      values.push(data[key]);
      index++;
    }

    if (fields.length === 0) {
      throw new Error("Aucun champ valide à mettre à jour.");
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
