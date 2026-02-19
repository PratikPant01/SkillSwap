// use client
import React, { useEffect, useState } from "react";

type Proposal = {
  id: number;
  post_id: number;
  cover_letter: string;
  files: string[] | null;
  created_at: string;
  buyer_id: number;
  buyer_name: string;
  title?: string;
};

export default function SellerProposalsPanel({ token, onOrderCreated }: { token: string, onOrderCreated?: () => void }) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const API = "http://localhost:5000";

  const fetchProposals = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/proposals/seller`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setProposals(data.proposals);
    } catch (err) {
      console.error("Fetch seller proposals error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [token]);

  const accept = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/proposals/${id}/accept`, { method: "POST", headers: { Authorization: `Bearer ${token}` }});
      const data = await res.json();
      if (data.success) {
        alert("Proposal accepted, order created.");
        fetchProposals();
        onOrderCreated?.();
      } else {
        alert(data.message || "Failed to accept");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const reject = async (id: number) => {
    if (!token) return;
    if (!confirm("Reject this proposal?")) return;
    try {
      const res = await fetch(`${API}/proposals/${id}/reject`, { method: "POST", headers: { Authorization: `Bearer ${token}` }});
      const data = await res.json();
      if (data.success) {
        fetchProposals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Proposals</h3>
        <button onClick={fetchProposals} className="text-xs text-gray-500">Refresh</button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-sm text-gray-500">Loading proposals…</div>
      ) : proposals.length === 0 ? (
        <div className="py-6 text-sm text-gray-400">No proposals yet.</div>
      ) : (
        <ul className="space-y-3">
          {proposals.map(p => (
            <li key={p.id} className="border rounded-lg p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <strong className="text-sm">{p.buyer_name}</strong>
                    <span className="text-xs text-gray-400"> · {new Date(p.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{p.cover_letter}</p>

                  {p.files && p.files.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {p.files.map((f, i) => (
                        <a key={i} href={`http://localhost:5000/${f}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">
                          Attachment {i+1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 shrink-0 ml-3">
                  <button onClick={() => accept(p.id)} className="text-xs bg-green-600 text-white px-3 py-1 rounded-md">Accept</button>
                  <button onClick={() => reject(p.id)} className="text-xs bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-md">Reject</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
