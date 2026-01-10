'use client'

import { Bell, Search, Menu } from 'lucide-react'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { ThemeToggle } from '@/ui/theme-toggle'
import { Sheet, SheetContent, SheetTrigger } from '@/ui/sheet'
import Sidebar from './sidebar'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { type User } from '@supabase/supabase-js'
import { type NguoiDung } from '@/app/_services/data-service'
import { useNguoiDung } from '@/app/_services/queries'
import { useNotifications } from '@/app/_hooks/use-notifications'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'
import { NotificationList } from './notifications/notification-list'

interface HeaderProps {
  user: User | null
  profile: NguoiDung | null
  role?: string
}

export default function Header({ user, profile, role }: HeaderProps) {
  const router = useRouter()
  // const { user } = useAuthContext() // Removed
  const { notifications, unreadCount, loading, markAllAsRead, markAsRead } =
    useNotifications(user?.id)
  // Fetch latest profile data on client-side to ensure real-time updates
  const { data: latestProfile } = useNguoiDung(user?.id)

  const displayProfile = latestProfile || profile

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="bg-background sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-6 shadow-sm">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <Sidebar role={role} />
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Tìm kiếm..."
              className="bg-background w-full pl-8 md:w-[300px] lg:w-[400px]"
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="border-background absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full border-2 bg-red-600 text-[10px] font-bold text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <NotificationList
              notifications={notifications}
              loading={loading}
              onMarkAllRead={markAllAsRead}
              onMarkRead={markAsRead}
            />
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="size-8">
                <AvatarImage
                  src={displayProfile?.anhDaiDien || undefined}
                  alt={displayProfile?.hoTen || 'User'}
                  className="object-cover"
                />
                <AvatarFallback>
                  {displayProfile?.hoTen?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm leading-none font-medium">
                  {displayProfile?.hoTen}
                </p>
                <p className="text-muted-foreground text-xs leading-none">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
            <DropdownMenuItem>Cài đặt</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive cursor-pointer"
              onClick={handleLogout}
            >
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
