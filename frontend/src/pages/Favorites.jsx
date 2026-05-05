import { useEffect, useState } from 'react';
import { fetchInventory } from '../services/api';
import ItemCard from '../components/ItemCard';

export default function Favorites() {
  const [favItems, setFavItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      const favIds = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (favIds.length === 0) {
        setFavItems([]);
        setLoading(false);
        return;
      }
      const all = await fetchInventory();
      const filtered = all.filter(item => favIds.includes(item.id));
      setFavItems(filtered);
      setLoading(false);
    };
    loadFavorites();
  }, []);

  if (loading) return <div className="p-8 text-center">Завантаження...</div>;
  if (favItems.length === 0) return <div className="p-8 text-center text-gray-500">Немає улюблених позицій</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">❤️ Улюблене</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favItems.map(item => <ItemCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
