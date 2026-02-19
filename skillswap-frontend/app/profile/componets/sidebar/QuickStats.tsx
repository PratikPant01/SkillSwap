import EditButton from "../shared/EditButton";

type Props = {
  onEdit: (section: string) => void;
  stats: any;
  isPublic?: boolean;
};

export default function QuickStats({ onEdit, stats: profile, isPublic }: Props) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  };

  const getLevel = (count: number) => {
    if (count === 0) return "Newcomer";
    if (count <= 3) return "Novice";
    if (count <= 10) return "Intermediate";
    if (count <= 25) return "Expert";
    return "Elite Pro";
  };

  const completedCount = profile?.completed_services?.length ?? 0;

  const stats = [
    { label: "Level", value: getLevel(completedCount), blue: true },
    { label: "Services Completed", value: completedCount },
    { label: "Portfolio Projects", value: profile?.portfolio?.length ?? 0 },
    { label: "Member Since", value: formatDate(profile?.created_at) },
    { label: "Response Time", value: "~1 hour" },
    ...(!isPublic ? [{ label: "Availability", value: "Available Now", green: true }] : []),
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 relative transition-all hover:shadow-md">
      <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
        Quick Stats
      </h3>
      <div className="space-y-2">
        {stats.map((s, i) => (
          <div key={i} className="flex justify-between py-2 border-b border-slate-50 last:border-0 items-center">
            <span className="text-sm text-slate-500">{s.label}</span>
            <span className={`text-sm font-semibold ${s.blue ? "text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100" :
              s.green ? "text-green-600 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100" :
                "text-slate-900"
              }`}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
