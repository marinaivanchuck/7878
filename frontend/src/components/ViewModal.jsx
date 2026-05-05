export default function ViewModal({ item, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md">
        <img src={`http://localhost:5001/uploads/${item.photoFilename}`} alt={item.inventory_name} className="w-full h-48 object-cover mb-4 rounded" />
        <h2 className="text-2xl font-bold">{item.inventory_name}</h2>
        <p className="mt-2 text-gray-700">{item.description}</p>
        <button onClick={onClose} className="mt-4 bg-gray-300 px-4 py-1 rounded">Закрити</button>
      </div>
    </div>
  );
}
