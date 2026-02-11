import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createEvent, uploadEventImage } from "../../api/events";
import "./CreateEvent.scss";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState(10);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);

  if (!user) {
    return <p>Vous devez être connecté pour créer un événement.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const created = await createEvent(
        {
          title,
          description,
          date,
          location,
          capacity
        },
        token
      );

      if (imageFile) {
        try {
          await uploadEventImage(created.id, imageFile, token);
        } catch (err) {
          console.error("Erreur upload image:", err);
          setError(
            err.message ||
              "Événement créé, mais l'upload de l'image a échoué."
          );
        }
      }

      navigate("/events");
    } catch (err) {
      console.error("Create event error:", err);
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

  return (
    <div className="create-event-page">
      <h2>Créer un événement</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Titre
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label>
          Date
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            min={new Date().toISOString().slice(0, 16)}
          />
        </label>

        <label>
          Lieu
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </label>

        <label>
          Capacité
          <input
            type="number"
            min="1"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            required
          />
        </label>

        <label>
          Image (optionnelle, max 2 Mo)
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>

        <button type="submit">Créer</button>
      </form>
    </div>
  );
};

export default CreateEvent;
