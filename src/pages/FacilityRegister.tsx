
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const FacilityRegister = () => {
  const navigate = useNavigate();
  const { facilityUrl } = useParams();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [facilityName, setFacilityName] = useState<string | null>(null);
  const [facilityId, setFacilityId] = useState<string | null>(null);

  // 페이지 로딩 시 facilityUrl로 시설 정보 가져오기
  useState(() => {
    const loadFacilityData = () => {
      try {
        // 로컬 스토리지에서 시설 데이터 가져오기 (실제 구현시 API로 대체)
        const savedData = localStorage.getItem('facilityData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setFacilityName(parsedData.name);
          setFacilityId("facility-1"); // 임시 ID, 실제 구현시 API에서 받아오기
        }
      } catch (error) {
        console.error("시설 정보를 불러오는데 실패했습니다:", error);
        toast({
          title: "오류",
          description: "시설 정보를 불러오는데 실패했습니다.",
          variant: "destructive"
        });
      }
    };
    
    loadFacilityData();
  });

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
    
    if (!facilityId) {
      toast({
        title: "시설 오류",
        description: "시설 정보를 불러오는데 실패했습니다.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      // 시설 ID를 전달하여 해당 시설의 회원으로 가입
      await register(name, phone, "member", facilityId);
      toast({
        title: "회원가입 완료",
        description: `${facilityName} 시설의 회원으로 가입이 완료되었습니다.`
      });
      navigate("/dashboard");
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

  if (!facilityName) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold">시설 정보 로딩 중...</h2>
          <p className="mt-2 text-muted-foreground">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{facilityName} 회원가입</CardTitle>
            <CardDescription>
              {facilityName}의 회원으로 가입하여 서비스를 이용해보세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <a href="/login" className="text-primary font-medium hover:underline">
                로그인
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default FacilityRegister;
