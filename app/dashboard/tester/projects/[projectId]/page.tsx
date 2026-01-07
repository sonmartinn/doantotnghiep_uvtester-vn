import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  getAuthUser,
  getDuAn,
  getUngTuyenByUserAndProject,
  getTestCaseCount
} from '@/app/_services/data-service'
import { TesterProjectDetail } from './tester-project-detail'
import { TesterProjectWorkspace } from './tester-project-workspace'

interface PageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function TesterProjectPage({ params }: PageProps) {
  const { projectId } = await params
  const supabase = await createClient()
  const user = await getAuthUser(supabase)

  if (!user) {
    redirect('/login')
  }

  const project = await getDuAn(parseInt(projectId), supabase)

  if (!project) {
    return <div>Dự án không tồn tại</div>
  }

  // Fetch application status
  const application = await getUngTuyenByUserAndProject(
    user.id,
    project.maDuAn,
    supabase
  )

  // Fetch test case count
  const testCaseCount = await getTestCaseCount(parseInt(projectId), supabase)

  const showWorkspace =
    application?.trangThaiUngTuyen === 'DaDuyet' &&
    project.trangThaiDuAn === 'DangTienHanh'

  if (showWorkspace) {
    return (
      <TesterProjectWorkspace
        project={project}
        application={application!}
        testCaseCount={testCaseCount}
      />
    )
  }

  // Otherwise show Read-only Detail view
  return <TesterProjectDetail project={project} application={application} />
}
