"use client";

import { useState } from "react";
import EditButton from "../shared/EditButton";
import SectionTitle from "../shared/SectionTitle";
import SkillEditor, { Skill, getIcon } from "./SkillEditor";
import SkillBadge from "./SkillBadge";

type Props = {
  onEdit: (section: string) => void;
};

// Only store names here; icons will be assigned dynamically
const initialSkills: Skill[] = [
  { name: "React.js", icon: null! },
  { name: "Node.js", icon: null! },
  { name: "JavaScript", icon: null! },
  { name: "TypeScript", icon: null! },
  { name: "MongoDB", icon: null! },
  { name: "PostgreSQL", icon: null! },
  { name: "AWS", icon: null! },
  { name: "Docker", icon: null! },
];

export default function SkillsTeach({ onEdit }: Props) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    onEdit("Skills updated successfully");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 relative">
      {!isEditing && (
        <EditButton onClick={() => setIsEditing(true)} title="Edit Skills to Teach" />
      )}

      <SectionTitle>Skills</SectionTitle>

      {isEditing ? (
        <div className="mt-4 space-y-4">
          <SkillEditor skills={skills} setSkills={setSkills} />

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
        <div className="flex flex-wrap gap-3 mt-4">
          {skills.map((skill) => (
            <SkillBadge
              key={skill.name}
              name={skill.name}
              icon={getIcon(skill.name)} // dynamically assign icon
            />
          ))}
        </div>
      )}
    </div>
  );
}
