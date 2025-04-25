
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/AdminLayout";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface MembershipPlan {
  id: string;
  name: string;
  durationInMonths: number;
  price: number;
  description?: string;
}

const MembershipManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 임시 데이터
  const [memberships, setMemberships] = useState<MembershipPlan[]>([
    {
      id: "1",
      name: "1개월 정기권",
      durationInMonths: 1,
      price: 100000,
      description: "한 달 동안 무제한 이용 가능한 정기권입니다."
    },
    {
      id: "2",
      name: "3개월 정기권",
      durationInMonths: 3,
      price: 270000,
      description: "3개월 동안 무제한 이용 가능한 정기권입니다. 10% 할인된 가격으로 제공됩니다."
    },
    {
      id: "3",
      name: "6개월 정기권",
      durationInMonths: 6,
      price: 510000,
      description: "6개월 동안 무제한 이용 가능한 정기권입니다. 15% 할인된 가격으로 제공됩니다."
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState<MembershipPlan | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  // 새 정기권 폼 상태
  const [formData, setFormData] = useState({
    name: "",
    durationInMonths: 1,
    price: 0,
    description: ""
  });

  // 만약 시설 관리자가 아니라면 대시보드로 리디렉션
  if (user?.role !== "admin") {
    navigate("/dashboard");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "durationInMonths" || name === "price") {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddClick = () => {
    setEditMode(false);
    setFormData({
      name: "",
      durationInMonths: 1,
      price: 0,
      description: ""
    });
    setIsDialogOpen(true);
  };

  const handleEditClick = (membership: MembershipPlan) => {
    setEditMode(true);
    setSelectedMembership(membership);
    setFormData({
      name: membership.name,
      durationInMonths: membership.durationInMonths,
      price: membership.price,
      description: membership.description || ""
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (membership: MembershipPlan) => {
    setSelectedMembership(membership);
    setIsDeleteDialogOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.durationInMonths <= 0 || formData.price <= 0) {
      toast({
        title: "입력 오류",
        description: "모든 필수 항목을 올바르게 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 실제 구현에서는 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (editMode && selectedMembership) {
        // 정기권 수정
        setMemberships(prev => 
          prev.map(item => 
            item.id === selectedMembership.id 
              ? { ...item, ...formData } 
              : item
          )
        );
        toast({
          title: "정기권 수정 완료",
          description: "정기권 정보가 성공적으로 수정되었습니다."
        });
      } else {
        // 새 정기권 추가
        const newMembership: MembershipPlan = {
          id: `${Date.now()}`,
          ...formData
        };
        setMemberships(prev => [...prev, newMembership]);
        toast({
          title: "정기권 추가 완료",
          description: "새로운 정기권이 추가되었습니다."
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "처리 실패",
        description: editMode ? "정기권 수정 중 오류가 발생했습니다." : "정기권 추가 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMembership) return;
    
    try {
      setIsLoading(true);
      
      // 실제 구현에서는 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMemberships(prev => prev.filter(item => item.id !== selectedMembership.id));
      toast({
        title: "정기권 삭제 완료",
        description: "정기권이 성공적으로 삭제되었습니다."
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: "정기권 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout activeTab="memberships">
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">정기권 관리</h1>
          <Button onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            정기권 추가
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberships.map(membership => (
            <Card key={membership.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle>{membership.name}</CardTitle>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditClick(membership)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive" 
                      onClick={() => handleDeleteClick(membership)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  기간: {membership.durationInMonths}개월
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold">
                      {formatPrice(membership.price)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      월 {formatPrice(membership.price / membership.durationInMonths)}
                    </p>
                  </div>
                  {membership.description && (
                    <p className="text-sm text-muted-foreground">
                      {membership.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* 정기권 추가/수정 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editMode ? "정기권 수정" : "새 정기권 추가"}
            </DialogTitle>
            <DialogDescription>
              {editMode ? "정기권 정보를 수정합니다." : "새로운 정기권을 추가합니다."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                정기권 이름
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="예: 1개월 정기권"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="durationInMonths" className="text-sm font-medium">
                  기간 (개월)
                </label>
                <Input
                  id="durationInMonths"
                  name="durationInMonths"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.durationInMonths}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  가격 (원)
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                설명 (선택사항)
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="정기권에 대한 추가 설명"
                rows={3}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "처리 중..." : editMode ? "수정하기" : "추가하기"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>정기권 삭제</DialogTitle>
            <DialogDescription>
              정말로 '{selectedMembership?.name}' 정기권을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default MembershipManagement;
