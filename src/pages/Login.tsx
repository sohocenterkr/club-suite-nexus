
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // 탭 상태
  const [activeTab, setActiveTab] = useState<"phone" | "email">("phone");
  
  // 입력 필드 상태
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 로그인 핸들러
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === "phone" && !phone) {
      toast({
        title: "전화번호를 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    
    if (activeTab === "email" && (!email || !password)) {
      toast({
        title: "이메일과 비밀번호를 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // 로그인 처리
      if (activeTab === "phone") {
        await login(phone);
      } else {
        // 이메일로 로그인할 경우 (슈퍼어드민 체크 포함)
        await login(phone, email);
      }
      
      // 로그인 성공 메시지
      toast({
        title: "로그인 성공",
        description: "환영합니다.",
      });
      
      // 대시보드로 리다이렉트
      navigate("/dashboard");
      
    } catch (error) {
      console.error(error);
      toast({
        title: "로그인 실패",
        description: "로그인에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center max-w-md px-4">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">로그인</CardTitle>
          <CardDescription className="text-center">
            아래의 방법으로 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as "phone" | "email")}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="phone">전화번호</TabsTrigger>
              <TabsTrigger value="email">이메일</TabsTrigger>
            </TabsList>
            
            {/* 전화번호 로그인 */}
            <TabsContent value="phone">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호</Label>
                    <Input
                      id="phone"
                      placeholder="010-0000-0000"
                      value={phone}
                      onChange={handlePhoneChange}
                    />
                  </div>
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? "로그인 중..." : "로그인"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            {/* 이메일 로그인 */}
            <TabsContent value="email">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">비밀번호</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? "로그인 중..." : "로그인"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="mt-2 text-center text-sm text-muted-foreground">
            계정이 없으신가요?{" "}
            <Link
              to="/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              회원가입
            </Link>
          </p>
          {activeTab === "email" && (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              <Link
                to="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
