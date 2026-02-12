import EditButton from "../shared/EditButton";
import SectionTitle from "../shared/SectionTitle";

type Props = {
  onEdit: (section: string) => void;
};

const skills = [
  "UI/UX Design",
  "Video Editing",
  "SEO",
  "Public Speaking",
];

export default function SkillsLearn({ onEdit }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 relative">
      <EditButton onClick={() => onEdit("skills-learn")} title="Edit Skills to Learn" />
      <SectionTitle>Skills I Want to Learn</SectionTitle>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm border-2 border-blue-200"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
