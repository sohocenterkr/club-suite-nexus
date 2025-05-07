
import { ReactNode } from "react";
import MembershipCard from "./MembershipCard";

interface MembershipSectionProps {
  memberships: {
    id: string;
    name: string;
    price: number;
    durationInMonths: number;
    description: string;
  }[];
  primaryColor: string;
  onSubscribe: (membershipId: string) => void;
}

const MembershipSection = ({ memberships, primaryColor, onSubscribe }: MembershipSectionProps) => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">멤버십 옵션</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memberships.map((membership) => (
          <MembershipCard 
            key={membership.id}
            membership={membership}
            primaryColor={primaryColor}
            onSubscribe={onSubscribe}
          />
        ))}
      </div>
    </section>
  );
};

export default MembershipSection;
