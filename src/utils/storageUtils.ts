
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
