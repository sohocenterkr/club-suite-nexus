
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, addDays, isBefore, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";

// 임시 데이터
const mockMemberships = [
  {
    id: "membership-1",
    userId: "user-1",
    name: "홍길동",
    phone: "010-1234-5678",
    facilityId: "facility-1",
    facilityName: "헬스플러스 피트니스",
    membershipName: "3개월 정기권",
    startDate: "2025-03-01",
    endDate: "2025-06-01",
    isActive: true,
  },
  {
    id: "membership-2",
    userId: "user-2",
    name: "김철수",
    phone: "010-5678-1234",
    facilityId: "facility-1",
    facilityName: "헬스플러스 피트니스",
    membershipName: "1개월 정기권",
    startDate: "2025-04-15",
    endDate: "2025-04-29", // 일주일 이내로 만료
    isActive: true,
  }
];

const CheckIn = () => {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length < 4) {
      toast({
        title: "입력 오류",
        description: "전화번호 뒷자리를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 실제 구현에서는 API 호출로 대체
      setTimeout(() => {
        // 전화번호 뒷자리로 회원 찾기
        const membership = mockMemberships.find(m => m.phone.endsWith(phone));
        
        if (membership) {
          setSelectedMembership(membership);
          setDialogOpen(true);
        } else {
          toast({
            title: "회원 정보 없음",
            description: "입력하신 전화번호로 등록된 회원 정보가 없습니다.",
            variant: "destructive"
          });
        }
        
        setIsLoading(false);
      }, 500);
    } catch (error) {
      toast({
        title: "조회 실패",
        description: "회원 정보를 조회하는 중 오류가 발생했습니다.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const isExpirationClose = (endDate: string) => {
    const today = new Date();
    const expirationDate = new Date(endDate);
    const daysRemaining = differenceInDays(expirationDate, today);
    return daysRemaining <= 7 && daysRemaining >= 0;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "yyyy년 M월 d일 (eee)", { locale: ko });
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">회원 입장 확인</CardTitle>
            <CardDescription>
              전화번호 뒷자리 4자리를 입력하여 회원 정보를 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium">
                  전화번호 뒷자리 4자리
                </label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                  placeholder="0000"
                  maxLength={4}
                  required
                  className="text-center text-2xl tracking-widest"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "확인 중..." : "입장 확인"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground text-center w-full">
              회원 정보가 표시되지 않으시면 데스크에 문의해주세요.
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* 회원 정보 대화상자 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">회원 정보</DialogTitle>
            <DialogDescription>
              {selectedMembership?.facilityName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="font-medium">{selectedMembership?.name} 회원님</p>
                <p className="text-sm text-muted-foreground">{selectedMembership?.phone}</p>
              </div>
              <div className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs font-semibold">
                유효 회원
              </div>
            </div>
            
            <Card>
              <CardHeader className="p-4 pb-2">
                <p className="font-medium">{selectedMembership?.membershipName}</p>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">사용기간</span>
                  <span className="text-sm">
                    {selectedMembership && `${formatDate(selectedMembership.startDate)} ~ ${formatDate(selectedMembership.endDate)}`}
                  </span>
                </div>
                
                {selectedMembership && isExpirationClose(selectedMembership.endDate) && (
                  <div className="mt-4 bg-orange-100 text-orange-800 rounded-lg p-3 text-sm">
                    <p className="font-medium">
                      정기권이 {differenceInDays(new Date(selectedMembership.endDate), new Date())}일 후 만료됩니다.
                    </p>
                    <p className="mt-1">
                      연장을 원하시면 아래 버튼을 눌러주세요.
                    </p>
                    <Button className="w-full mt-2 bg-orange-500 hover:bg-orange-600">
                      정기권 연장하기
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Button className="w-full" onClick={() => setDialogOpen(false)}>
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckIn;
