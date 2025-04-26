
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { CustomField, Facility } from "@/types";
import { Edit, Plus, Save, Trash, AlertCircle } from "lucide-react";

// Select 옵션 필드 컴포넌트
const OptionsField = ({ options, setOptions }: { options: string[], setOptions: React.Dispatch<React.SetStateAction<string[]>> }) => {
  const [newOption, setNewOption] = useState<string>("");

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    setOptions([...options, newOption.trim()]);
    setNewOption("");
  };

  const handleDeleteOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">선택 옵션</p>
      <div className="flex gap-2">
        <Input 
          placeholder="새 옵션 추가" 
          value={newOption} 
          onChange={(e) => setNewOption(e.target.value)}
        />
        <Button type="button" onClick={handleAddOption}>추가</Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center bg-muted px-3 py-1 rounded-md">
            <span>{option}</span>
            <button onClick={() => handleDeleteOption(index)} className="ml-2 text-destructive">
              <Trash className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomFieldsManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // 시설 정보
  const [facility, setFacility] = useState<Facility | null>(null);
  
  // 커스텀 필드 목록
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  
  // 다이얼로그 상태
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // 폼 상태
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState<"text" | "number" | "date" | "select">("text");
  const [fieldRequired, setFieldRequired] = useState(false);
  const [fieldOptions, setFieldOptions] = useState<string[]>([]);
  const [currentField, setCurrentField] = useState<CustomField | null>(null);

  // 예제 데이터 로드
  useEffect(() => {
    // 실제로는 API에서 시설 정보와 커스텀 필드를 가져옴
    if (user?.facilityId) {
      // 목업 데이터
      const mockFacility: Facility = {
        id: "facility-1",
        name: "헬스플러스 피트니스",
        logo: null,
        customUrl: "health-plus",
        theme: { primaryColor: "#4f46e5", secondaryColor: "#818cf8" },
        ownerId: user.id,
        customRegistrationFields: [
          { id: "field-1", facilityId: "facility-1", name: "생년월일", type: "date", required: true },
          { id: "field-2", facilityId: "facility-1", name: "직업", type: "text", required: false },
          { id: "field-3", facilityId: "facility-1", name: "운동 목적", type: "select", required: true, options: ["다이어트", "근력 향상", "건강 관리", "기타"] }
        ]
      };
      
      setFacility(mockFacility);
      setCustomFields(mockFacility.customRegistrationFields || []);
    } else {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // 필드 추가 핸들러
  const handleAddField = () => {
    if (!fieldName.trim()) {
      toast({
        title: "필드 이름 오류",
        description: "필드 이름을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    if (fieldType === "select" && fieldOptions.length === 0) {
      toast({
        title: "옵션 오류",
        description: "선택 타입의 필드는 최소 하나 이상의 옵션이 필요합니다.",
        variant: "destructive"
      });
      return;
    }

    const newField: CustomField = {
      id: `field-${Date.now()}`,
      facilityId: user?.facilityId || "",
      name: fieldName.trim(),
      type: fieldType,
      required: fieldRequired,
      options: fieldType === "select" ? fieldOptions : undefined
    };

    setCustomFields([...customFields, newField]);
    resetForm();
    setShowAddDialog(false);
    
    toast({
      title: "필드 추가 완료",
      description: "회원가입 양식에 새로운 필드가 추가되었습니다."
    });
  };

  // 필드 수정 핸들러
  const handleEditField = () => {
    if (!currentField) return;
    
    if (!fieldName.trim()) {
      toast({
        title: "필드 이름 오류",
        description: "필드 이름을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    if (fieldType === "select" && fieldOptions.length === 0) {
      toast({
        title: "옵션 오류",
        description: "선택 타입의 필드는 최소 하나 이상의 옵션이 필요합니다.",
        variant: "destructive"
      });
      return;
    }

    const updatedField: CustomField = {
      ...currentField,
      name: fieldName.trim(),
      type: fieldType,
      required: fieldRequired,
      options: fieldType === "select" ? fieldOptions : undefined
    };

    const updatedFields = customFields.map(field => 
      field.id === currentField.id ? updatedField : field
    );

    setCustomFields(updatedFields);
    resetForm();
    setShowEditDialog(false);
    
    toast({
      title: "필드 수정 완료",
      description: "회원가입 양식의 필드가 수정되었습니다."
    });
  };

  // 필드 삭제 핸들러
  const handleDeleteField = () => {
    if (!currentField) return;
    
    const updatedFields = customFields.filter(field => field.id !== currentField.id);
    setCustomFields(updatedFields);
    setCurrentField(null);
    setShowDeleteDialog(false);
    
    toast({
      title: "필드 삭제 완료",
      description: "회원가입 양식에서 필드가 삭제되었습니다."
    });
  };

  // 수정 모드 시작
  const startEditMode = (field: CustomField) => {
    setCurrentField(field);
    setFieldName(field.name);
    setFieldType(field.type);
    setFieldRequired(field.required);
    setFieldOptions(field.options || []);
    setShowEditDialog(true);
  };

  // 삭제 모드 시작
  const startDeleteMode = (field: CustomField) => {
    setCurrentField(field);
    setShowDeleteDialog(true);
  };

  // 폼 초기화
  const resetForm = () => {
    setFieldName("");
    setFieldType("text");
    setFieldRequired(false);
    setFieldOptions([]);
    setCurrentField(null);
  };

  // 변경사항 저장
  const saveChanges = () => {
    // 실제로는 API 호출로 서버에 저장
    // 여기서는 로컬 스토리지에 저장
    if (facility) {
      const updatedFacility = {
        ...facility,
        customRegistrationFields: customFields
      };
      
      localStorage.setItem(`facility_${facility.id}`, JSON.stringify(updatedFacility));
      
      toast({
        title: "설정 저장 완료",
        description: "회원가입 양식 설정이 저장되었습니다."
      });
    }
  };

  return (
    <AdminLayout activeTab="members">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">회원가입 양식 관리</h1>
          <div className="flex gap-2">
            <Button onClick={saveChanges}>
              <Save className="mr-2 h-4 w-4" />
              저장하기
            </Button>
            <Button variant="outline" onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              필드 추가
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="fields" className="space-y-4">
          <TabsList>
            <TabsTrigger value="fields">필드 관리</TabsTrigger>
            <TabsTrigger value="preview">미리보기</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fields">
            <Card>
              <CardHeader>
                <CardTitle>커스텀 필드 관리</CardTitle>
                <CardDescription>
                  회원가입 시 수집할 정보 필드를 추가, 수정, 삭제할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {customFields.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>필드명</TableHead>
                        <TableHead>타입</TableHead>
                        <TableHead>필수 여부</TableHead>
                        <TableHead>옵션</TableHead>
                        <TableHead className="text-right">관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customFields.map((field) => (
                        <TableRow key={field.id}>
                          <TableCell className="font-medium">{field.name}</TableCell>
                          <TableCell>
                            {field.type === "text" && "텍스트"}
                            {field.type === "number" && "숫자"}
                            {field.type === "date" && "날짜"}
                            {field.type === "select" && "선택"}
                          </TableCell>
                          <TableCell>{field.required ? "필수" : "선택"}</TableCell>
                          <TableCell>
                            {field.options && field.options.length > 0 ? (
                              <div className="flex gap-1 flex-wrap">
                                {field.options.map((option, index) => (
                                  <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                                    {option}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => startEditMode(field)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => startDeleteMode(field)}
                                className="text-destructive"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center p-4">
                    <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-semibold">커스텀 필드 없음</h3>
                    <p className="text-muted-foreground">
                      아직 등록된 커스텀 필드가 없습니다. 오른쪽 위 '필드 추가' 버튼을 클릭하여 
                      회원가입 시 수집할 정보를 추가해보세요.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>회원가입 양식 미리보기</CardTitle>
                <CardDescription>
                  회원들이 보게 될 회원가입 양식입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">이름 *</label>
                  <Input placeholder="이름을 입력하세요" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">전화번호 *</label>
                  <Input placeholder="010-0000-0000" />
                </div>
                
                {customFields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="text-sm font-medium">
                      {field.name} {field.required && "*"}
                    </label>
                    
                    {field.type === "text" && (
                      <Input placeholder={`${field.name}을(를) 입력하세요`} />
                    )}
                    
                    {field.type === "number" && (
                      <Input type="number" placeholder={`${field.name}을(를) 입력하세요`} />
                    )}
                    
                    {field.type === "date" && (
                      <Input type="date" />
                    )}
                    
                    {field.type === "select" && (
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={`${field.name}을(를) 선택하세요`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option, index) => (
                            <SelectItem key={index} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
                
                <Button className="w-full mt-4">가입하기</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 필드 추가 다이얼로그 */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>필드 추가</DialogTitle>
              <DialogDescription>
                회원가입 시 수집할 새로운 필드를 추가합니다.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="field-name" className="text-sm font-medium">필드 이름</label>
                <Input
                  id="field-name"
                  placeholder="예: 생년월일, 직업, 운동 목적 등"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="field-type" className="text-sm font-medium">필드 타입</label>
                <Select value={fieldType} onValueChange={(value) => setFieldType(value as any)}>
                  <SelectTrigger id="field-type">
                    <SelectValue placeholder="필드 타입 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">텍스트</SelectItem>
                    <SelectItem value="number">숫자</SelectItem>
                    <SelectItem value="date">날짜</SelectItem>
                    <SelectItem value="select">선택</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <label htmlFor="field-required" className="text-sm font-medium">필수 입력</label>
                <Switch
                  id="field-required"
                  checked={fieldRequired}
                  onCheckedChange={setFieldRequired}
                />
              </div>
              
              {fieldType === "select" && (
                <OptionsField options={fieldOptions} setOptions={setFieldOptions} />
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setShowAddDialog(false);
              }}>
                취소
              </Button>
              <Button onClick={handleAddField}>추가하기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 필드 수정 다이얼로그 */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>필드 수정</DialogTitle>
              <DialogDescription>
                기존 필드 정보를 수정합니다.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-field-name" className="text-sm font-medium">필드 이름</label>
                <Input
                  id="edit-field-name"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="edit-field-type" className="text-sm font-medium">필드 타입</label>
                <Select value={fieldType} onValueChange={(value) => setFieldType(value as any)}>
                  <SelectTrigger id="edit-field-type">
                    <SelectValue placeholder="필드 타입 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">텍스트</SelectItem>
                    <SelectItem value="number">숫자</SelectItem>
                    <SelectItem value="date">날짜</SelectItem>
                    <SelectItem value="select">선택</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <label htmlFor="edit-field-required" className="text-sm font-medium">필수 입력</label>
                <Switch
                  id="edit-field-required"
                  checked={fieldRequired}
                  onCheckedChange={setFieldRequired}
                />
              </div>
              
              {fieldType === "select" && (
                <OptionsField options={fieldOptions} setOptions={setFieldOptions} />
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setShowEditDialog(false);
              }}>
                취소
              </Button>
              <Button onClick={handleEditField}>수정하기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 필드 삭제 확인 다이얼로그 */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>필드 삭제</DialogTitle>
              <DialogDescription>
                {currentField?.name} 필드를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                취소
              </Button>
              <Button variant="destructive" onClick={handleDeleteField}>
                삭제하기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default CustomFieldsManagement;
