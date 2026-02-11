export default function Verifications() {
  const items = ["Email Verified", "Phone Verified", "ID Verified", "Video Intro Added"];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6">
      <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">
        Verifications
      </h3>
      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
            ✅ {item}
          </div>
        ))}
      </div>
    </div>
  );
}
