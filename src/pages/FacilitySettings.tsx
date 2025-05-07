
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/AdminLayout";

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

  // 시설 정보 변경사항 저장 (로컬 스토리지)
  useEffect(() => {
    const savedData = localStorage.getItem('facilityData');
    const savedLogo = localStorage.getItem('facilityLogo');
    
    if (savedData) {
      setFacilityData({...facilityData, ...JSON.parse(savedData)});
    }
    
    if (savedLogo) {
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
        localStorage.setItem('facilityLogo', result);
        
        // 로고 변경 즉시 로컬 스토리지에 저장하여 미리보기에 바로 반영
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
      
      // 로컬 스토리지에 데이터 저장
      localStorage.setItem('facilityData', JSON.stringify(facilityData));
      
      // 로고도 저장 (이미 handleLogoChange에서 저장했지만 확실히 하기 위해)
      if (logoPreview) {
        localStorage.setItem('facilityLogo', logoPreview);
      }
      
      // 스토리지 이벤트 발생시키기 (다른 탭에서 반영하기 위해)
      window.dispatchEvent(new Event('storage'));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "설정 저장 완료",
        description: "시설 정보가 성공적으로 저장되었습니다."
      });
    } catch (error) {
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
    const currentData = JSON.parse(localStorage.getItem('facilityData') || '{}');
    const updatedData = {
      ...currentData,
      primaryColor: facilityData.primaryColor,
      secondaryColor: facilityData.secondaryColor
    };
    
    localStorage.setItem('facilityData', JSON.stringify(updatedData));
    
    // 스토리지 이벤트 발생시키기
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "색상 테마 적용됨",
      description: "선택한 색상 테마가 적용되었습니다."
    });
  };

  const handlePreview = () => {
    // 현재 상태를 로컬 스토리지에 저장하고 미리보기 페이지로 이동
    localStorage.setItem('facilityData', JSON.stringify(facilityData));
    if (logoPreview) {
      localStorage.setItem('facilityLogo', logoPreview);
    }
    
    // 스토리지 이벤트 발생시키기
    window.dispatchEvent(new Event('storage'));
    
    // 새 창에서 미리보기 페이지 열기
    window.open(`/f/${facilityData.customUrl}`, "_blank");
  };

  return (
    <AdminLayout activeTab="facility">
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">시설 설정</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
                <CardDescription>
                  시설의 기본 정보를 설정합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium">
                        시설 이름
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={facilityData.name}
                        onChange={handleChange}
                        placeholder="시설 이름"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="customUrl" className="block text-sm font-medium">
                        커스텀 URL
                      </label>
                      <div className="flex items-center">
                        <span className="bg-muted px-3 py-2 text-sm border border-r-0 rounded-l-md">
                          facilityhub.com/f/
                        </span>
                        <Input
                          id="customUrl"
                          name="customUrl"
                          value={facilityData.customUrl}
                          onChange={handleChange}
                          className="rounded-l-none"
                          placeholder="your-facility"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium">
                      소개
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={facilityData.description}
                      onChange={handleChange}
                      placeholder="시설에 대한 간단한 소개를 작성해주세요."
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="address" className="block text-sm font-medium">
                        주소
                      </label>
                      <Input
                        id="address"
                        name="address"
                        value={facilityData.address}
                        onChange={handleChange}
                        placeholder="시설 주소"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium">
                        연락처
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={facilityData.phone}
                        onChange={handleChange}
                        placeholder="시설 연락처"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="operatingHours" className="block text-sm font-medium">
                      영업 시간
                    </label>
                    <Input
                      id="operatingHours"
                      name="operatingHours"
                      value={facilityData.operatingHours}
                      onChange={handleChange}
                      placeholder="예: 평일 06:00-22:00, 주말 10:00-18:00"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "저장 중..." : "저장하기"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>로고 및 테마</CardTitle>
                <CardDescription>
                  시설의 시각적 아이덴티티를 설정합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      로고 이미지
                    </label>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-colors">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="로고 미리보기"
                          className="max-h-32 mb-2"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                          <span className="text-xl font-bold text-gray-400">로고</span>
                        </div>
                      )}
                      <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="logo"
                        className="inline-flex items-center px-3 py-1 text-sm font-medium text-primary border border-primary rounded-md cursor-pointer hover:bg-primary/10 transition-colors"
                      >
                        로고 업로드
                      </label>
                      <p className="mt-2 text-xs text-muted-foreground text-center">
                        권장 크기: 512x512px, PNG 또는 JPG 파일
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="primaryColor" className="block text-sm font-medium">
                      메인 컬러
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        id="primaryColor"
                        name="primaryColor"
                        value={facilityData.primaryColor}
                        onChange={handleChange}
                        className="w-12 h-10 p-1 rounded border"
                      />
                      <Input
                        value={facilityData.primaryColor}
                        onChange={handleChange}
                        name="primaryColor"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="secondaryColor" className="block text-sm font-medium">
                      보조 컬러
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        id="secondaryColor"
                        name="secondaryColor"
                        value={facilityData.secondaryColor}
                        onChange={handleChange}
                        className="w-12 h-10 p-1 rounded border"
                      />
                      <Input
                        value={facilityData.secondaryColor}
                        onChange={handleChange}
                        name="secondaryColor"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <Button
                    className="w-full mt-2"
                    variant="outline"
                    onClick={applyTheme}
                  >
                    테마 적용
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>미리보기</CardTitle>
                  <CardDescription>
                    사이트 방문자들에게 보여질 페이지를 미리 확인하세요.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handlePreview}
                  >
                    시설 페이지 미리보기
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FacilitySettings;
