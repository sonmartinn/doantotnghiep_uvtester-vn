'use client'

import { useState } from 'react'
import { supabase } from '@/app/_lib/supabase'
import { ensureNguoiDungExists } from '@/app/_lib/data-service'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    } else {
      // Lấy thông tin user và role để redirect đúng trang
      const user = data.user
      const nguoiDung = await ensureNguoiDungExists(user)
      const role = nguoiDung?.vaiTro || user.user_metadata?.role

      if (role === 'tester') {
        router.push('/dashboard/tester')
      } else if (role === 'client') {
        router.push('/dashboard/client')
      } else {
        router.push('/')
      }
      // Không set loading false ở đây để tránh flash lại form login khi đang redirect
    }
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="bg-card-gradient shadow-soft border-border w-full max-w-md rounded-2xl border p-8">
        <h1 className="text-foreground mb-6 text-3xl font-bold">Đăng Nhập</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="bg-muted/60 text-foreground placeholder:text-muted-foreground focus:bg-card focus:ring-ring w-full rounded-xl px-4 py-3 focus:ring-2 focus:outline-none"
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            className="bg-muted/60 text-foreground placeholder:text-muted-foreground focus:bg-card focus:ring-ring w-full rounded-xl px-4 py-3 focus:ring-2 focus:outline-none"
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-primary text-sm hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {errorMsg && <p className="text-destructive text-sm">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-xl px-4 py-3 font-semibold transition-colors disabled:opacity-60"
          >
            {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
          </button>
        </form>

        <p className="text-muted-foreground mt-4 text-sm">
          Chưa có tài khoản?{' '}
          <Link
            className="text-primary font-semibold hover:underline"
            href="/register"
          >
            Tạo tài khoản
          </Link>
        </p>
      </div>
    </div>
  )
}
