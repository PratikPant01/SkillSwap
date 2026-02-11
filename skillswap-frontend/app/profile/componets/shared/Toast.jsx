export default function Toast({ message, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium">
      Editing: <strong>{message}</strong>
      <button onClick={onClose}>✕</button>
    </div>
  );
}
