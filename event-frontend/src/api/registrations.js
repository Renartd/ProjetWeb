const API = "http://localhost:3000/api/registrations";

async function handleResponse(res) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || "Erreur inconnue");
  }
  return json;
}

export async function registerToEvent(eventId, token) {
  const res = await fetch(`${API}/${eventId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(res);
}

export async function unregisterFromEvent(eventId, token) {
  const res = await fetch(`${API}/${eventId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(res);
}
