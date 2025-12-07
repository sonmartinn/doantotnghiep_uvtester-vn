'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/ui/card'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Button } from '@/ui/button'
import { Separator } from '@/ui/separator'
import { Plus, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'

export interface LanguageItem {
  id: string
  name: string
  level: string
}

interface LanguagesTabProps {
  nativeLang: string
  otherLangs: LanguageItem[]
  onNativeLangChange: (value: string) => void
  onAddLanguage: () => void
  onRemoveLanguage: (id: string) => void
  onUpdateLanguage: (id: string, field: 'name' | 'level', value: string) => void
}

export function LanguagesTab({
  nativeLang,
  otherLangs,
  onNativeLangChange,
  onAddLanguage,
  onRemoveLanguage,
  onUpdateLanguage
}: LanguagesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ngôn ngữ</CardTitle>
        <CardDescription>
          Khả năng ngôn ngữ giúp bạn tiếp cận nhiều dự án hơn.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Ngôn ngữ chính (Mẹ đẻ)</Label>
          <Input
            value={nativeLang}
            onChange={e => onNativeLangChange(e.target.value)}
            placeholder="Ví dụ: Tiếng Việt"
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Ngôn ngữ khác / Ngoại ngữ</Label>
            <Button variant="outline" size="sm" onClick={onAddLanguage}>
              <Plus className="mr-2 h-4 w-4" /> Thêm ngôn ngữ
            </Button>
          </div>

          {otherLangs.length === 0 && (
            <p className="text-muted-foreground text-sm italic">
              Chưa có ngôn ngữ nào được thêm.
            </p>
          )}

          {otherLangs.map(lang => (
            <div key={lang.id} className="flex items-end gap-4">
              <div className="flex-1 space-y-1">
                <Label className="text-muted-foreground text-xs">
                  Tên ngôn ngữ
                </Label>
                <Input
                  value={lang.name}
                  onChange={e =>
                    onUpdateLanguage(lang.id, 'name', e.target.value)
                  }
                  placeholder="VD: Tiếng Anh"
                />
              </div>
              <div className="w-[180px] space-y-1">
                <Label className="text-muted-foreground text-xs">
                  Trình độ
                </Label>
                <Select
                  value={lang.level}
                  onValueChange={v => onUpdateLanguage(lang.id, 'level', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cơ bản">Cơ bản</SelectItem>
                    <SelectItem value="Trung bình">Trung bình</SelectItem>
                    <SelectItem value="Thành thạo">Thành thạo</SelectItem>
                    <SelectItem value="Chuyên gia">Chuyên gia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onRemoveLanguage(lang.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
