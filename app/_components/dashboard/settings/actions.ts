'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import {
  paymentSchema,
  passwordChangeSchema,
  type PaymentFormValues,
  type PasswordChangeFormValues
} from './schemas'

export async function updatePaymentInfo(data: PaymentFormValues) {
  const supabase = await createClient()

  // 1. Validate data
  const result = paymentSchema.safeParse(data)
  if (!result.success) {
    return { error: 'Dữ liệu không hợp lệ', details: result.error.flatten() }
  }

  // 2. Get current user
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Bạn chưa đăng nhập' }
  }

  // 3. Update NguoiDung
  const { error } = await supabase
    .from('NguoiDung')
    .update({
      thongTinThanhToan: result.data
    })
    .eq('maNguoiDung', user.id)

  if (error) {
    console.error('Update payment info error:', error)
    return { error: 'Lỗi khi cập nhật thông tin thanh toán' }
  }

  // Reload the current page to reflect changes
  revalidatePath('/dashboard/client/settings')
  revalidatePath('/dashboard/tester/settings')
  return { success: true }
}

export async function updatePassword(data: PasswordChangeFormValues) {
  const supabase = await createClient()

  // 1. Validate data
  const result = passwordChangeSchema.safeParse(data)
  if (!result.success) {
    return { error: 'Mật khẩu không hợp lệ', details: result.error.flatten() }
  }

  // 2. Update password
  const { error } = await supabase.auth.updateUser({
    password: result.data.password
  })

  if (error) {
    console.error('Update password error:', error)
    return { error: error.message }
  }

  return { success: true }
}
