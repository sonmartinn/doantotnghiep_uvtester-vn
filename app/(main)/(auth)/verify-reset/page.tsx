'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { toast } from 'sonner'

function VerifyResetContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingResend, setIsLoadingResend] = useState(false)
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
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery'
      })

      if (error) throw error

      toast.success('Xác thực thành công! Vui lòng đặt lại mật khẩu.')
      router.push('/reset-password')
    } catch (error: any) {
      toast.error(error.message || 'Mã xác thực không đúng')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsLoadingResend(true)
    if (resendTimer > 0) return

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) throw error

      toast.success('Đã gửi lại mã OTP!')
      setResendTimer(60)
    } catch (error: any) {
      toast.error(
        error.message || 'Không thể gửi lại mã. Vui lòng thử lại sau.'
      )
    } finally {
      setIsLoadingResend(false)
    }
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="bg-card shadow-soft w-full max-w-md space-y-6 rounded-2xl border p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Khôi phục mật khẩu</h1>
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
            disabled={resendTimer > 0 || isLoadingResend}
            className="text-primary cursor-pointer text-sm hover:underline disabled:no-underline disabled:opacity-50"
          >
            {isLoadingResend
              ? 'Đang gửi mã OTP...'
              : resendTimer > 0
                ? `Gửi lại mã sau ${resendTimer}s`
                : 'Chưa nhận được mã? Gửi lại'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function VerifyResetPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyResetContent />
    </Suspense>
  )
}
