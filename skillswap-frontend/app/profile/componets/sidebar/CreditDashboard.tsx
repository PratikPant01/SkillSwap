"use client";

import { useState, useEffect } from "react";
import { Coins, TrendingUp, History, Sparkles, PlusCircle } from "lucide-react";

type Transaction = {
  id: number;
  amount: number;
  transaction_type: string;
  description: string;
  created_at: string;
};

export default function CreditDashboard({ profile }: { profile: any }) {
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("https://skillswapservice.up.railway.app/credits/history", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setHistory(data.history);
        }
      } catch (error) {
        console.error("Error fetching credit history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [profile?.credits]); // Refetch if credits change

  return (
    <div className="group bg-white rounded-3xl shadow-2xl shadow-blue-100/50 border border-blue-50 overflow-hidden transition-all duration-500 hover:shadow-blue-200/50">
      {/* Premium Header with Gradient */}
      <div className="bg-linear-to-br from-blue-600 via-blue-700 to-indigo-900 p-6 text-white relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-400/20 rounded-full blur-xl" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
              <Coins className="text-yellow-400 fill-yellow-400/20" size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-100/80 mb-0.5">Your Balance</p>
              <h2 className="text-3xl font-black tracking-tight flex items-baseline gap-1.5">
                {profile?.credits ?? 0}
                <span className="text-sm font-medium text-blue-200/60 uppercase tracking-tighter">SP</span>
              </h2>
            </div>
          </div>
          <button className="p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md border border-white/10 transition-all active:scale-90">
            <PlusCircle size={20} className="text-blue-100" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all duration-300">
            <TrendingUp size={18} className="text-green-500 mb-2" />
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Earnings</p>
            <p className="text-lg font-black text-slate-800">+{history.filter(h => h.amount > 0).reduce((acc, curr) => acc + curr.amount, 0)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all duration-300">
            <Sparkles size={18} className="text-purple-500 mb-2" />
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Rewards</p>
            <p className="text-lg font-black text-slate-800">{history.filter(h => h.transaction_type === "BONUS").length}x</p>
          </div>
        </div>

        {/* Transaction history */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <History size={14} /> Recent Activity
            </h3>
            <button className="text-[10px] font-bold text-blue-600 uppercase hover:underline">View All</button>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-50 rounded-xl" />)}
              </div>
            ) : history.length > 0 ? (
              history.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50/80 transition-all border border-transparent hover:border-slate-100 group/tx">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.amount > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                      }`}>
                      <Coins size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 line-clamp-1 group-hover/tx:text-slate-900 pr-2">{tx.description}</p>
                      <p className="text-[10px] font-medium text-slate-400 uppercase">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-black whitespace-nowrap ${tx.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">No activities yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
