import EditButton from "../shared/EditButton";

type Props = {
  onEdit: (section: string) => void;
};

export default function QuickStats({ onEdit, stats: profile }: { onEdit: (section: string) => void; stats: any }) {
  const stats = [
    { label: "Credits", value: profile?.credits ?? 0, green: true },
    { label: "Total Exchanges", value: "145" },
    { label: "Member Since", value: "Jan 2019" },
    { label: "Response Time", value: "~1 hour" },
    { label: "Availability", value: "Available Now", green: false },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 relative">
      <EditButton onClick={() => onEdit("stats")} title="Edit Stats" />
      <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">
        Quick Stats
      </h3>
      <div className="space-y-2">
        {stats.map((s, i) => (
          <div key={i} className="flex justify-between py-2 border-b last:border-0">
            <span className="text-sm text-slate-500">{s.label}</span>
            <span className={`text-sm font-semibold ${s.green ? "text-green-600" : "text-slate-900"}`}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
