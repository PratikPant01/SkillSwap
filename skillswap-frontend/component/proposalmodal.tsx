"use client";
import { useState, useRef } from "react";
import { X, Upload, FileText, Send, Loader2 } from "lucide-react";

interface ProposalModalProps {
  postId: number;
  postTitle: string;
  postType: string;
  token: string;
  currentUserId: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ProposalModal({
  postId,
  postTitle,
  postType,
  token,
  currentUserId,
  onClose,
  onSuccess,
}: ProposalModalProps) {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter((f) => f.size <= 10 * 1024 * 1024);
    if (valid.length < selected.length) setError("Some files exceed 10MB and were skipped.");
    setFiles((prev) => [...prev, ...valid].slice(0, 5));
  };

  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleSubmit = async () => {
    setError("");
    if (!description.trim()) {
      setError("Please write a description.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("cover_letter", description);
      files.forEach((file) => formData.append("files", file));

      const res = await fetch(`http://localhost:5000/proposals/${postId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => { onSuccess?.(); onClose(); }, 1800);
      } else {
        setError(data.message || "Submission failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Submit Proposal</h2>
            <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">{postTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-14 px-6">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Send size={24} className="text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Proposal Sent!</h3>
            <p className="text-gray-500 text-sm text-center">The seller will review your proposal shortly.</p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe why you're a good fit for this..."
                rows={5}
                maxLength={1000}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none text-sm"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{description.length}/1000</p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Attachments <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
              >
                <Upload size={20} className="mx-auto text-gray-400 mb-1" />
                <p className="text-sm text-gray-500">Click to upload files</p>
                <p className="text-xs text-gray-400">Max 5 files · 10MB each</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip,.txt"
                onChange={handleFileChange}
                className="hidden"
              />

              {files.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {files.map((file, i) => (
                    <li key={i} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText size={14} className="text-blue-500 shrink-0" />
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <span className="text-xs text-gray-400 shrink-0">{formatFileSize(file.size)}</span>
                      </div>
                      <button onClick={() => removeFile(i)} className="ml-2 text-gray-400 hover:text-red-500 transition">
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <><Send size={16} /> Submit</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}