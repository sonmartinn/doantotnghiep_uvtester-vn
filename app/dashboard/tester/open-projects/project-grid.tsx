import { getOpenProjects } from '@/app/_services/data-service'
import { createClient } from '@/lib/supabase/server'
import { Skeleton } from '@/ui/skeleton'
import { ProjectCard } from './project-card'

export async function ProjectGrid({ query }: { query: string }) {
  const supabase = await createClient()
  const projects = await getOpenProjects(query, supabase)

  if (projects.length === 0) {
    return (
      <div className="text-muted-foreground flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <p className="text-lg font-medium">Không tìm thấy dự án phù hợp</p>
        <p className="text-sm">Hãy thử thay đổi từ khóa tìm kiếm</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map(project => (
        <ProjectCard key={project.maDuAn} project={project} />
      ))}
    </div>
  )
}

export function ProjectsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  )
}
