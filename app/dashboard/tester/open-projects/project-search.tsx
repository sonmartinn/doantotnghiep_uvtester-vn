import { Input } from '@/ui/input'
import { Search } from 'lucide-react'

export function ProjectSearch({ defaultValue }: { defaultValue: string }) {
  return (
    <div className="relative flex-1 md:grow-0">
      <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
      <form action="" method="get">
        <Input
          name="query"
          type="search"
          placeholder="Tìm kiếm dự án..."
          className="bg-background w-full rounded-lg pl-8 md:w-[300px] lg:w-[400px]"
          defaultValue={defaultValue}
        />
      </form>
    </div>
  )
}
