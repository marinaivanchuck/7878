import { useState } from 'react';
import { createItem } from '../services/api';

export default function AddItemModal({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Назва обов'язкова");

    const formData = new FormData();
    formData.append('inventory_name', name);
    formData.append('description', desc);
    if (photo) {
      formData.append('photo', photo);
      console.log('Файло додано:', photo.name);
    } else {
      console.log('Фото не вибрано');
    }

    setLoading(true);
    try {
      const result = await createItem(formData);
      console.log('Створено:', result);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Помилка:', err);
      alert('Помилка створення');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Додати інвентар</h2>
        <form onSubmit={handleSubmit}>
          <input className="border p-2 w-full mb-2" placeholder="Назва *" value={name} onChange={e => setName(e.target.value)} />
          <textarea className="border p-2 w-full mb-2" placeholder="Опис" value={desc} onChange={e => setDesc(e.target.value)} />
          <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} className="mb-4" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Скасувати</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? '...' : 'Створити'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}