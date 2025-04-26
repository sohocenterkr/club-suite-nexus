
// 사용자 타입 정의
export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'admin' | 'member' | 'superadmin';
  facilityId: string | null;
  // 추가 정보 필드
  customFields?: Record<string, string>;
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
  // 회원 가입 시 사용자 정의 필드
  customRegistrationFields?: CustomField[];
}

// 사용자 정의 필드 타입
export interface CustomField {
  id: string;
  facilityId: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select';
  required: boolean;
  options?: string[]; // 'select' 타입일 경우 선택 옵션
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
  type: 'membership' | 'amenity' | 'sms_credit';
  membershipId?: string;
  amenityId?: string;
}

// SMS 메시지 템플릿 타입
export interface SmsTemplate {
  id: string;
  facilityId: string;
  name: string;
  content: string;
}

// SMS 발신 이력 타입
export interface SmsHistory {
  id: string;
  facilityId: string;
  recipientId: string;
  content: string;
  sentAt: string;
  status: 'sent' | 'failed';
}

// SMS 크레딧 정보 타입
export interface SmsCredit {
  id: string;
  facilityId: string;
  amount: number;
  updatedAt: string;
}

// 어드민 통계 타입
export interface AdminStats {
  totalFacilities: number;
  totalMembers: number;
  totalRevenue: number;
  activeMemberships: number;
  smsCreditsUsed: number;
}

