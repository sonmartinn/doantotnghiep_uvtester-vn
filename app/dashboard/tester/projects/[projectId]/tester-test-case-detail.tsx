import { Button } from '@/ui/button'
import { Label } from '@/ui/label'
import { Textarea } from '@/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'
import { Loader2, ArrowLeft, Laptop, Smartphone, Tablet } from 'lucide-react'
import { KichBan } from '@/app/_services/data-service'

export interface Device {
  id?: string
  name: string
  os: string
  osVersion: string
  type: string
}

interface TesterTestCaseDetailProps {
  testCase: KichBan
  device: Device | null
  status: string
  onStatusChange: (value: string) => void
  actualResult: string
  onActualResultChange: (value: string) => void
  submitting: boolean
  onBack: () => void
  onSubmit: () => void
}

export function TesterTestCaseDetail({
  testCase,
  device,
  status,
  onStatusChange,
  actualResult,
  onActualResultChange,
  submitting,
  onBack,
  onSubmit
}: TesterTestCaseDetailProps) {
  const getDeviceIcon = (type: string) => {
    const t = type.toLowerCase()
    if (t.includes('mobile') || t.includes('phone'))
      return <Smartphone className="h-5 w-5" />
    if (t.includes('tablet') || t.includes('ipad'))
      return <Tablet className="h-5 w-5" />
    return <Laptop className="h-5 w-5" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold">
          {testCase.maKichBanHienThi}: {testCase.tieuDe}
        </h2>
      </div>

      <div className="grid gap-6">
        <div className="bg-muted/30 rounded-md border p-4 text-sm">
          {testCase.dieuKienTienQuyet ? (
            <>
              <span className="font-semibold">Điều kiện tiên quyết:</span>{' '}
              {testCase.dieuKienTienQuyet}
            </>
          ) : (
            <span className="text-muted-foreground italic">
              Không có điều kiện tiên quyết
            </span>
          )}
        </div>

        {device && (
          <div className="bg-card flex items-center gap-3 rounded-lg border p-3 shadow-sm">
            <div className="bg-primary/10 text-primary rounded-full p-2">
              {getDeviceIcon(device.type)}
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs">
                Đang kiểm thử trên thiết bị
              </span>
              <span className="font-semibold">
                {device.name} ({device.os} {device.osVersion})
              </span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-lg font-semibold">Các bước thực hiện</Label>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {typeof testCase.cacBuocThucHien === 'string'
                ? testCase.cacBuocThucHien
                : JSON.stringify(testCase.cacBuocThucHien, null, 2)}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border bg-slate-50 p-6 dark:bg-slate-900/50">
          <h4 className="text-lg font-semibold">Kết quả thực hiện</h4>

          <div className="grid max-w-sm gap-4">
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select value={status} onValueChange={onStatusChange}>
                <SelectTrigger className="bg-white dark:bg-slate-950">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chưa thực hiện">Chưa thực hiện</SelectItem>
                  <SelectItem value="Pass">Pass</SelectItem>
                  <SelectItem value="Fail">Fail</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                  <SelectItem value="Skipped">Skipped</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Kết quả thực tế / Ghi chú</Label>
            <Textarea
              placeholder="Mô tả kết quả thực tế hoặc lý do..."
              value={actualResult}
              onChange={e => onActualResultChange(e.target.value)}
              rows={5}
              className="resize-y bg-white dark:bg-slate-950"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onBack} disabled={submitting}>
              Hủy bỏ
            </Button>
            <Button onClick={onSubmit} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu kết quả
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
