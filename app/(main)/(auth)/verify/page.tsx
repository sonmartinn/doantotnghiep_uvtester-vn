'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { toast } from 'sonner'
import { ensureNguoiDungExists } from '@/app/_services/data-service'

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)

  // Countdown effect
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [resendTimer])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
      })

      if (error) throw error

      if (data.user) {
        // Create user profile
        await ensureNguoiDungExists(data.user)

        toast.success(
          'Xác thực thành công! Đang chuyển bạn tới trang làm việc...'
        )

        const role = data.user.user_metadata?.role || 'tester'
        if (role === 'tester') {
          router.push('/dashboard/tester')
        } else if (role === 'client') {
          router.push('/dashboard/client')
        } else {
          router.push('/')
        }
      }
    } catch (error: any) {
      setIsLoading(false)
      toast.error(error.message || 'Mã xác thực không đúng')
    }
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      })

      if (error) throw error

      toast.success('Đã gửi lại mã OTP!')
      setResendTimer(60) // Disable button for 60s
    } catch (error: any) {
      toast.error(
        error.message || 'Không thể gửi lại mã. Vui lòng thử lại sau.'
      )
    }
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="bg-card shadow-soft w-full max-w-md space-y-6 rounded-2xl border p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Xác thực Email</h1>
          <p className="text-muted-foreground mt-2">
            Vui lòng nhập mã OTP gồm 6 chữ số đã được gửi đến {email}
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Mã OTP</Label>
            <Input
              id="otp"
              placeholder="123456"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="text-center text-2xl tracking-widest"
              maxLength={6}
              required
            />
          </div>

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Đang xác thực...' : 'Xác nhận'}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={handleResendOtp}
            disabled={resendTimer > 0}
            className="text-primary text-sm hover:underline disabled:no-underline disabled:opacity-50"
          >
            {resendTimer > 0
              ? `Gửi lại mã sau ${resendTimer}s`
              : 'Chưa nhận được mã? Gửi lại'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  )
}
