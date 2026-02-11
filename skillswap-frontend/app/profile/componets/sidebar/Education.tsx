import EditButton from "../shared/EditButton";

type Props = {
  onEdit: (section: string) => void;
};

export default function Education({ onEdit }: Props) {
  const edu = [
    { degree: "B.S. Computer Science", school: "Stanford University", year: "2013 – 2017" },
    { degree: "Full Stack Web Development", school: "freeCodeCamp", year: "2018" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 relative">
      <EditButton onClick={() => onEdit("education")} title="Edit Education" />
      <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">
        Education
      </h3>
      <div className="space-y-4">
        {edu.map((e, i) => (
          <div key={i} className={i > 0 ? "pt-4 border-t border-slate-100" : ""}>
            <p className="font-semibold text-slate-900 text-sm">{e.degree}</p>
            <p className="text-sm text-slate-500 mt-0.5">{e.school}</p>
            <p className="text-xs text-slate-400 mt-0.5">{e.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
