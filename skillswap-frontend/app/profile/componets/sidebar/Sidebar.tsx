import CreditDashboard from "./CreditDashboard";
import QuickStats from "./QuickStats";
import Languages from "./Languages";
import Education from "./Education";

type Props = {
  onEdit: (section: string) => void;
  profile?: any;
  isPublic?: boolean;
};

export default function Sidebar({ onEdit, profile, isPublic }: Props) {
  return (
    <div className="space-y-5">
      {!isPublic && <CreditDashboard profile={profile} />}
      <QuickStats onEdit={onEdit} stats={profile} isPublic={isPublic} />
      <Languages onEdit={onEdit} languages={profile?.languages} isPublic={isPublic} />
      <Education onEdit={onEdit} education={profile?.education} isPublic={isPublic} />
    </div>
  );
}
