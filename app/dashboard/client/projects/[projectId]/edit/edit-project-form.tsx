'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Resolver } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState } from 'react'

import { Button } from '@/ui/button'
import { Badge } from '@/ui/badge'
import { Form } from '@/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/ui/alert'
import { Loader2, ArrowLeft, Save, AlertTriangle } from 'lucide-react'

// Steps
import { Step1GeneralInfo } from '@/app/_components/dashboard/client/post-edit/steps/step-1-general'
import { Step2TechnicalSpecs } from '@/app/_components/dashboard/client/post-edit/steps/step-2-technical'
import { Step3ScopeSurvey } from '@/app/_components/dashboard/client/post-edit/steps/step-3-scope'
import { Step4TimelinePayment } from '@/app/_components/dashboard/client/post-edit/steps/step-4-timeline'

import {
  projectSchema,
  ProjectValues
} from '@/app/dashboard/client/post-project/schema'
import { useUpdateDuAn } from '@/app/_services/queries'
import { DuAn } from '@/app/_services/data-service'
import { getStatusColor, getStatusLabel } from '@/lib/project-helpers'

interface ProjectEditFormProps {
  project: DuAn
}

export function ProjectEditForm({ project }: ProjectEditFormProps) {
  const router = useRouter()
  const updateMutation = useUpdateDuAn()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Status logic
  const isFullEdit =
    project.trangThaiDuAn === 'Nhap' || project.trangThaiDuAn === 'DaDong'
  const isPartialEdit =
    project.trangThaiDuAn === 'DangTuyen' ||
    project.trangThaiDuAn === 'DangTienHanh'
  const isReadOnly = !isFullEdit && !isPartialEdit

  // Mapping logic: DuAn -> ProjectValues
  const defaultValues: Partial<ProjectValues> = {
    // Step 1
    tieuDe: project.tieuDe || '',
    loaiDuAn: (project.loaiDuAn as any) || 'Exploratory',
    moTa: project.moTa || '',
    nganSach: project.nganSach || 0,
    soLuongCanTuyen: project.soLuongCanTuyen || 1,

    // Step 2
    huongDanTruyCap: project.huongDanTruyCap || '',
    huongDanKyThuat: project.huongDanKyThuat || '',
    // @ts-ignore
    // @ts-ignore
    taiLieuDinhKem: (() => {
      try {
        if (Array.isArray(project.taiLieuDinhKem)) return project.taiLieuDinhKem
        if (typeof project.taiLieuDinhKem === 'string')
          return JSON.parse(project.taiLieuDinhKem)
        return []
      } catch {
        return []
      }
    })(),

    // JSONB Fields mapping
    env_device: (() => {
      const devices = (project.yeuCauMoiTruong as any)?.devices
      if (Array.isArray(devices)) return devices
      if (typeof devices === 'string')
        return devices.split(',').map((s: string) => s.trim())
      return []
    })(),
    env_os: (project.yeuCauMoiTruong as any)?.os?.join(', ') || '',
    env_browser: (project.yeuCauMoiTruong as any)?.browser?.join(', ') || '',

    // Step 3
    scope_in:
      (project.phamViTest as any)?.inScope?.map((s: string) => ({
        value: s
      })) || [],
    scope_out:
      (project.phamViTest as any)?.outScope?.map((s: string) => ({
        value: s
      })) || [],
    cauHoiKhaoSat: (project.cauHoiKhaoSat as any) || [],

    // Step 4
    thoiHanUngTuyen: project.thoiHanUngTuyen
      ? new Date(project.thoiHanUngTuyen)
      : undefined,
    thoiHanDuAn: project.thoiHanDuAn
      ? new Date(project.thoiHanDuAn)
      : undefined,
    pay_perBug: (project.cauHinhThanhToan as any)?.perBug || 0,
    pay_perCompletion: (project.cauHinhThanhToan as any)?.perCompletion || 0
  }

  const form = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema) as Resolver<ProjectValues>,
    defaultValues
  })

  async function onSubmit(data: ProjectValues) {
    if (isReadOnly) return

    setIsSubmitting(true)
    try {
      // Map back to DB schema
      const updateData: Partial<DuAn> = {
        // Only update fields allowed by status
      }

      const allFields = {
        tieuDe: data.tieuDe,
        loaiDuAn: data.loaiDuAn,
        moTa: data.moTa,
        nganSach: data.nganSach,
        soLuongCanTuyen: data.soLuongCanTuyen,
        huongDanTruyCap: data.huongDanTruyCap,
        huongDanKyThuat: data.huongDanKyThuat,
        taiLieuDinhKem: data.taiLieuDinhKem,
        yeuCauMoiTruong: {
          devices: data.env_device || [],
          os: data.env_os ? data.env_os.split(',').map(s => s.trim()) : [],
          browser: data.env_browser
            ? data.env_browser.split(',').map(s => s.trim())
            : []
        },
        phamViTest: {
          inScope: data.scope_in?.map(s => s.value) || [],
          outScope: data.scope_out?.map(s => s.value) || []
        },
        cauHoiKhaoSat: data.cauHoiKhaoSat,
        thoiHanUngTuyen: data.thoiHanUngTuyen.toISOString(),
        thoiHanDuAn: data.thoiHanDuAn.toISOString(),
        cauHinhThanhToan: {
          perBug: data.pay_perBug || 0,
          perCompletion: data.pay_perCompletion || 0
        }
      }

      if (isPartialEdit) {
        // Only update instructions
        updateData.huongDanTruyCap = data.huongDanTruyCap
        updateData.huongDanKyThuat = data.huongDanKyThuat
        // Also attachments as they are related to instructions
        updateData.taiLieuDinhKem = data.taiLieuDinhKem
      } else if (isFullEdit) {
        // Update all
        Object.assign(updateData, allFields)
      } else {
        toast.error('Không thể chỉnh sửa dự án ở trạng thái này')
        return
      }

      await updateMutation.mutateAsync({
        maDuAn: project.maDuAn,
        data: updateData
      })

      toast.success('Cập nhật dự án thành công')
      router.push(`/dashboard/client/projects/${project.maDuAn}`)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi cập nhật dự án')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onInvalid = (errors: any) => {
    const errorMessages = Object.values(errors)
      .map((error: any) => error.message)
      .join('\n')

    toast.error('Vui lòng kiểm tra lại thông tin:', {
      description: errorMessages || 'Có trường thông tin chưa hợp lệ'
    })
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Chỉnh sửa dự án: {project.maDuAnHienThi}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Trạng thái: </span>
            <Badge className={getStatusColor(project.trangThaiDuAn)}>
              {getStatusLabel(project.trangThaiDuAn)}
            </Badge>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-8"
        >
          {isPartialEdit && (
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Lưu ý</AlertTitle>
              <AlertDescription>
                Dự án đang trong giai đoạn tuyển dụng hoặc đang tiến hành. Bạn
                chỉ có thể chỉnh sửa hướng dẫn và tài liệu đính kèm.{' '}
                <span className="block font-semibold">
                  Bạn phải đóng dự án để chỉnh sửa tất cả thông tin.
                </span>
              </AlertDescription>
            </Alert>
          )}

          {/* Step 1: General Info */}
          <Step1GeneralInfo disabled={!isFullEdit} />

          {/* Step 2: Technical Specs */}
          {/*
              isFullEdit -> disabled=false, disabledEnv=false
              isPartialEdit -> disabled=false (instructions editable), disabledEnv=true
              isReadOnly -> disabled=true, disabledEnv=true
            */}
          <Step2TechnicalSpecs
            disabled={isReadOnly}
            disabledEnv={!isFullEdit}
          />

          {/* Step 3: Scope & Survey */}
          <Step3ScopeSurvey disabled={!isFullEdit} />

          {/* Step 4: Timeline & Payment */}
          <Step4TimelinePayment disabled={!isFullEdit} />

          <div className="fixed right-0 bottom-0 left-0 z-50 border-t bg-white p-4 shadow-lg dark:bg-gray-950">
            <div className="container mx-auto flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Hủy
              </Button>
              {!isReadOnly && (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
