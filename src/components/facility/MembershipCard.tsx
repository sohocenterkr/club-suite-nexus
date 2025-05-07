
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MembershipCardProps {
  membership: {
    id: string;
    name: string;
    price: number;
    durationInMonths: number;
    description: string;
  };
  primaryColor: string;
  onSubscribe: (membershipId: string) => void;
}

const MembershipCard = ({ membership, primaryColor, onSubscribe }: MembershipCardProps) => {
  return (
    <Card key={membership.id} className="h-full">
      <CardHeader>
        <CardTitle>{membership.name}</CardTitle>
        <CardDescription>{membership.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <span className="text-2xl font-bold">{membership.price.toLocaleString()}원</span>
          {membership.durationInMonths > 1 && (
            <span className="text-sm text-muted-foreground ml-2">
              ({membership.durationInMonths}개월)
            </span>
          )}
        </div>
        <Button 
          className="w-full"
          style={{
            backgroundColor: primaryColor,
            color: "white"
          }}
          onClick={() => onSubscribe(membership.id)}
        >
          가입하기
        </Button>
      </CardContent>
    </Card>
  );
};

export default MembershipCard;
