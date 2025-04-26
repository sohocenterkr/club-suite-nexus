
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Save, Trash } from "lucide-react";

// 목업 템플릿 데이터
const mockTemplates = [
  {
    id: "template-1",
    name: "결제 안내",
    content: "안녕하세요, [회원명]님. [시설명]입니다. 회원권 결제일이 다가오고 있습니다. 확인 부탁드립니다."
  },
  {
    id: "template-2",
    name: "이벤트 안내",
    content: "안녕하세요, [회원명]님. [시설명]입니다. 이번주 PT 프로모션 진행중입니다. 많은 관심 부탁드립니다."
  },
  {
    id: "template-3",
    name: "휴관일 안내",
    content: "안녕하세요, [회원명]님. [시설명]입니다. [날짜] 휴관일 안내드립니다. 이용에 참고 부탁드립니다."
  },
];

const SMSManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [smsCredit, setSmsCredit] = useState(100); // 문자 크레딧
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [templates, setTemplates] = useState<any[]>([]);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    content: ""
  });
  const [selectedTab, setSelectedTab] = useState("send");
  const [facilityName, setFacilityName] = useState("시설명");

  useEffect(() => {
    // 실제 구현 시 API에서 템플릿 데이터와 크레딧 정보 가져오기
    const loadData = () => {
      try {
        // 목업 템플릿 데이터
        setTemplates(mockTemplates);
        
        // 시설 정보 가져오기
        const savedData = localStorage.getItem('facilityData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setFacilityName(parsedData.name || "시설명");
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };

    loadData();
  }, []);

  const handleSendMessage = () => {
    if (!recipientName || !recipientPhone || !messageContent) {
      toast({
        title: "입력 필요",
        description: "수신자 정보와 메시지 내용을 모두 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    if (smsCredit <= 0) {
      toast({
        title: "크레딧 부족",
        description: "SMS 크레딧이 부족합니다. 충전 후 이용해주세요.",
        variant: "destructive"
      });
      return;
    }

    try {
      // 실제 구현 시 API를 통해 SMS 발송
      
      // 크레딧 차감
      setSmsCredit(prev => prev - 1);
      
      toast({
        title: "메시지 발송 완료",
        description: `${recipientName}님에게 메시지가 발송되었습니다.`
      });
      
      // 발송 후 메시지 초기화
      setMessageContent("");
    } catch (error) {
      console.error("메시지 발송 실패:", error);
      toast({
        title: "메시지 발송 실패",
        description: "메시지 발송 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleAddTemplate = () => {
    if (!newTemplate.name || !newTemplate.content) {
      toast({
        title: "입력 필요",
        description: "템플릿 이름과 내용을 모두 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    // 템플릿 추가 (실제 구현 시 API를 통해 저장)
    const newTemplateWithId = {
      ...newTemplate,
      id: `template-${Date.now()}`
    };
    
    setTemplates([...templates, newTemplateWithId]);
    setNewTemplate({ name: "", content: "" });
    
    toast({
      title: "템플릿 추가 완료",
      description: "새 메시지 템플릿이 추가되었습니다."
    });
  };

  const handleDeleteTemplate = (id: string) => {
    // 템플릿 삭제 (실제 구현 시 API를 통해 삭제)
    setTemplates(templates.filter(template => template.id !== id));
    
    toast({
      title: "템플릿 삭제",
      description: "메시지 템플릿이 삭제되었습니다."
    });
  };

  const handleUseTemplate = (template: any) => {
    // 템플릿을 메시지 내용에 적용
    let content = template.content;
    content = content.replace('[회원명]', recipientName);
    content = content.replace('[시설명]', facilityName);
    setMessageContent(content);
    setSelectedTab("send");
  };

  const handleChargeCredit = () => {
    // 실제 구현 시 결제 페이지로 이동
    navigate("/settings/sms-charge");
  };

  return (
    <AdminLayout activeTab="members">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">문자 메시지 관리</h1>
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium">남은 크레딧: {smsCredit}건</span>
            <Button onClick={handleChargeCredit}>충전하기</Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="send">문자 발송</TabsTrigger>
            <TabsTrigger value="templates">메시지 템플릿</TabsTrigger>
          </TabsList>
          
          <TabsContent value="send">
            <Card>
              <CardHeader>
                <CardTitle>문자 메시지 발송</CardTitle>
                <CardDescription>회원에게 문자 메시지를 발송합니다. SMS 1건당 크레딧 1건이 차감됩니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="recipient-name" className="text-sm font-medium">수신자 이름</label>
                    <Input 
                      id="recipient-name"
                      placeholder="홍길동" 
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="recipient-phone" className="text-sm font-medium">수신자 전화번호</label>
                    <Input 
                      id="recipient-phone"
                      placeholder="010-0000-0000" 
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label htmlFor="message-content" className="text-sm font-medium">메시지 내용</label>
                    <span className="text-xs text-muted-foreground">{messageContent.length}/90자</span>
                  </div>
                  <Textarea 
                    id="message-content"
                    placeholder="메시지 내용을 입력하세요..." 
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className="min-h-[150px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedTab("templates")}>템플릿 사용</Button>
                <Button onClick={handleSendMessage} disabled={smsCredit <= 0}>
                  <Send className="w-4 h-4 mr-2" />
                  발송하기
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>새 템플릿 등록</CardTitle>
                    <CardDescription>자주 사용하는 메시지를 템플릿으로 등록하세요.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="template-name" className="text-sm font-medium">템플릿 이름</label>
                      <Input 
                        id="template-name"
                        placeholder="결제 안내" 
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="template-content" className="text-sm font-medium">템플릿 내용</label>
                      <Textarea 
                        id="template-content"
                        placeholder="안녕하세요, [회원명]님. [시설명]입니다." 
                        value={newTemplate.content}
                        onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                        className="min-h-[100px]"
                      />
                      <p className="text-xs text-muted-foreground">
                        [회원명], [시설명] 등의 변수를 사용할 수 있습니다.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleAddTemplate} className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      템플릿 저장
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>저장된 템플릿</CardTitle>
                    <CardDescription>저장된 메시지 템플릿 목록입니다.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>이름</TableHead>
                            <TableHead className="hidden md:table-cell">내용</TableHead>
                            <TableHead className="w-[100px]">액션</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {templates.length > 0 ? (
                            templates.map(template => (
                              <TableRow key={template.id}>
                                <TableCell className="font-medium">{template.name}</TableCell>
                                <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                                  {template.content}
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleUseTemplate(template)}
                                    >
                                      사용
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => handleDeleteTemplate(template.id)}
                                    >
                                      <Trash className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-4">
                                저장된 템플릿이 없습니다.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SMSManagement;
