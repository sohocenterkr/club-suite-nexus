
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { saveToLocalStorage } from "@/utils/storageUtils";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [facilitySubdomain, setFacilitySubdomain] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      toast({
        title: "입력 오류",
        description: "이름과 전화번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    // 시설 관리자 등록 시 서브도메인 필수 확인
    if (isAdmin) {
      if (!facilityName.trim()) {
        toast({
          title: "입력 오류",
          description: "시설 이름을 입력해주세요.",
          variant: "destructive"
        });
        return;
      }
      
      if (!facilitySubdomain.trim()) {
        toast({
          title: "입력 오류",
          description: "시설 서브주소를 입력해주세요.",
          variant: "destructive"
        });
        return;
      }
      
      // 서브도메인 유효성 검사 (영문, 숫자, 하이픈만 허용)
      const subdomainPattern = /^[a-z0-9-]+$/;
      if (!subdomainPattern.test(facilitySubdomain)) {
        toast({
          title: "서브주소 형식 오류",
          description: "서브주소는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.",
          variant: "destructive"
        });
        return;
      }
    }
    
    try {
      setIsLoading(true);
      
      if (isAdmin) {
        // 시설 정보 저장
        const facilityData = {
          id: `facility-${facilitySubdomain}`,
          name: facilityName,
          customUrl: facilitySubdomain,
          description: "",
          address: "",
          phone: "",
          primaryColor: "#3b82f6",
          secondaryColor: "#60a5fa",
          operatingHours: ""
        };
        
        // facilitySubdomain을 facilityId로 사용하여 등록
        await register(name, phone, isAdmin ? "admin" : "member", facilitySubdomain);
        
        // 시설별 데이터 저장
        saveToLocalStorage(`facility_${facilitySubdomain}_data`, facilityData);
      } else {
        // 일반 회원 가입
        await register(name, phone, "member");
      }
      
      toast({
        title: "회원가입 완료",
        description: isAdmin ? "시설 관리자로 회원가입이 완료되었습니다." : "회원가입이 완료되었습니다."
      });
      
      navigate(isAdmin ? "/settings/facility" : "/dashboard");
    } catch (error) {
      toast({
        title: "회원가입 실패",
        description: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // 숫자만 입력 가능하도록
    const numbers = value.replace(/[^0-9]/g, "");
    
    // 한국 전화번호 형식 (010-1234-5678)
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 영문 소문자, 숫자, 하이픈만 허용
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFacilitySubdomain(value);
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">회원가입</CardTitle>
            <CardDescription>
              {isAdmin ? "시설 관리자" : "회원"}으로 가입하여 서비스를 이용해보세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="user-type" className="block text-sm font-medium">
                  가입 유형
                </label>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={!isAdmin ? "default" : "outline"}
                    onClick={() => setIsAdmin(false)}
                    className="flex-1"
                  >
                    회원
                  </Button>
                  <Button
                    type="button"
                    variant={isAdmin ? "default" : "outline"}
                    onClick={() => setIsAdmin(true)}
                    className="flex-1"
                  >
                    시설 관리자
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  이름
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력해주세요"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium">
                  전화번호
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="010-0000-0000"
                  required
                />
              </div>
              {isAdmin && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="facilityName" className="block text-sm font-medium">
                      시설 이름
                    </label>
                    <Input
                      id="facilityName"
                      value={facilityName}
                      onChange={(e) => setFacilityName(e.target.value)}
                      placeholder="시설 이름을 입력해주세요"
                      required={isAdmin}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="facilitySubdomain" className="block text-sm font-medium">
                      시설 서브주소
                    </label>
                    <div className="flex items-center">
                      <span className="bg-muted px-3 py-2 text-sm border border-r-0 rounded-l-md">
                        facilityhub.com/f/
                      </span>
                      <Input
                        id="facilitySubdomain"
                        value={facilitySubdomain}
                        onChange={handleSubdomainChange}
                        className="rounded-l-none"
                        placeholder="your-facility"
                        required={isAdmin}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.
                    </p>
                  </div>
                </>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "처리 중..." : "가입하기"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              이미 계정이 있으신가요?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                로그인
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
