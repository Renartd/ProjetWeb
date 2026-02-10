import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getEvents } from "../../api/events";
import EventCard from "../../components/EventCard/EventCard";
import "./MyEvents.scss";

export default function MyEvents() {
  const { user } = useContext(AuthContext);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const events = await getEvents();

        const mine = events.filter((e) => e.organizerId === user.id);
        const registered = events.filter((e) =>
          e.participants?.includes(user.id)
        );

        setCreatedEvents(mine);
        setRegisteredEvents(registered);
      } catch (err) {
        console.error("Erreur chargement événements:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="my-events-page">
          <p className="loading">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="my-events-page">
        <h2>Mes événements</h2>

        <section>
          <h3>Événements créés</h3>
          <div className="events-grid">
            {createdEvents.length === 0 && (
              <p className="empty">Aucun événement créé.</p>
            )}
            {createdEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        <section>
          <h3>Événements auxquels je suis inscrit</h3>
          <div className="events-grid">
            {registeredEvents.length === 0 && (
              <p className="empty">Aucune inscription.</p>
            )}
            {registeredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
