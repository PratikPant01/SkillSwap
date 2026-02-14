export default function SectionTitle({ children }) {
  return (
    <h3 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
      <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full inline-block" />
      {children}
    </h3>
  );
}
