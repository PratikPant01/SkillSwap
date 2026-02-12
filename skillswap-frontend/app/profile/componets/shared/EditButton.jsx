export default function EditButton({ onClick, title = "Edit" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="absolute top-4 right-4 z-10 p-2 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-all duration-200 hover:shadow-md"
    >
      ✏️
    </button>
  );
}
