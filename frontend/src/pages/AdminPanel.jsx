import { useEffect, useState } from 'react';
import { fetchInventory, deleteItem } from '../services/api';
import AddItemModal from '../components/AddItemModal';
import EditTextModal from '../components/EditTextModal';
import ChangePhotoModal from '../components/ChangePhotoModal';
import ViewModal from '../components/ViewModal';
import ConfirmModal from '../components/ConfirmModal';

export default function AdminPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEditText, setShowEditText] = useState(false);
  const [showChangePhoto, setShowChangePhoto] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchInventory();
      setItems(data);
      setError(null);
    } catch (err) {
      setError('Не вдалося завантажити дані');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      loadItems();
    } catch (err) {
      alert('Помилка видалення');
    }
    setShowDeleteConfirm(null);
  };

  if (loading) return <div className="p-8 text-center">Завантаження...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Адмін панель інвентарю</h1>
        <button onClick={() => setShowAdd(true)} className="bg-blue-600 text-white px-4 py-2 rounded">+ Додати</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Назва</th>
              <th className="py-2 px-4 border">Опис</th>
              <th className="py-2 px-4 border">Фото</th>
              <th className="py-2 px-4 border">Дії</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{item.inventory_name}</td>
                <td className="py-2 px-4 border">{item.description?.substring(0, 50)}...</td>
                <td className="py-2 px-4 border">
                  {item.photoFilename ? (
                    <img src={`http://localhost:5001/uploads/${item.photoFilename}`} alt="preview" className="w-12 h-12 object-cover rounded" />
                  ) : <span className="text-gray-400">Немає</span>}
                </td>
                <td className="py-2 px-4 border space-x-2">
                  <button onClick={() => { setSelectedItem(item); setShowView(true); }} className="text-blue-600">👁️</button>
                  <button onClick={() => { setSelectedItem(item); setShowEditText(true); }} className="text-green-600">✏️</button>
                  <button onClick={() => { setSelectedItem(item); setShowChangePhoto(true); }} className="text-purple-600">📷</button>
                  <button onClick={() => setShowDeleteConfirm(item)} className="text-red-600">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && <AddItemModal onClose={() => setShowAdd(false)} onSuccess={loadItems} />}
      {showEditText && selectedItem && <EditTextModal item={selectedItem} onClose={() => setShowEditText(false)} onSuccess={loadItems} />}
      {showChangePhoto && selectedItem && <ChangePhotoModal item={selectedItem} onClose={() => setShowChangePhoto(false)} onSuccess={loadItems} />}
      {showView && selectedItem && <ViewModal item={selectedItem} onClose={() => setShowView(false)} />}
      {showDeleteConfirm && <ConfirmModal message={`Видалити "${showDeleteConfirm.inventory_name}"?`} onConfirm={() => handleDelete(showDeleteConfirm.id)} onCancel={() => setShowDeleteConfirm(null)} />}
    </div>
  );
}
