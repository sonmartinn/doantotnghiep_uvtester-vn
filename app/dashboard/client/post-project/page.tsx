'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Send,
  LockKeyhole
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, type Resolver, FormProvider } from 'react-hook-form'
import { toast } from 'sonner'

import {
  useAuthUser,
  useCreateDuAn,
  useNguoiDung,
  useHoSoClient
} from '@/app/_services/queries'
import { checkProfileCompletion } from '@/app/_services/data-service'
import ProfileAlert from '@/app/_components/dashboard/profile-alert'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/button'
import { projectSchema, type ProjectValues } from './schema'

// Import Step Components
import { Step1GeneralInfo } from './steps/step-1-general'
import { Step2TechnicalSpecs } from './steps/step-2-technical'
import { Step3ScopeSurvey } from './steps/step-3-scope'
import { Step4TimelinePayment } from './steps/step-4-timeline'

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const STEPS = [
  { id: 1, title: 'Thông tin chung', desc: 'Cơ bản về dự án' },
  { id: 2, title: 'Kỹ thuật & Môi trường', desc: 'Hướng dẫn & Yêu cầu' },
  { id: 3, title: 'Phạm vi & Khảo sát', desc: 'Scope & Screening' },
  { id: 4, title: 'Thời gian & Thanh toán', desc: 'Hoàn tất' }
]

