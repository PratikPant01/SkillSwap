export default function EditButton({ onClick, title = "Edit" }) {
  const { Pencil } = require("lucide-react");

  return (
    <button
      onClick={onClick}
      title={title}
      className="absolute top-4 right-4 z-10 p-1.5 bg-white text-blue-500 hover:bg-blue-50 border border-blue-200 rounded-full transition-all duration-200 hover:shadow-md"
    >
      <Pencil size={14} />
    </button>
  );
}
