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

// Mock Data for Testing Settings (Dynamic Config)
const TESTING_CONFIG = [
  {
    id: 'device_types',
    label: 'Loại thiết bị bạn có thể test?',
    type: 'select',
    options: ['Laptop', 'Smartphone', 'Tablet', 'Smartwatch', 'All of them']
  },
  {
    id: 'test_types',
    label: 'Loại kiểm thử sở trường?',
    type: 'text',
    placeholder: 'Ví dụ: Functional, UI/UX, Performance...'
  },
  {
    id: 'bug_tracking_tools',
    label: 'Công cụ bug tracking quen thuộc?',
    type: 'text',
    placeholder: 'Jira, Trello, Asana...'
  },
  {
    id: 'weekly_availability',
    label: 'Thời gian rảnh trong tuần (giờ/tuần)?',
    type: 'number',
    placeholder: '10'
  }
]

interface TestingSettingsTabProps {
  settings: Record<string, any>
  onChange: (settings: Record<string, any>) => void
}

export function TestingSettingsTab({
  settings,
  onChange
}: TestingSettingsTabProps) {
  const handleChange = (id: string, value: string) => {
    onChange({ ...settings, [id]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cài đặt Kiểm thử</CardTitle>
        <CardDescription>
          Thông tin về môi trường và sở trường kiểm thử của bạn.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {TESTING_CONFIG.map(field => (
          <div key={field.id} className="space-y-2">
            <Label>{field.label}</Label>

            {/* Render inputs based on 'type' */}
            {field.type === 'text' && (
              <Input
                placeholder={field.placeholder}
                value={settings[field.id] || ''}
                onChange={e => handleChange(field.id, e.target.value)}
              />
            )}

            {field.type === 'number' && (
              <Input
                type="number"
                placeholder={field.placeholder}
                value={settings[field.id] || ''}
                onChange={e => handleChange(field.id, e.target.value)}
              />
            )}

            {field.type === 'select' && (
              <Select
                value={settings[field.id] || ''}
                onValueChange={v => handleChange(field.id, v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn một tùy chọn" />
                </SelectTrigger>
                <SelectContent>
                  {field.options &&
                    field.options.map((opt: string) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}

        <div className="bg-muted text-muted-foreground mt-4 rounded-lg p-4 text-sm">
          <p>
            Lưu ý: Các thông tin này sẽ giúp hệ thống gợi ý các dự án phù hợp
            nhất cho bạn.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
