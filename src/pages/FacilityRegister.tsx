
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Facility, CustomField } from "@/types";
import { loadFacilityData, saveFacilityMember } from "@/utils/storageUtils";

const FacilityRegister = () => {
  const { facilityUrl } = useParams<{ facilityUrl: string }>();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [facility, setFacility] = useState<Facility | null>(null);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // 시설 정보 로드
    const fetchFacility = () => {
      if (!facilityUrl) {
        navigate("/register");
        return;
      }

      // 로컬 스토리지에서 시설 정보 로드
      const facilityData = loadFacilityData(facilityUrl);
      
      if (facilityData) {
        // 시설 정보를 찾은 경우
        setFacility({
          id: facilityData.id || `facility-${facilityUrl}`,
          name: facilityData.name,
          logo: null,
          customUrl: facilityUrl,
          theme: { 
            primaryColor: facilityData.primaryColor || "#4f46e5", 
            secondaryColor: facilityData.secondaryColor || "#818cf8" 
          },
          ownerId: facilityData.ownerId || "admin-1",
          customRegistrationFields: facilityData.customRegistrationFields || [
            { id: "field-1", facilityId: facilityData.id || "facility-1", name: "생년월일", type: "date", required: true },
            { id: "field-2", facilityId: facilityData.id || "facility-1", name: "직업", type: "text", required: false },
            { id: "field-3", facilityId: facilityData.id || "facility-1", name: "운동 목적", type: "select", required: true, options: ["다이어트", "근력 향상", "건강 관리", "기타"] }
          ]
        });

        // 커스텀 필드의 기본값 설정
        const defaultValues: Record<string, string> = {};
        if (facilityData.customRegistrationFields) {
          facilityData.customRegistrationFields.forEach((field: CustomField) => {
            defaultValues[field.id] = "";
          });
        }
        setCustomFieldValues(defaultValues);
      } else {
        // 시설을 찾을 수 없는 경우
        toast({
          title: "시설을 찾을 수 없음",
          description: "해당 URL의 시설을 찾을 수 없습니다.",
          variant: "destructive"
        });
        navigate("/register");
      }
      
      setLoading(false);
    };

    if (facilityUrl) {
      fetchFacility();
    } else {
      navigate("/register");
    }
  }, [facilityUrl, navigate]);

  // 전화번호 포맷팅 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      // 010-1234-5678 형식으로 포맷팅
      let formattedValue = '';
      
      if (value.length > 7) {
        formattedValue = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
      } else if (value.length > 3) {
        formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
      } else {
        formattedValue = value;
      }
      
      setPhone(formattedValue);
    }
  };

  // 커스텀 필드 값 변경 핸들러
  const handleCustomFieldChange = (fieldId: string, value: string) => {
    setCustomFieldValues({
      ...customFieldValues,
      [fieldId]: value,
    });
  };

  // 회원가입 처리
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    if (!name || !phone) {
      toast({
        title: "입력 오류",
        description: "이름과 전화번호를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    // 필수 커스텀 필드 검사
    if (facility?.customRegistrationFields) {
      const requiredFields = facility.customRegistrationFields.filter(field => field.required);
      for (const field of requiredFields) {
        if (!customFieldValues[field.id]) {
          toast({
            title: "입력 오류",
            description: `${field.name} 필드는 필수 입력 항목입니다.`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    
    try {
      setLoading(true);
      
      if (facilityUrl) {
        // 시설별 회원 정보 저장
        const memberId = `member-${Date.now()}`;
        const memberData = {
          id: memberId,
          name,
          phone,
          role: "member",
          customFields: customFieldValues,
          registeredAt: new Date().toISOString(),
        };

        // 시설별 회원 정보 로컬 스토리지에 저장
        saveFacilityMember(facilityUrl, memberId, memberData);
      }
      
      // 회원가입 처리
      await register(name, phone, "member", facility?.id || null, undefined, customFieldValues);
      
      toast({
        title: "회원가입 성공",
        description: `${facility?.name || '시설'}의 회원으로 가입되었습니다.`,
      });
      
      navigate("/dashboard");
      
    } catch (error) {
      console.error(error);
      toast({
        title: "회원가입 실패",
        description: "회원가입에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 커스텀 필드 렌더링 함수
  const renderCustomField = (field: CustomField) => {
    switch (field.type) {
      case "text":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.name} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.id}
              value={customFieldValues[field.id] || ""}
              onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
              placeholder={`${field.name}을(를) 입력하세요`}
            />
          </div>
        );
        
      case "number":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.name} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.id}
              type="number"
              value={customFieldValues[field.id] || ""}
              onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
              placeholder={`${field.name}을(를) 입력하세요`}
            />
          </div>
        );
        
      case "date":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.name} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={customFieldValues[field.id] || ""}
              onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            />
          </div>
        );
        
      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.name} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Select
              value={customFieldValues[field.id] || ""}
              onValueChange={(value) => handleCustomFieldChange(field.id, value)}
            >
              <SelectTrigger id={field.id}>
                <SelectValue placeholder={`${field.name}을(를) 선택하세요`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading && !facility) {
    return (
      <div className="container mx-auto flex h-screen flex-col items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-10 px-4 max-w-md">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {facility?.name || '시설'} 회원 가입
          </CardTitle>
          <CardDescription className="text-center">
            {facility?.name || '시설'}의 회원으로 가입하고 서비스를 이용하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {/* 기본 필드 */}
            <div className="space-y-2">
              <Label htmlFor="name">이름 <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">전화번호 <span className="text-destructive">*</span></Label>
              <Input
                id="phone"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="010-0000-0000"
              />
            </div>
            
            {/* 커스텀 필드 */}
            {facility?.customRegistrationFields?.map(field => renderCustomField(field))}
            
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "가입 중..." : "가입하기"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link
              to="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              로그인
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FacilityRegister;
