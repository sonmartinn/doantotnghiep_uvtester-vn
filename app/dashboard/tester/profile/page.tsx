'use client'

import { Loader2, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'

// Service Imports (Queries)
import {
  useAuthUser,
  useNguoiDung,
  useHoSoTester,
  useUpdateNguoiDung,
  useUpdateHoSoTester
} from '@/app/_services/queries'
import { HoSoTester } from '@/app/_services/data-service'

// Import Tab Components
import { AddressTab } from '@/app/_components/dashboard/tester/profile/address-tab'
import { BasicInfoTab } from '@/app/_components/dashboard/tester/profile/basic-info-tab'
import {
  LanguageItem,
  LanguagesTab
} from '@/app/_components/dashboard/tester/profile/languages-tab'
import { TestingSettingsTab } from '@/app/_components/dashboard/tester/profile/testing-settings-tab'

export default function TesterProfilePage() {
  // 1. Queries
  const { data: user, isLoading: isLoadingUser } = useAuthUser()
  const { data: nguoiDung, isLoading: isLoadingNguoiDung } = useNguoiDung(
    user?.id
  )
  const { data: hoSo, isLoading: isLoadingHoSo } = useHoSoTester(user?.id)

  // 2. Mutations
  const updateNguoiDungMutation = useUpdateNguoiDung()
  const updateHoSoTesterMutation = useUpdateHoSoTester()

  // Data State (Form)
  // Basic Info
  const [basicInfo, setBasicInfo] = useState({
    hoTen: '',
    gioiTinh: 'Khác',
    ngaySinh: '',
    soNamKinhNghiem: '',
    gioiThieu: '',
    linkLinkedIn: ''
  })

  // Address
  const [address, setAddress] = useState({
    city: '',
    ward: '',
    details: ''
  })

  // Languages
  const [nativeLang, setNativeLang] = useState('Tiếng Việt')
  const [otherLangs, setOtherLangs] = useState<LanguageItem[]>([])

  // Testing Settings (Dynamic)
  const [testingSettings, setTestingSettings] = useState<Record<string, any>>(
    {}
  )

  // Flag to track if form is initialized to prevent overwriting user edits
  const [isInitialized, setIsInitialized] = useState(false)

  // 3. Effect: Populate Form when Data Loads
  useEffect(() => {
    if (user && nguoiDung && !isInitialized) {
      // Parse Address
      let addr = { city: '', ward: '', details: '' }
      if (nguoiDung.diaChi && typeof nguoiDung.diaChi === 'object') {
        addr = { ...addr, ...(nguoiDung.diaChi as any) }
      }

      setBasicInfo(prev => ({
        ...prev,
        hoTen: nguoiDung.hoTen || '',
        gioiTinh: nguoiDung.gioiTinh || 'Khác',
        ngaySinh: nguoiDung.ngaySinh || '',
        gioiThieu: nguoiDung.gioiThieu || '',
        linkLinkedIn: nguoiDung.linkLinkedIn || ''
      }))
      setAddress(addr)

      // Tester Specifics
      if (hoSo) {
        const testerProfile = hoSo as HoSoTester
        setBasicInfo(prev => ({
          ...prev,
          soNamKinhNghiem: testerProfile.soNamKinhNghiem?.toString() || ''
        }))
        setNativeLang(testerProfile.ngonNguChinh || '')

        if (
          testerProfile.ngonNguKhac &&
          Array.isArray(testerProfile.ngonNguKhac)
        ) {
          setOtherLangs(testerProfile.ngonNguKhac as any[])
        }

        if (
          testerProfile.thongTinKiemThu &&
          typeof testerProfile.thongTinKiemThu === 'object'
        ) {
          setTestingSettings(
            testerProfile.thongTinKiemThu as Record<string, any>
          )
        }
      }

      setIsInitialized(true)
    }
  }, [user, nguoiDung, hoSo, isInitialized])

  // Handlers
  const handleSave = async () => {
    if (!user) return

    try {
      // 1. Update NguoiDung
      await updateNguoiDungMutation.mutateAsync({
        id: user.id,
        data: {
          hoTen: basicInfo.hoTen,
          gioiTinh: basicInfo.gioiTinh,
          ngaySinh: basicInfo.ngaySinh,
          gioiThieu: basicInfo.gioiThieu,
          linkLinkedIn: basicInfo.linkLinkedIn,
          diaChi: address // Save as JSON
        }
      })

      // 2. Update HoSoTester
      await updateHoSoTesterMutation.mutateAsync({
        id: user.id,
        data: {
          soNamKinhNghiem: parseInt(basicInfo.soNamKinhNghiem) || 0,
          ngonNguChinh: nativeLang,
          ngonNguKhac: otherLangs as any,
          thongTinKiemThu: testingSettings
        }
      })

      toast.success('Cập nhật hồ sơ thành công!')
      // No need to router.refresh() because queryClient invalidates keys
    } catch (error: any) {
      console.error('Error saving profile:', error)
      toast.error('Có lỗi xảy ra: ' + error.message)
    }
  }

  // Language Handlers
  const addLanguage = () => {
    setOtherLangs([
      ...otherLangs,
      { id: Date.now().toString(), name: '', level: 'Cơ bản' }
    ])
  }

  const removeLanguage = (id: string) => {
    setOtherLangs(otherLangs.filter(l => l.id !== id))
  }

  const updateLanguage = (
    id: string,
    field: 'name' | 'level',
    value: string
  ) => {
    setOtherLangs(
      otherLangs.map(l => (l.id === id ? { ...l, [field]: value } : l))
    )
  }

  const isLoading = isLoadingUser || isLoadingNguoiDung || isLoadingHoSo
  const isSaving =
    updateNguoiDungMutation.isPending || updateHoSoTesterMutation.isPending

  if (isLoading && !isInitialized) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hồ Sơ Tester</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin cá nhân và kỹ năng kiểm thử của bạn
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Lưu thay đổi
        </Button>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="basic">Thông tin</TabsTrigger>
          <TabsTrigger value="address">Địa chỉ</TabsTrigger>
          <TabsTrigger value="languages">Ngôn ngữ</TabsTrigger>
          <TabsTrigger value="testing">Cài đặt Test</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="basic">
            <BasicInfoTab data={basicInfo} onChange={setBasicInfo} />
          </TabsContent>

          <TabsContent value="address">
            <AddressTab data={address} onChange={setAddress} />
          </TabsContent>

          <TabsContent value="languages">
            <LanguagesTab
              nativeLang={nativeLang}
              otherLangs={otherLangs}
              onNativeLangChange={setNativeLang}
              onAddLanguage={addLanguage}
              onRemoveLanguage={removeLanguage}
              onUpdateLanguage={updateLanguage}
            />
          </TabsContent>

          <TabsContent value="testing">
            <TestingSettingsTab
              settings={testingSettings}
              onChange={setTestingSettings}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
