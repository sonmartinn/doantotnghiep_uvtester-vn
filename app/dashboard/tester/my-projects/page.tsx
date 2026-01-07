import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAppliedProjects, getAuthUser } from '@/app/_services/data-service'
import { AppliedProjectList } from './applied-project-list'

export const metadata = {
  title: 'Dự án của tôi'
}

export default async function AppliedProjectsPage() {
  const supabase = await createClient()
  const user = await getAuthUser(supabase)

  if (!user) {
    redirect('/login')
  }

  const applications = await getAppliedProjects(user.id, supabase)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dự án của tôi</h1>
        <p className="text-muted-foreground">
          Theo dõi trạng thái các hồ sơ ứng tuyển của bạn và truy cập không gian
          làm việc các chu trình kiểm thử của dự án tại đây.
        </p>
      </div>

      <AppliedProjectList applications={applications} />
    </div>
  )
}
