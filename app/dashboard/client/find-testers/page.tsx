import { Suspense } from 'react'
import { getTesters } from '@/app/_services/data-service'
import { TesterGrid } from './tester-grid'
import { TesterFilter } from './tester-filter'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tìm Tester | UVTester',
  description: 'Tìm kiếm và mời các Tester tài năng tham gia dự án của bạn.'
}

export default async function FindTestersPage({
  searchParams
}: {
  searchParams: Promise<{ query?: string; experience?: string }>
}) {
  const params = await searchParams
  const query = params?.query || ''
  const experience = params?.experience || 'all'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Tìm kiếm Tester</h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TesterFilter />
        </div>
      </div>

      <Suspense fallback={<div>Loading testers...</div>}>
        <TesterGrid query={query} experience={experience} />
      </Suspense>
    </div>
  )
}
