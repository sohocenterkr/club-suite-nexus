
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/HeroSection";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen">
      {/* 간소화된 히어로 섹션 */}
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

      {/* 기능 소개 섹션 */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold">주요 기능</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            필요한 모든 기능을 한곳에서 쉽게 관리하세요
          </p>
        </div>
        
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 기능 카드 1 */}
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">회원 관리</h3>
            <p className="text-muted-foreground">
              회원 정보, 출석 기록, 결제 내역을 한눈에 확인하고 관리하세요.
            </p>
          </div>
          
          {/* 기능 카드 2 */}
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">멤버십 관리</h3>
            <p className="text-muted-foreground">
              다양한 멤버십 유형을 만들고 결제 주기와 기간을 설정할 수 있습니다.
            </p>
          </div>
          
          {/* 기능 카드 3 */}
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">자동화된 결제</h3>
            <p className="text-muted-foreground">
              자동 결제 시스템으로 수익을 안정적으로 관리하세요.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA 섹션 */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">지금 바로 시작하세요</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            무료로 시작하고 비즈니스가 성장함에 따라 필요한 기능을 추가하세요.
          </p>
          <Button size="lg" onClick={() => navigate("/register")}>
            무료로 시작하기
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
