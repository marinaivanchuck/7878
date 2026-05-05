const API_BASE = 'http://localhost:5001';

export const fetchInventory = () => fetch(`${API_BASE}/inventory`).then(res => res.json());

export const fetchItem = (id) => fetch(`${API_BASE}/inventory/${id}`).then(res => res.json());

export const createItem = (formData) => fetch(`${API_BASE}/register`, {
  method: 'POST',
  body: formData,
  // Не додавайте headers! Браузер сам встановить boundary для multipart
}).then(res => {
  if (!res.ok) throw new Error('Помилка створення');
  return res.json();
});

export const updateText = (id, data) => fetch(`${API_BASE}/inventory/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
}).then(res => res.json());

export const updatePhoto = (id, formData) => fetch(`${API_BASE}/inventory/${id}/photo`, {
  method: 'PUT',
  body: formData,
}).then(res => res.json());

export const deleteItem = (id) => fetch(`${API_BASE}/inventory/${id}`, {
  method: 'DELETE',
}).then(res => {
  if (!res.ok) throw new Error('Помилка видалення');
});
