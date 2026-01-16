import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Loader2, Plus, Trash2, Upload, X, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

import { bugReportSchema, BugReportFormValues } from './schema'

interface BugReportFormProps {
  projectId: number
  userId: string
  projectCode: string
  onSuccess: () => void
}

export function BugReportForm({
  projectId,
  userId,
  projectCode,
  onSuccess
}: BugReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  const form = useForm<BugReportFormValues>({
    resolver: zodResolver(bugReportSchema),
    defaultValues: {
      tieuDe: '',
      cacBuocTaiHien: [{ step: '' }],
      ketQuaThucTe: '',
      ketQuaMongDoi: '',
      mucDoNghiemTrong: '',
      khaNangTaiTao: ''
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'cacBuocTaiHien'
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files || [])])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: BugReportFormValues) => {
    try {
      setIsSubmitting(true)

      // 1. Upload files
      const fileUrls: string[] = []
      if (files.length > 0) {
        setUploading(true)
        for (const file of files) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Date.now()}_${Math.random()
            .toString(36)
            .substring(2)}.${fileExt}`
          const filePath = `bugs/${projectId}/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('test_cases_attachments')
            .upload(filePath, file)

          if (uploadError) {
            console.error('Upload error:', uploadError)
            toast.error(`Không thể tải lên file ${file.name}`)
            // Continue with other files or stop? Let's continue but maybe warn.
            // For simplicity, failing to upload a file won't block the report but won't attach it.
            continue
          }

          const { data: publicUrlData } = supabase.storage
            .from('test_cases_attachments')
            .getPublicUrl(filePath)

          fileUrls.push(publicUrlData.publicUrl)
        }
        setUploading(false)
      }

      // 2. Calculate next Bug ID
      const { count } = await supabase
        .from('BaoCaoLoi')
        .select('*', { count: 'exact', head: true })
        .eq('maDuAn', projectId)

      const nextBugNumber = (count || 0) + 1
      const maLoiHienThi = `${projectCode}-${nextBugNumber}`

      // 3. Insert into BaoCaoLoi
      const { error } = await supabase.from('BaoCaoLoi').insert({
        maDuAn: projectId,
        maNguoiBaoCao: userId,
        tieuDe: data.tieuDe,
        cacBuocTaiHien: data.cacBuocTaiHien.map(s => s.step), // Store as array of strings
        ketQuaThucTe: data.ketQuaThucTe,
        ketQuaMongDoi: data.ketQuaMongDoi,
        mucDoNghiemTrong: data.mucDoNghiemTrong,
        khaNangTaiTao: data.khaNangTaiTao,
        fileBangChung: fileUrls.length > 0 ? fileUrls : null,
        trangThaiLoi: 'DangXuLy',
        maLoiHienThi: maLoiHienThi
      })

      if (error) throw error

      // 4. Create Notification for Client
      try {
        const { data: projectData } = await supabase
          .from('DuAn')
          .select('maNguoiTao, tieuDe')
          .eq('maDuAn', projectId)
          .single()

        if (projectData) {
          await supabase.from('ThongBao').insert({
            maNguoiNhan: projectData.maNguoiTao,
            tieuDe: 'Báo cáo lỗi mới',
            noiDung: `Dự án ${projectData.tieuDe || projectCode} có báo cáo lỗi mới: ${
              data.tieuDe
            }`,
            loaiThongBao: 'LoiMoiDuAn',
            duongDan: `/dashboard/client/projects/${projectId}/bugs-tracker`,
            daXem: false
          })
        }
      } catch (notifyError) {
        console.error('Error creating notification:', notifyError)
        // Don't fail the main action if notification fails
      }

      toast.success('Báo lỗi thành công!')
      form.reset()
      setFiles([])
      onSuccess()
    } catch (error) {
      console.error('Error reporting bug:', error)
      toast.error('Có lỗi xảy ra khi báo lỗi. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
      setUploading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
        <FormField
          control={form.control}
          name="tieuDe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tiêu đề lỗi <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Nhập tiêu đề lỗi tóm tắt..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dynamic Reuse Steps */}
        <div className="space-y-2">
          <FormLabel>
            Các bước tái hiện <span className="text-red-500">*</span>
          </FormLabel>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`cacBuocTaiHien.${index}.step`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder={`Bước ${index + 1}...`}
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
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ step: '' })}
              className="mt-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm bước
            </Button>
          </div>
          <FormMessage>
            {form.formState.errors.cacBuocTaiHien?.root?.message}
          </FormMessage>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="ketQuaThucTe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Kết quả thực tế <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mô tả kết quả lỗi thực tế..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ketQuaMongDoi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Kết quả mong đợi <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mô tả kết quả mong muốn..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="mucDoNghiemTrong"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Mức độ nghiêm trọng <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn mức độ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Critical">
                      Critical (Nghiêm trọng)
                    </SelectItem>
                    <SelectItem value="High">High (Cao)</SelectItem>
                    <SelectItem value="Medium">Medium (Trung bình)</SelectItem>
                    <SelectItem value="Low">Low (Thấp)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="khaNangTaiTao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Khả năng tái tạo <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khả năng" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Always">Always (Luôn luôn)</SelectItem>
                    <SelectItem value="Sometimes">
                      Sometimes (Thỉnh thoảng)
                    </SelectItem>
                    <SelectItem value="Once">Once (Chỉ một lần)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormLabel>File bằng chứng đính kèm</FormLabel>
          <div className="relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900/50">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <Upload className="mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium">Kéo thả hoặc click để tải lên</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Hỗ trợ hình ảnh, video (Tối đa 50MB)
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-2 grid gap-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="bg-secondary/20 flex items-center justify-between rounded border p-2"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="truncate text-sm">{file.name}</span>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {uploading ? 'Đang tải file...' : 'Đang gửi...'}
              </>
            ) : (
              'Gửi báo cáo lỗi'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
