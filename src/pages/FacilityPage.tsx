
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import FacilityHeader from "@/components/facility/FacilityHeader";
import MembershipSection from "@/components/facility/MembershipSection";
import AmenitySection from "@/components/facility/AmenitySection";
import { defaultFacility, mockMemberships, mockAmenities } from "@/data/mockFacilityData";
import { loadFacilityData, loadFacilityLogo } from "@/utils/storageUtils";

const FacilityPage = () => {
  const { facilityUrl } = useParams<{ facilityUrl: string }>();
  const [facility, setFacility] = useState<any>(null);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [amenities, setAmenities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  // 시설 데이터 로드 함수
  const loadFacilityDataFromStorage = () => {
    try {
      if (!facilityUrl) {
        setFacility(defaultFacility);
        setLoading(false);
        return;
      }

      console.log("시설 데이터 로딩 시작... (FacilityPage)", facilityUrl);
      
      // 로컬 스토리지에서 데이터 가져오기
      const savedData = loadFacilityData(facilityUrl);
      const savedLogo = loadFacilityLogo(facilityUrl);
      
      console.log("로드된 데이터:", savedData);
      
      if (savedData) {
        console.log("파싱된 데이터:", savedData);
        
        setFacility({
          ...defaultFacility,
          name: savedData.name || defaultFacility.name,
          customUrl: facilityUrl,
          description: savedData.description || defaultFacility.description,
          address: savedData.address || defaultFacility.address,
          phone: savedData.phone || defaultFacility.phone,
          operatingHours: savedData.operatingHours || defaultFacility.operatingHours,
          theme: {
            primaryColor: savedData.primaryColor || defaultFacility.theme.primaryColor,
            secondaryColor: savedData.secondaryColor || defaultFacility.theme.secondaryColor
          }
        });
        console.log("시설 데이터 설정 완료:", savedData);
      } else {
        setFacility({
          ...defaultFacility,
          customUrl: facilityUrl
        });
        console.log("기본 시설 데이터 사용");
      }
      
      if (savedLogo) {
        console.log("로고 데이터 발견:", savedLogo.substring(0, 50) + "...");
        setLogoUrl(savedLogo);
      }
      
      setMemberships(mockMemberships);
      setAmenities(mockAmenities);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load facility data:", error);
      setFacility({
        ...defaultFacility,
        customUrl: facilityUrl
      });
      setMemberships(mockMemberships);
      setAmenities(mockAmenities);
      setLoading(false);
      
      toast({
        title: "데이터 로딩 오류",
        description: "시설 정보를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  // 초기 로드 및 스토리지 이벤트 리스너 설정
  useEffect(() => {
    // 초기 데이터 로드
    loadFacilityDataFromStorage();
    
    // 로컬 스토리지 변경 감지를 위한 이벤트 리스너 추가
    const handleStorageChange = () => {
      console.log("스토리지 이벤트 감지");
      loadFacilityDataFromStorage();
    };
    
    // 전역 스토리지 이벤트 리스너 등록
    window.addEventListener('storage', handleStorageChange);
    
    // 스토리지 이벤트를 시뮬레이션하기 위한 커스텀 이벤트 리스너
    window.addEventListener('custom-storage', handleStorageChange);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('custom-storage', handleStorageChange);
    };
  }, [facilityUrl]);

  const handleSubscribe = (membershipId: string) => {
    navigate(`/checkout/membership/${membershipId}`);
  };

  const handleAmenityPurchase = (amenityId: string) => {
    navigate(`/checkout/amenity/${amenityId}`);
  };

  const handleRegister = () => {
    navigate(`/register/${facilityUrl}`);
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
      <FacilityHeader 
        facility={facility} 
        logoUrl={logoUrl} 
        onRegister={handleRegister} 
      />

      <div className="container mx-auto px-4 py-12">
        {/* 멤버십 섹션 */}
        <MembershipSection 
          memberships={memberships} 
          primaryColor={facility.theme.primaryColor} 
          onSubscribe={handleSubscribe} 
        />

        {/* 부대시설 섹션 */}
        <AmenitySection 
          amenities={amenities} 
          primaryColor={facility.theme.primaryColor} 
          onPurchase={handleAmenityPurchase} 
        />
      </div>
    </div>
  );
};

export default FacilityPage;
