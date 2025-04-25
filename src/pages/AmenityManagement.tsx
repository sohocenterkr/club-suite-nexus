
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Key, Shower, Home, MoreHorizontal } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Amenity {
  id: string;
  name: string;
  type: 'locker' | 'shower' | 'meeting_room' | 'other';
  price: number;
  description?: string;
  hasLockerNumber?: boolean;
}

const AmenityManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 임시 데이터
  const [amenities, setAmenities] = useState<Amenity[]>([
    {
      id: "1",
      name: "락커 이용권",
      type: "locker",
      price: 30000,
      description: "개인 락커 한 달 이용권입니다.",
      hasLockerNumber: true
    },
    {
      id: "2",
      name: "샤워실 이용권",
      type: "shower",
      price: 5000,
      description: "헬스장 회원이 아닌 분들을 위한 일일 샤워실 이용권입니다.",
    },
    {
      id: "3",
      name: "미팅룸 1시간",
      type: "meeting_room",
      price: 15000,
      description: "최대 6인까지 이용 가능한 미팅룸 1시간 이용권입니다.",
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  // 새 부대시설 폼 상태
  const [formData, setFormData] = useState<Omit<Amenity, 'id'>>({
    name: "",
    type: "other",
    price: 0,
    description: "",
    hasLockerNumber: false
  });

  // 만약 시설 관리자가 아니라면 대시보드로 리디렉션
  if (user?.role !== "admin") {
    navigate("/dashboard");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "price") {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else if (name === "hasLockerNumber") {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTypeChange = (value: 'locker' | 'shower' | 'meeting_room' | 'other') => {
    setFormData(prev => ({ 
      ...prev, 
      type: value,
      hasLockerNumber: value === 'locker' ? true : false
    }));
  };

  const handleAddClick = () => {
    setEditMode(false);
    setFormData({
      name: "",
      type: "other",
      price: 0,
      description: "",
      hasLockerNumber: false
    });
    setIsDialogOpen(true);
  };

  const handleEditClick = (amenity: Amenity) => {
    setEditMode(true);
    setSelectedAmenity(amenity);
    setFormData({
      name: amenity.name,
      type: amenity.type,
      price: amenity.price,
      description: amenity.description || "",
      hasLockerNumber: amenity.hasLockerNumber || false
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    setIsDeleteDialogOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'locker':
        return <Key className="h-5 w-5" />;
      case 'shower':
        return <Shower className="h-5 w-5" />;
      case 'meeting_room':
        return <Home className="h-5 w-5" />;
      default:
        return <MoreHorizontal className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'locker':
        return '락커';
      case 'shower':
        return '샤워실';
      case 'meeting_room':
        return '미팅룸';
      default:
        return '기타';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.price < 0) {
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
      
      if (editMode && selectedAmenity) {
        // 부대시설 수정
        setAmenities(prev => 
          prev.map(item => 
            item.id === selectedAmenity.id 
              ? { ...item, ...formData } 
              : item
          )
        );
        toast({
          title: "부대시설 수정 완료",
          description: "부대시설 정보가 성공적으로 수정되었습니다."
        });
      } else {
        // 새 부대시설 추가
        const newAmenity: Amenity = {
          id: `${Date.now()}`,
          ...formData
        };
        setAmenities(prev => [...prev, newAmenity]);
        toast({
          title: "부대시설 추가 완료",
          description: "새로운 부대시설이 추가되었습니다."
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "처리 실패",
        description: editMode ? "부대시설 수정 중 오류가 발생했습니다." : "부대시설 추가 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAmenity) return;
    
    try {
      setIsLoading(true);
      
      // 실제 구현에서는 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAmenities(prev => prev.filter(item => item.id !== selectedAmenity.id));
      toast({
        title: "부대시설 삭제 완료",
        description: "부대시설이 성공적으로 삭제되었습니다."
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: "부대시설 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout activeTab="amenities">
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">부대시설 관리</h1>
          <Button onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            부대시설 추가
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map(amenity => (
            <Card key={amenity.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {getTypeIcon(amenity.type)}
                    </div>
                    {amenity.name}
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditClick(amenity)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive" 
                      onClick={() => handleDeleteClick(amenity)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {getTypeLabel(amenity.type)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold">
                      {formatPrice(amenity.price)}
                    </p>
                  </div>
                  {amenity.description && (
                    <p className="text-sm text-muted-foreground">
                      {amenity.description}
                    </p>
                  )}
                  {amenity.hasLockerNumber && (
                    <div className="bg-primary/5 p-2 rounded-md text-sm">
                      <p className="font-medium">락커 번호 입력 필요</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* 부대시설 추가/수정 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editMode ? "부대시설 수정" : "새 부대시설 추가"}
            </DialogTitle>
            <DialogDescription>
              {editMode ? "부대시설 정보를 수정합니다." : "새로운 부대시설을 추가합니다."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                부대시설 이름
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="예: 락커 이용권"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                유형
              </label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => handleTypeChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="locker">락커</SelectItem>
                  <SelectItem value="shower">샤워실</SelectItem>
                  <SelectItem value="meeting_room">미팅룸</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
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

            {formData.type === 'locker' && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasLockerNumber"
                  name="hasLockerNumber"
                  checked={formData.hasLockerNumber}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="hasLockerNumber" className="text-sm font-medium">
                  락커 번호 입력 필요
                </label>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                설명 (선택사항)
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="부대시설에 대한 추가 설명"
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
            <DialogTitle>부대시설 삭제</DialogTitle>
            <DialogDescription>
              정말로 '{selectedAmenity?.name}' 부대시설을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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

export default AmenityManagement;
