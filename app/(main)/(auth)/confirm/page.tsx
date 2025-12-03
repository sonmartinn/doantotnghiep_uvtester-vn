'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/_lib/supabase'
import { ensureNguoiDungExists } from '@/app/_lib/data-service'

export default function ConfirmPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Đang xác thực email...')

  useEffect(() => {
    async function handleConfirm() {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError || !userData?.user) {
        console.error(userError)
        setStatus('Không xác thực được tài khoản. Vui lòng thử lại.')
        return
      }

      const user = userData.user
      const role = user.user_metadata?.role || 'tester'

      try {
        // Sử dụng hàm từ data-service để đảm bảo logic thống nhất
        const nguoiDung = await ensureNguoiDungExists(user)

        if (!nguoiDung) {
          setStatus(
            'Xác thực thành công nhưng tạo hồ sơ thất bại. Vui lòng liên hệ hỗ trợ.'
          )
          return
        }

        setStatus('Xác thực email thành công! Đang chuyển hướng...')

        if (role === 'tester') {
          router.push('/dashboard/tester')
        } else if (role === 'client') {
          router.push('/dashboard/client')
        } else {
          router.push('/login')
        }
      } catch (err) {
        console.error(err)
        setStatus('Đã xảy ra lỗi trong quá trình xác thực.')
      }
    }

    handleConfirm()
  }, [router])

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="bg-card-gradient shadow-soft border-border rounded-2xl border p-6 text-center">
        <p className="text-foreground text-sm md:text-base">{status}</p>
      </div>
    </div>
  )
}
