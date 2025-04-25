
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
import Dashboard from "./pages/Dashboard";
import FacilitySettings from "./pages/FacilitySettings";
import MembershipManagement from "./pages/MembershipManagement";
import AmenityManagement from "./pages/AmenityManagement";
import CheckIn from "./pages/CheckIn";
import FacilityPage from "./pages/FacilityPage";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

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
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="settings/facility" element={<FacilitySettings />} />
              <Route path="settings/memberships" element={<MembershipManagement />} />
              <Route path="settings/amenities" element={<AmenityManagement />} />
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
