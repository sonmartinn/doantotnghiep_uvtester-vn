'use client'

import { ClientBasicInfoTab } from '@/app/_components/dashboard/client/profile/client-basic-info-tab'
import { CompanyInfoTab } from '@/app/_components/dashboard/client/profile/company-info-tab'
import {
  useAuthUser,
  useHoSoClient,
  useNguoiDung,
  useUpdateHoSoClient,
  useUpdateNguoiDung
} from '@/app/_services/queries'
import { Button } from '@/ui/button'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const clientProfileSchema = z.object({
  // Basic Info
  hoTen: z.string().min(1, 'Họ và tên là bắt buộc'),
  anhDaiDien: z.string().optional(),
  gioiTinh: z
    .string({ message: 'Vui lòng chọn giới tính' })
    .min(1, 'Vui lòng chọn giới tính'),
  gioiThieu: z.string().optional(),
  ngaySinh: z.string().min(1, 'Vui lòng chọn ngày sinh'),
  diaChi: z
    .object({
      city: z.string().min(1, 'Vui lòng chọn Tỉnh/Thành phố'),
      ward: z.string().min(1, 'Vui lòng chọn Phường/Xã'),
      details: z.string().min(1, 'Vui lòng nhập địa chỉ cụ thể')
    })
    .optional(),
  viTriCongViec: z.string().min(1, 'Vui lòng nhập vị trí công việc'),

  // Company Info
  tenCongTy: z.string().min(1, 'Tên công ty là bắt buộc'),
  maSoThue: z
    .string()
    .min(1, 'Vui lòng nhập mã số thuế')
    .regex(/^\d+$/, 'Mã số thuế phải là số'),
  website: z
    .string()
    .url('Link website không hợp lệ')
    .optional()
    .or(z.literal('')),
  linhVucHoatDong: z.string().min(1, 'Vui lòng nhập lĩnh vực hoạt động'),
  quyMoCongTy: z.string().min(1, 'Vui lòng chọn quy mô công ty'),
  soDienThoai: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .refine(
      val => {
        if (!val) return false
        const parts = val.split(' ')
        // Required: must have code and number
        if (parts.length < 2 || !parts[1] || parts[1].trim() === '') {
          return false
        }
        const numberPart = parts[1]
        // Check numeric and length (9 to 15 digits)
        return (
          /^\d+$/.test(numberPart) &&
          numberPart.length >= 9 &&
          numberPart.length <= 15
        )
      },
      { message: 'Số điện thoại phải là số và bao gồm từ 9 đến 15 số' }
    )
})

type ClientProfileValues = z.infer<typeof clientProfileSchema>

