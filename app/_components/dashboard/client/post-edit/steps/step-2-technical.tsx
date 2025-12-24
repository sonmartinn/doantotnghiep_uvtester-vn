'use client'

import { toast } from 'sonner'

import { uploadFile, deleteFile } from '@/lib/upload_assests'

import { Card, CardContent } from '@/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/ui/form'
import { Input } from '@/ui/input'
import { RichTextEditor } from '@/ui/rich-text-editor'
import { Separator } from '@/ui/separator'
import { useFormContext } from 'react-hook-form'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/ui/tooltip'

import type { ProjectValues } from '../../../../../dashboard/client/post-project/schema'
import { Info, X, FileText, CloudUpload, Loader2 } from 'lucide-react'
import { useState } from 'react'

export function Step2TechnicalSpecs({
  disabled,
  disabledEnv
}: {
  disabled?: boolean
  disabledEnv?: boolean
}) {
  const { control, setValue } = useFormContext<ProjectValues>()
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadImage = async (file: File) => {
    return uploadFile(file)
  }

  const handleRemoveFile = async (index: number, currentFiles: string[]) => {
    if (disabled) return
    const fileUrl = currentFiles[index]
    const fileName = fileUrl.split('/').pop() // Extract original filename from URL

    if (fileName) {
      try {
        await deleteFile(fileName)
        toast.success('Đã xóa file')
      } catch (error) {
        console.error('Error deleting file:', error)
        toast.error('Lỗi khi xóa file')
      }
    }

    const newFiles = [...currentFiles]
    newFiles.splice(index, 1)
    setValue('taiLieuDinhKem', newFiles, { shouldValidate: true })
  }

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Kỹ thuật & Môi trường</h2>
          <Separator />
        </div>

        <FormField
          control={control}
          name="huongDanTruyCap"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Hướng dẫn truy cập <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RichTextEditor
                  placeholder="URL, thông tin tài khoản test, link tải app... (VD: Truy cập https://test-app.bank.com. Tài khoản: testuser/password123. Tải file APK tại đây.)"
                  value={field.value || ''}
                  onChange={field.onChange}
                  onUploadImage={handleUploadImage}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="huongDanKyThuat"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Hướng dẫn kỹ thuật (Optional)
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Info className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover text-popover-foreground max-w-sm p-4 text-sm shadow-xl">
                      <p>
                        Hướng dẫn chi tiết cho Tester về yêu cầu phạm vi và các
                        vấn đề kỹ thuật của dự án kiểm thử
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Nếu bạn đã có tài liệu chi tiết về yêu cầu phạm vi và
                        các vấn đề kỹ thuật của dự án kiểm thử, bạn có thể tải
                        lên tại mục &quot;Tài liệu đính kèm&quot; ở dưới
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <RichTextEditor
                  placeholder="Yêu cầu chi tiết về phạm vi kiểm thử, yêu cầu về VPN, Proxy, API docs, các vấn đề kĩ thuật khác..."
                  value={field.value || ''}
                  onChange={field.onChange}
                  onUploadImage={handleUploadImage}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="taiLieuDinhKem"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Tài liệu đính kèm (Optional)
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Info className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover text-popover-foreground max-w-sm p-4 text-sm shadow-xl">
                      <p className="text-red-500">
                        Chỉ chấp nhận file .pdf, .doc, .docx, .txt và không vượt
                        quá 50MB/file
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {!disabled && (
                    <div className="flex w-full items-center justify-center">
                      <label
                        htmlFor="dropzone-file"
                        className="dark:hover:bg-bray-800 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {isUploading ? (
                            <div className="flex flex-col items-center">
                              <Loader2 className="mb-4 h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                Đang tải lên...
                              </p>
                            </div>
                          ) : (
                            <>
                              <CloudUpload className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                  Click để tải lên
                                </span>{' '}
                                hoặc kéo thả vào đây
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                PDF, DOC, DOCX, TXT (MAX. 50MB)
                              </p>
                            </>
                          )}
                        </div>
                        <Input
                          id="dropzone-file"
                          type="file"
                          multiple
                          className="hidden"
                          accept=".pdf,.doc,.docx,.txt"
                          disabled={isUploading}
                          onChange={async e => {
                            const files = Array.from(e.target.files || [])
                            if (files.length > 0) {
                              setIsUploading(true)
                              try {
                                const uploadPromises = files.map(
                                  file => uploadFile(file) // uploadFile already sanitizes
                                )
                                const urls = await Promise.all(uploadPromises)

                                const currentFiles = field.value || []
                                field.onChange([...currentFiles, ...urls])

                                toast.success(
                                  `Đã upload ${urls.length} tài liệu`
                                )
                              } catch (error) {
                                console.error(error)
                                toast.error('Có lỗi xảy ra khi upload')
                              } finally {
                                setIsUploading(false)
                              }
                            }
                            // Reset input value to allow uploading same file again if needed
                            e.target.value = ''
                          }}
                        />
                      </label>
                    </div>
                  )}

                  {/* File List */}
                  {Array.isArray(field.value) && field.value.length > 0 && (
                    <div className="grid gap-2">
                      {field.value.map((url, index) => {
                        // Extract filename from URL for display
                        const fileName = decodeURIComponent(
                          url.split('/').pop()?.split('-').slice(1).join('-') ||
                            'Tai_lieu'
                        )

                        return (
                          <div
                            key={index}
                            className="bg-muted/50 flex items-center justify-between rounded-md border p-2 text-sm"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="h-4 w-4 shrink-0 text-blue-500" />
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate hover:underline"
                                title={fileName}
                              >
                                {fileName}
                              </a>
                            </div>
                            {!disabled && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveFile(
                                    index,
                                    field.value as string[]
                                  )
                                }
                                className="text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormField
            control={control}
            name="env_device"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Thiết bị yêu cầu <span className="text-red-500">*</span>
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Info className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover text-popover-foreground max-w-sm p-4 text-sm shadow-xl">
                        <div className="flex flex-col gap-2">
                          Các loại thiết bị mà dự án yêu cầu (VD: Mobile, PC,
                          Laptop... hoặc cụ thể: iPhone 13, Samsung S21,...)
                          <p className="text-red-500">
                            <span className="font-bold">Lưu ý:</span> Các thiết
                            bị phải ngăn cách nhau bởi dấu phẩy ( ,)
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Thiết bị Mobile, PC, Laptop..."
                    {...field}
                    disabled={disabled || disabledEnv}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="env_os"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <div>
                    Hệ điều hành <span className="text-red-500">*</span>{' '}
                  </div>
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Info className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover text-popover-foreground max-w-sm p-4 text-sm shadow-xl">
                        <div className="flex flex-col gap-2">
                          Các hệ điều hành mà dự án yêu cầu (VD: Android, iOS,
                          Windows... hoặc có số phiên bản cụ thể: Android 12,
                          iOS 15,...)
                          <p className="text-red-500">
                            <span className="font-bold">Lưu ý:</span> Các hệ
                            điều hành phải ngăn cách nhau bởi dấu phẩy ( ,)
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="iOS 15, Android 12..."
                    {...field}
                    disabled={disabled || disabledEnv}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="env_browser"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Trình duyệt
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Info className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover text-popover-foreground max-w-sm p-4 text-sm shadow-xl">
                        <p>
                          Nếu dự án kiểm thử của bạn không bao gồm nền tảng web,
                          bạn có thể để trống mục này
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Chrome, Safari..."
                    {...field}
                    disabled={disabled || disabledEnv}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
