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

interface HeaderProps {
  user: User | null
  profile: NguoiDung | null
  role?: string
}

export default function Header({ user, profile, role }: HeaderProps) {
  const router = useRouter()

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

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          <span className="border-background absolute top-2 right-2 size-2 rounded-full border-2 bg-red-600"></span>
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="size-8">
                <AvatarImage
                  src={profile?.anhDaiDien || undefined}
                  alt={profile?.hoTen || 'User'}
                />
                <AvatarFallback>
                  {profile?.hoTen?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm leading-none font-medium">
                  {profile?.hoTen}
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
