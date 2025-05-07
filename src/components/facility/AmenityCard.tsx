
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AmenityCardProps {
  amenity: {
    id: string;
    name: string;
    price: number;
    type: string;
    description: string;
  };
  primaryColor: string;
  onPurchase: (amenityId: string) => void;
}

const AmenityCard = ({ amenity, primaryColor, onPurchase }: AmenityCardProps) => {
  return (
    <Card key={amenity.id} className="h-full">
      <CardHeader>
        <CardTitle>{amenity.name}</CardTitle>
        <CardDescription>{amenity.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <span className="text-xl font-bold">{amenity.price.toLocaleString()}원</span>
        </div>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onPurchase(amenity.id)}
          style={{
            borderColor: primaryColor,
            color: primaryColor
          }}
        >
          이용권 구매
        </Button>
      </CardContent>
    </Card>
  );
};

export default AmenityCard;
