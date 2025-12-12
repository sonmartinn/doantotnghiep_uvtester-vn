'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, Resolver } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/ui/button'
import { Form } from '@/ui/form'
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
import { LanguagesTab } from '@/app/_components/dashboard/tester/profile/languages-tab'
import { TestingSettingsTab } from '@/app/_components/dashboard/tester/profile/testing-settings-tab'

// Zod Schema
const profileSchema = z.object({
  // Basic Info
  hoTen: z.string().min(1, 'Họ và tên là bắt buộc'),
  anhDaiDien: z.string().optional(),
  gioiTinh: z.string({ message: 'Vui lòng chọn giới tính' }),
  ngaySinh: z.string().min(1, 'Ngày sinh là bắt buộc'),
  soNamKinhNghiem: z.coerce
    .number({ message: 'Số năm kinh nghiệm là bắt buộc' })
    .min(0, 'Số năm kinh nghiệm phải >= 0'),
  gioiThieu: z.string().optional(),
  linkLinkedIn: z
    .string()
    .optional()
    .refine(
      val => {
        if (!val) return true
        const urlPattern = new RegExp(
          '^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$',
          'i'
        )
        return urlPattern.test(val)
      },
      { message: 'LinkedIn đường dẫn không hợp lệ' }
    ),

  diaChi: z
    .object({
      city: z.string().min(1, 'Vui lòng chọn Tỉnh/Thành phố'),
      ward: z.string().min(1, 'Vui lòng chọn Phường/Xã'),
      details: z.string().min(1, 'Vui lòng nhập địa chỉ cụ thể')
    })
    .optional(),
  ngonNguChinh: z.string().min(1, 'Vui lòng nhập ngôn ngữ chính'),
  ngonNguKhac: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1, 'Tên ngôn ngữ không được để trống'),
        level: z.string().min(1, 'Vui lòng chọn trình độ')
      })
    )
    .optional(),
  thongTinKiemThu: z
    .object({
      willing_to_travel: z.boolean().optional(),
      willing_to_payment_testing: z.boolean().optional(),
      testing_fields: z.array(z.string()).optional(),
      programming_languages: z.array(z.string()).optional(),
      app_types: z.array(z.string()).optional(),
      payment_testing: z.array(z.string()).optional(),
      internet_providers: z.string().optional(),
      weekly_availability: z.coerce.number().optional()
    })
    .refine(
      data => {
        // Check if at least one field has a "truthy" or meaningful value
        return (
          data.willing_to_travel === true ||
          data.willing_to_payment_testing === true ||
          (data.testing_fields && data.testing_fields.length > 0) ||
          (data.programming_languages &&
            data.programming_languages.length > 0) ||
          (data.app_types && data.app_types.length > 0) ||
          (data.payment_testing && data.payment_testing.length > 0) ||
          (data.internet_providers && data.internet_providers.length > 0) ||
          (data.weekly_availability && data.weekly_availability > 0)
        )
      },
      {
        message: 'Vui lòng hoàn thiện ít nhất một thông tin trong Cài đặt Test'
      }
    )
})

type ProfileValues = z.infer<typeof profileSchema>

