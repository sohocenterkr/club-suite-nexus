
import { ReactNode } from "react";
import AmenityCard from "./AmenityCard";

interface AmenitySectionProps {
  amenities: {
    id: string;
    name: string;
    price: number;
    type: string;
    description: string;
  }[];
  primaryColor: string;
  onPurchase: (amenityId: string) => void;
}

const AmenitySection = ({ amenities, primaryColor, onPurchase }: AmenitySectionProps) => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">부대시설 및 서비스</h2>
      {amenities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((amenity) => (
            <AmenityCard 
              key={amenity.id}
              amenity={amenity}
              primaryColor={primaryColor}
              onPurchase={onPurchase}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">현재 이용 가능한 부대시설이 없습니다.</p>
      )}
    </section>
  );
};

export default AmenitySection;
