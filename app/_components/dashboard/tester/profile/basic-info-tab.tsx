'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/app/_components/ui/tooltip'
import { useAuthUser, useUpdateNguoiDung } from '@/app/_services/queries'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { supabase } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { Button } from '@/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/ui/card'
import { Input } from '@/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'
import { Textarea } from '@/ui/textarea'
import { Camera, Info, Loader2, User } from 'lucide-react'
import { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'sonner'

export function BasicInfoTab() {
  const { control, watch, setValue } = useFormContext()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get user and mutation for auto-save
  const { data: user } = useAuthUser()
  const updateNguoiDungMutation = useUpdateNguoiDung()

  const currentAvatarUrl = watch('anhDaiDien')

  const deleteOldAvatar = async (url: string) => {
    try {
      if (!url) return
      // Extract file path from URL
      // Example: .../user_avatars/filename.png
      const urlParts = url.split('/user_avatars/')
      if (urlParts.length < 2) return

      const filePath = decodeURIComponent(urlParts[1])

      const { error } = await supabase.storage
        .from('user_avatars')
        .remove([filePath])

      if (error) {
        console.error('Error deleting old avatar:', error)
      }
    } catch (e) {
      console.error('Error parsing old avatar URL:', e)
    }
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB')
      return
    }

    if (!user) {
      toast.error('Không tìm thấy thông tin người dùng')
      return
    }

    try {
      setIsUploading(true)
      const oldAvatarUrl = currentAvatarUrl

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      // 1. Upload new file
      const { error: uploadError } = await supabase.storage
        .from('user_avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // 2. Get Public URL
      const { data } = supabase.storage
        .from('user_avatars')
        .getPublicUrl(filePath)

      const newAvatarUrl = data.publicUrl

      if (newAvatarUrl) {
        // 3. Auto-save to Database
        await updateNguoiDungMutation.mutateAsync({
          id: user.id,
          data: {
            anhDaiDien: newAvatarUrl
          }
        })

        // 4. Update Form State
        setValue('anhDaiDien', newAvatarUrl, { shouldDirty: true })
        toast.success('Cập nhật ảnh đại diện thành công')

        // 5. Delete Old Avatar (Clean up)
        if (oldAvatarUrl && oldAvatarUrl !== newAvatarUrl) {
          await deleteOldAvatar(oldAvatarUrl)
        }
      }
    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      toast.error('Lỗi khi tải ảnh: ' + error.message)
    } finally {
      setIsUploading(false)
      // Reset input so same file can be selected again if needed (though unlikely for avatar)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
        <CardDescription>
          Thông tin cá nhân hiển thị trên hồ sơ của bạn.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <Avatar className="border-muted h-24 w-24 cursor-pointer border-2">
              <AvatarImage
                src={currentAvatarUrl}
                alt="Avatar"
                className="object-cover"
              />
              <AvatarFallback className="bg-muted">
                <User className="text-muted-foreground h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute right-0 bottom-0 h-8 w-8 rounded-full shadow-md"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <p className="text-muted-foreground text-sm">
            Nhấn vào biểu tượng máy ảnh để thay đổi ảnh đại diện
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="hoTen"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Họ và Tên <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nguyễn Văn A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="gioiTinh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Giới tính <span className="text-destructive">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="ngaySinh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Ngày sinh <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="soNamKinhNghiem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Số năm kinh nghiệm <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ví dụ: 2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="linkLinkedIn"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>LinkedIn Profile</FormLabel>
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Info className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover text-popover-foreground max-w-sm p-4 text-sm shadow-xl">
                      <p>
                        Việc cung cấp URL hồ sơ LinkedIn của bạn cho phép chúng
                        tôi xác minh danh tính của bạn tốt hơn. Sau khi danh
                        tính của bạn được xác minh, bạn sẽ có cơ hội tham gia
                        những dự án thú vị và được trả lương cao hơn.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <FormControl>
                <Input
                  placeholder="https://linkedin.com/in/..."
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="gioiThieu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới thiệu ngắn</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Hãy viết đôi dòng giới thiệu về bản thân và kinh nghiệm của bạn..."
                  className="h-32"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
