'use client'

import { Input } from '@/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'
import { Button } from '@/ui/button'
import { PlusCircle, Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export function ProjectToolbar() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }, 300)

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams)
    if (status && status !== 'all') {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2 space-x-2">
        <div className="relative w-full max-w-sm">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm dự án..."
            className="pl-8"
            onChange={e => handleSearch(e.target.value)}
            defaultValue={searchParams.get('query')?.toString()}
          />
        </div>
        <Select
          onValueChange={handleStatusFilter}
          defaultValue={searchParams.get('status') || 'all'}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="Nhap">Nháp</SelectItem>
            <SelectItem value="ChoDuyet">Chờ duyệt</SelectItem>
            <SelectItem value="DangTuyen">Đang tuyển</SelectItem>
            <SelectItem value="DangTienHanh">Đang tiến hành</SelectItem>
            <SelectItem value="ChoQuyetToan">Chờ quyết toán</SelectItem>
            <SelectItem value="DaDong">Đã đóng</SelectItem>
            <SelectItem value="BiTuChoi">Bị từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button asChild>
        <Link href="/dashboard/client/post-project">
          <PlusCircle className="mr-2 h-4 w-4" />
          Tạo dự án
        </Link>
      </Button>
    </div>
  )
}
