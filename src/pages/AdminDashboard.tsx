import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Facility, AdminStats, SmsCredit, User } from "@/types";
import { Building, Users, MessageSquare, CreditCard, ChevronRight, Edit, Plus, Shield, User as UserIcon } from "lucide-react";

// 목업 데이터
const mockFacilities: Facility[] = [
  {
    id: "facility-1",
    name: "헬스플러스 피트니스",
    logo: null,
    customUrl: "health-plus",
    theme: { primaryColor: "#4f46e5", secondaryColor: "#818cf8" },
    ownerId: "admin-1",
    customRegistrationFields: [
      { id: "field-1", facilityId: "facility-1", name: "생년월일", type: "date", required: true },
      { id: "field-2", facilityId: "facility-1", name: "직업", type: "text", required: false },
      { id: "field-3", facilityId: "facility-1", name: "운동 목적", type: "select", required: true, options: ["다이어트", "근력 향상", "건강 관리", "기타"] }
    ]
  },
  {
    id: "facility-2",
    name: "우먼스 요가 스튜디오",
    logo: null,
    customUrl: "womens-yoga",
    theme: { primaryColor: "#d946ef", secondaryColor: "#f0abfc" },
    ownerId: "admin-2",
    customRegistrationFields: [
      { id: "field-4", facilityId: "facility-2", name: "요가 경험", type: "select", required: true, options: ["초보자", "중급자", "상급자"] },
      { id: "field-5", facilityId: "facility-2", name: "알레르기", type: "text", required: false }
    ]
  },
  {
    id: "facility-3",
    name: "스포츠 클럽 아레나",
    logo: null,
    customUrl: "sports-arena",
    theme: { primaryColor: "#0ea5e9", secondaryColor: "#7dd3fc" },
    ownerId: "admin-3",
    customRegistrationFields: []
  }
];

const mockMembers: User[] = [
  { id: "user-1", name: "김회원", phone: "010-1234-5678", role: "member", facilityId: "facility-1" },
  { id: "user-2", name: "이회원", phone: "010-2345-6789", role: "member", facilityId: "facility-1" },
  { id: "user-3", name: "박회원", phone: "010-3456-7890", role: "member", facilityId: "facility-2" },
  { id: "user-4", name: "최회원", phone: "010-4567-8901", role: "member", facilityId: "facility-2" },
  { id: "user-5", name: "정회원", phone: "010-5678-9012", role: "member", facilityId: "facility-3" }
];

const mockFacilityManagers: User[] = [
  { id: "admin-1", name: "김관리자", phone: "010-9876-5432", role: "admin", facilityId: "facility-1" },
  { id: "admin-2", name: "이관리자", phone: "010-8765-4321", role: "admin", facilityId: "facility-2" },
  { id: "admin-3", name: "박관리자", phone: "010-7654-3210", role: "admin", facilityId: "facility-3" }
];

