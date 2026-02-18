"use client";

import { useState } from "react";
import SkillBadge from "./SkillBadge";
import { FaReact, FaNodeJs, FaAws, FaDocker, FaCode } from "react-icons/fa";
import { SiJavascript, SiTypescript, SiMongodb, SiPostgresql } from "react-icons/si";

export type Skill = {
  name: string;
  icon: React.ReactNode;
};

// Mapping known skills to icons
export const skillIcons: Record<string, React.ReactNode> = {
  "React.js": <FaReact className="text-sky-500" />,
  "Node.js": <FaNodeJs className="text-green-600" />,
  "JavaScript": <SiJavascript className="text-yellow-500" />,
  "TypeScript": <SiTypescript className="text-blue-600" />,
  "MongoDB": <SiMongodb className="text-green-500" />,
  "PostgreSQL": <SiPostgresql className="text-indigo-600" />,
  "AWS": <FaAws className="text-orange-500" />,
  "Docker": <FaDocker className="text-blue-500" />,
};

// Function to get icon for a skill name
export const getIcon = (name: string) => skillIcons[name] || <FaCode className="text-gray-500" />;

type Props = {
  skills: Skill[];
  setSkills: (skills: Skill[]) => void;
};

export default function SkillEditor({ skills, setSkills }: Props) {
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;

    // prevent duplicates
    if (skills.find((s) => s.name.toLowerCase() === trimmed.toLowerCase())) return;

    setSkills([...skills, { name: trimmed, icon: getIcon(trimmed) }]);
    setNewSkill("");
  };

  const handleRemoveSkill = (name: string) => {
    setSkills(skills.filter((s) => s.name !== name));
  };

  return (
    <div className="space-y-4">
      {/* Existing skills */}
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <SkillBadge
            key={skill.name}
            name={skill.name}
            icon={getIcon(skill.name)}
            onRemove={() => handleRemoveSkill(skill.name)}
          />
        ))}
      </div>

      {/* Add new skill */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add new skill"
          className="flex-1 border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddSkill}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Add
        </button>
      </div>
    </div>
  );
}
