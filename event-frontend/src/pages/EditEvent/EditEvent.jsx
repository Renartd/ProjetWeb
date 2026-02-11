import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getEvent, updateEvent, uploadEventImage } from "../../api/events";
import "./EditEvent.scss";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [event, setEvent] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEvent(id)
      .then(setEvent)
      .catch((err) => setError(err.message));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      capacity: event.capacity
    };

    try {
      await updateEvent(id, payload, token);

      if (imageFile) {
        try {
          await uploadEventImage(id, imageFile, token);
        } catch (err) {
          console.error("Erreur upload image:", err);
          setError(
            err.message ||
              "Modification enregistrée, mais l'upload de l'image a échoué."
          );
        }
      }

      navigate(`/events/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      return;
    }
    setImageFile(file);
  };

  if (!event) return <p>Chargement...</p>;

  const imageUrl = event.image_url
    ? `http://localhost:3000${event.image_url}`
    : null;

  return (
    <div className="edit-event-page">
      <h2>Modifier l'événement</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Titre
          <input
            type="text"
            value={event.title}
            onChange={(e) => setEvent({ ...event, title: e.target.value })}
          />
        </label>

        <label>
          Description
          <textarea
            value={event.description}
            onChange={(e) =>
              setEvent({ ...event, description: e.target.value })
            }
          />
        </label>

        <label>
          Date
          <input
            type="datetime-local"
            value={event.date.slice(0, 16)}
            onChange={(e) => setEvent({ ...event, date: e.target.value })}
          />
        </label>

        <label>
          Lieu
          <input
            type="text"
            value={event.location}
            onChange={(e) => setEvent({ ...event, location: e.target.value })}
          />
        </label>

        <label>
          Capacité
          <input
            type="number"
            min="1"
            value={event.capacity}
            onChange={(e) =>
              setEvent({ ...event, capacity: Number(e.target.value) })
            }
          />
        </label>

        <div className="image-section">
          <p>Image actuelle :</p>
          {imageUrl ? (
            <img src={imageUrl} alt={event.title} className="event-image-preview" />
          ) : (
            <p>Aucune image pour cet événement.</p>
          )}

          <label>
            Changer l'image (optionnelle, max 2 Mo)
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
}
