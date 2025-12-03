'use client'

import Link from 'next/link'
import { Button } from '@/ui/button'

export default function AuthCodeErrorPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="bg-card-gradient shadow-soft border-border w-full max-w-md rounded-2xl border p-8 text-center">
        <h1 className="text-destructive mb-4 text-2xl font-bold">
          Lỗi Xác Thực
        </h1>
        <p className="text-muted-foreground mb-6">
          Không thể xác thực tài khoản của bạn. Có thể liên kết đã hết hạn hoặc
          không hợp lệ.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/login">Đăng nhập</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Đăng ký lại</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
