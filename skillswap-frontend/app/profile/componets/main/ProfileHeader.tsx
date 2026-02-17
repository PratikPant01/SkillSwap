import EditButton from "../shared/EditButton";

type Props = {
  onEdit: (section: string) => void;
};

export default function ProfileHeader({ onEdit }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 relative">
      <EditButton onClick={() => onEdit("profile-header")} title="Edit Profile" />

      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="w-28 h-28 rounded-2xl bg-linear-to-br from-blue-400 via-blue-600 to-blue-800 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
          SJ
        </div>

        <div className="flex-1">
          <h2 className="text-3xl font-bold text-slate-900 mb-1">
            Sarah Johnson
          </h2>
          <p className="text-base text-slate-500">
            Full Stack Developer · React & Node.js Specialist
          </p>
        </div>
      </div>
    </div>
  );
}
