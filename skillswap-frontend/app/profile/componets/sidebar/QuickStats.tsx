import EditButton from "../shared/EditButton";

type Props = {
  onEdit: (section: string) => void;
  stats: any;
};

export default function QuickStats({ onEdit, stats: profile }: Props) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  };

  const stats = [
    { label: "Level", value: "Skill Pro", green: true },
    { label: "Services Completed", value: profile?.completed_services?.length ?? 0 },
    { label: "Portfolio Projects", value: profile?.portfolio?.length ?? 0 },
    { label: "Member Since", value: formatDate(profile?.created_at) },
    { label: "Response Time", value: "~1 hour" },
    { label: "Availability", value: "Available Now", green: false },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 relative transition-all hover:shadow-md">
      <EditButton onClick={() => onEdit("stats")} title="Edit Stats" />
      <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
        Quick Stats
      </h3>
      <div className="space-y-2">
        {stats.map((s, i) => (
          <div key={i} className="flex justify-between py-2 border-b border-slate-50 last:border-0 items-center">
            <span className="text-sm text-slate-500">{s.label}</span>
            <span className={`text-sm font-semibold ${s.green ? "text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg" : "text-slate-900"}`}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
