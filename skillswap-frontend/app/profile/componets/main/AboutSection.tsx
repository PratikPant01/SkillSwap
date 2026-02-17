"use client";

import { useState } from "react";
import EditButton from "../shared/EditButton";
import SectionTitle from "../shared/SectionTitle";

type Props = {
  onEdit: (section: string) => void;
};

export default function AboutSection({ onEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [aboutText, setAboutText] = useState(
    "I'm a passionate Full Stack Developer with 6+ years of experience building scalable web applications."
  );

  const handleSave = () => {
    setIsEditing(false);
    onEdit("About updated successfully"); // show toast after saving
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 relative">
      
      {!isEditing && (
        <EditButton
          onClick={() => setIsEditing(true)}
          title="Edit About"
        />
      )}

      <SectionTitle>About Me</SectionTitle>

      {isEditing ? (
        <div className="mt-4 space-y-4">
          <textarea
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            className="w-full border border-blue-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
          />

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 px-4 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-slate-600 text-sm leading-relaxed mt-4">
          {aboutText}
        </p>
      )}
    </div>
  );
}
