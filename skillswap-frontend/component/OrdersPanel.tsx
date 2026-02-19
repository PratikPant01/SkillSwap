// use client
import React, { useEffect, useState } from "react";
import DeliverModal from "./DeliverModal";

type Order = {
  id: number;
  post_id: number;
  post_title?: string;
  buyer_id: number;
  seller_id: number;
  escrow_amount: number;
  status: string;
  seller_delivered_files?: string[] | null;
  buyer_confirmed: boolean;
  seller_confirmed: boolean;
  created_at: string;
  updated_at: string;
};

export default function OrdersPanel({ token, currentUserId }: { token: string, currentUserId: number | null }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [deliverModalFor, setDeliverModalFor] = useState<Order | null>(null);
  const API = "http://localhost:5000";

  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/orders`, { headers: { Authorization: `Bearer ${token}` }});
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [token]);

  const confirm = async (orderId: number) => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/orders/${orderId}/confirm`, { method: "POST", headers: { Authorization: `Bearer ${token}` }});
      const data = await res.json();
      if (data.success) fetchOrders();
      else alert(data.message || "Confirm failed");
    } catch (err) { console.error(err); }
  };

  const onDelivered = () => {
    setDeliverModalFor(null);
    fetchOrders();
  };

  if (!token) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Orders</h3>
        <button onClick={fetchOrders} className="text-xs text-gray-500">Refresh</button>
      </div>

      {loading ? (
        <div className="py-6 text-sm text-gray-500">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="py-6 text-sm text-gray-400">No orders yet.</div>
      ) : (
        <ul className="space-y-3">
          {orders.map(o => (
            <li key={o.id} className="border rounded-lg p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm">{o.post_title || `Post #${o.post_id}`}</strong>
                    <span className="text-xs text-gray-400">· {o.status}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Escrow: {o.escrow_amount} credits • Created: {new Date(o.created_at).toLocaleString()}
                  </div>

                  {o.seller_delivered_files && o.seller_delivered_files.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {o.seller_delivered_files.map((f, i) => (
                        <a key={i} href={`http://localhost:5000/${f}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">
                          Deliverable {i+1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-3 shrink-0">
                  {/* If current user is the seller and order in progress -> show Deliver */}
                  {currentUserId === o.seller_id && o.status === "IN_PROGRESS" && (
                    <button onClick={() => setDeliverModalFor(o)} className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md">Deliver</button>
                  )}

                  {/* If order delivered or in_progress, allow confirm */}
                  <button onClick={() => confirm(o.id)} className="text-xs bg-green-50 text-green-600 border border-green-100 px-3 py-1 rounded-md">
                    Confirm
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {deliverModalFor && (
        <DeliverModal token={token} order={deliverModalFor} onClose={() => setDeliverModalFor(null)} onDelivered={onDelivered} />
      )}
    </div>
  );
}
