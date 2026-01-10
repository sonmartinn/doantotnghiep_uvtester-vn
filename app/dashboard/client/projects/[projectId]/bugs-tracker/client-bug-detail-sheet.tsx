'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { BaoCaoLoi } from '@/app/_services/data-service'
import { Button } from '@/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from '@/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/ui/dialog'
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
import { toast } from 'sonner'
import { Loader2, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

// Schema for editing bug report
const bugEditSchema = z.object({
  tieuDe: z.string().min(1, 'Tiêu đề không được để trống'),
  // cacBuocTaiHien is stored as JSON but we treat it as array of strings in form
  // We'll manage it as a single text block for simplicity or keep array structure?
  // Let's use simple text area for step editing for now, or assume array string.
  // The user asked to "chỉnh sửa báo cáo lỗi đó".
  // Let's make it editable. treating steps as text area line separated for ease of editing?
  // Or keeping it structued. Let's keep it structured but maybe simple map.
  ketQuaThucTe: z.string().min(1, 'Kết quả thực tế không được để trống'),
  ketQuaMongDoi: z.string().min(1, 'Kết quả mong đợi không được để trống')
})

type BugEditValues = z.infer<typeof bugEditSchema>

interface ClientBugDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bug: BaoCaoLoi | null
  onUpdate: () => void
}

