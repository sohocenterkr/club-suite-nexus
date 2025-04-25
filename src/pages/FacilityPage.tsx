
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// Mock facility data (기본값으로 사용)
const defaultFacility = {
  id: "facility-1",
  name: "헬스플러스 피트니스",
  logo: "/placeholder.svg",
  customUrl: "health-plus",
  theme: {
    primaryColor: "#3182ce",
    secondaryColor: "#63b3ed",
  },
  description: "최신 장비와 전문 트레이너가 있는 프리미엄 피트니스 센터",
  address: "서울시 강남구 테헤란로 123",
  phone: "02-123-4567",
  operatingHours: "평일 06:00-22:00, 주말 10:00-18:00",
  ownerId: "owner-1"
};

// Mock membership options
const mockMemberships = [
  {
    id: "membership-1",
    name: "1개월 정기권",
    price: 100000,
    durationInMonths: 1,
    description: "한 달 동안 무제한 이용 가능한 정기권",
  },
  {
    id: "membership-2",
    name: "3개월 정기권",
    price: 270000,
    durationInMonths: 3,
    description: "3개월 동안 무제한 이용 가능한 정기권 (10% 할인)",
  },
  {
    id: "membership-3",
    name: "6개월 정기권",
    price: 480000,
    durationInMonths: 6,
    description: "6개월 동안 무제한 이용 가능한 정기권 (20% 할인)",
  }
];

// Mock amenity options
const mockAmenities = [
  {
    id: "amenity-1",
    name: "개인 락커",
    price: 30000,
    type: "locker",
    description: "개인 물품을 보관할 수 있는 락커 (월 이용권)",
  },
  {
    id: "amenity-2",
    name: "개인 PT 1회",
    price: 50000,
    type: "other",
    description: "전문 트레이너의 1:1 퍼스널 트레이닝 1회권",
  },
  {
    id: "amenity-3",
    name: "운동복 대여 서비스",
    price: 5000,
    type: "other",
    description: "깨끗한 운동복 대여 (1회용)",
  }
];

const FacilityPage = () => {
  const { facilityUrl } = useParams<{ facilityUrl: string }>();
  const [facility, setFacility] = useState<any>(null);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [amenities, setAmenities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 로컬 스토리지에서 시설 데이터 가져오기
    const loadFacilityData = async () => {
      try {
        // 로컬 스토리지에서 데이터 가져오기
        const savedData = localStorage.getItem('facilityData');
        const savedLogo = localStorage.getItem('facilityLogo');
        
        setTimeout(() => {
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            setFacility({
              ...defaultFacility,
              name: parsedData.name,
              customUrl: parsedData.customUrl,
              description: parsedData.description,
              address: parsedData.address,
              phone: parsedData.phone,
              theme: {
                primaryColor: parsedData.primaryColor,
                secondaryColor: parsedData.secondaryColor
              }
            });
          } else {
            setFacility(defaultFacility);
          }
          
          if (savedLogo) {
            setLogoUrl(savedLogo);
          }
          
          setMemberships(mockMemberships);
          setAmenities(mockAmenities);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Failed to load facility data:", error);
        setFacility(defaultFacility);
        setMemberships(mockMemberships);
        setAmenities(mockAmenities);
        setLoading(false);
      }
    };
    
    loadFacilityData();
  }, [facilityUrl]);

  const handleSubscribe = (membershipId: string) => {
    navigate(`/checkout/membership/${membershipId}`);
  };

  const handleAmenityPurchase = (amenityId: string) => {
    navigate(`/checkout/amenity/${amenityId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <div>로딩 중...</div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <div>존재하지 않는 시설입니다.</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        background: `linear-gradient(to right, ${facility.theme.primaryColor}10, ${facility.theme.secondaryColor}10)`,
      }}
    >
      {/* 시설 정보 헤더 */}
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
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* 멤버십 섹션 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">멤버십 옵션</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memberships.map((membership) => (
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
                      backgroundColor: facility.theme.primaryColor,
                      color: "white"
                    }}
                    onClick={() => handleSubscribe(membership.id)}
                  >
                    가입하기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 부대시설 섹션 */}
        <section>
          <h2 className="text-2xl font-bold mb-6">부대시설 및 서비스</h2>
          {amenities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {amenities.map((amenity) => (
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
                      onClick={() => handleAmenityPurchase(amenity.id)}
                      style={{
                        borderColor: facility.theme.primaryColor,
                        color: facility.theme.primaryColor
                      }}
                    >
                      이용권 구매
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">현재 이용 가능한 부대시설이 없습니다.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default FacilityPage;
