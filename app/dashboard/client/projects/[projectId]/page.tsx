import { createClient } from '@/lib/supabase/server'
import { getDuAn, getUngTuyenByDuAn } from '@/app/_services/data-service'
import { getStatusColor, getStatusLabel } from '@/lib/project-helpers'
import { Badge } from '@/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/ui/breadcrumb'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import { Calendar, Clock, DollarSign, Users, UserPlus } from 'lucide-react'
import { notFound } from 'next/navigation'
import { CandidatesTab } from './candidates-tab'
import { OverviewTab } from './overview-tab'
import { ProjectHeaderActions } from './project-header-actions'
import { TestCasesTab } from './test-cases-tab'

export default async function ProjectDetailsPage(props: {
  params: Promise<{ projectId: string }>
}) {
  const params = await props.params
  const projectId = Number(params.projectId)
  const supabase = await createClient()
  const project = await getDuAn(projectId, supabase)
  const applications = await getUngTuyenByDuAn(projectId, supabase)
  const acceptedCount = applications.filter(
    app => app.trangThaiUngTuyen === 'DaDuyet'
  ).length
  const pendingCount = applications.filter(
    app => app.trangThaiUngTuyen === 'ChoDuyet'
  ).length

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/client/projects">
              Dự án
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{project.maDuAnHienThi}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <h1 className="text-3xl leading-tight font-bold tracking-tight">
                {project.tieuDe}
              </h1>
              <Badge
                className={`${getStatusColor(project.trangThaiDuAn)} mt-1 shrink-0`}
              >
                {getStatusLabel(project.trangThaiDuAn)}
              </Badge>
            </div>
            <p className="text-muted-foreground">ID: {project.maDuAnHienThi}</p>
          </div>

          <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span>
                Ngân sách: {project.nganSach?.toLocaleString('vi-VN')} đ
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                Tuyển: <span className="text-green-600">{acceptedCount}</span>/
                {project.soLuongCanTuyen} người
              </span>
            </div>
            <div className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              <span>
                Chờ duyệt:{' '}
                <span className="text-orange-500">{pendingCount}</span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Hạn ứng tuyển:{' '}
                {project.thoiHanUngTuyen
                  ? new Date(project.thoiHanUngTuyen).toLocaleDateString(
                      'vi-VN'
                    )
                  : 'Chưa set'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                Hạn dự án:{' '}
                {project.thoiHanDuAn
                  ? new Date(project.thoiHanDuAn).toLocaleDateString('vi-VN')
                  : 'Chưa set'}
              </span>
            </div>
          </div>
        </div>

        <ProjectHeaderActions
          projectId={project.maDuAn}
          status={project.trangThaiDuAn}
          projectCode={project.maDuAnHienThi || ''}
          projectTitle={project.tieuDe}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="candidates">Ứng viên</TabsTrigger>
          <TabsTrigger value="test-cases">Kịch bản kiểm thử</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab project={project} />
        </TabsContent>

        <TabsContent value="candidates">
          <CandidatesTab projectId={projectId} />
        </TabsContent>

        <TabsContent value="test-cases">
          <TestCasesTab projectId={projectId} project={project} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
