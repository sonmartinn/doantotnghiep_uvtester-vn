'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  KichBan,
  KetQuaKiemThu,
  KetQuaKiemThuInsert,
  getKichBanByDuAn,
  getKetQuaByDuAnAndUser,
  upsertKetQuaKiemThu,
  getHoSoTester,
  getTesterProjectConfig,
  upsertTesterProjectConfig
} from '@/app/_services/data-service'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/ui/dialog'
import { Label } from '@/ui/label'
import { Textarea } from '@/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'
import { toast } from 'sonner'
import {
  Loader2,
  CheckCircle2,
  Laptop,
  Smartphone,
  Tablet,
  ArrowLeft
} from 'lucide-react'
import { TesterTestCaseDetail, SubmissionData } from './tester-test-case-detail'
import { Card, CardContent, CardHeader } from '@/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group'

interface TesterTestCaseListProps {
  projectId: number
  userId: string
}

interface Device {
  id?: string
  name: string
  os: string
  osVersion: string
  type: string
}

export function TesterTestCaseList({
  projectId,
  userId
}: TesterTestCaseListProps) {
  const [testCases, setTestCases] = useState<KichBan[]>([])
  const [results, setResults] = useState<Record<number, KetQuaKiemThu>>({})
  const [loading, setLoading] = useState(true)
  const [selectedTestCase, setSelectedTestCase] = useState<KichBan | null>(null)

  // Device State
  const [devices, setDevices] = useState<Device[]>([])
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [isDeviceDialogOpen, setIsDeviceDialogOpen] = useState(false)

  // Form state
  const [submitting, setSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [kbs, res, hoSo, config] = await Promise.all([
        getKichBanByDuAn(projectId, supabase),
        getKetQuaByDuAnAndUser(projectId, userId, supabase),
        getHoSoTester(userId, supabase),
        getTesterProjectConfig(projectId, userId, supabase)
      ])

      setTestCases(kbs)

      const resMap: Record<number, KetQuaKiemThu> = {}
      res.forEach(r => {
        resMap[r.maKichBan] = r
      })
      setResults(resMap)

      // Parse devices
      if (hoSo?.thongTinThietBi) {
        try {
          const deviceData = hoSo.thongTinThietBi as any
          let rawList: any[] = []

          if (Array.isArray(deviceData)) {
            rawList = deviceData
          } else if (deviceData?.devices && Array.isArray(deviceData.devices)) {
            rawList = deviceData.devices
          }

          const parsedDevices: Device[] = rawList.map((d: any) => ({
            id: d.id || `${d.name}-${d.os}`,
            name: d.name || d.deviceName || d.tenThietBi || 'Unknown Device',
            os: d.os || d.heDieuHanh || 'Unknown OS',
            osVersion: d.osVersion || d.phienBan || '',
            type: d.type || d.loaiThietBi || 'Unknown'
          }))

          setDevices(parsedDevices)

          if (config?.thietBiDuocChon) {
            const savedDeviceId = (config.thietBiDuocChon as any).id
            const savedDevice = parsedDevices.find(
              d => String(d.id) === String(savedDeviceId)
            )
            if (savedDevice) {
              setSelectedDevice(savedDevice)
            }
          }
        } catch (e) {
          console.error('Error parsing devices', e)
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }, [projectId, userId])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Scroll to top when opening detail view
  useEffect(() => {
    if (selectedTestCase) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [selectedTestCase])

  // Process Progress
  const progressStats = useMemo(() => {
    const total = testCases.length
    if (total === 0) return { total: 0, completed: 0, percent: 0 }

    let completed = 0
    Object.values(results).forEach(r => {
      if (r.trangThaiChung && r.trangThaiChung !== 'Chưa thực hiện') {
        completed++
      }
    })

    const percent = Math.round((completed / total) * 100)
    return { total, completed, percent }
  }, [testCases, results])

  const openUpdateDialog = (tc: KichBan) => {
    if (!selectedDevice) {
      toast.error('Vui lòng thiết lập và chọn thiết bị kiểm thử trước')
      return
    }
    setSelectedTestCase(tc)
  }

  const handleSubmit = async (data: SubmissionData) => {
    if (!selectedTestCase || !selectedDevice) return

    setSubmitting(true)
    try {
      const payload: KetQuaKiemThuInsert = {
        maKichBan: selectedTestCase.maKichBan,
        maNguoiThucHien: userId,
        trangThaiChung: data.trangThaiChung,
        ketQuaThucTeChung: data.ketQuaThucTeChung,
        maBaoCaoLoiLienQuan: data.maBaoCaoLoiLienQuan,
        lyDoBiChan: data.lyDoBiChan,
        lyDoBoQua: data.lyDoBoQua,
        ketQuaTungBuoc: data.ketQuaTungBuoc as any,
        thongTinBoSung: data.thongTinBoSung as any,
        fileBangChung: data.fileBangChung as any,
        thietBiSuDung: selectedDevice as any,
        ngayThucHien: new Date().toISOString(),
        trangThaiDuyet: 'ChoDuyet'
      }

      await upsertKetQuaKiemThu(payload, supabase)
      toast.success('Đã lưu kết quả kiểm thử')

      // Refresh data
      const updatedRes = await getKetQuaByDuAnAndUser(
        projectId,
        userId,
        supabase
      )
      const resMap: Record<number, KetQuaKiemThu> = {}
      updatedRes.forEach(r => {
        resMap[r.maKichBan] = r
      })
      setResults(resMap)

      setSelectedTestCase(null)
    } catch (error) {
      console.error('Failed to save result:', error)
      toast.error('Lỗi khi lưu kết quả')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'ChoDuyet':
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Chờ duyệt</Badge>
        )
      case 'DaChapNhan':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            Đã chấp nhận
          </Badge>
        )
      case 'TuChoi':
        return <Badge className="bg-red-500 hover:bg-red-600">Từ chối</Badge>
      case 'YeuCauChinhSua':
        return <Badge variant="secondary">Yêu cầu chỉnh sửa</Badge>
      default:
        return <Badge variant="outline">Chưa thực hiện</Badge>
    }
  }

  const getDeviceIcon = (type: string) => {
    const t = type.toLowerCase()
    if (t.includes('mobile') || t.includes('phone'))
      return <Smartphone className="h-5 w-5" />
    if (t.includes('tablet') || t.includes('ipad'))
      return <Tablet className="h-5 w-5" />
    return <Laptop className="h-5 w-5" />
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (selectedTestCase) {
    return (
      <TesterTestCaseDetail
        testCase={selectedTestCase}
        device={selectedDevice}
        initialData={results[selectedTestCase.maKichBan]} // Pass existing result
        submitting={submitting}
        onBack={() => setSelectedTestCase(null)}
        onSubmit={handleSubmit}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress & Header */}
      <div className="space-y-2">
        <div className="flex items-end justify-between">
          <h3 className="text-muted-foreground font-medium">
            {progressStats.completed} trên {progressStats.total} test cases đã
            được thực hiện
          </h3>
          <Button variant="outline" size="sm">
            Report blocker
          </Button>
        </div>
        <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all duration-500 ease-in-out"
            style={{ width: `${progressStats.percent}%` }}
          />
        </div>
      </div>

      {/* Device Selection Card */}
      <div className="bg-muted/30 flex flex-col items-start gap-2 rounded-lg border p-4">
        <h4 className="text-sm font-semibold">Thiết bị của tôi</h4>
        {selectedDevice ? (
          <>
            <div className="flex items-center gap-2 text-sm">
              {getDeviceIcon(selectedDevice.type)}
              <span>
                <span className="font-semibold">
                  {selectedDevice.os} {selectedDevice.osVersion}
                </span>
                <span className="text-muted-foreground mx-2">|</span>
                <span>{selectedDevice.name}</span>
              </span>
            </div>
            <Button
              variant="link"
              className="text-primary h-auto p-0 text-xs"
              onClick={() => setIsDeviceDialogOpen(true)}
            >
              Thay đổi thiết bị
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-start gap-2">
            <span className="text-destructive text-sm">
              Chưa có thiết bị nào được chọn. Vui lòng chọn 1 thiết bị của bạn
              trước khi thực hiện các Test Cases!
            </span>
            <Button
              variant="link"
              className="text-primary h-auto p-0 text-xs"
              onClick={() => setIsDeviceDialogOpen(true)}
            >
              Chọn thiết bị
            </Button>
          </div>
        )}
      </div>

      {/* Test Case Cards List */}
      <div className="grid gap-4">
        {testCases.map(tc => {
          const result = results[tc.maKichBan]
          const isDone =
            result?.trangThaiChung && result.trangThaiChung !== 'Chưa thực hiện'

          return (
            <Card
              key={tc.maKichBan}
              className="hover:border-l-primary/50 border-l-4 border-l-transparent shadow-sm transition-shadow hover:shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="text-muted-foreground text-sm font-medium">
                  {tc.maKichBanHienThi}
                </div>
                {getStatusBadge(result?.trangThaiDuyet || null)}
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{tc.tieuDe}</h3>
                    <p className="text-muted-foreground text-xs">
                      Bao gồm{' '}
                      {Array.isArray(tc.cacBuocThucHien)
                        ? tc.cacBuocThucHien.length
                        : 'Multiple'}{' '}
                      bước
                    </p>
                    <Button
                      variant="link"
                      className="text-primary h-auto p-0"
                      onClick={() => openUpdateDialog(tc)}
                    >
                      {isDone ? 'Xem và chỉnh sửa test case' : 'Mở test case'}
                    </Button>
                  </div>

                  {isDone && (
                    <CheckCircle2 className="h-5 w-5 text-green-500 opacity-0 md:opacity-100" />
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Device Selection Dialog */}
      <Dialog open={isDeviceDialogOpen} onOpenChange={setIsDeviceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn thiết bị của bạn</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {devices.length === 0 ? (
              <div className="text-muted-foreground py-4 text-center">
                No devices found in your profile. Please update your profile
                settings.
              </div>
            ) : (
              <RadioGroup
                value={
                  selectedDevice?.id ? String(selectedDevice.id) : undefined
                }
                onValueChange={val => {
                  const dev = devices.find(d => String(d.id) === val)
                  if (dev) {
                    setSelectedDevice(dev)
                    // Persist to DB
                    upsertTesterProjectConfig(
                      projectId,
                      userId,
                      {
                        thietBiDuocChon: dev
                      },
                      supabase
                    )
                    setIsDeviceDialogOpen(false)
                  }
                }}
                className="gap-3"
              >
                {devices.map((dev, idx) => (
                  <div
                    key={idx}
                    className="hover:bg-muted/50 flex cursor-pointer items-center space-x-2 rounded-md border p-3"
                    onClick={() => {
                      setSelectedDevice(dev)
                      // Persist to DB
                      upsertTesterProjectConfig(
                        projectId,
                        userId,
                        {
                          thietBiDuocChon: dev
                        },
                        supabase
                      )
                      setIsDeviceDialogOpen(false)
                    }}
                  >
                    <RadioGroupItem
                      value={String(dev.id || idx)}
                      id={`dev-${idx}`}
                    />
                    <Label
                      htmlFor={`dev-${idx}`}
                      className="flex flex-1 cursor-pointer items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(dev.type)}
                        <div className="flex flex-col">
                          <span className="font-semibold">{dev.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {dev.os} {dev.osVersion}
                          </span>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
