'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/ui/dialog'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { ScrollArea } from '@/ui/scroll-area'
import { TesterProfile } from '@/app/_services/data-service'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import {
  Mail,
  Briefcase,
  MapPin,
  Calendar,
  Smartphone,
  Globe,
  Code
} from 'lucide-react'
import { format } from 'date-fns'
import { TESTING_CONFIG } from '@/app/_components/dashboard/tester/profile/testing-settings-tab'

interface TesterDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  tester: TesterProfile
  onInvite?: () => void
}

export function TesterDetailDialog({
  isOpen,
  onClose,
  tester,
  onInvite
}: TesterDetailDialogProps) {
  const hoso = tester.HoSoTester
  const skills = hoso?.ngonNguChinh
    ? [
        hoso.ngonNguChinh,
        ...(Array.isArray(hoso.ngonNguKhac)
          ? (hoso.ngonNguKhac as any[]).map(s =>
              typeof s === 'string' ? s : s.name || s.label || JSON.stringify(s)
            )
          : [])
      ]
    : []

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Chưa cập nhật'
    try {
      return format(new Date(dateString), 'dd/MM/yyyy')
    } catch (e) {
      return dateString
    }
  }

  // Handle address mostly being a JSON object or string
  const renderAddress = (addr: any) => {
    if (!addr) return 'Chưa cập nhật'
    if (typeof addr === 'string') return addr
    // Common address fields: address, city, district
    const parts = [addr.address, addr.ward, addr.district, addr.city].filter(
      Boolean
    )
    return parts.length > 0 ? parts.join(', ') : JSON.stringify(addr)
  }

  /* ... (removed renderSurveyAnswers) ... */

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[80vh] flex-col p-0 sm:max-w-[600px]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Thông tin Tester</DialogTitle>
          <DialogDescription>
            Xem chi tiết hồ sơ và kinh nghiệm của ứng viên.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 pb-6">
            {/* Header Info */}
            <div className="flex items-start gap-4">
              <Avatar className="border-muted h-20 w-20 border-2">
                <AvatarImage
                  src={tester.anhDaiDien || ''}
                  alt={tester.hoTen || ''}
                />
                <AvatarFallback className="text-xl">
                  {tester.hoTen?.charAt(0) || 'T'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">{tester.hoTen}</h3>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>{tester.email}</span>
                </div>
                {tester.gioiTinh && (
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <span className="font-medium">Giới tính:</span>{' '}
                    {tester.gioiTinh}
                  </div>
                )}
                {tester.ngaySinh && (
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(tester.ngaySinh)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-lg border p-4">
                <h4 className="flex items-center gap-2 font-semibold">
                  <Briefcase className="text-primary h-4 w-4" />
                  Kinh nghiệm làm việc
                </h4>
                <p className="text-primary text-2xl font-bold">
                  {hoso?.soNamKinhNghiem || 0}{' '}
                  <span className="text-muted-foreground text-sm font-normal">
                    năm
                  </span>
                </p>
              </div>
              <div className="space-y-3 rounded-lg border p-4">
                <h4 className="flex items-center gap-2 font-semibold">
                  <MapPin className="text-primary h-4 w-4" />
                  Địa chỉ
                </h4>
                <p className="text-muted-foreground text-sm">
                  {renderAddress(tester.diaChi)}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold">
                <Code className="text-primary h-4 w-4" />
                Kỹ năng & Ngôn ngữ
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill, i) => (
                    <Badge key={i} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm italic">
                    Chưa cập nhật
                  </p>
                )}
              </div>
            </div>

            {/* Devices (mock or real if available in HoSoTester) */}
            {/* Devices */}
            {hoso?.thongTinThietBi && (
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 font-semibold">
                  <Smartphone className="text-primary h-4 w-4" />
                  Thiết bị test
                </h4>
                <div className="bg-muted/30 rounded-lg border p-3 text-sm">
                  {(() => {
                    const devicesData = hoso.thongTinThietBi as any

                    const renderDeviceItem = (device: any, index: number) => {
                      // Try to detect if it looks like a device object
                      if (
                        typeof device === 'object' &&
                        device !== null &&
                        (device.name || device.os || device.deviceName)
                      ) {
                        const name =
                          device.name || device.deviceName || 'Unknown Device'
                        const os = device.os
                          ? `${device.os} ${device.osVersion || ''}`
                          : ''
                        const category = device.category || device.type || ''
                        return (
                          <div
                            key={index}
                            className="bg-background flex flex-col gap-1 rounded border p-2 sm:flex-row sm:items-center sm:gap-2"
                          >
                            <Badge variant="outline" className="w-fit">
                              {category || 'Device'}
                            </Badge>
                            <span className="font-medium">{name}</span>
                            {os && (
                              <span className="text-muted-foreground text-sm">
                                ({os})
                              </span>
                            )}
                          </div>
                        )
                      }
                      return (
                        <li key={index}>
                          {typeof device === 'string'
                            ? device
                            : JSON.stringify(device)}
                        </li>
                      )
                    }

                    const renderContent = (data: any) => {
                      if (Array.isArray(data) && data.length > 0) {
                        return (
                          <div className="flex flex-col gap-2">
                            {data.map((item, i) => renderDeviceItem(item, i))}
                          </div>
                        )
                      } else if (typeof data === 'object' && data !== null) {
                        // Check if it's a wrapper like { "Devices": [...] }
                        const values = Object.values(data)
                        // If the object only has array values, flatten them for display or show keys
                        return (
                          <div className="flex flex-col gap-4">
                            {Object.entries(data).map(
                              ([key, value]: [string, any], i) => (
                                <div key={i} className="flex flex-col gap-2">
                                  <span className="text-muted-foreground mb-1 border-b pb-1 font-semibold capitalize">
                                    {key}:
                                  </span>
                                  {Array.isArray(value) ? (
                                    <div className="flex flex-col gap-2 pl-2">
                                      {value.map((item, idx) =>
                                        renderDeviceItem(item, idx)
                                      )}
                                    </div>
                                  ) : (
                                    <span className="pl-2">
                                      {typeof value === 'object'
                                        ? JSON.stringify(value)
                                        : String(value)}
                                    </span>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        )
                      } else {
                        return <p>{String(data)}</p>
                      }
                    }

                    return renderContent(devicesData)
                  })()}
                </div>
              </div>
            )}

            {/* Testing Info */}
            {hoso?.thongTinKiemThu && (
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 font-semibold">
                  <Globe className="text-primary h-4 w-4" />
                  Thông tin kiểm thử khác
                </h4>
                <div className="bg-muted/30 rounded-lg border p-3 text-sm">
                  {(() => {
                    const info = hoso.thongTinKiemThu as any
                    if (Array.isArray(info)) {
                      return (
                        <div className="flex flex-wrap gap-2">
                          {info.map((item: any, i: number) => (
                            <Badge key={i} variant="outline">
                              {typeof item === 'string'
                                ? item
                                : JSON.stringify(item)}
                            </Badge>
                          ))}
                        </div>
                      )
                    } else if (typeof info === 'object' && info !== null) {
                      // Create a map for quick label lookup
                      const labelMap = new Map(
                        TESTING_CONFIG.map(item => [item.id, item.label])
                      )

                      return (
                        <div className="grid grid-cols-1 gap-3">
                          {Object.entries(info).map(
                            ([key, value]: [string, any], i) => {
                              // Get label from config or fallback to formatted key
                              const label =
                                labelMap.get(key) ||
                                key.replace(/([A-Z])/g, ' $1').trim()

                              return (
                                <div
                                  key={i}
                                  className="flex flex-col gap-1 border-b pb-2 last:border-0 last:pb-0"
                                >
                                  <span className="text-muted-foreground text-xs font-semibold uppercase">
                                    {label}
                                  </span>
                                  <div className="pl-1 font-medium">
                                    {Array.isArray(value) ? (
                                      <div className="mt-1 flex flex-wrap gap-1">
                                        {value.map((v, idx) => (
                                          <Badge
                                            key={idx}
                                            variant="secondary"
                                            className="font-normal"
                                          >
                                            {v}
                                          </Badge>
                                        ))}
                                      </div>
                                    ) : (
                                      <span>
                                        {typeof value === 'boolean'
                                          ? value
                                            ? 'Có'
                                            : 'Không'
                                          : String(value)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )
                            }
                          )}
                        </div>
                      )
                    } else {
                      return <p>{String(info)}</p>
                    }
                  })()}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="mt-auto flex justify-end gap-2 border-t p-6 pt-2">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          {onInvite && (
            <Button
              onClick={() => {
                onInvite()
                onClose()
              }}
            >
              Mời tham gia dự án
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