export default function TesterProfilePage() {
  // 1. Queries
  const { data: user, isLoading: isLoadingUser } = useAuthUser()
  const { data: nguoiDung, isLoading: isLoadingNguoiDung } = useNguoiDung(
    user?.id
  )
  const { data: hoSo, isLoading: isLoadingHoSo } = useHoSoTester(user?.id)

  const isLoading = isLoadingUser || isLoadingNguoiDung || isLoadingHoSo

  // 2. Mutations
  const updateNguoiDungMutation = useUpdateNguoiDung()
  const updateHoSoTesterMutation = useUpdateHoSoTester()

  // 3. Form Setup
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema) as Resolver<ProfileValues>,
    defaultValues: {
      hoTen: '',
      anhDaiDien: '',
      gioiTinh: '', // Initialize as empty string to avoid uncontrolled component warning
      ngaySinh: '',
      soNamKinhNghiem: 0,
      gioiThieu: '',
      linkLinkedIn: '',
      diaChi: { city: '', ward: '', details: '' }
    }
  })

  const [isInitialized, setIsInitialized] = useState(false)

  // 4. Populate Form
  useEffect(() => {
    if (
      user &&
      nguoiDung &&
      !isLoadingUser &&
      !isLoadingNguoiDung &&
      !isLoadingHoSo
    ) {
      // Check if we need to initialize or re-initialize (if data is missing in form)
      const currentValues = form.getValues()
      const needsInit =
        !isInitialized || (currentValues.gioiTinh === '' && nguoiDung.gioiTinh)

      if (needsInit) {
        let addr = { city: '', ward: '', details: '' }
        if (nguoiDung.diaChi && typeof nguoiDung.diaChi === 'object') {
          addr = { ...addr, ...(nguoiDung.diaChi as any) }
        }

        const testerProfile = hoSo as HoSoTester

        form.reset({
          hoTen: nguoiDung.hoTen || '',
          anhDaiDien: nguoiDung.anhDaiDien || '',
          gioiTinh: nguoiDung.gioiTinh ? nguoiDung.gioiTinh.trim() : '',
          ngaySinh: nguoiDung.ngaySinh || '',
          gioiThieu: nguoiDung.gioiThieu || '',
          linkLinkedIn: nguoiDung.linkLinkedIn || '',
          soNamKinhNghiem: testerProfile?.soNamKinhNghiem || 0,
          diaChi: addr,
          ngonNguChinh: testerProfile?.ngonNguChinh || '',
          ngonNguKhac: (testerProfile?.ngonNguKhac as any[]) || [],
          thongTinKiemThu: (() => {
            const info =
              (testerProfile?.thongTinKiemThu as Record<string, any>) || {}
            return {
              ...info,
              testing_fields: Array.isArray(info.testing_fields)
                ? info.testing_fields
                : info.testing_fields
                  ? [info.testing_fields]
                  : [],
              programming_languages: Array.isArray(info.programming_languages)
                ? info.programming_languages
                : info.programming_languages
                  ? [info.programming_languages]
                  : []
            }
          })()
        })

        setIsInitialized(true)
      }
    }
  }, [
    user,
    nguoiDung,
    hoSo,
    isInitialized,
    form,
    isLoadingUser,
    isLoadingNguoiDung,
    isLoadingHoSo
  ])

  // Handlers
  const onSubmit = async (values: ProfileValues) => {
    if (!user) return

    try {
      // 1. Update NguoiDung
      await updateNguoiDungMutation.mutateAsync({
        id: user.id,
        data: {
          hoTen: values.hoTen,
          anhDaiDien: values.anhDaiDien,
          gioiTinh: values.gioiTinh,
          ngaySinh: values.ngaySinh,
          gioiThieu: values.gioiThieu,
          linkLinkedIn: values.linkLinkedIn,
          diaChi: values.diaChi
        }
      })

      // 2. Update HoSoTester
      await updateHoSoTesterMutation.mutateAsync({
        id: user.id,
        data: {
          soNamKinhNghiem: values.soNamKinhNghiem,
          ngonNguChinh: values.ngonNguChinh,
          ngonNguKhac: values.ngonNguKhac as any,
          thongTinKiemThu: values.thongTinKiemThu
        }
      })

      toast.success('Cập nhật hồ sơ thành công!')
    } catch (error: any) {
      console.error('Error saving profile:', error)
      toast.error('Có lỗi xảy ra: ' + error.message)
    }
  }

  const onInvalid = (errors: any) => {
    const FIELD_LABELS: Record<string, string> = {
      hoTen: 'Họ và tên',
      gioiTinh: 'Giới tính',
      ngaySinh: 'Ngày sinh',
      soNamKinhNghiem: 'Số năm kinh nghiệm',
      gioiThieu: 'Giới thiệu',
      linkLinkedIn: 'LinkedIn',
      diaChi: 'Địa chỉ',
      ngonNguChinh: 'Ngôn ngữ chính',
      ngonNguKhac: 'Ngôn ngữ khác',
      thongTinKiemThu:
        'Vui lòng hoàn thiện ít nhất một thông tin trong Cài đặt Test'
    }

    const errorFields = Object.keys(errors)
      .map(key => FIELD_LABELS[key] || key)
      .filter(Boolean)

    toast.error('Vui lòng kiểm tra lại thông tin', {
      description: (
        <div className="mt-2 text-sm text-red-500">
          <p className="text-foreground mb-1 font-semibold">Các trường lỗi:</p>
          <ul className="list-disc space-y-1 pl-4">
            {errorFields.map(field => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      ),
      duration: 5000
    })
    console.error('Form errors:', errors)
  }

  const isSaving =
    updateNguoiDungMutation.isPending || updateHoSoTesterMutation.isPending

  // Error checking for Tabs
  const errors = form.formState.errors
  const hasBasicError =
    errors.hoTen ||
    errors.gioiTinh ||
    errors.ngaySinh ||
    errors.soNamKinhNghiem ||
    errors.gioiThieu ||
    errors.linkLinkedIn

  const hasAddressError = errors.diaChi

  const hasLangError = errors.ngonNguChinh || errors.ngonNguKhac

  const hasTestError = errors.thongTinKiemThu

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
            Quản lý thông tin cá nhân và cài đặt kiểm thử giúp bạn khớp với các
            yêu cầu kiểm thử
          </p>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit, onInvalid)}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Lưu thay đổi
        </Button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-8"
        >
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="basic" className="relative">
                Thông tin
                {hasBasicError && (
                  <span className="bg-destructive absolute top-2 right-2 h-2 w-2 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger value="address" className="relative">
                Địa chỉ
                {hasAddressError && (
                  <span className="bg-destructive absolute top-2 right-2 h-2 w-2 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger value="languages" className="relative">
                Ngôn ngữ
                {hasLangError && (
                  <span className="bg-destructive absolute top-2 right-2 h-2 w-2 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger value="testing" className="relative">
                Cài đặt Test
                {hasTestError && (
                  <span className="bg-destructive absolute top-2 right-2 h-2 w-2 rounded-full" />
                )}
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="basic">
                {/* BasicInfoTab now uses useFormContext internally */}
                <BasicInfoTab />
              </TabsContent>

              <TabsContent value="address">
                {/* AddressTab now uses useFormContext */}
                <AddressTab />
              </TabsContent>

              <TabsContent value="languages">
                {/* LanguagesTab remains state-driven for now */}
                <LanguagesTab />
              </TabsContent>

              <TabsContent value="testing">
                {/* TestingSettingsTab remains state-driven for now */}
                <TestingSettingsTab />
              </TabsContent>
            </div>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}
