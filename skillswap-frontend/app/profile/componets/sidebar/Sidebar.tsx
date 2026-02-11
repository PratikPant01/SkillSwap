import CTACard from "./CTACard";
import QuickStats from "./QuickStats";
import Languages from "./Languages";
import Education from "./Education";
import Verifications from "./Verifications";

type Props = {
  onEdit: (section: string) => void;
};

export default function Sidebar({ onEdit }: Props) {
  return (
    <div className="space-y-5">
      <CTACard />
      <QuickStats onEdit={onEdit} />
      <Languages onEdit={onEdit} />
      <Education onEdit={onEdit} />
      <Verifications />
    </div>
  );
}
