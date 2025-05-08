
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
  if (typeof data === 'object') {
    localStorage.setItem(key, JSON.stringify(data));
  } else {
    localStorage.setItem(key, data);
  }
  dispatchStorageEvent();
};

// localStorage에서 데이터 로드 유틸리티
export const loadFromLocalStorage = (key: string, defaultValue: any = null) => {
  const saved = localStorage.getItem(key);
  if (!saved) return defaultValue;
  
  try {
    // JSON 데이터인 경우 파싱
    return JSON.parse(saved);
  } catch (e) {
    // 일반 문자열 데이터인 경우 그대로 반환
    return saved;
  }
};

// 시설별 데이터 저장 유틸리티
export const saveFacilityData = (facilityUrl: string, data: any) => {
  saveToLocalStorage(`facility_${facilityUrl}_data`, data);
};

// 시설별 데이터 로드 유틸리티
export const loadFacilityData = (facilityUrl: string, defaultValue: any = null) => {
  return loadFromLocalStorage(`facility_${facilityUrl}_data`, defaultValue);
};

// 시설별 로고 저장 유틸리티
export const saveFacilityLogo = (facilityUrl: string, logoData: string) => {
  saveToLocalStorage(`facility_${facilityUrl}_logo`, logoData);
};

// 시설별 로고 로드 유틸리티
export const loadFacilityLogo = (facilityUrl: string) => {
  return loadFromLocalStorage(`facility_${facilityUrl}_logo`, null);
};

// 시설별 회원 데이터 저장 유틸리티
export const saveFacilityMember = (facilityUrl: string, memberId: string, memberData: any) => {
  const memberList = loadFacilityMembers(facilityUrl, []);
  const existingIndex = memberList.findIndex((m: any) => m.id === memberId);
  
  if (existingIndex >= 0) {
    memberList[existingIndex] = { ...memberList[existingIndex], ...memberData };
  } else {
    memberList.push({ id: memberId, ...memberData });
  }
  
  saveToLocalStorage(`facility_${facilityUrl}_members`, memberList);
  return memberList;
};

// 시설별 회원 목록 로드 유틸리티
export const loadFacilityMembers = (facilityUrl: string, defaultValue: any[] = []) => {
  return loadFromLocalStorage(`facility_${facilityUrl}_members`, defaultValue);
};
