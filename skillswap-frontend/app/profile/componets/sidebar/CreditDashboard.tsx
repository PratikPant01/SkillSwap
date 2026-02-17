"use client";

import { useState } from "react";
import { FaCoins, FaPlus, FaMinus } from "react-icons/fa";

type Transaction = {
  id: number;
  type: "add" | "spend";
  amount: number;
  description: string;
  date: string;
};

export default function CreditDashboard() {
  const [credits, setCredits] = useState(120); // example starting credits
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, type: "add", amount: 50, description: "Completed Task A", date: "2026-02-15" },
    { id: 2, type: "spend", amount: 20, description: "Requested Service B", date: "2026-02-16" },
  ]);

  const handleAddCredit = (amount: number) => {
    setCredits(credits + amount);
    setTransactions([
      { id: transactions.length + 1, type: "add", amount, description: "Added Credits", date: new Date().toLocaleDateString() },
      ...transactions,
    ]);
  };

  const handleSpendCredit = (amount: number) => {
    if (amount > credits) return alert("Not enough credits!");
    setCredits(credits - amount);
    setTransactions([
      { id: transactions.length + 1, type: "spend", amount, description: "Spent Credits", date: new Date().toLocaleDateString() },
      ...transactions,
    ]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 space-y-6">
      {/* Current Credits */}
      <div className="flex items-center gap-4">
        <FaCoins className="text-yellow-400 text-3xl" />
        <div>
          <p className="text-sm text-gray-500">Current Credits</p>
          <h2 className="text-3xl font-bold">{credits}</h2>
        </div>
      </div>

      {/* Add / Spend buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => handleAddCredit(10)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
        >
          <FaPlus /> Add 10 Credits
        </button>
        <button
          onClick={() => handleSpendCredit(10)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
        >
          <FaMinus /> Spend 10 Credits
        </button>
      </div>

      {/* Transaction history */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
        <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
          {transactions.map((tx) => (
            <li key={tx.id} className="py-2 flex justify-between items-center">
              <div>
                <p className="text-sm">{tx.description}</p>
                <p className="text-xs text-gray-400">{tx.date}</p>
              </div>
              <span
                className={`text-sm font-semibold ${
                  tx.type === "add" ? "text-green-600" : "text-red-600"
                }`}
              >
                {tx.type === "add" ? `+${tx.amount}` : `-${tx.amount}`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
