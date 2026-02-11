import { Link } from "react-router-dom";
import "./EventCard.scss";

export default function EventCard({ event }) {
  const imageUrl = event.image_url
    ? `http://localhost:3000${event.image_url}`
    : null;

  return (
    <Link to={`/events/${event.id}`} className="event-card">
      {imageUrl && (
        <div className="event-card-image-wrapper">
          <img src={imageUrl} alt={event.title} className="event-card-image" />
        </div>
      )}
      <h3>{event.title}</h3>
      <p>{event.location}</p>
      <p>{new Date(event.date).toLocaleDateString()}</p>
    </Link>
  );
}
