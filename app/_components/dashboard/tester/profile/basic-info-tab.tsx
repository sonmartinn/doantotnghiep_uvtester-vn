'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/ui/card'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Textarea } from '@/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'
import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/app/_components/ui/tooltip'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useFormContext } from 'react-hook-form'

export function BasicInfoTab() {
  const { control } = useFormContext()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
        <CardDescription>
          Thông tin cá nhân hiển thị trên hồ sơ của bạn.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
