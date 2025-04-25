
import { CheckCircle, Users, Calendar, Settings, CreditCard, Building } from "lucide-react";

const features = [
  {
    icon: <Building className="h-6 w-6 text-primary" />,
    title: "시설별 맞춤 사이트",
    description: "각 시설마다 개별 서브사이트가 자동 생성되어, 로고와 이름을 손쉽게 커스터마이징 할 수 있습니다."
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "간편한 회원 가입",
    description: "이름과 전화번호만으로 빠르게 회원가입하고, 바로 이용할 수 있습니다."
  },
  {
    icon: <Calendar className="h-6 w-6 text-primary" />,
    title: "정기권 관리",
    description: "시설별로 다양한 정기권 기간을 설정하고, 회원들에게 제공할 수 있습니다."
  },
  {
    icon: <Settings className="h-6 w-6 text-primary" />,
    title: "부대시설 관리",
    description: "락커, 샤워실, 회의실 등 부대시설 이용권을 추가하고 관리할 수 있습니다."
  },
  {
    icon: <CreditCard className="h-6 w-6 text-primary" />,
    title: "간편 결제",
    description: "다양한 결제 수단을 통해 편리하게 정기권과 부대시설 이용권을 결제할 수 있습니다."
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: "입장 확인",
    description: "전화번호 뒷자리만으로 빠르게 입장 확인하고, 연장 시기를 놓치지 않도록 알려드립니다."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">주요 기능</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            시설 관리에 필요한 모든 기능을 하나의 플랫폼에서 제공합니다
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
