import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getEvent,
  registerEvent,
  unregisterEvent,
  deleteEvent
} from "../../api/events";
import "./EventDetail.scss";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [event, setEvent] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // 🔒 Confirmation avant suppression
  const ok = window.confirm(
    "Voulez-vous vraiment supprimer cet événement ? Cette action est irréversible."
  );

  if (!ok) return; // L'utilisateur annule → on ne fait rien

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

  return (
    <div className="event-detail-page">
      <h2>{event.title}</h2>

      <p>
        <strong>Description :</strong> {event.description}
      </p>

      <p>
        <strong>Date :</strong>{" "}
        {event.date ? new Date(event.date).toLocaleString() : "Date inconnue"}
      </p>

      <p>
        <strong>Lieu :</strong> {event.location || "Lieu inconnu"}
      </p>

      <p>
        <strong>Places restantes :</strong> {event.remaining ?? "?"}
      </p>

      {event.organizer && (
        <p>
          <strong>Organisateur :</strong> {event.organizer.username}
        </p>
      )}

      <h3>Participants</h3>

      {!event.participants || event.participants.length === 0 ? (
        <p>Aucun participant pour le moment.</p>
      ) : (
        <ul>
          {event.participants.map((p) => (
            <li key={p.id}>{p.username}</li>
          ))}
        </ul>
      )}

      {error && <p className="error">{error}</p>}

      {user && !isOrganizer && (
        <>
          {registered ? (
            <button onClick={handleUnregister}>Se désinscrire</button>
          ) : (
            <button onClick={handleRegister}>S'inscrire</button>
          )}
        </>
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
