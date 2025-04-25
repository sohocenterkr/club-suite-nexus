
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isFacilityPage = location.pathname.startsWith("/f/");
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled || isFacilityPage ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">FacilityHub</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              홈
            </Link>
            <Link
              to="/features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              기능
            </Link>
            <Link
              to="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              요금제
            </Link>
            <Link
              to="/check-in"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              입장 확인
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User size={16} />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    대시보드
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/settings/facility")}>
                        시설 관리
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/settings/memberships")}>
                        정기권 관리
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/settings/amenities")}>
                        부대시설 관리
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  로그인
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate("/register")}
                >
                  시작하기
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background py-4 px-4 shadow-lg">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/"
              className="text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              홈
            </Link>
            <Link
              to="/features"
              className="text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              기능
            </Link>
            <Link
              to="/pricing"
              className="text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              요금제
            </Link>
            <Link
              to="/check-in"
              className="text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              입장 확인
            </Link>
            {user ? (
              <>
                <hr className="my-2" />
                <Link
                  to="/dashboard"
                  className="text-sm font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  대시보드
                </Link>
                {user.role === "admin" && (
                  <>
                    <Link
                      to="/settings/facility"
                      className="text-sm font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      시설 관리
                    </Link>
                    <Link
                      to="/settings/memberships"
                      className="text-sm font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      정기권 관리
                    </Link>
                    <Link
                      to="/settings/amenities"
                      className="text-sm font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      부대시설 관리
                    </Link>
                  </>
                )}
                <Button
                  variant="destructive"
                  className="w-full mt-2"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 mt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                >
                  로그인
                </Button>
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => {
                    navigate("/register");
                    setIsMenuOpen(false);
                  }}
                >
                  시작하기
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
