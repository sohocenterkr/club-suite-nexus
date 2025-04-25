
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string) => Promise<void>;
  register: (name: string, phone: string, role?: "admin" | "member") => Promise<void>;
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
  const login = async (phone: string) => {
    try {
      setLoading(true);
      
      // 실제 구현에서는 API 호출로 대체
      // 테스트용 목 데이터
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
  const register = async (name: string, phone: string, role: "admin" | "member" = "member") => {
    try {
      setLoading(true);
      
      // 실제 구현에서는 API 호출로 대체
      // 테스트용 목 데이터
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name,
        phone,
        role,
        facilityId: role === "admin" ? `facility-${Date.now()}` : null
      };
      
      // 로컬 스토리지에 사용자 정보 저장
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
