import { Suspense } from 'react'
import { ProjectGrid, ProjectsSkeleton } from './project-grid'
import { ProjectSearch } from './project-search'
import { ProjectFilter } from './project-filter'

export const dynamic = 'force-dynamic'

export default async function OpenProjectsPage({
  searchParams
}: {
  searchParams: Promise<{
    query?: string
    sort?: string
    device?: string
    type?: string
  }>
}) {
  const params = await searchParams
  const query = params?.query || ''
  const sort = params?.sort || 'latest'
  const device = params?.device || 'all'
  const type = params?.type || 'all'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dự án đang tuyển</h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ProjectSearch defaultValue={query} />
          <ProjectFilter />
        </div>
      </div>

      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectGrid query={query} sort={sort} device={device} type={type} />
      </Suspense>
    </div>
  )
}
