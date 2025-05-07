
// 기본 시설 정보
export const defaultFacility = {
  id: "facility-1",
  name: "헬스플러스 피트니스",
  logo: "/placeholder.svg",
  customUrl: "health-plus",
  theme: {
    primaryColor: "#3182ce",
    secondaryColor: "#63b3ed",
  },
  description: "최신 장비와 전문 트레이너가 있는 프리미엄 피트니스 센터",
  address: "서울시 강남구 테헤란로 123",
  phone: "02-123-4567",
  operatingHours: "평일 06:00-22:00, 주말 10:00-18:00",
  ownerId: "owner-1"
};

// 멤버십 옵션
export const mockMemberships = [
  {
    id: "membership-1",
    name: "1개월 정기권",
    price: 100000,
    durationInMonths: 1,
    description: "한 달 동안 무제한 이용 가능한 정기권",
  },
  {
    id: "membership-2",
    name: "3개월 정기권",
    price: 270000,
    durationInMonths: 3,
    description: "3개월 동안 무제한 이용 가능한 정기권 (10% 할인)",
  },
  {
    id: "membership-3",
    name: "6개월 정기권",
    price: 480000,
    durationInMonths: 6,
    description: "6개월 동안 무제한 이용 가능한 정기권 (20% 할인)",
  }
];

// 부대시설 옵션
export const mockAmenities = [
  {
    id: "amenity-1",
    name: "개인 락커",
    price: 30000,
    type: "locker",
    description: "개인 물품을 보관할 수 있는 락커 (월 이용권)",
  },
  {
    id: "amenity-2",
    name: "개인 PT 1회",
    price: 50000,
    type: "other",
    description: "전문 트레이너의 1:1 퍼스널 트레이닝 1회권",
  },
  {
    id: "amenity-3",
    name: "운동복 대여 서비스",
    price: 5000,
    type: "other",
    description: "깨끗한 운동복 대여 (1회용)",
  }
];
