import { DuAn, UngTuyen } from '@/app/_services/data-service'
import { AppliedProjectCard } from './applied-project-card'
import { ProjectStatusSection } from './project-status-section'
import { Briefcase } from 'lucide-react'

interface AppliedProjectListProps {
  applications: (UngTuyen & { DuAn: DuAn | null })[]
}

export function AppliedProjectList({ applications }: AppliedProjectListProps) {
  if (applications.length === 0) {
    return (
      <div className="text-muted-foreground flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <Briefcase className="text-muted-foreground/50 mb-4 h-12 w-12" />
        <p className="text-lg font-medium">Bạn chưa ứng tuyển dự án nào</p>
        <p className="text-sm">
          Hãy tìm kiếm các dự án phù hợp và ứng tuyển ngay!
        </p>
      </div>
    )
  }

  const pendingApps = applications.filter(
    app => app.trangThaiUngTuyen === 'ChoDuyet'
  )
  const approvedApps = applications.filter(
    app => app.trangThaiUngTuyen === 'DaDuyet'
  )
  const rejectedApps = applications.filter(
    app => app.trangThaiUngTuyen === 'TuChoi'
  )
  // Catch any others (e.g. cancelled)
  const otherApps = applications.filter(
    app =>
      !['ChoDuyet', 'DaDuyet', 'TuChoi'].includes(app.trangThaiUngTuyen || '')
  )

  return (
    <div className="space-y-8">
      <ProjectStatusSection
        title="Đã nhận"
        count={approvedApps.length}
        color="bg-green-600"
      >
        {approvedApps.map(app => (
          <AppliedProjectCard key={app.maUngTuyen} application={app} />
        ))}
      </ProjectStatusSection>

      <ProjectStatusSection
        title="Chờ duyệt"
        count={pendingApps.length}
        color="bg-yellow-500"
      >
        {pendingApps.map(app => (
          <AppliedProjectCard key={app.maUngTuyen} application={app} />
        ))}
      </ProjectStatusSection>

      <ProjectStatusSection
        title="Từ chối"
        count={rejectedApps.length}
        color="bg-red-500"
        defaultExpanded={false}
      >
        {rejectedApps.map(app => (
          <AppliedProjectCard key={app.maUngTuyen} application={app} />
        ))}
      </ProjectStatusSection>

      <ProjectStatusSection
        title="Khác"
        count={otherApps.length}
        color="bg-gray-500"
        defaultExpanded={false}
      >
        {otherApps.map(app => (
          <AppliedProjectCard key={app.maUngTuyen} application={app} />
        ))}
      </ProjectStatusSection>
    </div>
  )
}
