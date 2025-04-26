
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FacilityRegister from "./pages/FacilityRegister"; // 시설별 회원가입 페이지
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard"; // 슈퍼 어드민 대시보드
import FacilitySettings from "./pages/FacilitySettings";
import MembershipManagement from "./pages/MembershipManagement";
import MemberManagement from "./pages/MemberManagement"; // 회원 관리 페이지
import SMSManagement from "./pages/SMSManagement"; // SMS 관리 페이지
import SMSCharge from "./pages/SMSCharge"; // SMS 충전 페이지
import AmenityManagement from "./pages/AmenityManagement";
import CheckIn from "./pages/CheckIn";
import FacilityPage from "./pages/FacilityPage";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import CustomFieldsManagement from "./pages/CustomFieldsManagement"; // 사용자 정의 필드 관리 페이지

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="register/:facilityUrl" element={<FacilityRegister />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="settings/facility" element={<FacilitySettings />} />
              <Route path="settings/memberships" element={<MembershipManagement />} />
              <Route path="settings/amenities" element={<AmenityManagement />} />
              <Route path="settings/members" element={<MemberManagement />} />
              <Route path="settings/sms" element={<SMSManagement />} />
              <Route path="settings/sms/:memberId" element={<SMSManagement />} />
              <Route path="settings/sms-charge" element={<SMSCharge />} />
              <Route path="settings/custom-fields" element={<CustomFieldsManagement />} />
              <Route path="check-in" element={<CheckIn />} />
              <Route path="checkout/:type/:id" element={<Checkout />} />
              <Route path="f/:facilityUrl" element={<FacilityPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
