'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  paymentSchema,
  passwordChangeSchema,
  type PaymentFormValues,
  type PasswordChangeFormValues
} from './schemas'
import { Button } from '@/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/ui/card'
import { Input } from '@/ui/input'
import { PasswordInput } from '@/ui/password-input'
import { Label } from '@/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/app/_components/ui/form'
import { updatePaymentInfo, updatePassword } from './actions'
import { User } from '@supabase/supabase-js'
import { Database } from '@/app/_services/database.types'

type NguoiDung = Database['public']['Tables']['NguoiDung']['Row']

interface SettingsFormProps {
  user: User | null
  nguoiDung: NguoiDung | null

  // Customization props
  paymentTitle?: string
  paymentDescription?: string
  paymentNote?: React.ReactNode
}

export function SettingsForm({
  user,
  nguoiDung,
  paymentTitle = 'Phương thức thanh toán',
  paymentDescription = 'Cấu hình phương thức thanh toán',
  paymentNote
}: SettingsFormProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: 'bank',
      fullName: '',
      bankName: '',
      accountNumber: ''
    }
  })

  // Password Form
  const passwordForm = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  // Load existing payment info
  useEffect(() => {
    if (nguoiDung?.thongTinThanhToan) {
      const savedInfo = nguoiDung.thongTinThanhToan as any
      form.reset({
        method: savedInfo.method || 'bank',
        fullName: savedInfo.fullName || '',
        bankName: savedInfo.bankName || '',
        accountNumber: savedInfo.accountNumber || ''
      })
    }
  }, [nguoiDung, form])

  const onSubmit = async (data: PaymentFormValues) => {
    try {
      const result = await updatePaymentInfo(data)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success('Đã lưu cài đặt')
    } catch (error) {
      toast.error('Lỗi khi lưu cài đặt')
      console.error(error)
    }
  }

  const onUpdatePassword = async (data: PasswordChangeFormValues) => {
    try {
      const result = await updatePassword(data)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success('Đã cập nhật mật khẩu')
      passwordForm.reset()
    } catch (error) {
      toast.error('Lỗi khi cập nhật mật khẩu')
      console.error(error)
    }
  }

  return (
    <div className="grid gap-6">
      {/* Account Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin tài khoản</CardTitle>
          <CardDescription>Thông tin đăng nhập của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              value={user?.email || ''}
              disabled
              className="bg-muted"
              readOnly
            />
            <p className="text-muted-foreground text-xs">
              Email không thể thay đổi vì được dùng để định danh tài khoản.
            </p>
          </div>

          <div className="border-t pt-4">
            <h4 className="mb-4 text-sm font-medium">Đổi mật khẩu</h4>
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(onUpdatePassword)}
                className="space-y-4"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu mới</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Nhập mật khẩu mới..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Xác nhận mật khẩu</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Nhập lại mật khẩu..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    disabled={passwordForm.formState.isSubmitting}
                  >
                    {passwordForm.formState.isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Cập nhật mật khẩu
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>

      {/* Payment Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>{paymentTitle}</CardTitle>
          <CardDescription>{paymentDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phương thức thanh toán</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      key={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phương thức..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bank">
                          Chuyển khoản ngân hàng
                        </SelectItem>
                        <SelectItem value="momo">Ví Momo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Họ và tên (Chủ tài khoản/Tên công ty){' '}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="NGUYEN VAN A"
                          {...field}
                          onChange={e =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                        />
                      </FormControl>
                      {paymentNote && (
                        <div className="bg-muted mt-2 rounded-lg p-4 text-xs">
                          {paymentNote}
                        </div>
                      )}

                      {/* Default note if none provided, or better to remove default hardcoded note if using props? 
                          The original code had a specific note. I will leave the original note as default if no prop provided?? 
                          No, better to use the prop. If user passes null, show nothing?
                          Client had a specific warning note. Tester had a specific warning note.
                          I should use the prop for the note content.
                      */}
                      {!paymentNote && (
                        <div className="bg-muted mt-2 rounded-lg p-4 text-xs">
                          <p className="text-muted-foreground">
                            <span className="font-semibold text-red-600 dark:text-red-500">
                              Lưu ý!
                            </span>{' '}
                            Nếu sau này bạn thanh toán bằng thông tin tài khoản
                            ngân hàng khác, thì nếu có vấn đề xảy ra, chúng tôi
                            sẽ không chịu trách nhiệm.
                          </p>
                        </div>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('method') === 'bank' && (
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Tên ngân hàng <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="VD: Vietcombank, Techcombank..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {form.watch('method') === 'bank'
                          ? 'Số tài khoản ngân hàng'
                          : 'Số tài khoản Momo'}{' '}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            form.watch('method') === 'bank'
                              ? 'Nhập số tài khoản...'
                              : 'Nhập số điện thoại đăng ký Momo...'
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" /> Lưu thông tin
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
