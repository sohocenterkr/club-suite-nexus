
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import FacilityShowcase from "@/components/FacilityShowcase";
import FeaturesSection from "@/components/FeaturesSection";
import HeroSection from "@/components/HeroSection";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* 히어로 섹션 */}
      <HeroSection />
      
      {/* 주요 기능 설명 */}
      <FeaturesSection />
      
      {/* 시설 쇼케이스 */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">인기 시설</h2>
          <FacilityShowcase />
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">나만의 시설 관리 시스템을 시작해보세요</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            간편한 회원 관리, 정기권 설정, 부대시설 관리까지 한 번에 해결하세요.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => navigate("/register")}
            >
              무료로 시작하기
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate("/login")}
            >
              로그인
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
