import { useEffect, useState } from 'react';
import { fetchInventory } from '../services/api';
import ItemCard from '../components/ItemCard';
import SkeletonCard from '../components/SkeletonCard';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInventory()
      .then(setItems)
      .catch(() => setError('Не вдалося завантажити'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">{Array(8).fill().map((_, i) => <SkeletonCard key={i} />)}</div>;
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;
  if (items.length === 0) return <div className="p-8 text-center text-gray-500">Немає інвентарю</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Галерея інвентарю</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map(item => <ItemCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
