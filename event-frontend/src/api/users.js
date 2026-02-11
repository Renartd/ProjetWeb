const API = "http://localhost:3000/api/users";

async function handle(res) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Erreur inconnue");
  return json;
}

export async function getProfile(token) {
  const res = await fetch(`${API}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handle(res);
}

export async function updateProfile(data, token) {
  const res = await fetch(`${API}/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return handle(res);
}

export async function uploadAvatar(file, token) {
  const form = new FormData();
  form.append("avatar", file);

  const res = await fetch(`${API}/me/avatar`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form
  });

  return handle(res);
}
