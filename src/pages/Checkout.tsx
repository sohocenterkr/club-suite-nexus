
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

// Mock data
const mockMemberships = [
  {
    id: "membership-1",
    facilityId: "facility-1",
    facilityName: "헬스플러스 피트니스",
    name: "1개월 정기권",
    price: 100000,
    durationInMonths: 1,
    description: "한 달 동안 무제한 이용 가능한 정기권",
  },
  {
    id: "membership-2",
    facilityId: "facility-1",
    facilityName: "헬스플러스 피트니스",
    name: "3개월 정기권",
    price: 270000,
    durationInMonths: 3,
    description: "3개월 동안 무제한 이용 가능한 정기권 (10% 할인)",
  },
];

const mockAmenities = [
  {
    id: "amenity-1",
    facilityId: "facility-1",
    facilityName: "헬스플러스 피트니스",
    name: "개인 락커",
    price: 30000,
    type: "locker",
    description: "개인 물품을 보관할 수 있는 락커 (월 이용권)",
  },
  {
    id: "amenity-2",
    facilityId: "facility-1",
    facilityName: "헬스플러스 피트니스",
    name: "개인 PT 1회",
    price: 50000,
    type: "other",
    description: "전문 트레이너의 1:1 퍼스널 트레이닝 1회권",
  },
];

const Checkout = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "transfer">("card");
  const [lockerNumber, setLockerNumber] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // 실제 구현에서는 API 호출로 상품 정보를 가져옵니다
    setTimeout(() => {
      if (type === "membership") {
        const membership = mockMemberships.find((m) => m.id === id);
        if (membership) {
          setProduct({
            ...membership,
            type: "membership",
          });
        }
      } else if (type === "amenity") {
        const amenity = mockAmenities.find((a) => a.id === id);
        if (amenity) {
          setProduct({
            ...amenity,
            type: "amenity",
          });
        }
      }
      setLoading(false);
    }, 500);
  }, [type, id]);

  const handleProcessPayment = async () => {
    if (product?.type === "amenity" && product.type === "locker" && !lockerNumber.trim()) {
      toast({
        title: "입력 오류",
        description: "락커 번호를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // 실제 구현에서는 결제 API 연동
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "결제 완료",
        description: "성공적으로 결제되었습니다.",
      });
      
      // 결제 후 대시보드로 이동
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "결제 실패",
        description: "결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <div>로딩 중...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-16 flex justify-center flex-col items-center">
        <div className="mb-4">요청하신 상품을 찾을 수 없습니다.</div>
        <Button onClick={() => navigate(-1)}>돌아가기</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">결제하기</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>상품 정보</CardTitle>
                <CardDescription>{product.facilityName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">{product.name}</h3>
                    <p className="text-muted-foreground">{product.description}</p>
                  </div>
                  
                  {product.type === "membership" && (
                    <div>
                      <span className="font-medium">이용 기간: </span>
                      <span>{product.durationInMonths}개월</span>
                    </div>
                  )}
                  
                  {product.type === "amenity" && product.type === "locker" && (
                    <div className="space-y-2">
                      <Label htmlFor="locker-number">락커 번호</Label>
                      <Input
                        id="locker-number"
                        value={lockerNumber}
                        onChange={(e) => setLockerNumber(e.target.value)}
                        placeholder="사용할 락커 번호를 입력해주세요"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>결제 방법</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("card")}
                    className="flex-1"
                  >
                    카드 결제
                  </Button>
                  <Button
                    variant={paymentMethod === "transfer" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("transfer")}
                    className="flex-1"
                  >
                    계좌 이체
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>결제 금액</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>상품 금액</span>
                    <span>{product.price.toLocaleString()}원</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>총 결제 금액</span>
                    <span>{product.price.toLocaleString()}원</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  disabled={isProcessing}
                  onClick={handleProcessPayment}
                >
                  {isProcessing ? "처리 중..." : "결제하기"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
