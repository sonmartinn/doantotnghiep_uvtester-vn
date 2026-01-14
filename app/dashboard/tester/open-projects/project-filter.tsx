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
import { X, Sparkles, ListFilter } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'

export function ProjectFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const currentSort = searchParams.get('sort')
  const isBestMatch = currentSort === 'best-match'

  const toggleBestMatch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (isBestMatch) {
      params.delete('sort') // toggle off -> default
    } else {
      params.set('sort', 'best-match')
    }

    // Preserve query if it exists
    if (searchParams.get('query')) {
      params.set('query', searchParams.get('query')!)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

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
      {/* AI Match Button - Prominent */}
      <Button
        variant={isBestMatch ? 'default' : 'outline'}
        onClick={toggleBestMatch}
        className={`border-dashed transition-all ${
          isBestMatch
            ? 'border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:from-emerald-600 hover:to-teal-600'
            : 'border-emerald-500/50 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-900/20'
        }`}
      >
        <Sparkles
          className={`mr-2 h-4 w-4 ${isBestMatch ? 'animate-pulse' : ''}`}
        />
        {isBestMatch ? 'Đang lọc theo AI Match' : 'Phù hợp nhất với tôi'}
      </Button>

      {/* Unified Filter Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="border-dashed">
            <ListFilter className="mr-2 h-4 w-4" />
            Bộ lọc & Sắp xếp
            {(searchParams.get('device') ||
              searchParams.get('type') ||
              (currentSort && currentSort !== 'latest')) && (
              <span className="ml-1 rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] leading-none font-semibold text-slate-900">
                {
                  [
                    searchParams.get('device'),
                    searchParams.get('type'),
                    currentSort && currentSort !== 'latest' ? 'sort' : null
                  ].filter(Boolean).length
                }
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-4" align="start">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Bộ lọc tìm kiếm</h4>
              <p className="text-muted-foreground text-sm">
                Tùy chỉnh tiêu chí hiển thị dự án
              </p>
            </div>

            <div className="grid gap-2">
              {/* Device Filter */}
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm">Thiết bị</span>
                <Select
                  value={searchParams.get('device') || 'all'}
                  onValueChange={handleDeviceChange}
                >
                  <SelectTrigger className="col-span-2 h-8">
                    <SelectValue placeholder="Tất cả" />
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
              </div>

              {/* Type Filter */}
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm">Loại</span>
                <Select
                  value={searchParams.get('type') || 'all'}
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger className="col-span-2 h-8">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="Exploratory">Exploratory</SelectItem>
                    <SelectItem value="TestCase">TestCase</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm">Sắp xếp</span>
                <Select
                  value={isBestMatch ? '' : currentSort || 'latest'}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="col-span-2 h-8">
                    <SelectValue placeholder="Mới nhất" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Mới nhất</SelectItem>
                    <SelectItem value="price_asc">Giá: Thấp-Cao</SelectItem>
                    <SelectItem value="price_desc">Giá: Cao-Thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

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
