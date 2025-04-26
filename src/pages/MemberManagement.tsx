
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Search, User, Send } from "lucide-react";

// 목업 회원 데이터
const mockMembers = [
  { 
    id: "member-1", 
    name: "김회원", 
    phone: "010-1234-5678", 
    joinedAt: "2023-04-15", 
    membershipName: "3개월 정기권", 
    endDate: "2023-07-15",
    visits: 24
  },
  { 
    id: "member-2", 
    name: "이용자", 
    phone: "010-2345-6789", 
    joinedAt: "2023-05-10", 
    membershipName: "6개월 정기권", 
    endDate: "2023-11-10",
    visits: 18
  },
  { 
    id: "member-3", 
    name: "박고객", 
    phone: "010-3456-7890", 
    joinedAt: "2023-06-05", 
    membershipName: "1개월 정기권", 
    endDate: "2023-07-05",
    visits: 8
  },
];

const MemberManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제 구현 시 API에서 회원 데이터 가져오기
    const fetchMembers = () => {
      try {
        // 임시로 목업 데이터 사용
        setMembers(mockMembers);
      } catch (error) {
        console.error("Failed to fetch members:", error);
        toast({
          title: "회원 데이터 로드 실패",
          description: "회원 정보를 가져오는데 실패했습니다.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member => 
    member.name.includes(searchTerm) || 
    member.phone.includes(searchTerm.replace(/-/g, ""))
  );

  const handleSendSMS = (member: any) => {
    // 문자 발송 페이지로 이동
    navigate(`/settings/sms/${member.id}`);
  };

  return (
    <AdminLayout activeTab="members">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">회원 관리</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>회원 검색</CardTitle>
            <CardDescription>이름이나 전화번호로 회원을 검색할 수 있습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="이름 또는 전화번호 검색"
                  className="pl-10"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">검색</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>회원 목록</CardTitle>
            <CardDescription>총 {filteredMembers.length}명의 회원이 있습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">회원 정보를 불러오는 중...</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이름</TableHead>
                      <TableHead>전화번호</TableHead>
                      <TableHead className="hidden md:table-cell">가입일</TableHead>
                      <TableHead className="hidden md:table-cell">정기권</TableHead>
                      <TableHead className="hidden md:table-cell">종료일</TableHead>
                      <TableHead className="hidden md:table-cell">방문횟수</TableHead>
                      <TableHead className="text-right">액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map(member => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>{member.phone}</TableCell>
                          <TableCell className="hidden md:table-cell">{member.joinedAt}</TableCell>
                          <TableCell className="hidden md:table-cell">{member.membershipName}</TableCell>
                          <TableCell className="hidden md:table-cell">{member.endDate}</TableCell>
                          <TableCell className="hidden md:table-cell">{member.visits}회</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleSendSMS(member)}
                            >
                              <Send className="h-4 w-4" />
                              <span className="sr-only">문자 보내기</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          검색 결과가 없습니다.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default MemberManagement;
