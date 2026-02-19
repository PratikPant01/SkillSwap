import { useRef } from "react";
import { Camera, MapPin, Github, Linkedin, Briefcase } from "lucide-react";
import EditButton from "../shared/EditButton";

type Props = {
  onEdit: (section: string) => void;
  profile: any;
  onImageUpload: (file: File) => void;
  isPublic?: boolean;
};

export default function ProfileHeader({ onEdit, profile, onImageUpload, isPublic }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!profile) return null;

  const handleImageClick = () => {
    if (isPublic) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -z-0 pointer-events-none" />

      {!isPublic && <EditButton onClick={() => onEdit("profile-header")} title="Edit Profile" />}

      <div className="flex flex-col sm:flex-row gap-8 items-start relative z-10">
        <div
          onClick={handleImageClick}
          className="group relative w-32 h-32 rounded-3xl bg-linear-to-br from-blue-500 via-blue-600 to-blue-800 flex items-center justify-center text-white text-5xl font-bold shadow-2xl shadow-blue-200 overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95 border-4 border-white"
        >
          {profile.profile_picture_url ? (
            <img
              src={profile.profile_picture_url}
              alt={profile.username}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            profile.username?.charAt(0).toUpperCase()
          )}

          {!isPublic && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-1 backdrop-blur-[2px]">
              <Camera size={24} className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300" />
              <span className="text-[10px] uppercase tracking-widest font-black">Upload</span>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {profile.first_name && profile.last_name
                ? `${profile.first_name} ${profile.last_name}`
                : profile.username}
            </h2>
            <p className="text-lg text-slate-500 font-medium">
              {profile.headline || "Passionate Skill Swapper"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3">
            {profile.location && (
              <div className="flex items-center gap-1.5 text-sm text-slate-400 font-semibold bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                <MapPin size={14} className="text-blue-500" /> {profile.location}
              </div>
            )}
            {!isPublic && (
              <div className="flex items-center gap-1.5 text-sm text-slate-400 font-semibold bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                <Briefcase size={14} className="text-blue-500" /> {profile.credits || 0} Credits
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            {profile.github_url && (
              <a href={profile.github_url} target="_blank" className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-100">
                <Github size={20} />
              </a>
            )}
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-100">
                <Linkedin size={20} />
              </a>
            )}
            {profile.portfolio_url && (
              <a href={profile.portfolio_url} target="_blank" className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-100">
                <Briefcase size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
