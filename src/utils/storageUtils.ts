
// 커스텀 이벤트 디스패치 함수
export const dispatchStorageEvent = () => {
  console.log("커스텀 스토리지 이벤트 발생");
  
  // 브라우저 스토리지 이벤트 발생 (다른 탭에서 감지)
  window.dispatchEvent(new Event('storage'));
  
  // 커스텀 이벤트 발생 (같은 탭에서 감지)
  window.dispatchEvent(new Event('custom-storage'));
};

// localStorage에 데이터 저장 유틸리티
export const saveToLocalStorage = (key: string, data: any) => {
  try {
    if (typeof data === 'object') {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      localStorage.setItem(key, data);
    }
    dispatchStorageEvent();
  } catch (error) {
    console.error("데이터 저장 오류:", error);
  }
};

// localStorage에서 데이터 로드 유틸리티
export const loadFromLocalStorage = (key: string, defaultValue: any = null) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;
    
    try {
      // JSON 데이터인 경우 파싱
      return JSON.parse(saved);
    } catch (e) {
      // 일반 문자열 데이터인 경우 그대로 반환
      return saved;
    }
  } catch (error) {
    console.error("데이터 로드 오류:", error);
    return defaultValue;
  }
};

// 시설별 데이터 저장 유틸리티
export const saveFacilityData = (facilityUrl: string, data: any) => {
  if (!facilityUrl) {
    console.error("facilityUrl이 제공되지 않았습니다.");
    return;
  }
  
  // 'facility-' 접두사가 있는 경우 제거
  const cleanUrl = facilityUrl.replace(/^facility-/, '');
  saveToLocalStorage(`facility_${cleanUrl}_data`, data);
};

// 시설별 데이터 로드 유틸리티
export const loadFacilityData = (facilityUrl: string, defaultValue: any = null) => {
  if (!facilityUrl) {
    console.error("facilityUrl이 제공되지 않았습니다.");
    return defaultValue;
  }
  
  // 'facility-' 접두사가 있는 경우 제거
  const cleanUrl = facilityUrl.replace(/^facility-/, '');
  return loadFromLocalStorage(`facility_${cleanUrl}_data`, defaultValue);
};

// 시설별 로고 저장 유틸리티
export const saveFacilityLogo = (facilityUrl: string, logoData: string) => {
  if (!facilityUrl) {
    console.error("facilityUrl이 제공되지 않았습니다.");
    return;
  }
  
  // 'facility-' 접두사가 있는 경우 제거
  const cleanUrl = facilityUrl.replace(/^facility-/, '');
  saveToLocalStorage(`facility_${cleanUrl}_logo`, logoData);
};

// 시설별 로고 로드 유틸리티
export const loadFacilityLogo = (facilityUrl: string) => {
  if (!facilityUrl) {
    console.error("facilityUrl이 제공되지 않았습니다.");
    return null;
  }
  
  // 'facility-' 접두사가 있는 경우 제거
  const cleanUrl = facilityUrl.replace(/^facility-/, '');
  return loadFromLocalStorage(`facility_${cleanUrl}_logo`, null);
};

// 시설별 회원 데이터 저장 유틸리티
export const saveFacilityMember = (facilityUrl: string, memberId: string, memberData: any) => {
  if (!facilityUrl) {
    console.error("facilityUrl이 제공되지 않았습니다.");
    return;
  }
  
  // 'facility-' 접두사가 있는 경우 제거
  const cleanUrl = facilityUrl.replace(/^facility-/, '');
  const memberList = loadFacilityMembers(cleanUrl, []);
  const existingIndex = memberList.findIndex((m: any) => m.id === memberId);
  
  if (existingIndex >= 0) {
    memberList[existingIndex] = { ...memberList[existingIndex], ...memberData };
  } else {
    memberList.push({ id: memberId, ...memberData });
  }
  
  saveToLocalStorage(`facility_${cleanUrl}_members`, memberList);
  return memberList;
};

// 시설별 회원 목록 로드 유틸리티
export const loadFacilityMembers = (facilityUrl: string, defaultValue: any[] = []) => {
  if (!facilityUrl) {
    console.error("facilityUrl이 제공되지 않았습니다.");
    return defaultValue;
  }
  
  // 'facility-' 접두사가 있는 경우 제거
  const cleanUrl = facilityUrl.replace(/^facility-/, '');
  return loadFromLocalStorage(`facility_${cleanUrl}_members`, defaultValue);
};

// 특정 시설의 특정 회원 데이터 로드
export const loadFacilityMember = (facilityUrl: string, memberId: string, defaultValue: any = null) => {
  if (!facilityUrl || !memberId) {
    console.error("facilityUrl 또는 memberId가 제공되지 않았습니다.");
    return defaultValue;
  }
  
  const members = loadFacilityMembers(facilityUrl, []);
  const member = members.find((m: any) => m.id === memberId);
  return member || defaultValue;
};

// 회원이 속한 시설 확인
export const getMemberFacility = (memberId: string) => {
  if (!memberId) return null;
  
  // 모든 로컬 스토리지 키 검색
  const allKeys = Object.keys(localStorage);
  
  for (const key of allKeys) {
    if (key.startsWith('facility_') && key.endsWith('_members')) {
      const facilityUrl = key.replace('facility_', '').replace('_members', '');
      const members = loadFacilityMembers(facilityUrl, []);
      
      if (members.some((m: any) => m.id === memberId)) {
        return facilityUrl;
      }
    }
  }
  
  return null;
};
