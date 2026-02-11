import EditButton from "../shared/EditButton";
import SectionTitle from "../shared/SectionTitle";

type Props = {
  onEdit: (section: string) => void;
};

export default function AboutSection({ onEdit }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 relative">
      <EditButton onClick={() => onEdit("about")} title="Edit About" />
      <SectionTitle>About Me</SectionTitle>

      <p className="text-slate-600 text-sm leading-relaxed">
        I'm a passionate Full Stack Developer with 6+ years of experience building scalable web applications.
      </p>
    </div>
  );
}
