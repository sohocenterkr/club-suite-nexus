
const facilities = [
  {
    id: "1",
    name: "헬스플러스 피트니스",
    logo: "/placeholder.svg",
    description: "최신 장비와 전문 트레이너가 함께하는 프리미엄 헬스장",
    type: "gym"
  },
  {
    id: "2",
    name: "블루워터 수영장",
    logo: "/placeholder.svg",
    description: "전 연령대를 위한 쾌적한 수영 시설",
    type: "pool"
  },
  {
    id: "3",
    name: "퀘스트 스터디룸",
    logo: "/placeholder.svg",
    description: "집중력을 높여주는 조용하고 쾌적한 스터디 공간",
    type: "study"
  }
];

const FacilityShowcase = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {facilities.map((facility) => (
        <div 
          key={facility.id} 
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="h-48 overflow-hidden">
            <img 
              src={facility.logo} 
              alt={facility.name}
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="p-6">
            <h3 className="font-bold text-xl mb-2">{facility.name}</h3>
            <p className="text-muted-foreground mb-4">
              {facility.description}
            </p>
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {facility.type === "gym" && "헬스장"}
              {facility.type === "pool" && "수영장"}
              {facility.type === "study" && "스터디룸"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FacilityShowcase;
