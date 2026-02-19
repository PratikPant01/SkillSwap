import CreditDashboard from "./CreditDashboard";
import QuickStats from "./QuickStats";
import Languages from "./Languages";
import Education from "./Education";

type Props = {
  onEdit: (section: string) => void;
  profile?: any;
};

export default function Sidebar({ onEdit, profile }: Props) {
  return (
    <div className="space-y-5">
      <CreditDashboard profile={profile} />
      <QuickStats onEdit={onEdit} stats={profile} />
      <Languages onEdit={onEdit} languages={profile?.languages} />
      <Education onEdit={onEdit} education={profile?.education} />
    </div>
  );
}
