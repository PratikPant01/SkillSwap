import { FaTimes } from "react-icons/fa";

interface Props {
  name: string;
  icon?: React.ReactNode;
  onRemove?: () => void;
}

export default function SkillBadge({ name, icon, onRemove }: Props) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-700 rounded-full border border-gray-200 shadow-sm text-sm hover:border-blue-300 transition-colors">
      {icon ? (
        <span className="text-lg">{icon}</span>
      ) : (
        <div className="w-5 h-5 flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-xs rounded-full">
          {initial}
        </div>
      )}
      <span className="font-medium">{name}</span>
      {onRemove && (
        <button onClick={onRemove} className="ml-1 text-gray-400 hover:text-red-500 transition-colors">
          <FaTimes size={12} />
        </button>
      )}
    </div>
  );
}
