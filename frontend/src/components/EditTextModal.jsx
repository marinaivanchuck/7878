import { useState } from 'react';
import { updateText } from '../services/api';

export default function EditTextModal({ item, onClose, onSuccess }) {
  const [name, setName] = useState(item.inventory_name);
  const [desc, setDesc] = useState(item.description || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateText(item.id, { inventory_name: name, description: desc });
      onSuccess();
      onClose();
    } catch (err) {
      alert('Помилка оновлення');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl mb-4">Редагувати текст</h2>
        <form onSubmit={handleSubmit}>
          <input className="border p-2 w-full mb-2" value={name} onChange={e => setName(e.target.value)} required />
          <textarea className="border p-2 w-full mb-4" value={desc} onChange={e => setDesc(e.target.value)} />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose}>Скасувати</button>
            <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded">Зберегти</button>
          </div>
        </form>
      </div>
    </div>
  );
}
