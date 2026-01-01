import { Suspense } from 'react'
import { ProjectGrid, ProjectsSkeleton } from './project-grid'
import { ProjectSearch } from './project-search'

export const dynamic = 'force-dynamic'

export default async function OpenProjectsPage({
  searchParams
}: {
  searchParams: { query?: string }
}) {
  const query = (await searchParams?.query) || ''

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dự án đang mở</h1>
          <p className="text-muted-foreground">
            Khám phá và ứng tuyển vào các dự án kiểm thử hấp dẫn.
          </p>
        </div>
        <ProjectSearch defaultValue={query} />
      </div>

      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectGrid query={query} />
      </Suspense>
    </div>
  )
}
