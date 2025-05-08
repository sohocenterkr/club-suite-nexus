
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LogoThemeSettingsProps {
  facilityData: {
    primaryColor: string;
    secondaryColor: string;
  };
  logoPreview: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyTheme: () => void;
}

const LogoThemeSettings = ({
  facilityData,
  logoPreview,
  onChange,
  onLogoChange,
  onApplyTheme
}: LogoThemeSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>로고 및 테마</CardTitle>
        <CardDescription>
          시설의 시각적 아이덴티티를 설정합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              로고 이미지
            </label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-colors">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="로고 미리보기"
                  className="max-h-32 mb-2"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xl font-bold text-gray-400">로고</span>
                </div>
              )}
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={onLogoChange}
                className="hidden"
              />
              <label
                htmlFor="logo"
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-primary border border-primary rounded-md cursor-pointer hover:bg-primary/10 transition-colors"
              >
                로고 업로드
              </label>
              <p className="mt-2 text-xs text-muted-foreground text-center">
                권장 크기: 512x512px, PNG 또는 JPG 파일
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="primaryColor" className="block text-sm font-medium">
              메인 컬러
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                id="primaryColor"
                name="primaryColor"
                value={facilityData.primaryColor}
                onChange={onChange}
                className="w-12 h-10 p-1 rounded border"
              />
              <Input
                value={facilityData.primaryColor}
                onChange={onChange}
                name="primaryColor"
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="secondaryColor" className="block text-sm font-medium">
              보조 컬러
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                id="secondaryColor"
                name="secondaryColor"
                value={facilityData.secondaryColor}
                onChange={onChange}
                className="w-12 h-10 p-1 rounded border"
              />
              <Input
                value={facilityData.secondaryColor}
                onChange={onChange}
                name="secondaryColor"
                className="flex-1"
              />
            </div>
          </div>
          
          <Button
            className="w-full mt-2"
            variant="outline"
            onClick={onApplyTheme}
          >
            테마 적용
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogoThemeSettings;