export default function PostProjectWizardPage() {
  const router = useRouter()
  const { data: user } = useAuthUser()
  const { data: nguoiDung } = useNguoiDung(user?.id)
  const { data: hoSoClient } = useHoSoClient(user?.id)
  const createDuAnMutation = useCreateDuAn()
  const [currentStep, setCurrentStep] = useState(1)

  // -- Check Profile Logic --
  const { percent } = checkProfileCompletion(
    nguoiDung || null,
    hoSoClient || null
  )

  const form = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema) as Resolver<ProjectValues>,
    defaultValues: {
      tieuDe: 'Dự án Kiểm thử App Mobile Banking 2025',
      loaiDuAn: 'Exploratory',
      moTa: 'Chúng tôi cần kiểm thử tính năng chuyển khoản nhanh 24/7 và thanh toán QR code trên ứng dụng mobile banking mới. Yêu cầu tập trung vào trải nghiệm người dùng và độ ổn định.',
      soLuongCanTuyen: 10,
      nganSach: 5000000,
      huongDanTruyCap:
        'Truy cập https://test-app.bank.com. Tài khoản: testuser/password123. Tải file APK tại đây.',
      huongDanKyThuat:
        'Sử dụng Charles Proxy để bắt API log. Chú ý các endpoint /transfer và /payment.',
      env_device: 'Thiết bị Mobile, PC, Laptop',
      env_os: 'iOS 15, Android 12',
      env_browser: 'Safari, Chrome Mobile',
      scope_in: [
        { value: 'Chức năng chuyển khoản' },
        { value: 'Quét QR Code' },
        { value: 'Lịch sử giao dịch' }
      ],
      scope_out: [
        { value: 'Màn hình cài đặt' },
        { value: 'Đổi mật khẩu' },
        { value: 'Các vấn đề về UI/UX' }
      ],
      cauHoiKhaoSat: [
        {
          question: 'Bạn đã từng sử dụng app ngân hàng nào chưa?',
          type: 'Radio',
          options: ['Rồi', 'Chưa']
        },
        {
          question: 'Thiết bị chính bạn đang dùng là gì?',
          type: 'Text',
          options: []
        }
      ],
      pay_perBug: 50000,
      pay_perCompletion: 200000,
      thoiHanUngTuyen: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      thoiHanDuAn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    },
    mode: 'onChange'
  })

  if (percent < 100) {
    return (
      <div className="container mx-auto max-w-5xl py-8">
        <h1 className="mb-6 text-2xl font-bold">Đăng dự án mới</h1>
        <ProfileAlert profile={nguoiDung || null} hoSo={hoSoClient || null} />
        <div className="text-muted-foreground mt-8 flex flex-col items-center justify-center gap-4 text-center">
          <p>Vui lòng hoàn thiện hồ sơ để mở khóa tính năng đăng dự án.</p>
          <LockKeyhole className="text-muted-foreground/20 h-32 w-32" />
        </div>
      </div>
    )
  }

  // Navigation Logic
  const nextStep = async (e: React.MouseEvent) => {
    e.preventDefault()
    let fieldsToValidate: any[] = []

    if (currentStep === 1) {
      fieldsToValidate = [
        'tieuDe',
        'loaiDuAn',
        'moTa',
        'nganSach',
        'soLuongCanTuyen'
      ]
    } else if (currentStep === 2) {
      fieldsToValidate = [
        'huongDanTruyCap',
        'huongDanKyThuat',
        'env_device',
        'env_os',
        'env_browser'
      ]
    } else if (currentStep === 3) {
      fieldsToValidate = ['scope_in', 'scope_out', 'cauHoiKhaoSat']
    } else if (currentStep === 4) {
      fieldsToValidate = [
        'thoiHanUngTuyen',
        'thoiHanDuAn',
        'pay_perBug',
        'pay_perCompletion'
      ]
    }

    const isValid = await form.trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
      window.scrollTo(0, 0)
    }
  }

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentStep(prev => Math.max(prev - 1, 1))
    window.scrollTo(0, 0)
  }

  // Submit Handler
  const onSubmit = async (values: ProjectValues) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập!')
      return
    }

    try {
      // Transform UI data to Database Schema
      const payload = {
        maNguoiTao: user.id,
        maDuAnHienThi: 'PENDING', // Will be updated by DB Trigger
        tieuDe: values.tieuDe,
        loaiDuAn: values.loaiDuAn,
        moTa: values.moTa,
        soLuongCanTuyen: values.soLuongCanTuyen,
        nganSach: values.nganSach,
        thoiHanUngTuyen: values.thoiHanUngTuyen.toISOString(),
        thoiHanDuAn: values.thoiHanDuAn.toISOString(),
        huongDanTruyCap: values.huongDanTruyCap,
        huongDanKyThuat: values.huongDanKyThuat,
        taiLieuDinhKem: values.taiLieuDinhKem
          ? JSON.stringify(values.taiLieuDinhKem)
          : null,

        // JSONB Transformations
        yeuCauMoiTruong: {
          devices: values.env_device
            ? values.env_device.split(',').map(s => s.trim())
            : [],
          os: values.env_os ? values.env_os.split(',').map(s => s.trim()) : [],
          browser: values.env_browser
            ? values.env_browser.split(',').map(s => s.trim())
            : []
        },
        phamViTest: {
          inScope: values.scope_in?.map(i => i.value).filter(Boolean) || [],
          outScope: values.scope_out?.map(i => i.value).filter(Boolean) || []
        },
        cauHoiKhaoSat: values.cauHoiKhaoSat || [],
        cauHinhThanhToan: {
          perBug: values.pay_perBug || 0,
          perCompletion: values.pay_perCompletion || 0
        },

        trangThaiDuAn: 'DangTuyen',
        ngayTao: new Date().toISOString()
      }

      const result = await createDuAnMutation.mutateAsync(payload)

      if (payload.loaiDuAn === 'TestCase' && result) {
        toast.success('Dự án nháp đã được tạo. Vui lòng thiết lập kịch bản.')
        router.push(
          `/dashboard/client/projects/${result.maDuAn}/setup-test-cases`
        )
      } else {
        toast.success('Đăng dự án thành công!')
        router.push('/dashboard/client/projects')
      }
    } catch (error: any) {
      console.error(error)
      toast.error('Có lỗi xảy ra: ' + error.message)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1GeneralInfo />
      case 2:
        return <Step2TechnicalSpecs />
      case 3:
        return <Step3ScopeSurvey />
      case 4:
        return <Step4TimelinePayment />
      default:
        return null
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Đăng Dự Án Mới</h1>
        <p className="text-muted-foreground">
          Thực hiện theo 4 bước để thiết lập dự án crowdtesting của bạn
        </p>
      </div>

      {/* Steps Indicator */}
      <div className="grid grid-cols-4 gap-4">
        {STEPS.map(step => {
          const isActive = step.id === currentStep
          const isPast = step.id < currentStep
          return (
            <div key={step.id} className="relative flex flex-col gap-2">
              <div
                className={cn(
                  'h-2 w-full rounded-full transition-colors',
                  isActive
                    ? 'bg-primary'
                    : isPast
                      ? 'bg-primary/60'
                      : 'bg-muted'
                )}
              />
              <div className="flex flex-col px-1">
                <span
                  className={cn(
                    'text-xs font-semibold uppercase',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  Bước {step.id}
                </span>
                <span className="text-sm font-medium">{step.title}</span>
              </div>
            </div>
          )
        })}
      </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || createDuAnMutation.isPending}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại
            </Button>

            {currentStep < STEPS.length ? (
              <Button type="button" onClick={nextStep}>
                Tiếp tục <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={createDuAnMutation.isPending}>
                {createDuAnMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Đăng dự án <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
