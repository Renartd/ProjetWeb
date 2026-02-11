const API = "http://localhost:3000/api/events";

async function handleResponse(res) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error || "Erreur inconnue");
  }
  return json;
}

export async function getEvents() {
  const res = await fetch(API);
  return handleResponse(res);
}

export async function getEvent(id) {
  const res = await fetch(`${API}/${id}`);
  return handleResponse(res);
}

export async function createEvent(data, token) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function updateEvent(id, data, token) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function deleteEvent(id, token) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(res);
}

export async function registerEvent(id, token) {
  const res = await fetch(`${API}/${id}/register`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(res);
}

export async function unregisterEvent(id, token) {
  const res = await fetch(`${API}/${id}/register`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(res);
}

/* ---------------- PAGINATION ---------------- */
export async function getPaginatedEvents(page = 1, limit = 10) {
  const res = await fetch(
    `${API}/paginated?page=${page}&limit=${limit}`
  );
  return handleResponse(res);
}

/* ---------------- PARTICIPANTS PAGINÉS ---------------- */
export async function getParticipants(eventId, page = 1, limit = 20) {
  const res = await fetch(
    `${API}/${eventId}/participants?page=${page}&limit=${limit}`
  );
  return handleResponse(res);
}
