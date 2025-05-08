
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string, email?: string) => Promise<void>;
  register: (name: string, phone: string, role?: "admin" | "member" | "superadmin", facilityId?: string | null, email?: string, customFields?: Record<string, string>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 시작 시 로컬 스토리지에서 사용자 정보를 로드
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from local storage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 로그인 함수
  const login = async (phone: string, email?: string) => {
    try {
      setLoading(true);
      
      // 슈퍼 어드민 체크 (고정된 값)
      if (phone === "010-892-0396" || email === "sohocenter.kr@gmail.com") {
        const superAdminUser: User = {
          id: "superadmin-1",
          name: "소호센터",
          phone: "010-892-0396",
          role: "superadmin",
          facilityId: null
        };
        localStorage.setItem("user", JSON.stringify(superAdminUser));
        setUser(superAdminUser);
        return;
      }
      
      // 로컬 스토리지에서 사용자 찾기
      // 실제 구현에서는 API 호출로 대체되어야 함
      const mockUsers = JSON.parse(localStorage.getItem("mockUsers") || "[]");
      const foundUser = mockUsers.find((u: any) => u.phone === phone);
      
      if (foundUser) {
        localStorage.setItem("user", JSON.stringify(foundUser));
        setUser(foundUser);
        return;
      }
      
      // 사용자가 없으면 테스트 사용자로 로그인
      const mockUser: User = {
        id: "user-1",
        name: "테스트 사용자",
        phone,
        role: "member",
        facilityId: null
      };
      
      // 로컬 스토리지에 사용자 정보 저장
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 회원가입 함수
  const register = async (
    name: string, 
    phone: string, 
    role: "admin" | "member" | "superadmin" = "member", 
    facilityId: string | null = null,
    email?: string,
    customFields?: Record<string, string>
  ) => {
    try {
      setLoading(true);
      
      // 슈퍼 어드민 체크
      if (phone === "010-892-0396" || email === "sohocenter.kr@gmail.com") {
        role = "superadmin";
      }

      const newUserId = `user-${Date.now()}`;
      let newFacilityId = facilityId;
      
      // 시설 관리자인 경우 facility ID 생성
      if (role === "admin" && !facilityId) {
        // Register 컴포넌트에서 나중에 쓰도록 customUrl을 facilityId의 suffix로 저장
        newFacilityId = `facility-${facilityId || Date.now()}`;
      }
      
      // 실제 구현에서는 API 호출로 대체
      // 테스트용 목 데이터
      const mockUser: User = {
        id: newUserId,
        name,
        phone,
        role,
        facilityId: newFacilityId,
        customFields
      };
      
      // 로컬 스토리지에 사용자 목록 업데이트
      const mockUsers = JSON.parse(localStorage.getItem("mockUsers") || "[]");
      mockUsers.push(mockUser);
      localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
      
      // 로컬 스토리지에 사용자 정보 저장 (현재 로그인된 사용자)
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
