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
  MonitorSmartphone
} from 'lucide-react'
import { Button } from '@/ui/button'
import { supabase } from '@/lib/supabase/client'

interface SidebarProps {
  role?: string
  className?: string
}

export default function Sidebar({ role, className }: SidebarProps) {
  const pathname = usePathname()

  const testerLinks = [
    {
      name: 'Tổng quan',
      href: '/dashboard/tester',
      icon: LayoutDashboard
    },
    {
      name: 'Tìm việc làm',
      href: '/jobs',
      icon: Briefcase
    },
    {
      name: 'Việc của tôi',
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
      href: '/settings',
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

            return (
              <Link
                key={index}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="size-4" />
                {link.name}
              </Link>
            )
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
