import EditButton from "../shared/EditButton";
import SectionTitle from "../shared/SectionTitle";

type Props = {
  onEdit: (section: string) => void;
};

const skills = [
  "React.js",
  "Node.js",
  "JavaScript",
  "TypeScript",
  "MongoDB",
  "PostgreSQL",
  "AWS",
  "Docker",
];

export default function SkillsTeach({ onEdit }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 relative">
      <EditButton onClick={() => onEdit("skills-teach")} title="Edit Skills to Teach" />
      <SectionTitle>Skills I Can Teach</SectionTitle>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
