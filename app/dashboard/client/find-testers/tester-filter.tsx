'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'
import { Input } from '@/ui/input'
import { Search } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'

export function TesterFilter() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  const handleExperienceChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== 'all') {
      params.set('experience', value)
    } else {
      params.delete('experience')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          placeholder="Tìm theo tên hoặc kỹ năng..."
          className="pl-8"
          defaultValue={searchParams.get('query')?.toString()}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>
      <Select
        defaultValue={searchParams.get('experience')?.toString() || 'all'}
        onValueChange={handleExperienceChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Kinh nghiệm" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả kinh nghiệm</SelectItem>
          <SelectItem value="1">1+ năm</SelectItem>
          <SelectItem value="3">3+ năm</SelectItem>
          <SelectItem value="5">5+ năm</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
