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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'

// Mock Data
const CITIES = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ']
const WARDS = ['Phường 1', 'Phường 2', 'Phường 3', 'Xã A', 'Xã B']

interface AddressState {
  city: string
  ward: string
  details: string
}

interface AddressTabProps {
  data: AddressState
  onChange: (data: AddressState) => void
}

export function AddressTab({ data, onChange }: AddressTabProps) {
  const handleChange = (field: keyof AddressState, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Địa chỉ liên hệ</CardTitle>
        <CardDescription>Nơi bạn đang sinh sống và làm việc.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Tỉnh / Thành phố</Label>
            <Select
              value={data.city}
              onValueChange={v => handleChange('city', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map(c => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Phường / Xã</Label>
            <Select
              value={data.ward}
              onValueChange={v => handleChange('ward', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn Phường/Xã" />
              </SelectTrigger>
              <SelectContent>
                {WARDS.map(w => (
                  <SelectItem key={w} value={w}>
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Địa chỉ cụ thể</Label>
          <Input
            value={data.details}
            onChange={e => handleChange('details', e.target.value)}
            placeholder="Số nhà, tên đường..."
          />
        </div>
      </CardContent>
    </Card>
  )
}
