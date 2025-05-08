
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BasicInfoFormProps {
  facilityData: {
    name: string;
    customUrl: string;
    description: string;
    address: string;
    phone: string;
    operatingHours: string;
  };
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  hideCustomUrl?: boolean; // 커스텀 URL 숨김 여부 (선택적)
}

const BasicInfoForm = ({ 
  facilityData, 
  isLoading, 
  onSubmit, 
  onChange,
  hideCustomUrl = false 
}: BasicInfoFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>기본 정보</CardTitle>
        <CardDescription>
          시설의 기본 정보를 설정합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                시설 이름
              </label>
              <Input
                id="name"
                name="name"
                value={facilityData.name}
                onChange={onChange}
                placeholder="시설 이름"
                required
              />
            </div>
            {!hideCustomUrl && (
              <div className="space-y-2">
                <label htmlFor="customUrl" className="block text-sm font-medium">
                  커스텀 URL
                </label>
                <div className="flex items-center">
                  <span className="bg-muted px-3 py-2 text-sm border border-r-0 rounded-l-md">
                    facilityhub.com/f/
                  </span>
                  <Input
                    id="customUrl"
                    name="customUrl"
                    value={facilityData.customUrl}
                    onChange={onChange}
                    className="rounded-l-none"
                    placeholder="your-facility"
                    required
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              소개
            </label>
            <Textarea
              id="description"
              name="description"
              value={facilityData.description}
              onChange={onChange}
              placeholder="시설에 대한 간단한 소개를 작성해주세요."
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium">
                주소
              </label>
              <Input
                id="address"
                name="address"
                value={facilityData.address}
                onChange={onChange}
                placeholder="시설 주소"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium">
                연락처
              </label>
              <Input
                id="phone"
                name="phone"
                value={facilityData.phone}
                onChange={onChange}
                placeholder="시설 연락처"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="operatingHours" className="block text-sm font-medium">
              영업 시간
            </label>
            <Input
              id="operatingHours"
              name="operatingHours"
              value={facilityData.operatingHours}
              onChange={onChange}
              placeholder="예: 평일 06:00-22:00, 주말 10:00-18:00"
            />
          </div>
          
          <div className="pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BasicInfoForm;
