import { Link } from "react-router-dom";
import "./EventCard.scss";

export default function EventCard({ event }) {
  return (
    <Link to={`/events/${event.id}`} className="event-card">
      <h3>{event.title}</h3>
      <p>{event.location}</p>
      <p>{new Date(event.date).toLocaleDateString()}</p>
    </Link>
  );
}
