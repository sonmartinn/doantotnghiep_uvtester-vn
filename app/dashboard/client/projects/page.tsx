import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Button } from '@/ui/button'
import { Skeleton } from '@/ui/skeleton'
import { ProjectToolbar } from './project-toolbar'
import { ProjectTable } from './project-table'
import {
  PlusCircle,
  FolderKanban,
  Clock,
  CheckCircle2,
  PlayCircle
} from 'lucide-react'

// Types
export const dynamic = 'force-dynamic'

async function getStats(userId: string, supabase: any) {
  const { data: allProjects } = await supabase
    .from('DuAn')
    .select('trangThaiDuAn', { count: 'exact' })
    .eq('maNguoiTao', userId)

  const total = allProjects?.length || 0
  const active =
    allProjects?.filter((p: any) => p.trangThaiDuAn === 'DangTuyen').length || 0
  const inProgress =
    allProjects?.filter((p: any) => p.trangThaiDuAn === 'DangTienHanh')
      .length || 0
  const pending =
    allProjects?.filter((p: any) => p.trangThaiDuAn === 'ChoDuyet').length || 0

  return { total, active, inProgress, pending }
}

async function ProjectsContent({
  searchParams,
  userId
}: {
  searchParams: any
  userId: string
}) {
  const supabase = await createClient()
  const query = (await searchParams)?.query || ''
  const status = (await searchParams)?.status || ''

  let dbQuery = supabase
    .from('DuAn')
    .select('*, UngTuyen(trangThaiUngTuyen)')
    .eq('maNguoiTao', userId)
    .order('ngayTao', { ascending: false })

  if (query) {
    dbQuery = dbQuery.ilike('tieuDe', `%${query}%`)
  }

  if (status) {
    dbQuery = dbQuery.eq('trangThaiDuAn', status)
  }

  const { data: rawProjects, error } = await dbQuery

  const projects = rawProjects?.map((p: any) => ({
    ...p,
    pendingCount:
      p.UngTuyen?.filter((u: any) => u.trangThaiUngTuyen === 'ChoDuyet')
        .length || 0,
    acceptedCount:
      p.UngTuyen?.filter((u: any) => u.trangThaiUngTuyen === 'DaDuyet')
        .length || 0
  }))

  if (error) {
    console.error('Error fetching projects:', error)
    return <div className="text-destructive">Lỗi khi tải danh sách dự án</div>
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="animate-in fade-in-50 flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
        <div className="bg-background mx-auto flex h-12 w-12 items-center justify-center rounded-full">
          <FolderKanban className="text-muted-foreground h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Không tìm thấy dự án nào</h3>
        <p className="text-muted-foreground mt-2 mb-4 max-w-sm text-sm">
          {query || status
            ? 'Thử thay đổi bộ lọc để tìm kiếm.'
            : 'Bạn chưa có dự án nào. Hãy bắt đầu bằng cách tạo dự án đầu tiên.'}
        </p>
        <Button asChild>
          <Link href="/dashboard/client/post-project">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo dự án
          </Link>
        </Button>
      </div>
    )
  }

  return <ProjectTable projects={projects} />
}

export default async function ProjectsPage({
  searchParams
}: {
  searchParams: any
}) {
  const supabase = await createClient()

  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const stats = await getStats(session.user.id, supabase)

  return (
    <div className="container mx-auto max-w-7xl space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý dự án</h1>
        <p className="text-muted-foreground">
          Quản lý các dự án kiểm thử, theo dõi tiến độ và đánh giá ứng viên.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số dự án</CardTitle>
            <FolderKanban className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-muted-foreground text-xs">Tổng dự án đã tạo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dự án đang mở</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-muted-foreground text-xs">Đang tuyển tester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đang tiến hành
            </CardTitle>
            <PlayCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-muted-foreground text-xs">Đang thực hiện test</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-muted-foreground text-xs">
              Đang chờ admin duyệt
            </p>
          </CardContent>
        </Card>
      </div>

      <ProjectToolbar />

      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsContent searchParams={searchParams} userId={session.user.id} />
      </Suspense>
    </div>
  )
}

function ProjectsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="space-y-4 p-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className="flex items-center justify-between space-x-4"
            >
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
