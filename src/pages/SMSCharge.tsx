
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const SMSCharge = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const plans = [
    { id: "plan-1", credits: 50, price: 5000, description: "소량 발송에 적합" },
    { id: "plan-2", credits: 100, price: 9000, description: "10% 할인된 가격" },
    { id: "plan-3", credits: 300, price: 24000, description: "20% 할인된 가격" },
    { id: "plan-4", credits: 500, price: 35000, description: "30% 할인된 가격" },
    { id: "plan-5", credits: 1000, price: 60000, description: "40% 할인된 가격" },
  ];

  const handleCharge = async () => {
    if (!selectedPlan) {
      toast({
        title: "요금제 선택 필요",
        description: "충전할 요금제를 선택해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 실제 구현 시 결제 API 연동
      await new Promise(resolve => setTimeout(resolve, 1500)); // 임시 딜레이
      
      const plan = plans.find(p => p.id === selectedPlan);
      
      toast({
        title: "충전 완료",
        description: `${plan?.credits}건의 SMS 크레딧이 성공적으로 충전되었습니다.`
      });
      
      navigate("/settings/sms");
    } catch (error) {
      console.error("충전 실패:", error);
      toast({
        title: "충전 실패",
        description: "결제 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">SMS 크레딧 충전</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>충전 요금제 선택</CardTitle>
            <CardDescription>
              필요한 SMS 크레딧 양에 따라 적절한 요금제를 선택하세요.
              대량 구매 시 할인이 적용됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedPlan || ""} onValueChange={setSelectedPlan}>
              <div className="grid gap-4">
                {plans.map(plan => (
                  <div key={plan.id} className="flex items-center">
                    <RadioGroupItem value={plan.id} id={plan.id} />
                    <Label htmlFor={plan.id} className="ml-2 flex flex-1 justify-between items-center">
                      <div>
                        <span className="font-medium">{plan.credits}건</span>
                        <span className="text-muted-foreground ml-2 text-sm">
                          ({plan.description})
                        </span>
                      </div>
                      <span className="text-base font-medium">
                        {plan.price.toLocaleString()}원
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            
            <div className="mt-6 p-4 bg-muted rounded-md">
              <h3 className="font-medium mb-2">SMS 크레딧 안내</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 충전된 SMS 크레딧은 만료 기간이 없습니다.</li>
                <li>• 각 SMS 발송 시 1건의 크레딧이 차감됩니다.</li>
                <li>• 대량 구매 시 최대 40%까지 할인이 적용됩니다.</li>
                <li>• 결제 완료 즉시 크레딧이 충전됩니다.</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            {selectedPlan && (
              <div className="w-full text-center mb-2">
                <span className="text-sm text-muted-foreground">
                  선택: {plans.find(p => p.id === selectedPlan)?.credits}건 / 
                  {plans.find(p => p.id === selectedPlan)?.price.toLocaleString()}원
                </span>
              </div>
            )}
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/settings/sms")}
              >
                취소
              </Button>
              <Button
                className="flex-1"
                onClick={handleCharge}
                disabled={!selectedPlan || isLoading}
              >
                {isLoading ? "처리 중..." : "결제하기"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default SMSCharge;
