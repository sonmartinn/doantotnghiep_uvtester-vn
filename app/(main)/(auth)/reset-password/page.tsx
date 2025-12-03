'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/_lib/supabase'

export default function ResetPasswordPage() {
  const router = useRouter()

  const [status, setStatus] = useState<
    'checking' | 'ready' | 'invalid' | 'success'
  >('checking')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        setStatus('invalid')
      } else {
        setStatus('ready')
      }
    }
    checkSession()
  }, [])

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp.')
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setErrorMsg(error.message)
    } else {
      setStatus('success')

      // đã có session từ magic link → cho về home (hoặc dashboard sau này)
      setTimeout(() => {
        router.push('/')
      }, 1500)
    }
  }

  if (status === 'checking') {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="bg-card-gradient shadow-soft border-border text-foreground rounded-2xl border p-6 text-center">
          Đang kiểm tra liên kết khôi phục...
        </div>
      </div>
    )
  }

  if (status === 'invalid') {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="bg-card-gradient shadow-soft border-border text-foreground rounded-2xl border p-6 text-center">
          Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="bg-card-gradient shadow-soft border-border w-full max-w-md rounded-2xl border p-8">
        <h1 className="text-foreground mb-4 text-3xl font-bold">
          Đặt lại mật khẩu
        </h1>

        {status === 'success' ? (
          <p className="text-emerald-400">
            Đổi mật khẩu thành công! Đang chuyển bạn về trang chủ...
          </p>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              className="bg-muted/60 text-foreground placeholder:text-muted-foreground focus:bg-card focus:ring-ring w-full rounded-xl px-4 py-3 focus:ring-2 focus:outline-none"
              type="password"
              placeholder="Mật khẩu mới"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <input
              className="bg-muted/60 text-foreground placeholder:text-muted-foreground focus:bg-card focus:ring-ring w-full rounded-xl px-4 py-3 focus:ring-2 focus:outline-none"
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />

            {errorMsg && <p className="text-destructive text-sm">{errorMsg}</p>}

            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-xl px-4 py-3 font-semibold transition-colors disabled:opacity-60"
            >
              Cập nhật mật khẩu
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
