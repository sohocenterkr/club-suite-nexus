
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-20 px-4">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            쉽고 간편한 <span className="text-primary">회원 관리 시스템</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            헬스장, 수영장, 스터디룸 등 다양한 시설에서 사용할 수 있는 맞춤형 회원 관리 솔루션을 제공합니다. 
            간편한 가입과 결제, 쉬운 관리로 당신의 비즈니스를 성장시키세요.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" onClick={() => navigate("/register")}>
              무료로 시작하기
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/demo")}>
              데모 보기
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className="bg-background p-2 rounded-xl shadow-lg">
            <img 
              src="/placeholder.svg" 
              alt="회원 관리 대시보드 미리보기" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
