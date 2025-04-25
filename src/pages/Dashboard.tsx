
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Calendar, CalendarCheck, CreditCard, Key } from "lucide-react";
import { format, addDays, isBefore, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import AdminLayout from "@/components/AdminLayout";

// 임시 데이터 인터페이스
interface ActiveMembership {
  id: string;
  facilityId: string;
  facilityName: string;
  membershipName: string;
  startDate: string;
  endDate: string;
}

interface ActiveAmenity {
  id: string;
  facilityId: string;
  facilityName: string;
  amenityName: string;
  type: string;
  startDate: string;
  endDate: string | null;
  lockerNumber?: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 임시 데이터
  const [activeMemberships, setActiveMemberships] = useState<ActiveMembership[]>([
    {
      id: "membership-1",
      facilityId: "facility-1",
      facilityName: "헬스플러스 피트니스",
      membershipName: "3개월 정기권",
      startDate: "2025-03-01",
      endDate: "2025-06-01"
    }
  ]);
  
  const [activeAmenities, setActiveAmenities] = useState<ActiveAmenity[]>([
    {
      id: "amenity-1",
      facilityId: "facility-1",
      facilityName: "헬스플러스 피트니스",
      amenityName: "락커 이용권",
      type: "locker",
      startDate: "2025-03-01",
      endDate: "2025-06-01",
      lockerNumber: "A-123"
    }
  ]);

  const [isLockerDialogOpen, setIsLockerDialogOpen] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<ActiveAmenity | null>(null);
  const [lockerNumber, setLockerNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const isExpirationClose = (endDate: string) => {
    const today = new Date();
    const expirationDate = new Date(endDate);
    const daysRemaining = differenceInDays(expirationDate, today);
    return daysRemaining <= 7 && daysRemaining >= 0;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "yyyy년 M월 d일 (eee)", { locale: ko });
  };

  const handleExtendMembership = (membershipId: string) => {
    navigate(`/checkout/membership/${membershipId}`);
  };

  const handleEditLockerNumber = (amenity: ActiveAmenity) => {
    setSelectedAmenity(amenity);
    setLockerNumber(amenity.lockerNumber || "");
    setIsLockerDialogOpen(true);
  };

  const handleSaveLockerNumber = async () => {
    if (!selectedAmenity) return;
    
    try {
      setIsLoading(true);
      
      // 실제 구현에서는 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 락커 번호 업데이트
      setActiveAmenities(prev => 
        prev.map(item => 
          item.id === selectedAmenity.id 
            ? { ...item, lockerNumber } 
            : item
        )
      );
      
      toast({
        title: "락커 번호 변경 완료",
        description: "락커 번호가 성공적으로 변경되었습니다."
      });
      
      setIsLockerDialogOpen(false);
    } catch (error) {
      toast({
        title: "변경 실패",
        description: "락커 번호 변경 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 관리자인 경우 관리자 대시보드 렌더링
  if (user?.role === "admin") {
    return (
      <AdminLayout activeTab="dashboard">
        <div className="container mx-auto py-6 px-4">
          <h1 className="text-2xl font-bold mb-6">관리자 대시보드</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">총 회원 수</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45명</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">활성 정기권</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">38명</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">이번달 매출</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4,350,000원</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">방문자 수</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">오늘 12명</div>
                <p className="text-xs text-muted-foreground mt-1">이번주 총 89명</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>최근 활동</CardTitle>
                <CardDescription>지난 7일간의 활동 내역입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">김철수님 3개월 정기권 구매</p>
                        <p className="text-sm text-muted-foreground">2025년 4월 24일 14:23</p>
                      </div>
                    </div>
                    <span className="text-green-600 font-medium">270,000원</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Key className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">박지민님 락커 이용권 구매</p>
                        <p className="text-sm text-muted-foreground">2025년 4월 23일 11:15</p>
                      </div>
                    </div>
                    <span className="text-green-600 font-medium">30,000원</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <CalendarCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">이영희님 입장</p>
                        <p className="text-sm text-muted-foreground">2025년 4월 22일 18:30</p>
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">유효 회원</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">모든 활동 보기</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>빠른 링크</CardTitle>
                <CardDescription>자주 사용하는 기능에 빠르게 접근하세요.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-background"
                  onClick={() => navigate("/settings/facility")}
                >
                  <Building className="mr-2 h-4 w-4" />
                  시설 정보 관리
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-background"
                  onClick={() => navigate("/settings/memberships")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  정기권 관리
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-background"
                  onClick={() => navigate("/settings/amenities")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  부대시설 관리
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-background"
                  onClick={() => navigate("/check-in")}
                >
                  <User className="mr-2 h-4 w-4" />
                  입장 확인
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // 일반 회원 대시보드
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">내 이용권</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            정기권
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeMemberships.length > 0 ? (
              activeMemberships.map(membership => (
                <Card key={membership.id} className="relative">
                  {isExpirationClose(membership.endDate) && (
                    <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs px-2 py-1 rounded-bl-md rounded-tr-md">
                      곧 만료
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{membership.facilityName}</CardTitle>
                    <CardDescription>{membership.membershipName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">시작일:</span>
                      <span className="text-sm">{formatDate(membership.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">만료일:</span>
                      <span className="text-sm font-medium">{formatDate(membership.endDate)}</span>
                    </div>
                    
                    {isExpirationClose(membership.endDate) && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-orange-600 mb-2">
                          정기권이 {differenceInDays(new Date(membership.endDate), new Date())}일 후 만료됩니다.
                        </p>
                        <Button 
                          className="w-full"
                          onClick={() => handleExtendMembership(membership.id)}
                        >
                          정기권 연장하기
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full bg-muted/30 rounded-lg p-8 text-center">
                <p className="text-muted-foreground mb-4">활성화된 정기권이 없습니다.</p>
                <Button onClick={() => navigate("/facilities")}>
                  정기권 구매하기
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            부대시설 이용권
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAmenities.length > 0 ? (
              activeAmenities.map(amenity => (
                <Card key={amenity.id}>
                  <CardHeader>
                    <CardTitle>{amenity.facilityName}</CardTitle>
                    <CardDescription>{amenity.amenityName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">시작일:</span>
                      <span className="text-sm">{formatDate(amenity.startDate)}</span>
                    </div>
                    {amenity.endDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">만료일:</span>
                        <span className="text-sm">{formatDate(amenity.endDate)}</span>
                      </div>
                    )}
                    
                    {amenity.type === "locker" && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">락커 번호:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm bg-primary/10 px-2 py-1 rounded">
                              {amenity.lockerNumber || "미지정"}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditLockerNumber(amenity)}
                            >
                              변경
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full bg-muted/30 rounded-lg p-8 text-center">
                <p className="text-muted-foreground mb-4">활성화된 부대시설 이용권이 없습니다.</p>
                <Button onClick={() => navigate("/facilities")}>
                  이용권 구매하기
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 락커 번호 변경 다이얼로그 */}
      {selectedAmenity && (
        <Dialog open={isLockerDialogOpen} onOpenChange={setIsLockerDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>락커 번호 변경</DialogTitle>
              <DialogDescription>
                사용하실 락커 번호를 입력해주세요.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="lockerNumber" className="text-sm font-medium">
                  락커 번호
                </label>
                <Input
                  id="lockerNumber"
                  value={lockerNumber}
                  onChange={(e) => setLockerNumber(e.target.value)}
                  placeholder="예: A-123"
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsLockerDialogOpen(false)}>
                  취소
                </Button>
                <Button 
                  onClick={handleSaveLockerNumber}
                  disabled={isLoading}
                >
                  {isLoading ? "저장 중..." : "저장"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Dashboard;
