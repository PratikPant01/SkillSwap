import CreditDashboard from "./CreditDashboard";
import QuickStats from "./QuickStats";
import Languages from "./Languages";
import Education from "./Education";
import Verifications from "./Verifications";

type Props = {
  onEdit: (section: string) => void;
  profile?: any;
};

export default function Sidebar({ onEdit, profile }: Props) {
  return (
    <div className="space-y-5">
      <CreditDashboard />
      <QuickStats onEdit={onEdit} />
      <Languages onEdit={onEdit} languages={profile?.languages} />
      <Education onEdit={onEdit} education={profile?.education} />
      <Verifications />
    </div>
  );
}
