import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getEvent,
  registerEvent,
  unregisterEvent,
  deleteEvent
} from "../../api/events";
import ParticipantsModal from "./ParticipantsModal";
import "./EventDetail.scss";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [event, setEvent] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showParticipants, setShowParticipants] = useState(false);

  async function fetchEvent() {
    setError(null);
    setLoading(true);
    try {
      const data = await getEvent(id);
      setEvent(data);

      if (user && data.participants) {
        const isRegistered = data.participants.some((p) => p.id === user.id);
        setRegistered(isRegistered);
      } else {
        setRegistered(false);
      }
    } catch (err) {
      setError(err.message || "Erreur lors du chargement de l'événement.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvent();
  }, [id, user]);

  const handleRegister = async () => {
    if (!token) {
      setError("Vous devez être connecté pour vous inscrire.");
      return;
    }
    setError(null);
    try {
      await registerEvent(id, token);
      setRegistered(true);
      await fetchEvent();
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription.");
    }
  };

  const handleUnregister = async () => {
    if (!token) {
      setError("Vous devez être connecté pour vous désinscrire.");
      return;
    }
    setError(null);
    try {
      await unregisterEvent(id, token);
      setRegistered(false);
      await fetchEvent();
    } catch (err) {
      setError(err.message || "Erreur lors de la désinscription.");
    }
  };

  const handleEdit = () => {
    navigate(`/events/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!token) {
      setError("Vous devez être connecté pour supprimer un événement.");
      return;
    }

    const ok = window.confirm(
      "Voulez-vous vraiment supprimer cet événement ? Cette action est irréversible."
    );

    if (!ok) return;

    setError(null);
    try {
      await deleteEvent(id, token);
      navigate("/events");
    } catch (err) {
      setError(err.message || "Erreur lors de la suppression.");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!event) return <p>Événement introuvable.</p>;

  const isOrganizer =
    user && event.organizer && user.id === event.organizer.id;

  const imageUrl = event.image_url
    ? `http://localhost:3000${event.image_url}`
    : null;

  return (
    <div className="event-detail-page">
      <h2>{event.title}</h2>

      {imageUrl && (
        <div className="event-detail-image-wrapper">
          <img src={imageUrl} alt={event.title} className="event-detail-image" />
        </div>
      )}

      <p><strong>Description :</strong> {event.description}</p>
      <p><strong>Date :</strong> {new Date(event.date).toLocaleString()}</p>
      <p><strong>Lieu :</strong> {event.location}</p>
      <p><strong>Places restantes :</strong> {event.remaining}</p>

      <p><strong>Organisateur :</strong> {event.organizer.username}</p>

      <button onClick={() => setShowParticipants(true)}>
        Voir les participants ({event.participants.length})
      </button>

      {showParticipants && (
        <ParticipantsModal
          eventId={event.id}
          onClose={() => setShowParticipants(false)}
        />
      )}

      {error && <p className="error">{error}</p>}

      {user && !isOrganizer && (
        registered ? (
          <button onClick={handleUnregister}>Se désinscrire</button>
        ) : (
          <button onClick={handleRegister}>S'inscrire</button>
        )
      )}

      {isOrganizer && (
        <>
          <button onClick={handleEdit}>Modifier</button>
          <button onClick={handleDelete}>Supprimer</button>
        </>
      )}
    </div>
  );
};

export default EventDetail;
