import { useState } from 'react';
import { updatePhoto } from '../services/api';

export default function ChangePhotoModal({ item, onClose, onSuccess }) {
  const [photo, setPhoto] = useState(null);

  const handleSubmit = async () => {
    if (!photo) return alert('Оберіть фото');
    const formData = new FormData();
    formData.append('photo', photo);
    try {
      await updatePhoto(item.id, formData);
      onSuccess();
      onClose();
    } catch (err) {
      alert('Помилка оновлення фото');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl mb-2">Змінити фото: {item.inventory_name}</h2>
        <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose}>Скасувати</button>
          <button onClick={handleSubmit} className="bg-purple-600 text-white px-4 py-1 rounded">Оновити</button>
        </div>
      </div>
    </div>
  );
}
