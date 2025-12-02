'use client'

import { useState } from 'react'
import { supabase } from '@/app/_lib/supabase'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    const origin = typeof window !== 'undefined' ? window.location.origin : ''

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`
    })

    if (error) {
      setErrorMsg(error.message)
    } else {
      setSuccessMsg(
        'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi cho bạn một liên kết đặt lại mật khẩu. Vui lòng kiểm tra hộp thư (kể cả spam).'
      )
    }

    setLoading(false)
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="bg-card-gradient shadow-soft border-border w-full max-w-md rounded-2xl border p-8">
        <h1 className="text-foreground mb-6 text-3xl font-bold">
          Quên mật khẩu
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="bg-muted/60 text-foreground placeholder:text-muted-foreground focus:bg-card focus:ring-ring w-full rounded-xl px-4 py-3 focus:ring-2 focus:outline-none"
            type="email"
            placeholder="Nhập email bạn đã đăng ký"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          {errorMsg && <p className="text-destructive text-sm">{errorMsg}</p>}
          {successMsg && (
            <p className="text-sm text-emerald-400">{successMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-xl px-4 py-3 font-semibold transition-colors disabled:opacity-60"
          >
            {loading ? 'Đang gửi email...' : 'Gửi link đặt lại mật khẩu'}
          </button>
        </form>

        <p className="text-muted-foreground mt-4 text-sm">
          Nhớ mật khẩu rồi?{' '}
          <Link
            className="text-primary font-semibold hover:underline"
            href="/login"
          >
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}
