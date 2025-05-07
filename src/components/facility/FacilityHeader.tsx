
import { Button } from "@/components/ui/button";

interface FacilityHeaderProps {
  facility: {
    name: string;
    description: string;
    address: string;
    phone: string;
    operatingHours: string;
    theme: {
      primaryColor: string;
    };
    customUrl?: string;
  };
  logoUrl: string | null;
  onRegister: () => void;
}

const FacilityHeader = ({ facility, logoUrl, onRegister }: FacilityHeaderProps) => {
  return (
    <div 
      className="bg-white shadow-sm py-8"
      style={{
        borderBottom: `4px solid ${facility.theme.primaryColor}`,
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {logoUrl ? (
              <img src={logoUrl} alt={facility.name} className="w-full h-full object-contain" />
            ) : (
              <div className="text-3xl font-bold text-center">{facility.name.charAt(0)}</div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold">{facility.name}</h1>
            <p className="text-gray-600 mt-2">{facility.description}</p>
            <div className="mt-4 space-y-1 text-sm">
              <p>{facility.address}</p>
              <p>{facility.phone}</p>
              <p>{facility.operatingHours}</p>
            </div>
            <div className="mt-4">
              <Button
                style={{
                  backgroundColor: facility.theme.primaryColor,
                }}
                onClick={onRegister}
              >
                이 시설에 회원 가입하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityHeader;
