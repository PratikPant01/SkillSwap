import EditButton from "../shared/EditButton";

type Props = {
  onEdit: (section: string) => void;
};

export default function ProfileHeader({ onEdit, profile }: { onEdit: (section: string) => void; profile: any }) {
  if (!profile) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 relative">
      <EditButton onClick={() => onEdit("profile-header")} title="Edit Profile" />

      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="w-28 h-28 rounded-2xl bg-linear-to-br from-blue-400 via-blue-600 to-blue-800 flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden">
          {profile.profile_picture_url ? (
            <img src={profile.profile_picture_url} alt={profile.username} className="w-full h-full object-cover" />
          ) : (
            profile.username?.charAt(0).toUpperCase()
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-3xl font-bold text-slate-900 mb-1">
            {profile.first_name && profile.last_name
              ? `${profile.first_name} ${profile.last_name}`
              : profile.username}
          </h2>
          <p className="text-base text-slate-500">
            {profile.headline || "No headline set"}
          </p>
          {profile.location && (
            <p className="text-sm text-slate-400 mt-1">📍 {profile.location}</p>
          )}

          <div className="flex gap-3 mt-4">
            {profile.github_url && <a href={profile.github_url} target="_blank" className="text-slate-500 hover:text-blue-600">GitHub</a>}
            {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" className="text-slate-500 hover:text-blue-600">LinkedIn</a>}
            {profile.portfolio_url && <a href={profile.portfolio_url} target="_blank" className="text-slate-500 hover:text-blue-600">Portfolio</a>}
          </div>
        </div>
      </div>
    </div>
  );
}