const mockSmsCredits: SmsCredit[] = [
  { id: "sms-1", facilityId: "facility-1", amount: 500, updatedAt: "2025-04-20" },
  { id: "sms-2", facilityId: "facility-2", amount: 200, updatedAt: "2025-04-15" },
  { id: "sms-3", facilityId: "facility-3", amount: 100, updatedAt: "2025-04-10" }
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [facilityManagers, setFacilityManagers] = useState<User[]>([]);
  const [smsCredits, setSmsCredits] = useState<SmsCredit[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalFacilities: 0,
    totalMembers: 0,
    totalRevenue: 0,
    activeMemberships: 0,
    smsCreditsUsed: 0
  });

  const [facilitySearchTerm, setFacilitySearchTerm] = useState("");
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [managerSearchTerm, setManagerSearchTerm] = useState("");
  const [showAddFacilityDialog, setShowAddFacilityDialog] = useState(false);
  const [newFacilityName, setNewFacilityName] = useState("");
  const [newFacilityUrl, setNewFacilityUrl] = useState("");

  useEffect(() => {
    // 슈퍼 어드민 체크
    if (!user || user.role !== "superadmin") {
      navigate("/login");
      return;
    }

    // 데이터 로드 (실제로는 API 호출)
    setFacilities(mockFacilities);
    setMembers(mockMembers);
    setFacilityManagers(mockFacilityManagers);
    setSmsCredits(mockSmsCredits);
    
    // 통계 계산
    setStats({
      totalFacilities: mockFacilities.length,
      totalMembers: mockMembers.length,
      totalRevenue: 12500000, // 예시 금액
      activeMemberships: 35, // 예시 값
      smsCreditsUsed: 1200 // 예시 값
    });
  }, [user, navigate]);

  const handleAddFacility = () => {
    if (!newFacilityName || !newFacilityUrl) {
      toast({
        title: "입력 오류",
        description: "시설 이름과 URL을 모두 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    // URL 유효성 검사 (영문, 숫자, 하이픈만 허용)
    if (!/^[a-z0-9-]+$/.test(newFacilityUrl)) {
      toast({
        title: "URL 형식 오류",
        description: "URL은 영문 소문자, 숫자, 하이픈(-)만 포함할 수 있습니다.",
        variant: "destructive"
      });
      return;
    }

    // 중복 URL 검사
    if (facilities.some(f => f.customUrl === newFacilityUrl)) {
      toast({
        title: "URL 중복",
        description: "이미 사용 중인 URL입니다. 다른 URL을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    const newFacility: Facility = {
      id: `facility-${Date.now()}`,
      name: newFacilityName,
      logo: null,
      customUrl: newFacilityUrl,
      theme: { primaryColor: "#4f46e5", secondaryColor: "#818cf8" },
      ownerId: "",
      customRegistrationFields: []
    };

    setFacilities([...facilities, newFacility]);
    setStats({...stats, totalFacilities: stats.totalFacilities + 1});
    setShowAddFacilityDialog(false);
    setNewFacilityName("");
    setNewFacilityUrl("");

    toast({
      title: "시설 추가 완료",
      description: `${newFacilityName} 시설이 성공적으로 추가되었습니다.`
    });
  };

  // 시설 필터링
  const filteredFacilities = facilities.filter(facility =>
    facility.name.toLowerCase().includes(facilitySearchTerm.toLowerCase()) ||
    facility.customUrl.toLowerCase().includes(facilitySearchTerm.toLowerCase())
  );

  // 회원 필터링
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
    member.phone.includes(memberSearchTerm.replace(/-/g, ""))
  );

  // 시설 관리자 필터링
  const filteredManagers = facilityManagers.filter(manager =>
    manager.name.toLowerCase().includes(managerSearchTerm.toLowerCase()) ||
    manager.phone.includes(managerSearchTerm.replace(/-/g, ""))
  );

  // 시설별 SMS 충전금액 조회
  const getFacilitySmsCredit = (facilityId: string): number => {
    const credit = smsCredits.find(c => c.facilityId === facilityId);
    return credit ? credit.amount : 0;
  };

  // 시설별 회원 수 조회
  const getFacilityMemberCount = (facilityId: string): number => {
    return members.filter(m => m.facilityId === facilityId).length;
  };

  // 시설 관리자 이름 조회
  const getFacilityManager = (ownerId: string): string => {
    const manager = facilityManagers.find(m => m.id === ownerId);
    return manager ? manager.name : "-";
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">어드민 대시보드</h1>
          <p className="text-muted-foreground">전체 시설 및 회원 관리</p>
        </div>
        <Button onClick={() => navigate("/")}>
          메인으로 돌아가기
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">
            <Shield className="mr-2 h-4 w-4" /> 요약
          </TabsTrigger>
          <TabsTrigger value="facilities">
            <Building className="mr-2 h-4 w-4" /> 시설 관리
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="mr-2 h-4 w-4" /> 회원 관리
          </TabsTrigger>
          <TabsTrigger value="managers">
            <User className="mr-2 h-4 w-4" /> 시설 관리자
          </TabsTrigger>
          <TabsTrigger value="sms">
            <MessageSquare className="mr-2 h-4 w-4" /> SMS 관리
          </TabsTrigger>
        </TabsList>

        {/* 요약 탭 */}
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 시설 수</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalFacilities}개</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 회원 수</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMembers}명</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">총 매출</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()}원</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">활성 멤버십</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeMemberships}개</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">사용된 SMS 크레딧</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.smsCreditsUsed}건</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>최근 등록된 시설</CardTitle>
              <CardDescription>최근에 등록된 시설 목록입니다</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>시설명</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>관리자</TableHead>
                    <TableHead>회원 수</TableHead>
                    <TableHead>SMS 크레딧</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facilities.slice(0, 5).map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell className="font-medium">{facility.name}</TableCell>
                      <TableCell>{facility.customUrl}</TableCell>
                      <TableCell>{getFacilityManager(facility.ownerId)}</TableCell>
                      <TableCell>{getFacilityMemberCount(facility.id)}</TableCell>
                      <TableCell>{getFacilitySmsCredit(facility.id).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/f/${facility.customUrl}`}>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setActiveTab("facilities")}>
                모든 시설 보기
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 시설 관리 탭 */}
        <TabsContent value="facilities">
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>시설 관리</CardTitle>
                <CardDescription>전체 시설 목록 및 관리</CardDescription>
              </div>
              <Button onClick={() => setShowAddFacilityDialog(true)}>
                <Plus className="mr-2 h-4 w-4" /> 시설 추가
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="시설 이름 또는 URL 검색"
                  value={facilitySearchTerm}
                  onChange={(e) => setFacilitySearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>시설명</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>관리자</TableHead>
                    <TableHead>회원 수</TableHead>
                    <TableHead>SMS 크레딧</TableHead>
                    <TableHead>커스텀 필드</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFacilities.map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell className="font-medium">{facility.name}</TableCell>
                      <TableCell>{facility.customUrl}</TableCell>
                      <TableCell>{getFacilityManager(facility.ownerId)}</TableCell>
                      <TableCell>{getFacilityMemberCount(facility.id)}</TableCell>
                      <TableCell>{getFacilitySmsCredit(facility.id).toLocaleString()}</TableCell>
                      <TableCell>{facility.customRegistrationFields?.length || 0}개</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/f/${facility.customUrl}`}>
                              미리보기
                            </Link>
                          </Button>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredFacilities.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        검색 결과가 없습니다
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 회원 관리 탭 */}
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>회원 관리</CardTitle>
              <CardDescription>전체 회원 ��록 및 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="회원 이름 또는 전화번호 검색"
                  value={memberSearchTerm}
                  onChange={(e) => setMemberSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>전화번호</TableHead>
                    <TableHead>소속 시설</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => {
                    const facility = facilities.find(f => f.id === member.facilityId);
                    return (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.phone}</TableCell>
                        <TableCell>{facility?.name || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredMembers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        검색 결과가 없습니다
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 시설 관리자 탭 */}
        <TabsContent value="managers">
          <Card>
            <CardHeader>
              <CardTitle>시설 관리자</CardTitle>
              <CardDescription>시설별 관리자 목록 및 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="관리자 이름 또는 전화번호 검색"
                  value={managerSearchTerm}
                  onChange={(e) => setManagerSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>전화번호</TableHead>
                    <TableHead>관리 시설</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredManagers.map((manager) => {
                    const facility = facilities.find(f => f.id === manager.facilityId);
                    return (
                      <TableRow key={manager.id}>
                        <TableCell className="font-medium">{manager.name}</TableCell>
                        <TableCell>{manager.phone}</TableCell>
                        <TableCell>{facility?.name || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredManagers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        검색 결과가 없습니다
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS 관리 탭 */}
        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle>SMS 크레딧 관리</CardTitle>
              <CardDescription>시설별 SMS 크레딧 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>시설명</TableHead>
                    <TableHead>잔여 크레딧</TableHead>
                    <TableHead>마지막 업데이트</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {smsCredits.map((credit) => {
                    const facility = facilities.find(f => f.id === credit.facilityId);
                    return (
                      <TableRow key={credit.id}>
                        <TableCell className="font-medium">{facility?.name || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={credit.amount > 100 ? "default" : "destructive"}>
                            {credit.amount.toLocaleString()}건
                          </Badge>
                        </TableCell>
                        <TableCell>{credit.updatedAt}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            충전하기
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 시설 추가 다이얼로그 */}
      <Dialog open={showAddFacilityDialog} onOpenChange={setShowAddFacilityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 시설 추가</DialogTitle>
            <DialogDescription>
              새로운 시설 정보를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="facility-name">시설 이름</label>
              <Input
                id="facility-name"
                placeholder="헬스장 이름"
                value={newFacilityName}
                onChange={(e) => setNewFacilityName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="facility-url">커스텀 URL (영문, 숫자, 하이픈만 허용)</label>
              <Input
                id="facility-url"
                placeholder="url-example"
                value={newFacilityUrl}
                onChange={(e) => setNewFacilityUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                해당 URL로 시설 페이지에 접근할 수 있습니다. (예: yoursite.com/f/url-example)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddFacilityDialog(false)}>취소</Button>
            <Button onClick={handleAddFacility}>추가하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
