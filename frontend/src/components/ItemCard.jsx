import { useState, useEffect } from 'react';
import { fetchItem } from '../services/api';

export default function ItemCard({ item }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [detailedItem, setDetailedItem] = useState(null);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favs.includes(item.id));
  }, [item.id]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavs;
    if (isFavorite) {
      newFavs = favs.filter(id => id !== item.id);
    } else {
      newFavs = [...favs, item.id];
    }
    localStorage.setItem('favorites', JSON.stringify(newFavs));
    setIsFavorite(!isFavorite);
  };

  const openModal = async () => {
    setShowModal(true);
    if (!detailedItem) {
      try {
        const full = await fetchItem(item.id);
        setDetailedItem(full);
      } catch {
        setDetailedItem(item);
      }
    } else {
      setDetailedItem(item);
    }
  };

  const photoUrl = item.photoFilename ? `http://localhost:5001/uploads/${item.photoFilename}` : 'https://via.placeholder.com/300';

  return (
    <>
      <div onClick={openModal} className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative">
          <img src={photoUrl} alt={item.inventory_name} className="w-full h-48 object-cover" />
          <button onClick={toggleFavorite} className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:scale-110 transition">
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{item.inventory_name}</h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description || 'Без опису'}</p>
        </div>
      </div>

      {showModal && detailedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-lg w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
            <img src={photoUrl} alt={detailedItem.inventory_name} className="w-full h-64 object-cover rounded-lg mb-4" />
            <h2 className="text-2xl font-bold">{detailedItem.inventory_name}</h2>
            <p className="mt-3 text-gray-700">{detailedItem.description}</p>
            <button onClick={() => setShowModal(false)} className="mt-6 bg-gray-200 px-4 py-2 rounded-lg w-full">Закрити</button>
          </div>
        </div>
      )}
    </>
  );
}
