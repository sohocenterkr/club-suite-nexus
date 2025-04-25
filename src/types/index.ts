
// 사용자 타입 정의
export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'admin' | 'member';
  facilityId: string | null;
}

// 시설 타입 정의
export interface Facility {
  id: string;
  name: string;
  logo: string | null;
  customUrl: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  ownerId: string;
}

// 멤버십(정기권) 타입 정의
export interface Membership {
  id: string;
  facilityId: string;
  name: string;
  durationInMonths: number;
  price: number;
  description?: string;
}

// 부대시설 타입 정의
export interface Amenity {
  id: string;
  facilityId: string;
  name: string;
  price: number;
  description?: string;
  type: 'locker' | 'shower' | 'meeting_room' | 'other';
  lockerNumber?: string;
}

// 회원권 구독 타입 정의
export interface Subscription {
  id: string;
  userId: string;
  facilityId: string;
  membershipId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// 부대시설 이용권 타입 정의
export interface AmenityUsage {
  id: string;
  userId: string;
  facilityId: string;
  amenityId: string;
  startDate: string;
  endDate: string | null;
  lockerNumber?: string;
  isActive: boolean;
}

// 결제 타입 정의
export interface Payment {
  id: string;
  userId: string;
  facilityId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  type: 'membership' | 'amenity';
  membershipId?: string;
  amenityId?: string;
}
