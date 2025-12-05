'use client'

import { Suspense, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

function RegisterContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const roleFromURL = searchParams.get('role') ?? 'tester'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hoTen, setHoTen] = useState('')
  const [role, setRole] = useState(roleFromURL)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            hoTen
          }
          // // We don't need redirect URL for OTP flow, but good to keep just in case
          // emailRedirectTo: `${window.location.origin}/confirm`
        }
      })

      if (error) {
        setErrorMsg(error.message)
        return
      } else if (data.user && data.user.identities?.length === 0) {
        setErrorMsg(
          'Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng chức năng quên mật khẩu.'
        )
        return
      } else {
        toast.success(
          'Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.'
        )
        // Redirect to OTP verification page
        router.push(`/verify?email=${encodeURIComponent(email)}`)
      }
    } catch (err: any) {
      setLoading(false)
      setErrorMsg('Đã xảy ra lỗi. Vui lòng thử lại.')
    }
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="bg-card-gradient shadow-soft border-border w-full max-w-md rounded-2xl border p-8">
        <h1 className="text-foreground mb-6 text-3xl font-bold">Đăng Ký</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            className="bg-muted/60 text-foreground placeholder:text-muted-foreground focus:bg-card focus:ring-ring w-full rounded-xl px-4 py-3 focus:ring-2 focus:outline-none"
            type="text"
            placeholder="Họ và tên"
            value={hoTen}
            onChange={e => setHoTen(e.target.value)}
            required
          />

          <input
            className="bg-muted/60 text-foreground placeholder:text-muted-foreground focus:bg-card focus:ring-ring w-full rounded-xl px-4 py-3 focus:ring-2 focus:outline-none"
            type="email"
            placeholder="Email của bạn"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            className="bg-muted/60 text-foreground placeholder:text-muted-foreground focus:bg-card focus:ring-ring w-full rounded-xl px-4 py-3 focus:ring-2 focus:outline-none"
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <div className="relative">
            <select
              className="border-border bg-muted/60 text-foreground focus:bg-card focus:ring-ring w-full appearance-none rounded-xl border px-4 py-3 pr-10 text-sm focus:ring-2 focus:outline-none"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="tester" className="bg-card text-foreground">
                Tôi là Tester
              </option>
              <option value="client" className="bg-card text-foreground">
                Tôi cần Tester (Khách hàng / Công ty)
              </option>
            </select>

            {/* icon mũi tên nhỏ bên phải cho đẹp */}
            <span className="text-muted-foreground pointer-events-none absolute inset-y-0 right-3 flex items-center">
              ▼
            </span>
          </div>

          {errorMsg && <p className="text-destructive text-sm">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-xl px-4 py-3 font-semibold transition-colors disabled:opacity-60"
          >
            {loading ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>
        </form>

        <p className="text-muted-foreground mt-4 text-sm">
          Đã có tài khoản?{' '}
          <Link
            className="text-primary font-semibold hover:underline"
            href="/login"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  )
}
