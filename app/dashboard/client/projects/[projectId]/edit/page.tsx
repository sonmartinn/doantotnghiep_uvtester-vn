import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDuAn } from '@/app/_services/data-service'
import { ProjectEditForm } from './edit-project-form'

interface PageProps {
  params: Promise<{ projectId: string }>
}

export default async function EditProjectPage(props: PageProps) {
  const params = await props.params
  const supabase = await createClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const projectId = Number(params.projectId)

  if (isNaN(projectId)) {
    notFound()
  }

  const project = await getDuAn(projectId, supabase)

  if (!project) {
    notFound()
  }

  // Check ownership
  if (project.maNguoiTao !== session.user.id) {
    return (
      <div className="p-8 text-center text-red-500">
        Bạn không có quyền chỉnh sửa dự án này
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <ProjectEditForm project={project} />
    </div>
  )
}