export default function ClientProfilePage() {
  const { data: user, isLoading: isLoadingUser } = useAuthUser()
  const { data: nguoiDung, isLoading: isLoadingNguoiDung } = useNguoiDung(
    user?.id
  )
  const { data: hoSoClient, isLoading: isLoadingHoSo } = useHoSoClient(user?.id)

  const updateNguoiDungMutation = useUpdateNguoiDung()
  const updateHoSoClientMutation = useUpdateHoSoClient()

  const isLoading = isLoadingUser || isLoadingNguoiDung || isLoadingHoSo

  const form = useForm<ClientProfileValues>({
    resolver: zodResolver(clientProfileSchema),
    defaultValues: {
      hoTen: '',
      anhDaiDien: '',
      gioiTinh: '',
      gioiThieu: '',
      ngaySinh: '',
      viTriCongViec: '',
      tenCongTy: '',
      maSoThue: '',
      website: '',
      linhVucHoatDong: '',
      quyMoCongTy: '',
      soDienThoai: ''
    }
  })

  const [isInitialized, setIsInitialized] = useState(false)

  // Populate form when data loads
  useEffect(() => {
    if (nguoiDung && !isLoadingNguoiDung && !isLoadingHoSo) {
      // Check if we need to initialize or re-initialize (if data is missing in form)
      const currentValues = form.getValues()
      // If initialized but gender is still empty while DB has gender, trigger re-init
      // Also check if company info is missing but hoSoClient has data
      const needsInit =
        !isInitialized ||
        (currentValues.gioiTinh === '' && nguoiDung.gioiTinh) ||
        (hoSoClient && currentValues.tenCongTy === '' && hoSoClient.tenCongTy)

      if (needsInit) {
        let addr = {}
        if (nguoiDung.diaChi && typeof nguoiDung.diaChi === 'object') {
          addr = { ...addr, ...(nguoiDung.diaChi as any) }
        }

        form.reset({
          hoTen: nguoiDung.hoTen || '',
          anhDaiDien: nguoiDung.anhDaiDien || '',
          gioiTinh: nguoiDung.gioiTinh ? nguoiDung.gioiTinh.trim() : '',
          gioiThieu: nguoiDung.gioiThieu || '',
          ngaySinh: nguoiDung.ngaySinh || '',
          diaChi: addr as any,
          viTriCongViec: hoSoClient?.viTriCongViec || '',
          tenCongTy: hoSoClient?.tenCongTy || '',
          maSoThue: hoSoClient?.maSoThue || '',
          website: hoSoClient?.website || '',
          linhVucHoatDong: hoSoClient?.linhVucHoatDong || '',
          quyMoCongTy: hoSoClient?.quyMoCongTy || '',
          soDienThoai: hoSoClient?.soDienThoai || ''
        })
        setIsInitialized(true)
      }
    }
  }, [
    nguoiDung,
    hoSoClient,
    form,
    isLoadingNguoiDung,
    isLoadingHoSo,
    isInitialized
  ])

  async function onSubmit(values: ClientProfileValues) {
    if (!user) return

    try {
      // 1. Update NguoiDung
      await updateNguoiDungMutation.mutateAsync({
        id: user.id,
        data: {
          hoTen: values.hoTen,
          anhDaiDien: values.anhDaiDien,
          gioiTinh: values.gioiTinh,
          gioiThieu: values.gioiThieu,
          ngaySinh: values.ngaySinh,
          diaChi: values.diaChi
        }
      })

      // 2. Update HoSoClient
      await updateHoSoClientMutation.mutateAsync({
        id: user.id,
        data: {
          tenCongTy: values.tenCongTy,
          maSoThue: values.maSoThue,
          viTriCongViec: values.viTriCongViec,
          website: values.website,
          linhVucHoatDong: values.linhVucHoatDong,
          quyMoCongTy: values.quyMoCongTy,
          soDienThoai: values.soDienThoai
        }
      })

      toast.success('Cập nhật hồ sơ thành công')
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi cập nhật hồ sơ')
    }
  }

  const onInvalid = (errors: any) => {
    const FIELD_LABELS: Record<string, string> = {
      hoTen: 'Họ và tên',
      gioiTinh: 'Giới tính',
      ngaySinh: 'Ngày sinh',
      diaChi: 'Địa chỉ',
      viTriCongViec: 'Vị trí công việc',
      gioiThieu: 'Giới thiệu',
      tenCongTy: 'Tên Công ty',
      maSoThue: 'Mã số thuế',
      website: 'Website',
      linhVucHoatDong: 'Lĩnh vực hoạt động',
      quyMoCongTy: 'Quy mô công ty',
      soDienThoai: 'Số điện thoại'
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

  // Error checking for Tabs
  const errors = form.formState.errors
  const hasBasicError =
    errors.hoTen ||
    errors.gioiTinh ||
    errors.ngaySinh ||
    errors.viTriCongViec ||
    errors.gioiThieu ||
    errors.diaChi

  const hasCompanyError =
    errors.tenCongTy ||
    errors.maSoThue ||
    errors.website ||
    errors.linhVucHoatDong ||
    errors.quyMoCongTy ||
    errors.soDienThoai

  if (isLoading && !isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hồ sơ Client</h2>
          <p className="text-muted-foreground">
            Quản lý thông tin cá nhân và thông tin doanh nghiệp của bạn.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-8"
        >
          <Tabs defaultValue="basic" className="w-full">
            <TabsList>
              <TabsTrigger value="basic" className="relative px-6">
                Thông tin cơ bản
                {hasBasicError && (
                  <span className="bg-destructive absolute top-2 right-2 h-2 w-2 rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger value="company" className="relative px-6">
                Thông tin Công ty
                {hasCompanyError && (
                  <span className="bg-destructive absolute top-2 right-2 h-2 w-2 rounded-full" />
                )}
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="basic">
                <ClientBasicInfoTab />
              </TabsContent>
              <TabsContent value="company">
                <CompanyInfoTab />
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Save className="mr-2 h-4 w-4" />
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
