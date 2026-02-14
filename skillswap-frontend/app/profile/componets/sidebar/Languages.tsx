import EditButton from "../shared/EditButton";

type Props = {
  onEdit: (section: string) => void;
};

export default function Languages({ onEdit }: Props) {
  const langs = [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Fluent" },
    { name: "French", level: "Conversational" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 relative">
      <EditButton onClick={() => onEdit("languages")} title="Edit Languages" />
      <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">
        Languages
      </h3>
      <div className="space-y-3">
        {langs.map((l, i) => (
          <div key={i} className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-800">{l.name}</span>
            <span className="text-xs text-slate-500 bg-slate-50 border px-2.5 py-1 rounded-full">
              {l.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
