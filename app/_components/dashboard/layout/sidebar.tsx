'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Bug,
  UserCog,
  Users,
  CreditCard,
  MonitorSmartphone,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/ui/button'
import { supabase } from '@/lib/supabase/client'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/ui/tooltip'
import {
  useAuthUser,
  useHoSoTester,
  useNguoiDung
} from '@/app/_services/queries'

interface SidebarProps {
  role?: string
  className?: string
}

export default function Sidebar({ role, className }: SidebarProps) {
  const pathname = usePathname()
  const { data: user, isLoading: isLoadingUser } = useAuthUser()
  const { data: nguoiDung, isLoading: isLoadingNguoiDung } = useNguoiDung(
    user?.id
  )
  const { data: hoSo, isLoading: isLoadingHoSo } = useHoSoTester(user?.id)

  const isLoading = isLoadingUser || isLoadingNguoiDung || isLoadingHoSo

  // -- LOGIC CHECK COMPLETION --
  let profileMissing: string[] = []
  let devicesWarning: string | null = null
  let settingsWarning: string | null = null

  if (!isLoading && role === 'tester') {
    // 1. Settings
    if (!nguoiDung?.thongTinThanhToan) {
      settingsWarning = 'Chưa cập nhật thông tin thanh toán'
    }

    // 2. Devices
    if (
      !hoSo?.thongTinThietBi ||
      (Array.isArray((hoSo.thongTinThietBi as any)?.devices) &&
        (hoSo.thongTinThietBi as any).devices.length === 0)
    ) {
      devicesWarning = 'Chưa thêm thiết bị nào'
    }

    // 3. Profile
    if (!nguoiDung?.hoTen) profileMissing.push('Họ và tên')
    if (!nguoiDung?.gioiTinh) profileMissing.push('Giới tính')
    if (!nguoiDung?.ngaySinh) profileMissing.push('Ngày sinh')
    if (!nguoiDung?.diaChi) profileMissing.push('Địa chỉ')
    if (!nguoiDung?.gioiThieu) profileMissing.push('Giới thiệu')
    if (hoSo?.soNamKinhNghiem === undefined || hoSo?.soNamKinhNghiem === null)
      profileMissing.push('Số năm kinh nghiệm')
    if (!hoSo?.ngonNguChinh) profileMissing.push('Ngôn ngữ chính')
    if (!hoSo?.thongTinKiemThu) profileMissing.push('Thông tin kiểm thử')
  }

  const testerLinks = [
    {
      name: 'Tổng quan',
      href: '/dashboard/tester',
      icon: LayoutDashboard
    },
    {
      name: 'Dự án đang mở',
      href: '/jobs',
      icon: Briefcase
    },
    {
      name: 'Dự án đã nhận',
      href: '/dashboard/tester/projects',
      icon: FileText
    },
    {
      name: 'Lịch sử thanh toán',
      href: '/dashboard/tester/payment-history',
      icon: CreditCard
    },
    {
      name: 'Thiết bị',
      href: '/dashboard/tester/devices',
      icon: MonitorSmartphone
    },
    {
      name: 'Hồ sơ',
      href: '/dashboard/tester/profile',
      icon: UserCog
    },
    {
      name: 'Cài đặt',
      href: '/dashboard/tester/settings',
      icon: Settings
    }
  ]

  const clientLinks = [
    {
      name: 'Tổng quan',
      href: '/dashboard/client',
      icon: LayoutDashboard
    },
    {
      name: 'Đăng dự án',
      href: '/dashboard/client/post-project',
      icon: Briefcase
    },
    {
      name: 'Quản lý dự án',
      href: '/dashboard/client/projects',
      icon: FileText
    },
    {
      name: 'Tìm Tester',
      href: '/testers',
      icon: Users
    },
    {
      name: 'Tin nhắn',
      href: '/dashboard/messages',
      icon: MessageSquare
    },
    {
      name: 'Cài đặt',
      href: '/settings',
      icon: Settings
    }
  ]

  const links = role === 'client' ? clientLinks : testerLinks

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className={cn('bg-card flex h-full flex-col border-r', className)}>
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <div className="bg-primary flex size-8 items-center justify-center rounded-lg text-white">
            <Bug className="size-5" />
          </div>
          <span className="text-primary">UVTester</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {links.map((link, index) => {
            const Icon = link.icon
            const isActive = pathname === link.href

            // Logic highlight & warning content
            let isWarning = false
            let warningContent: React.ReactNode = null

            if (role === 'tester') {
              if (
                link.href === '/dashboard/tester/profile' &&
                profileMissing.length > 0
              ) {
                isWarning = true
                warningContent = (
                  <div className="space-y-1">
                    <p className="font-semibold">Chưa hoàn thiện:</p>
                    <ul className="list-disc pl-4 text-xs">
                      {profileMissing.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )
              }
              if (link.href === '/dashboard/tester/devices' && devicesWarning) {
                isWarning = true
                warningContent = devicesWarning
              }
              if (
                link.href === '/dashboard/tester/settings' &&
                settingsWarning
              ) {
                isWarning = true
                warningContent = settingsWarning
              }
            }

            const LinkContent = (
              <Link
                href={link.href}
                className={cn(
                  'flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : isWarning
                      ? 'text-destructive bg-destructive/10 hover:bg-destructive/20'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="size-4" />
                <span className="flex-1">{link.name}</span>
                {isWarning && <AlertCircle className="h-4 w-4 animate-pulse" />}
              </Link>
            )

            if (isWarning && warningContent) {
              return (
                <TooltipProvider key={index}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>{LinkContent}</TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      {warningContent}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            }

            return <div key={index}>{LinkContent}</div>
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full justify-start gap-3"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}
