// use client
import React, { useRef, useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";

export default function DeliverModal({
  token,
  order,
  onClose,
  onDelivered,
}: {
  token: string;
  order: any;
  onClose: () => void;
  onDelivered?: () => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const API = "http://localhost:5000";

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter(f => f.size <= 30 * 1024 * 1024); // 30MB limit for deliverable
    setFiles(valid.slice(0, 10));
  };

  const send = async () => {
    if (!token) { setError("Not authenticated"); return; }
    if (files.length === 0) { setError("Select at least one file"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append("files", f));
      const res = await fetch(`${API}/orders/${order.id}/deliver`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (data.success) {
        onDelivered?.();
        onClose();
      } else {
        setError(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Upload Deliverables</h3>
          <button onClick={onClose} className="p-1"><X /></button>
        </div>

        <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed p-6 rounded-lg text-center cursor-pointer">
          <Upload className="mx-auto mb-2" />
          <p className="text-sm text-gray-500">Click to select files (max 10 files, 30MB each)</p>
          <input ref={fileRef} type="file" multiple onChange={handleFiles} className="hidden" />
        </div>

        {files.length > 0 && (
          <ul className="mt-3 space-y-1">
            {files.map((f, i) => <li key={i} className="text-sm text-gray-700">{f.name} • {(f.size / (1024*1024)).toFixed(2)} MB</li>)}
          </ul>
        )}

        {error && <div className="text-sm text-red-600 mt-3">{error}</div>}

        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={send} disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">
            {submitting ? <><Loader2 className="animate-spin" /> Uploading...</> : "Upload & Mark Delivered"}
          </button>
        </div>
      </div>
    </div>
  );
}
