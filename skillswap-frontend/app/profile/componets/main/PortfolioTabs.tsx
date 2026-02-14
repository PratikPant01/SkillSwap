"use client";

import { useState } from "react";
import EditButton from "../shared/EditButton";

type Props = {
  onEdit: (section: string) => void;
};

export default function PortfolioTabs({ onEdit }: Props) {
  const [tab, setTab] = useState<"portfolio" | "reviews">("portfolio");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
      <div className="flex border-b border-blue-100">
        {["portfolio", "reviews"].map((key) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`flex-1 py-4 text-sm font-semibold ${
              tab === key
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500"
            }`}
          >
            {key === "portfolio" ? "Portfolio" : "Exchange History"}
          </button>
        ))}
      </div>

      <div className="p-8 relative">
        <EditButton onClick={() => onEdit(tab)} />

        {tab === "portfolio" ? (
          <p className="text-sm text-slate-600">Portfolio content here...</p>
        ) : (
          <p className="text-sm text-slate-600">Reviews content here...</p>
        )}
      </div>
    </div>
  );
}
