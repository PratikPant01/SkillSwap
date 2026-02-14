export default function CTACard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
      <div className="space-y-3">
        <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3.5 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm">
          Request Skill Exchange
        </button>
        <button className="w-full border-2 border-blue-200 text-blue-700 font-semibold py-3.5 rounded-xl hover:bg-blue-50 transition-all duration-200 text-sm">
          Send Message
        </button>
      </div>
      <div className="mt-5 pt-5 border-t border-blue-100 flex justify-center">
        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 rounded-full border border-blue-200 text-xs font-semibold text-blue-700">
          100% Free · No Money Involved
        </span>
      </div>
    </div>
  );
}
