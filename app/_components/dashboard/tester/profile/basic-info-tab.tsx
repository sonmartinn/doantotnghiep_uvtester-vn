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
import { Textarea } from '@/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'

interface BasicInfoState {
  hoTen: string
  gioiTinh: string
  ngaySinh: string
  soNamKinhNghiem: string
  gioiThieu: string
  linkLinkedIn: string
}

interface BasicInfoTabProps {
  data: BasicInfoState
  onChange: (data: BasicInfoState) => void
}

export function BasicInfoTab({ data, onChange }: BasicInfoTabProps) {
  const handleChange = (field: keyof BasicInfoState, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
        <CardDescription>
          Thông tin cá nhân hiển thị trên hồ sơ của bạn.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Họ và Tên</Label>
            <Input
              value={data.hoTen}
              onChange={e => handleChange('hoTen', e.target.value)}
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div className="space-y-2">
            <Label>Giới tính</Label>
            <Select
              value={data.gioiTinh}
              onValueChange={v => handleChange('gioiTinh', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nam">Nam</SelectItem>
                <SelectItem value="Nữ">Nữ</SelectItem>
                <SelectItem value="Khác">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Ngày sinh</Label>
            <Input
              type="date"
              value={data.ngaySinh}
              onChange={e => handleChange('ngaySinh', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Số năm kinh nghiệm</Label>
            <Input
              type="number"
              value={data.soNamKinhNghiem}
              onChange={e => handleChange('soNamKinhNghiem', e.target.value)}
              placeholder="Ví dụ: 2"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>LinkedIn Profile</Label>
          <Input
            value={data.linkLinkedIn}
            onChange={e => handleChange('linkLinkedIn', e.target.value)}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        <div className="space-y-2">
          <Label>Giới thiệu ngắn</Label>
          <Textarea
            value={data.gioiThieu}
            onChange={e => handleChange('gioiThieu', e.target.value)}
            placeholder="Hãy viết đôi dòng giới thiệu về bản thân và kinh nghiệm của bạn..."
            className="h-32"
          />
        </div>
      </CardContent>
    </Card>
  )
}
