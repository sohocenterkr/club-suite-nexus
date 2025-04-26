
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Building, CreditCard, User, Menu, X, Settings, LogOut, Calendar, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab?: "dashboard" | "facility" | "memberships" | "amenities" | "members" | "sms";
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab = "dashboard" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    {
      name: "대시보드",
      icon: <Calendar className="h-5 w-5" />,
      href: "/dashboard",
      active: activeTab === "dashboard",
    },
    {
      name: "시설 설정",
      icon: <Building className="h-5 w-5" />,
      href: "/settings/facility",
      active: activeTab === "facility",
    },
    {
      name: "정기권 관리",
      icon: <CreditCard className="h-5 w-5" />,
      href: "/settings/memberships",
      active: activeTab === "memberships",
    },
    {
      name: "부대시설 관리",
      icon: <Settings className="h-5 w-5" />,
      href: "/settings/amenities",
      active: activeTab === "amenities",
    },
    {
      name: "회원 관리",
      icon: <User className="h-5 w-5" />,
      href: "/settings/members",
      active: activeTab === "members",
    },
    {
      name: "문자 메시지",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/settings/sms",
      active: activeTab === "sms",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* 사이드바 (모바일) */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
      </div>

      {/* 사이드바 (모바일) */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white transition-transform ease-in-out duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-white border-b">
          <div className="flex items-center">
            <span className="text-xl font-bold text-primary">FacilityHub</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="px-2 py-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 mt-1 text-sm font-medium rounded-md ${
                item.active
                  ? "text-primary bg-primary/10"
                  : "text-gray-600 hover:text-primary hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
          
          <div className="mt-8 px-4">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </div>

      {/* 사이드바 (데스크탑) */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-primary">FacilityHub</span>
              </Link>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 mt-1 text-sm font-medium rounded-md ${
                      item.active
                        ? "text-primary bg-primary/10"
                        : "text-gray-600 hover:text-primary hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">관리자</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full mt-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  로그아웃
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </Button>
            <div className="ml-3">
              <span className="text-xl font-bold text-primary">FacilityHub</span>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
