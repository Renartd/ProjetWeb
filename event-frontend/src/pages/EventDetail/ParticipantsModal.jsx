import { useEffect, useState } from "react";
import { getParticipants } from "../../api/events";
import "./ParticipantsModal.scss";

export default function ParticipantsModal({ eventId, onClose }) {
  const [participants, setParticipants] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getParticipants(eventId, page, limit);
        setParticipants(data.participants);
        setTotal(data.total);
      } catch (err) {
        console.error("Erreur chargement participants :", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [eventId, page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="participants-modal-overlay" onClick={onClose}>
      <div
        className="participants-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Participants</h3>

        {loading ? (
          <p>Chargement...</p>
        ) : participants.length === 0 ? (
          <p>Aucun participant.</p>
        ) : (
          <ul className="participants-list">
            {participants.map((p) => {
              const avatar = p.avatar_url
                ? `http://localhost:3000${p.avatar_url}`
                : "/default-avatar.png";

              return (
                <li key={p.id} className="participant-item">
                  <img src={avatar} className="avatar-small" alt="" />
                  <span>{p.username}</span>
                </li>
              );
            })}
          </ul>
        )}

        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ◀
          </button>

          <span>
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            ▶
          </button>
        </div>

        <button className="close-btn" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
}
