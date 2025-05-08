
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/AdminLayout";
import BasicInfoForm from "@/components/facility/BasicInfoForm";
import LogoThemeSettings from "@/components/facility/LogoThemeSettings";
import PreviewCard from "@/components/facility/PreviewCard";
import { saveToLocalStorage, loadFromLocalStorage } from "@/utils/storageUtils";

const FacilitySettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 시설 정보 상태 관리
  const [facilityData, setFacilityData] = useState({
    name: "헬스플러스 피트니스",
    customUrl: "health-plus",
    description: "최고의 시설과 장비를 갖춘 프리미엄 헬스장입니다.",
    address: "서울시 강남구 역삼동 123-45",
    phone: "02-1234-5678",
    primaryColor: "#3b82f6",
    secondaryColor: "#60a5fa",
    operatingHours: "평일 06:00-22:00, 주말 10:00-18:00"
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // 시설 정보 로드
  useEffect(() => {
    const savedData = loadFromLocalStorage('facilityData');
    const savedLogo = loadFromLocalStorage('facilityLogo');
    
    if (savedData) {
      console.log("FacilitySettings: 저장된 데이터 로드", savedData);
      setFacilityData({...facilityData, ...savedData});
    }
    
    if (savedLogo) {
      console.log("FacilitySettings: 저장된 로고 로드");
      setLogoPreview(savedLogo);
    }
  }, []);

  // 만약 시설 관리자가 아니라면 대시보드로 리디렉션
  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFacilityData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // 이미지 미리보기
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        
        // 로고 변경 즉시 로컬 스토리지에 저장하여 미리보기에 바로 반영
        saveToLocalStorage('facilityLogo', result);
        
        toast({
          title: "로고 변경 완료",
          description: "로고가 성공적으로 변경되었습니다."
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      console.log("FacilitySettings: 데이터 저장 시작", facilityData);
      
      // 로컬 스토리지에 데이터 저장
      saveToLocalStorage('facilityData', facilityData);
      
      // 로고도 저장 (이미 handleLogoChange에서 저장했지만 확실히 하기 위해)
      if (logoPreview) {
        saveToLocalStorage('facilityLogo', logoPreview);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "설정 저장 완료",
        description: "시설 정보가 성공적으로 저장되었습니다."
      });
    } catch (error) {
      console.error("저장 실패:", error);
      toast({
        title: "저장 실패",
        description: "시설 정보를 저장하는 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyTheme = () => {
    // 색상 테마만 저장
    const currentData = loadFromLocalStorage('facilityData', {});
    const updatedData = {
      ...currentData,
      primaryColor: facilityData.primaryColor,
      secondaryColor: facilityData.secondaryColor
    };
    
    saveToLocalStorage('facilityData', updatedData);
    
    toast({
      title: "색상 테마 적용됨",
      description: "선택한 색상 테마가 적용되었습니다."
    });
  };

  const handlePreview = () => {
    // 현재 상태를 로컬 스토리지에 저장하고 미리보기 페이지로 이동
    saveToLocalStorage('facilityData', facilityData);
    if (logoPreview) {
      saveToLocalStorage('facilityLogo', logoPreview);
    }
    
    // 새 창에서 미리보기 페이지 열기
    window.open(`/f/${facilityData.customUrl}`, "_blank");
  };

  return (
    <AdminLayout activeTab="facility">
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">시설 설정</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BasicInfoForm
              facilityData={facilityData}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-6">
            <LogoThemeSettings
              facilityData={facilityData}
              logoPreview={logoPreview}
              onChange={handleChange}
              onLogoChange={handleLogoChange}
              onApplyTheme={applyTheme}
            />
            
            <PreviewCard onPreview={handlePreview} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FacilitySettings;
