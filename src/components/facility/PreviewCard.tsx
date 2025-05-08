
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PreviewCardProps {
  onPreview: () => void;
}

const PreviewCard = ({ onPreview }: PreviewCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>미리보기</CardTitle>
        <CardDescription>
          사이트 방문자들에게 보여질 페이지를 미리 확인하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="secondary"
          className="w-full"
          onClick={onPreview}
        >
          시설 페이지 미리보기
        </Button>
      </CardContent>
    </Card>
  );
};

export default PreviewCard;
