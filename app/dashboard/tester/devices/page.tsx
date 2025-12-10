'use client'

import {
  Edit,
  Laptop,
  Loader2,
  Monitor,
  MonitorSmartphone,
  Plus,
  Smartphone,
  Tablet,
  Trash2,
  Tv,
  Watch
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

import { Button } from '@/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/ui/dialog'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'

import {
  useAuthUser,
  useHoSoTester,
  useUpdateHoSoTester
} from '@/app/_services/queries'

// Device Types
type DeviceType = 'desktop' | 'mobile'

interface Device {
  id: string
  type: DeviceType
  category: string // e.g., 'PC', 'Laptop' or 'Phone', 'Tablet'
  name: string // e.g., 'My MacBook' or 'iPhone 13'
  os: string // e.g., 'Windows', 'macOS' or 'iOS', 'Android'
  osVersion: string // e.g., '10', 'Ventura' or '15.0'
  testEnvironment?: boolean // If true, it's a primary test device
}

export default function DevicesPage() {
  const { data: user } = useAuthUser()
  const { data: hoSo, isLoading } = useHoSoTester(user?.id)
  const updateHoSo = useUpdateHoSoTester()

  const [devices, setDevices] = useState<Device[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<DeviceType>('desktop')
  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null)

  // Form State
  const [newDevice, setNewDevice] = useState<Partial<Device>>({
    category: '',
    name: '',
    os: '',
    osVersion: ''
  })

  // Load devices from profile on mount
  useEffect(() => {
    if (hoSo?.thongTinThietBi) {
      // @ts-ignore
      const savedDevices = (hoSo.thongTinThietBi as any)?.devices || []
      setDevices(savedDevices)
    }
  }, [hoSo])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  const handleSaveDevice = async () => {
    if (!newDevice.name || !newDevice.os) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    let updatedDevices: Device[]

    if (editingDeviceId) {
      // Update existing device
      updatedDevices = devices.map(d =>
        d.id === editingDeviceId
          ? {
              ...d,
              category: newDevice.category || d.category,
              name: newDevice.name!,
              os: newDevice.os!,
              osVersion: newDevice.osVersion || ''
            }
          : d
      )
    } else {
      // Add new device
      const deviceToAdd: Device = {
        id: uuidv4(),
        type: activeTab,
        category:
          newDevice.category || (activeTab === 'desktop' ? 'Laptop' : 'Phone'),
        name: newDevice.name!,
        os: newDevice.os!,
        osVersion: newDevice.osVersion || '',
        testEnvironment: true
      }
      updatedDevices = [...devices, deviceToAdd]
    }

    setDevices(updatedDevices)
    setIsDialogOpen(false)
    setNewDevice({ category: '', name: '', os: '', osVersion: '' })
    setEditingDeviceId(null)

    // Save to DB
    try {
      if (user?.id) {
        await updateHoSo.mutateAsync({
          id: user.id,
          data: {
            thongTinThietBi: { devices: updatedDevices } as any
          }
        })
        toast.success(
          editingDeviceId ? 'Đã cập nhật thiết bị' : 'Đã thêm thiết bị'
        )
      }
    } catch (error) {
      toast.error('Lỗi khi lưu thiết bị')
      console.error(error)
    }
  }

  const handleEditDevice = (device: Device) => {
    setEditingDeviceId(device.id)
    setNewDevice({
      category: device.category,
      name: device.name,
      os: device.os,
      osVersion: device.osVersion
    })
    // Ensure we switch to the correct tab if editing (though usually user is already on that tab)
    setActiveTab(device.type)
    setIsDialogOpen(true)
  }

  const handleRemoveDevice = async (id: string) => {
    const updatedDevices = devices.filter(d => d.id !== id)
    setDevices(updatedDevices)

    try {
      if (user?.id) {
        await updateHoSo.mutateAsync({
          id: user.id,
          data: {
            thongTinThietBi: { devices: updatedDevices } as any
          }
        })
        toast.success('Đã xóa thiết bị')
      }
    } catch (error) {
      toast.error('Lỗi khi xóa thiết bị')
      console.error(error)
    }
  }

  const getDeviceIcon = (category: string) => {
    switch (category) {
      case 'Smartphone':
        return Smartphone
      case 'Tablet':
        return Tablet
      case 'SmartWatch':
        return Watch
      case 'Smart TV':
        return Tv
      case 'PC':
        return Monitor
      case 'Laptop':
      case 'MacBook':
        return Laptop
      default:
        return Smartphone
    }
  }

  const renderDeviceList = (type: DeviceType) => {
    const filteredDevices = devices.filter(d => d.type === type)

    if (filteredDevices.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500">
          {type === 'desktop' ? (
            <Monitor className="mb-2 h-10 w-10 opacity-20" />
          ) : (
            <MonitorSmartphone className="mb-2 h-10 w-10 opacity-20" />
          )}
          <p>Chưa có thiết bị nào</p>
          <Button
            variant="link"
            onClick={() => setIsDialogOpen(true)}
            className="mt-2"
          >
            Thêm thiết bị ngay
          </Button>
        </div>
      )
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDevices.map(device => (
          <Card key={device.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {device.category}
              </CardTitle>
              {(() => {
                const Icon = getDeviceIcon(device.category)
                return <Icon className="text-muted-foreground h-4 w-4" />
              })()}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{device.name}</div>
              <p className="text-muted-foreground text-xs">
                {device.os} {device.osVersion}
              </p>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => handleEditDevice(device)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Sửa
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive h-8 px-2"
                  onClick={() => handleRemoveDevice(device.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Thiết bị của tôi</h1>
        <p className="text-muted-foreground">
          Quản lý các thiết bị bạn sử dụng để kiểm thử.
        </p>
      </div>

      <Tabs
        defaultValue="desktop"
        className="w-full"
        onValueChange={val => setActiveTab(val as DeviceType)}
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="desktop" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" /> Desktop
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-2">
              <MonitorSmartphone className="h-4 w-4" /> Mobile & Smart Devices
            </TabsTrigger>
          </TabsList>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Thêm thiết bị
          </Button>
        </div>

        <TabsContent value="desktop" className="mt-6">
          {renderDeviceList('desktop')}
        </TabsContent>
        <TabsContent value="mobile" className="mt-6">
          {renderDeviceList('mobile')}
        </TabsContent>
      </Tabs>

      <Dialog
        open={isDialogOpen}
        onOpenChange={open => {
          setIsDialogOpen(open)
          if (!open) {
            setEditingDeviceId(null)
            setNewDevice({ category: '', name: '', os: '', osVersion: '' })
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingDeviceId ? 'Cập nhật thiết bị' : 'Thêm thiết bị mới'}
            </DialogTitle>
            <DialogDescription>
              Nhập thông tin chi tiết về thiết bị{' '}
              {activeTab === 'desktop' ? 'máy tính' : 'di động / TV'} của bạn.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Loại thiết bị</Label>
              <Select
                value={newDevice.category}
                onValueChange={val =>
                  setNewDevice({ ...newDevice, category: val })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn loại thiết bị..." />
                </SelectTrigger>
                <SelectContent>
                  {activeTab === 'desktop' ? (
                    <>
                      <SelectItem value="PC">PC (Máy bàn)</SelectItem>
                      <SelectItem value="Laptop">Laptop</SelectItem>
                      <SelectItem value="MacBook">MacBook</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Smartphone">Smartphone</SelectItem>
                      <SelectItem value="Tablet">
                        Tablet (Máy tính bảng)
                      </SelectItem>
                      <SelectItem value="SmartWatch">SmartWatch</SelectItem>
                      <SelectItem value="Smart TV">Smart TV</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Tên thiết bị / Model</Label>
              <Input
                placeholder={
                  activeTab === 'desktop'
                    ? 'Ví dụ: MacBook Pro M1'
                    : 'Ví dụ: iPhone 13 Pro, Sony Bravia...'
                }
                value={newDevice.name}
                onChange={e =>
                  setNewDevice({ ...newDevice, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Hệ điều hành</Label>
                <Select
                  value={newDevice.os}
                  onValueChange={val => setNewDevice({ ...newDevice, os: val })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn OS..." />
                  </SelectTrigger>
                  <SelectContent>
                    {activeTab === 'desktop' ? (
                      <>
                        <SelectItem value="Windows">Windows</SelectItem>
                        <SelectItem value="macOS">macOS</SelectItem>
                        <SelectItem value="Linux">Linux</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="iOS">iOS</SelectItem>
                        <SelectItem value="Android">Android</SelectItem>
                        <SelectItem value="Android TV">Android TV</SelectItem>
                        <SelectItem value="tvOS">tvOS (Apple TV)</SelectItem>
                        <SelectItem value="Tizen">Tizen (Samsung)</SelectItem>
                        <SelectItem value="WebOS">WebOS (LG)</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Phiên bản</Label>
                <Input
                  placeholder="VD: 11, 15.0"
                  value={newDevice.osVersion}
                  onChange={e =>
                    setNewDevice({ ...newDevice, osVersion: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSaveDevice}
              disabled={!newDevice.name || !newDevice.os}
            >
              {editingDeviceId ? 'Cập nhật' : 'Lưu thiết bị'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
