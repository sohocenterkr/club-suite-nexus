import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Edit, Trash2, Plus, Key, Droplet, Users, Package } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const typeIcons: Record<string, React.ReactNode> = {
  locker: <Key className="h-5 w-5" />,
  shower: <Droplet className="h-5 w-5" />,
  meeting_room: <Users className="h-5 w-5" />,
  other: <Package className="h-5 w-5" />,
};

const typeOptions = [
  { value: "locker", label: "락커" },
  { value: "shower", label: "샤워실" },
  { value: "meeting_room", label: "회의실" },
  { value: "other", label: "기타" },
];

const mockAmenities = [
  {
    id: "1",
    facilityId: "facility-1",
    name: "개인 락커",
    price: 30000,
    description: "회원 개인 물품 보관용 락커입니다. (월 기준)",
    type: "locker",
  },
  {
    id: "2", 
    facilityId: "facility-1",
    name: "VIP 샤워실",
    price: 5000,
    description: "일반 샤워실보다 넓고 쾌적한 VIP 샤워실입니다. (1회 사용권)",
    type: "shower",
  },
  {
    id: "3",
    facilityId: "facility-1",
    name: "소규모 회의실",
    price: 10000,
    description: "4인까지 사용 가능한 소규모 회의실입니다. (1시간)",
    type: "meeting_room",
  },
  {
    id: "4",
    facilityId: "facility-1", 
    name: "운동복 대여",
    price: 3000,
    description: "깨끗하게 세탁된 운동복을 대여해 드립니다. (1회)",
    type: "other",
  }
];

const AmenityManagement = () => {
  const [amenities, setAmenities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    type: "other",
  });
  const [formErrors, setFormErrors] = useState({
    name: false,
    price: false,
    type: false,
  });

  useEffect(() => {
    setTimeout(() => {
      setAmenities(mockAmenities);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    if (field in formErrors && formErrors[field as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [field]: false,
      });
    }
  };

  const handleAdd = () => {
    setSelectedAmenity(null);
    setFormData({
      name: "",
      price: "",
      description: "",
      type: "other",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (amenity: any) => {
    setSelectedAmenity(amenity);
    setFormData({
      name: amenity.name,
      price: amenity.price.toString(),
      description: amenity.description || "",
      type: amenity.type,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (amenity: any) => {
    setSelectedAmenity(amenity);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = () => {
    const errors = {
      name: !formData.name.trim(),
      price: !formData.price.trim() || isNaN(Number(formData.price)) || Number(formData.price) < 0,
      type: !formData.type,
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const updatedAmenity = {
      id: selectedAmenity?.id || `new-${Date.now()}`,
      facilityId: "facility-1",
      name: formData.name,
      price: Number(formData.price),
      description: formData.description,
      type: formData.type,
    };

    if (selectedAmenity) {
      setAmenities(amenities.map(item => 
        item.id === selectedAmenity.id ? updatedAmenity : item
      ));
      toast({
        title: "부대시설 수정 완료",
        description: `'${formData.name}' 부대시설이 수정되었습니다.`,
      });
    } else {
      setAmenities([...amenities, updatedAmenity]);
      toast({
        title: "부대시설 추가 완료",
        description: `'${formData.name}' 부대시설이 추가되었습니다.`,
      });
    }

    setIsDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedAmenity) {
      setAmenities(amenities.filter(item => item.id !== selectedAmenity.id));
      toast({
        title: "부대시설 삭제 완료",
        description: `'${selectedAmenity.name}' 부대시설이 삭제되었습니다.`,
      });
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">부대시설 관리</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> 부대시설 추가
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">로딩 중...</div>
      ) : amenities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">등록된 부대시설이 없습니다.</p>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" /> 부대시설 추가
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map(amenity => (
            <Card key={amenity.id} className="h-full overflow-hidden">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">{amenity.name}</CardTitle>
                  <CardDescription>{typeOptions.find(t => t.value === amenity.type)?.label}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>관리</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEdit(amenity)}>
                      <Edit className="mr-2 h-4 w-4" /> 수정
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600" 
                      onClick={() => handleDelete(amenity)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> 삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-lg mb-3">
                    {typeIcons[amenity.type] || typeIcons.other}
                  </div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-2xl font-bold">{amenity.price.toLocaleString()}원</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{amenity.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedAmenity ? '부대시설 수정' : '부대시설 추가'}</DialogTitle>
            <DialogDescription>
              부대시설의 정보를 입력해주세요. 모든 회원들에게 표시됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">이름을 입력해주세요.</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">가격 (원) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className={formErrors.price ? "border-red-500" : ""}
              />
              {formErrors.price && (
                <p className="text-sm text-red-500">유효한 가격을 입력해주세요.</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">유형 *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>부대시설 유형</SelectLabel>
                    {typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formErrors.type && (
                <p className="text-sm text-red-500">유형을 선택해주세요.</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="부가 설명을 입력하세요."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSave}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>부대시설 삭제</DialogTitle>
            <DialogDescription>
              정말 이 부대시설을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AmenityManagement;