export function ClientBugDetailSheet({
  open,
  onOpenChange,
  bug,
  onUpdate
}: ClientBugDetailSheetProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Local state for steps editing if we want dynamic array,
  // but to simplify let's just use the form.
  const form = useForm<BugEditValues>({
    resolver: zodResolver(bugEditSchema),
    defaultValues: {
      tieuDe: '',
      ketQuaThucTe: '',
      ketQuaMongDoi: ''
    }
  })

  // We need to handle steps separately or add to schema.
  // For simplicity lets just edit title, actual result, expected result first.
  // Steps editing is complex UI, let's see if we can do it later or if simple text area is enough.
  // Re-reading request: "chỉnh sửa báo cáo lỗi đó".
  // I will add steps as a text area where each line is a step for simplicity in this version.
  const [stepsText, setStepsText] = useState('')

  useEffect(() => {
    if (bug) {
      form.reset({
        tieuDe: bug.tieuDe,
        ketQuaThucTe: bug.ketQuaThucTe,
        ketQuaMongDoi: bug.ketQuaMongDoi
      })

      const steps = Array.isArray(bug.cacBuocTaiHien)
        ? (bug.cacBuocTaiHien as string[])
        : []
      setStepsText(steps.join('\n'))
      setIsEditing(false)
    }
  }, [bug, form, open])

  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const handleUpdateStatus = async (newStatus: string) => {
    if (!bug) return

    // If rejecting, open dialog instead of immediate update
    if (newStatus === 'TuChoi') {
      setIsRejectDialogOpen(true)
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('BaoCaoLoi')
        .update({ trangThaiLoi: newStatus })
        .eq('maLoi', bug.maLoi)

      if (error) throw error

      toast.success(
        newStatus === 'DaChapNhan' ? 'Đã chấp nhận lỗi' : 'Đã từ chối lỗi'
      )
      onUpdate()
      onOpenChange(false)
    } catch (error: any) {
      toast.error('Lỗi cập nhật: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmReject = async () => {
    if (!bug || !rejectReason.trim()) return
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('BaoCaoLoi')
        .update({
          trangThaiLoi: 'TuChoi',
          phanHoiCuaClient: rejectReason
        })
        .eq('maLoi', bug.maLoi)

      if (error) throw error

      toast.success('Đã từ chối lỗi thành công')
      setIsRejectDialogOpen(false)
      setRejectReason('') // Reset reason
      onUpdate()
      onOpenChange(false)
    } catch (error: any) {
      toast.error('Lỗi khi từ chối: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSave = async (values: BugEditValues) => {
    if (!bug) return
    setIsSubmitting(true)
    try {
      // Parse steps from text
      const steps = stepsText.split('\n').filter(s => s.trim() !== '')

      const { error } = await supabase
        .from('BaoCaoLoi')
        .update({
          tieuDe: values.tieuDe,
          ketQuaThucTe: values.ketQuaThucTe,
          ketQuaMongDoi: values.ketQuaMongDoi,
          cacBuocTaiHien: steps, // supabase handles json conversion
          trangThaiLoi: 'ChinhSuaVaChapNhan'
        })
        .eq('maLoi', bug.maLoi)

      if (error) throw error

      toast.success('Đã lưu chỉnh sửa và chấp nhận lỗi')
      onUpdate()
      onOpenChange(false)
    } catch (error: any) {
      toast.error('Lỗi cập nhật: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!bug) return null

  const stepsList = Array.isArray(bug.cacBuocTaiHien)
    ? (bug.cacBuocTaiHien as string[])
    : []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-[650px]">
        {/* ... Sheet Header ... */}
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-indigo-600">
            {isEditing ? 'Chỉnh sửa lỗi' : bug.maLoiHienThi}
          </SheetTitle>
          {!isEditing && <SheetDescription>{bug.tieuDe}</SheetDescription>}
        </SheetHeader>

        <div className="space-y-6 py-6">
          {isEditing ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSave)}
                className="space-y-4 p-4"
              >
                <FormField
                  control={form.control}
                  name="tieuDe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề lỗi</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Các bước tái hiện (Mỗi bước 1 dòng)</FormLabel>
                  <Textarea
                    value={stepsText}
                    onChange={e => setStepsText(e.target.value)}
                    rows={5}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="ketQuaThucTe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kết quả thực tế</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
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
                      <FormLabel>Kết quả mong đợi</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-teal-600 text-white hover:bg-teal-700"
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Lưu & Chấp nhận
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <>
              {/* View Mode */}
              <div className="space-y-4 p-4">
                {/* Meta Info Row */}
                <div className="flex gap-8 border-b pb-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-gray-500 uppercase">
                      Mức độ nghiêm trọng
                    </h4>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {bug.mucDoNghiemTrong || 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-gray-500 uppercase">
                      Khả năng tái tạo
                    </h4>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {bug.khaNangTaiTao || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 pt-2 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase">
                      Các bước tái hiện
                    </h4>
                    <ul className="list-inside list-decimal space-y-1 text-sm">
                      {stepsList.map((step, idx) => (
                        <li
                          key={idx}
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase">
                        Kết quả thực tế
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {bug.ketQuaThucTe}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase">
                        Kết quả mong đợi
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {bug.ketQuaMongDoi}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Attachments embedded if any (Read only view) */}
                {Array.isArray(bug.fileBangChung) &&
                  bug.fileBangChung.length > 0 && (
                    <div className="mt-6 space-y-3 border-t pt-4">
                      <h4 className="text-xs font-bold text-gray-500 uppercase">
                        Bằng chứng (Attachments)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(bug.fileBangChung as string[]).map((url, index) => {
                          const isImage = url.match(
                            /\.(jpeg|jpg|gif|png|webp)$/i
                          )
                          return (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-100 transition-colors hover:border-indigo-500 dark:border-gray-800 dark:bg-gray-800"
                            >
                              {isImage ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={url}
                                  alt={`Attachment ${index + 1}`}
                                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                />
                              ) : (
                                <FileText className="h-8 w-8 text-gray-500 group-hover:text-indigo-500" />
                              )}
                            </a>
                          )
                        })}
                      </div>
                    </div>
                  )}
              </div>

              <SheetFooter className="mt-6 flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  disabled={isSubmitting}
                >
                  Chỉnh sửa
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleUpdateStatus('TuChoi')}
                    disabled={isSubmitting}
                  >
                    Từ chối
                  </Button>
                  <Button
                    className="bg-green-600 text-white hover:bg-green-700"
                    onClick={() => handleUpdateStatus('DaChapNhan')}
                    disabled={isSubmitting}
                  >
                    Chấp nhận
                  </Button>
                </div>
              </SheetFooter>
            </>
          )}
        </div>
      </SheetContent>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối báo cáo lỗi</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do từ chối để tester có thể hiểu rõ và kiểm tra
              lại.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={isSubmitting || !rejectReason.trim()}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  )
}
