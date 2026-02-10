import { useEffect, useState } from "react";
import { getEvents } from "../../api/events";
import EventCard from "../../components/EventCard/EventCard";
import "./EventsList.scss";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [author, setAuthor] = useState("");

  const [showFilters, setShowFilters] = useState(false);

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

  function resetFilters() {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setLocation("");
    setAuthor("");
  }

  const filteredEvents = events
    .filter(e =>
      e.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter(e =>
      !location || e.location.toLowerCase().includes(location.toLowerCase())
    )
    .filter(e => {
      if (!startDate) return true;
      return new Date(e.date) >= new Date(startDate);
    })
    .filter(e => {
      if (!endDate) return true;
      return new Date(e.date) <= new Date(endDate);
    })
    .filter(e =>
      !author || e.organizer?.toLowerCase().includes(author.toLowerCase())
    );

  return (
    <div className="events-list-page">
      <h2>Liste des événements</h2>

      {loading && <p className="loading">Chargement des événements...</p>}
      {error && <div className="error-box">{error}</div>}

      <input
        type="text"
        placeholder="Rechercher un événement..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      <button
        className="toggle-filters-btn"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
      </button>

      <div className={`filters-wrapper ${showFilters ? "open" : ""}`}>
        <div className="filters">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <input
            type="text"
            placeholder="Lieu..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            type="text"
            placeholder="Auteur..."
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <button className="reset-btn" onClick={resetFilters}>
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
