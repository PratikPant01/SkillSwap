"use client";

import { useState } from "react";
import EditButton from "../shared/EditButton";
import SectionTitle from "../shared/SectionTitle";

type Props = {
  onEdit: (section: string) => void;
};

export default function AboutSection({ onEdit, bio }: { onEdit: (section: string) => void; bio: string }) {
  // We can treat "Edit" here as opening the main profile modal too, or a specific about modal.
  // For simplicity, let's trigger the same main edit modal for now, or just use the onEdit callback.

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 relative">
      <EditButton
        onClick={() => onEdit("about")}
        title="Edit About"
      />

      <SectionTitle>About Me</SectionTitle>

      <p className="text-slate-600 text-sm leading-relaxed mt-4 whitespace-pre-wrap">
        {bio || "No bio added yet."}
      </p>
    </div>
  );
}
