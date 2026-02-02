import { useEffect, useState } from "react";
import { getEvents } from "../../api/events";
import EventCard from "../../components/EventCard/EventCard";
import "./EventsList.scss";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError(err.message || "Erreur serveur. Impossible de charger les événements.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="events-list-page">
      <h2>Liste des événements</h2>

      {loading && <p className="loading">Chargement des événements...</p>}
      {error && <div className="error-box">{error}</div>}

      <div className="events-grid">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
