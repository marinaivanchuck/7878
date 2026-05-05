export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="border px-4 py-1 rounded">Ні</button>
          <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-1 rounded">Так, видалити</button>
        </div>
      </div>
    </div>
  );
}
