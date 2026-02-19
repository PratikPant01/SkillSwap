import EditButton from "../shared/EditButton";

type EducationItem = {
  institution: string;
  degree: string;
  start_year: string;
  end_year: string;
};

type Props = {
  onEdit: (section: string) => void;
  education?: EducationItem[];
  isPublic?: boolean;
};

export default function Education({ onEdit, education, isPublic }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 relative">
      {!isPublic && <EditButton onClick={() => onEdit("education")} title="Edit Education" />}
      <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">
        Education
      </h3>
      <div className="space-y-4">
        {education && education.length > 0 ? (
          education.map((e, i) => (
            <div key={i} className={i > 0 ? "pt-4 border-t border-slate-100" : ""}>
              <p className="font-semibold text-slate-900 text-sm">{e.institution}</p>
              <p className="text-sm text-slate-500 mt-0.5">{e.degree}</p>
              <p className="text-xs text-slate-400 mt-0.5">{e.start_year} - {e.end_year}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400 italic">No education added.</p>
        )}

      </div >
    </div >
  );
}
