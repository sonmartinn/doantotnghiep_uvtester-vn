'use client'

import { useCreateKichBan, useUpdateKichBan } from '@/app/_services/queries'
import { Button } from '@/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/ui/form'
import { Input } from '@/ui/input'
import { Textarea } from '@/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/ui/tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Info, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ImportModal } from './import-modal'
import { testCaseSchema, type TestCaseValues } from './schema'

interface TestCaseFormProps {
  projectId: number
  editingId: number | null
  initialData: TestCaseValues | null
  nextIdSuffix: number
  onCancelEdit: () => void
  onSuccess: () => void
  onImport: (ids: number[]) => Promise<void>
}

export function TestCaseForm({
  projectId,
  editingId,
  initialData,
  nextIdSuffix,
  onCancelEdit,
  onSuccess,
  onImport
}: TestCaseFormProps) {
  const createMutation = useCreateKichBan()
  const updateMutation = useUpdateKichBan()

  const form = useForm<TestCaseValues>({
    resolver: zodResolver(testCaseSchema),
    defaultValues: {
      tieuDe: '',
      dieuKienTienQuyet: '',
      yeuCauBangChung: '',
      cacBuocThucHien: [{ buoc: 1, moTa: '', ketQuaMongDoi: '' }],
      cauHoiBoSung: []
    }
  })

  // Sync form with initialData when editing
  useEffect(() => {
    if (editingId && initialData) {
      form.reset(initialData)
    } else if (!editingId) {
      form.reset({
        tieuDe: '',
        dieuKienTienQuyet: '',
        yeuCauBangChung: '',
        cacBuocThucHien: [{ buoc: 1, moTa: '', ketQuaMongDoi: '' }],
        cauHoiBoSung: []
      })
    }
  }, [editingId, initialData, form])

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep
  } = useFieldArray({
    control: form.control,
    name: 'cacBuocThucHien'
  })

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion
  } = useFieldArray({
    control: form.control,
    name: 'cauHoiBoSung'
  })

  const onSubmit = async (values: TestCaseValues) => {
    try {
      const payload = {
        maDuAn: projectId,
        tieuDe: values.tieuDe,
        dieuKienTienQuyet: values.dieuKienTienQuyet,
        yeuCauBangChung: values.yeuCauBangChung,
        cacBuocThucHien: JSON.parse(JSON.stringify(values.cacBuocThucHien)),
        cauHoiBoSung: values.cauHoiBoSung
          ? JSON.parse(JSON.stringify(values.cauHoiBoSung))
          : []
      }

      if (editingId) {
        await updateMutation.mutateAsync({
          maKichBan: editingId,
          data: payload
        })
        toast.success('Cập nhật kịch bản thành công!')
      } else {
        await createMutation.mutateAsync({
          ...payload,
          maKichBanHienThi: `TC-${String(nextIdSuffix).padStart(2, '0')}`,
          soThuTu: nextIdSuffix - 1 // 0-based index
        })
        toast.success('Thêm kịch bản thành công!')
        form.reset({
          tieuDe: '',
          dieuKienTienQuyet: '',
          yeuCauBangChung: '',
          cacBuocThucHien: [{ buoc: 1, moTa: '', ketQuaMongDoi: '' }],
          cauHoiBoSung: []
        })
      }
      onSuccess()
    } catch (error: any) {
      console.error(error)
      toast.error('Lỗi: ' + error.message)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-start justify-between gap-4 space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>
              {editingId ? 'Cập nhật Kịch bản' : 'Thêm Kịch bản mới'}
            </CardTitle>
            <CardDescription>
              {editingId
                ? 'Chỉnh sửa thông tin kịch bản đang chọn.'
                : 'Mô tả các bước cần thực hiện và kết quả mong đợi.'}
            </CardDescription>
          </div>
          {!editingId && <ImportModal onImport={onImport} />}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="tieuDe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tiêu đề kịch bản <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Đăng nhập thành công"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dieuKienTienQuyet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Điều kiện tiên quyết (nếu có)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Đã có tài khoản active"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel>
                    Các bước thực hiện <span className="text-red-500">*</span>
                  </FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendStep({
                        buoc: stepFields.length + 1,
                        moTa: '',
                        ketQuaMongDoi: ''
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" /> Thêm bước
                  </Button>
                </div>

                <div className="space-y-3">
                  {stepFields.map((field, index) => (
                    <Card key={field.id} className="bg-muted/20 relative p-3">
                      <div className="absolute top-2 right-2">
                        {stepFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive h-6 w-6"
                            onClick={() => removeStep(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid gap-3">
                        <div className="text-muted-foreground text-xs font-medium">
                          Bước {index + 1}
                        </div>

                        <FormField
                          control={form.control}
                          name={`cacBuocThucHien.${index}.moTa`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Mô tả hành động..."
                                  className="min-h-[60px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`cacBuocThucHien.${index}.ketQuaMongDoi`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Kết quả mong đợi..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
                <FormMessage>
                  {form.formState.errors.cacBuocThucHien?.message ||
                    form.formState.errors.cacBuocThucHien?.root?.message}
                </FormMessage>
              </div>

              <FormField
                control={form.control}
                name="yeuCauBangChung"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>Yêu cầu bằng chứng</FormLabel>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-pointer">
                            <Info className="text-muted-foreground hover:text-foreground h-4 w-4" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-popover text-popover-foreground max-w-sm p-4 text-sm shadow-xl">
                          <p>
                            Lời yêu cầu để Tester cung cấp các file ảnh/video
                            bằng chứng đính kèm. Bạn có thể để trống trường này!
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="VD: Ảnh chụp màn hình, Video..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Additional Questions Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel className="flex items-center gap-2">
                    Câu hỏi bổ sung (nếu có)
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-pointer">
                          <Info className="text-muted-foreground hover:text-foreground h-4 w-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover text-popover-foreground max-w-sm p-4 text-sm shadow-xl">
                        <p>
                          Các câu hỏi bổ sung (nếu có) để Tester trả lời. VD:
                          &quot;Bạn đã sử dụng phương tiện gì để di chuyển đến
                          địa điểm đại lý trên?&quot;
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendQuestion({ cauHoi: '' })}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Thêm câu hỏi
                  </Button>
                </div>

                <div className="space-y-3">
                  {questionFields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-2">
                      <FormField
                        control={form.control}
                        name={`cauHoiBoSung.${index}.cauHoi`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder={`Câu hỏi ${index + 1}...`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive mt-0.5 shrink-0"
                        onClick={() => removeQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {editingId && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancelEdit}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Hủy
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    'Đang xử lý...'
                  ) : editingId ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Cập nhật TC
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" /> Thêm vào danh sách
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
