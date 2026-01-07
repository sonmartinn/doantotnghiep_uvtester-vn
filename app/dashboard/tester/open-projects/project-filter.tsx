'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'
import { Button } from '@/ui/button'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { X } from 'lucide-react'

export function ProjectFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const handleDeviceChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set('device', value)
    } else {
      params.delete('device')
    }
    // Preserve query if it exists
    if (searchParams.get('query')) {
      params.set('query', searchParams.get('query')!)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set('type', value)
    } else {
      params.delete('type')
    }
    // Preserve query if it exists
    if (searchParams.get('query')) {
      params.set('query', searchParams.get('query')!)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set('sort', value)
    } else {
      params.delete('sort')
    }
    // Preserve query if it exists
    if (searchParams.get('query')) {
      params.set('query', searchParams.get('query')!)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Device Filter */}
      <Select
        value={searchParams.get('device') || 'all'}
        onValueChange={handleDeviceChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Lọc theo thiết bị" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả thiết bị</SelectItem>
          <SelectItem value="Mobile">Mobile</SelectItem>
          <SelectItem value="PC">PC</SelectItem>
          <SelectItem value="Laptop">Laptop</SelectItem>
          <SelectItem value="Tablet">Tablet</SelectItem>
          <SelectItem value="Smart TV">Smart TV</SelectItem>
          <SelectItem value="Wearable">Wearable</SelectItem>
        </SelectContent>
      </Select>

      {/* Type Filter */}
      <Select
        value={searchParams.get('type') || 'all'}
        onValueChange={handleTypeChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Loại dự án" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả loại</SelectItem>
          <SelectItem value="Exploratory">Exploratory</SelectItem>
          <SelectItem value="TestCase">TestCase</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        value={searchParams.get('sort') || 'latest'}
        onValueChange={handleSortChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sắp xếp" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">Mới nhất</SelectItem>
          <SelectItem value="price_asc">Giá: Thấp đến Cao</SelectItem>
          <SelectItem value="price_desc">Giá: Cao đến Thấp</SelectItem>
        </SelectContent>
      </Select>

      {(searchParams.get('device') ||
        searchParams.get('sort') ||
        searchParams.get('type')) && (
        <Button
          variant="outline"
          onClick={() => {
            const params = new URLSearchParams()
            // Preserve query if it exists
            if (searchParams.get('query')) {
              params.set('query', searchParams.get('query')!)
            }
            router.replace(`${pathname}?${params.toString()}`)
          }}
          className="ml-auto border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
        >
          <X className="mr-2 h-4 w-4" />
          Xóa bộ lọc
        </Button>
      )}
    </div>
  )
}
