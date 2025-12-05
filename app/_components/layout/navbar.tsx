'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bug, Menu, User as UserIcon } from 'lucide-react'

import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/app/_components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/app/_components/ui/sheet'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/app/_components/ui/avatar'
import { ThemeToggle } from '@/ui/theme-toggle'

import { supabase } from '@/lib/supabase/client'
import { getFullUser, type NguoiDung } from '@/app/_services/data-service'
import { type User } from '@supabase/supabase-js'

export default function Navbar() {
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<NguoiDung | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user + profile từ data-service
  useEffect(() => {
    async function loadUser() {
      setLoading(true)
      const { user, nguoiDung } = await getFullUser()
      setAuthUser(user)
      setProfile(nguoiDung)
      setLoading(false)
    }

    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser()
    })

    return () => listener?.subscription?.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setAuthUser(null)
    setProfile(null)
    window.location.href = '/'
  }

  const role = profile?.vaiTro || authUser?.user_metadata?.role
  const displayName = profile?.hoTen || authUser?.email || 'Người dùng'
  const avatarUrl = profile?.anhDaiDien || null

  const roleLabel =
    role === 'tester' ? 'Tester' : role === 'client' ? 'Client' : ''

  function getDashboardLink() {
    if (role === 'tester') return '/dashboard/tester'
    if (role === 'client') return '/dashboard/client'
    return '/'
  }

  return (
    <nav className="border-border bg-background/50 fixed top-0 right-0 left-0 z-50 border-b shadow-sm backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Bug className="text-primary h-8 w-8" />
            <span className="text-foreground hover:text-primary-glow hover:shadow-glow text-2xl font-bold transition-colors">
              UVTester
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center space-x-8 md:flex">
            <Link
              href="/#features"
              className="text-foreground hover:text-primary text-sm font-medium transition-colors"
            >
              Tính Năng
            </Link>
            <Link
              href="/#how-it-works"
              className="text-foreground hover:text-primary text-sm font-medium transition-colors"
            >
              Cách Hoạt Động
            </Link>
            <Link
              href="/#contact"
              className="text-foreground hover:text-primary text-sm font-medium transition-colors"
            >
              Liên Hệ
            </Link>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden items-center space-x-4 md:flex">
            <ThemeToggle />
            {loading ? (
              <div className="bg-muted h-9 w-24 animate-pulse rounded-md"></div>
            ) : !authUser ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-sm font-medium">
                    Đăng Nhập
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary text-primary-foreground text-sm font-semibold">
                    Đăng Ký
                  </Button>
                </Link>
              </>
            ) : (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="hover:bg-muted/60 flex items-center space-x-2 rounded-xl px-3 py-2 transition">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={avatarUrl || ''} alt="avatar" />
                      <AvatarFallback>
                        <UserIcon className="text-muted-foreground h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-foreground text-sm font-medium">
                        {displayName}
                      </span>
                      {roleLabel && (
                        <span className="text-muted-foreground text-xs">
                          {roleLabel}
                        </span>
                      )}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="border-border bg-card w-56 rounded-xl border"
                >
                  <DropdownMenuLabel className="text-sm font-semibold">
                    {displayName}
                  </DropdownMenuLabel>
                  {roleLabel && (
                    <DropdownMenuLabel className="text-muted-foreground text-xs">
                      Vai trò: {roleLabel}
                    </DropdownMenuLabel>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()} className="cursor-pointer">
                      Trang làm việc
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive cursor-pointer"
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile: Sheet */}
          <div className="flex items-center md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="top"
                className="bg-background/95 flex flex-col px-4 pt-4 backdrop-blur-md"
              >
                <Link href="/" className="flex items-center space-x-2">
                  <Bug className="text-primary h-8 w-8" />
                  <span className="text-foreground hover:text-primary-glow hover:shadow-glow text-2xl font-bold transition-colors">
                    UVTester
                  </span>
                </Link>
                {/* Main Navigation */}
                <div className="flex flex-col space-y-4 py-4">
                  <Link
                    href="/#features"
                    className="text-foreground hover:text-primary text-base font-medium transition-colors"
                  >
                    Tính Năng
                  </Link>
                  <Link
                    href="/#how-it-works"
                    className="text-foreground hover:text-primary text-base font-medium transition-colors"
                  >
                    Cách Hoạt Động
                  </Link>
                  <Link
                    href="/#contact"
                    className="text-foreground hover:text-primary text-base font-medium transition-colors"
                  >
                    Liên Hệ
                  </Link>
                </div>

                {/* Footer Section */}
                <div className="border-border space-y-6 border-t pt-6 pb-4">
                  {/* Theme Toggle Row */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm font-medium">
                      Giao diện
                    </span>
                    <ThemeToggle />
                  </div>

                  {/* User Actions */}
                  {loading ? (
                    <div className="bg-muted h-9 w-full animate-pulse rounded-md"></div>
                  ) : authUser ? (
                    <div className="space-y-4">
                      <div className="bg-muted/40 flex items-center space-x-3 rounded-xl p-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={avatarUrl || ''} alt="avatar" />
                          <AvatarFallback>
                            <UserIcon className="text-muted-foreground h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-foreground text-sm font-semibold">
                            {displayName}
                          </span>
                          {roleLabel && (
                            <span className="text-muted-foreground text-xs">
                              {roleLabel}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Link href={getDashboardLink()}>
                          <Button className="bg-primary text-primary-foreground w-full font-semibold">
                            Trang làm việc
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10 w-full font-medium"
                          onClick={handleLogout}
                        >
                          Đăng xuất
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link href="/login" className="w-full">
                        <Button variant="ghost" className="w-full font-medium">
                          Đăng Nhập
                        </Button>
                      </Link>
                      <Link href="/register" className="w-full">
                        <Button className="bg-primary text-primary-foreground shadow-primary/20 w-full font-semibold shadow-lg">
                          Đăng Ký
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
