
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Building, 
  Settings, 
  User,
  Calendar, 
  CreditCard, 
  DollarSign, 
  Clock, 
  CheckSquare,
  ChevronRight
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockSubscriptions = [
  {
    id: "subscription-1",
    membershipName: "3개월 정기권",
    facilityName: "헬스플러스 피트니스",
    price: 270000,
    startDate: "2025-03-01",
    endDate: "2025-06-01",
    isActive: true,
    facilityId: "facility-1",
  },
];

const mockAmenityUsage = [
  {
    id: "amenity-1",
    amenityName: "개인 락커",
    facilityName: "헬스플러스 피트니스",
    price: 30000,
    startDate: "2025-03-01",
    endDate: "2025-04-01",
    isActive: true,
    facilityId: "facility-1",
    lockerNumber: "A-123",
  },
];

const mockPayments = [
  {
    id: "payment-1",
    facilityName: "헬스플러스 피트니스",
    itemName: "3개월 정기권",
    amount: 270000,
    date: "2025-03-01",
    status: "completed",
  },
  {
    id: "payment-2",
    facilityName: "헬스플러스 피트니스",
    itemName: "개인 락커",
    amount: 30000,
    date: "2025-03-01",
    status: "completed",
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [amenityUsage, setAmenityUsage] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openLockerDialog, setOpenLockerDialog] = useState(false);
  const [selectedLocker, setSelectedLocker] = useState<any>(null);
  const [lockerNumber, setLockerNumber] = useState("");

  useEffect(() => {
    // API 호출을 시뮬레이션
    setTimeout(() => {
      setSubscriptions(mockSubscriptions);
      setAmenityUsage(mockAmenityUsage);
      setPayments(mockPayments);
      setIsLoading(false);
    }, 500);
  }, []);

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 락커 번호 변경 함수
  const handleLockerNumberChange = (amenityUsage: any) => {
    setSelectedLocker(amenityUsage);
    setLockerNumber(amenityUsage.lockerNumber || "");
    setOpenLockerDialog(true);
  };

  // 락커 번호 저장 함수
  const handleSaveLockerNumber = () => {
    if (!lockerNumber.trim()) {
      toast({
        title: "입력 오류",
        description: "락커 번호를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    // 실제로는 API 호출로 서버에 저장
    setAmenityUsage(
      amenityUsage.map((item) =>
        item.id === selectedLocker.id ? { ...item, lockerNumber } : item
      )
    );

    toast({
      title: "락커 번호 변경 완료",
      description: "락커 번호가 성공적으로 변경되었습니다.",
    });

    setOpenLockerDialog(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex items-center justify-center min-h-[60vh]">
        <div>로딩 중...</div>
      </div>
    );
  }

  const hasActiveSubscription = subscriptions.some((sub) => sub.isActive);
  const hasActiveAmenity = amenityUsage.some((usage) => usage.isActive);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">내 대시보드</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">
            <Building className="mr-2 h-4 w-4" /> 요약
          </TabsTrigger>
          <TabsTrigger value="memberships">
            <Calendar className="mr-2 h-4 w-4" /> 내 정기권
          </TabsTrigger>
          <TabsTrigger value="amenities">
            <Settings className="mr-2 h-4 w-4" /> 부대시설
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="mr-2 h-4 w-4" /> 결제 내역
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" /> 내 정보
          </TabsTrigger>
        </TabsList>

        {/* 요약 탭 */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">활성 정기권</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subscriptions.filter((sub) => sub.isActive).length}개</div>
                <p className="text-xs text-muted-foreground">총 정기권 {subscriptions.length}개</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">부대시설 이용권</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{amenityUsage.filter((usage) => usage.isActive).length}개</div>
                <p className="text-xs text-muted-foreground">총 이용권 {amenityUsage.length}개</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 결제 금액</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {payments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}원
                </div>
                <p className="text-xs text-muted-foreground">총 {payments.length}건의 결제</p>
              </CardContent>
            </Card>
          </div>

          {hasActiveSubscription || hasActiveAmenity ? (
            <div className="grid gap-4 md:grid-cols-2">
              {hasActiveSubscription && (
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>활성 정기권</CardTitle>
                    <CardDescription>현재 이용 중인 시설 회원권</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {subscriptions
                      .filter((sub) => sub.isActive)
                      .map((subscription) => (
                        <div key={subscription.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <h3 className="font-medium">{subscription.facilityName}</h3>
                            <p className="text-sm text-muted-foreground">{subscription.membershipName}</p>
                            <p className="text-xs mt-1">
                              {formatDate(subscription.startDate)} ~ {formatDate(subscription.endDate)}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                              활성
                            </div>
                            <ChevronRight className="h-4 w-4 ml-2 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}

              {hasActiveAmenity && (
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>부대시설 이용권</CardTitle>
                    <CardDescription>현재 이용 중인 부대시설</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {amenityUsage
                      .filter((usage) => usage.isActive)
                      .map((usage) => (
                        <div key={usage.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <h3 className="font-medium">{usage.facilityName}</h3>
                            <p className="text-sm text-muted-foreground">{usage.amenityName}</p>
                            {usage.amenityName.includes("락커") && (
                              <p className="text-xs font-medium mt-1">락커 번호: {usage.lockerNumber || "-"}</p>
                            )}
                          </div>
                          <div className="flex items-center">
                            {usage.amenityName.includes("락커") && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleLockerNumberChange(usage)}
                              >
                                번호 변경
                              </Button>
                            )}
                            <ChevronRight className="h-4 w-4 ml-2 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <CheckSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">시설 회원권이 없습니다</h3>
                <p className="text-muted-foreground text-center mb-4">
                  아직 시설 회원권을 구매하지 않았습니다. 시설을 이용하시려면 회원권을 구매해주세요.
                </p>
                <Button>시설 둘러보기</Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>최근 결제 내역</CardTitle>
              <CardDescription>최근 결제 기록을 확인하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {payments.slice(0, 3).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <h3 className="font-medium">{payment.facilityName}</h3>
                      <p className="text-sm text-muted-foreground">{payment.itemName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{payment.amount.toLocaleString()}원</p>
                      <p className="text-xs text-muted-foreground">{formatDate(payment.date)}</p>
                    </div>
                  </div>
                ))}

                {payments.length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    결제 내역이 없습니다.
                  </div>
                )}
              </div>
            </CardContent>
            {payments.length > 3 && (
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("payments")}>
                  모든 결제 내역 보기
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        {/* 내 정기권 탭 */}
        <TabsContent value="memberships">
          <Card>
            <CardHeader>
              <CardTitle>내 정기권 목록</CardTitle>
              <CardDescription>가입한 시설의 정기권 정보</CardDescription>
            </CardHeader>
            <CardContent>
              {subscriptions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">가입한 정기권이 없습니다.</p>
                  <Button>시설 둘러보기</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptions.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{subscription.facilityName}</h3>
                          <p className="text-muted-foreground">{subscription.membershipName}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subscription.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {subscription.isActive ? "활성" : "비활성"}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">시작일</p>
                          <p>{formatDate(subscription.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">종료일</p>
                          <p>{formatDate(subscription.endDate)}</p>
                        </div>
                      </div>

                      <div className="pt-2 text-right">
                        <span className="font-bold">
                          {subscription.price.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 부대시설 탭 */}
        <TabsContent value="amenities">
          <Card>
            <CardHeader>
              <CardTitle>이용 중인 부대시설</CardTitle>
              <CardDescription>현재 이용 중인 부대시설 정보</CardDescription>
            </CardHeader>
            <CardContent>
              {amenityUsage.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">이용 중인 부대시설이 없습니다.</p>
                  <Button>부대시설 이용하기</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {amenityUsage.map((usage) => (
                    <div
                      key={usage.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{usage.facilityName}</h3>
                          <p className="text-muted-foreground">{usage.amenityName}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            usage.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {usage.isActive ? "활성" : "비활성"}
                        </div>
                      </div>

                      {usage.amenityName.includes("락커") && (
                        <div className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">락커 번호</p>
                            <p className="text-lg">{usage.lockerNumber || "-"}</p>
                          </div>
                          {usage.isActive && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleLockerNumberChange(usage)}
                            >
                              번호 변경
                            </Button>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">시작일</p>
                          <p>{formatDate(usage.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">종료일</p>
                          <p>{usage.endDate ? formatDate(usage.endDate) : "무기한"}</p>
                        </div>
                      </div>

                      <div className="pt-2 text-right">
                        <span className="font-bold">
                          {usage.price.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 결제 내역 탭 */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>결제 내역</CardTitle>
              <CardDescription>모든 결제 기록을 확인하세요</CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">결제 내역이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <h3 className="font-medium">{payment.facilityName}</h3>
                        <p className="text-sm text-muted-foreground">{payment.itemName}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(payment.date)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === "completed" 
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {payment.status === "completed" ? "완료" : "처리 중"}
                        </div>
                        <p className="font-bold text-right">
                          {payment.amount.toLocaleString()}원
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 내 정보 탭 */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>내 정보</CardTitle>
              <CardDescription>회원 정보를 확인하고 관리하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">이름</label>
                <div className="flex items-center gap-4">
                  <Input value="홍길동" readOnly className="max-w-xs" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">전화번호</label>
                <div className="flex items-center gap-4">
                  <Input value="010-1234-5678" readOnly className="max-w-xs" />
                </div>
              </div>
              <div>
                <Button>정보 수정</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 락커 번호 변경 다이얼로그 */}
      <Dialog open={openLockerDialog} onOpenChange={setOpenLockerDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>락커 번호 변경</DialogTitle>
            <DialogDescription>
              사용할 락커 번호를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="locker-number">락커 번호</label>
              <Input
                id="locker-number"
                value={lockerNumber}
                onChange={(e) => setLockerNumber(e.target.value)}
                placeholder="예: A-123"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenLockerDialog(false)}>
              취소
            </Button>
            <Button onClick={handleSaveLockerNumber}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
