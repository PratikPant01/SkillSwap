"use client";

import { ReactNode } from "react";

type Props = {
  name: string;
  icon: ReactNode;
  onRemove?: (name: string) => void;
};

export default function SkillBadge({ name, icon, onRemove }: Props) {
  return (
    <span className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">
      {icon}
      {name}
      {onRemove && (
        <button
          onClick={() => onRemove(name)}
          className="ml-1 text-red-500 text-xs"
        >
          ✕
        </button>
      )}
    </span>
  );
}
