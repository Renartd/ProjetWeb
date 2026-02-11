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

    const now = new Date();
    const eventDate = new Date(date);
    if (eventDate < now) {
      throw new Error("La date de l'événement ne peut pas être dans le passé.");
    }

    if (capacity <= 0) {
      throw new Error("Le nombre de places doit être un nombre positif.");
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

    const forbidden = ["remaining", "organizer", "participants", "id", "organizer_id"];

    for (const key in data) {
      if (forbidden.includes(key)) {
        throw new Error(`Le champ '${key}' ne peut pas être modifié.`);
      }

      if (key === "date") {
        const d = new Date(data[key]);
        if (d < new Date()) {
          throw new Error("La date de l'événement ne peut pas être dans le passé.");
        }
      }

      if (key === "capacity" && data[key] <= 0) {
        throw new Error("Le nombre de places doit être un nombre positif.");
      }

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
  },

  async getPaginatedEvents(limit, offset) {
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
      ORDER BY e.date ASC
      LIMIT $1 OFFSET $2;
    `;

    const result = await db.query(query, [limit, offset]);
    return result.rows;
  },

  async getParticipantsPaginated(eventId, limit, offset) {
    const query = `
      SELECT 
        u.id,
        u.username
      FROM registrations r
      JOIN users u ON u.id = r.user_id
      WHERE r.event_id = $1
      ORDER BY u.username ASC
      LIMIT $2 OFFSET $3;
    `;

    const totalQuery = `
      SELECT COUNT(*) AS total
      FROM registrations
      WHERE event_id = $1;
    `;

    const [participantsRes, totalRes] = await Promise.all([
      db.query(query, [eventId, limit, offset]),
      db.query(totalQuery, [eventId])
    ]);

    return {
      participants: participantsRes.rows,
      total: Number(totalRes.rows[0].total)
    };
  },

  async updateEventImage(eventId, imageUrl) {
    const result = await db.query(
      `UPDATE events
       SET image_url = $2
       WHERE id = $1
       RETURNING *`,
      [eventId, imageUrl]
    );
    return result.rows[0] || null;
  }
};

module.exports = eventManager;
