import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser, getDuAn } from '@/app/_services/data-service'
import { ApplicationForm } from './application-form'
import { Button } from '@/ui/button'
import { ChevronLeft, Info } from 'lucide-react'
import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '@/ui/alert'

export const metadata = {
  title: 'Ứng tuyển dự án'
}

export default async function ApplyProjectPage({
  params
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId: projectIdStr } = await params
  const projectId = parseInt(projectIdStr)
  if (isNaN(projectId)) notFound()

  const supabase = await createClient()
  const user = await getAuthUser(supabase)

  if (!user) {
    redirect('/login')
  }

  // Fetch project details
  const project = await getDuAn(projectId, supabase)

  if (!project) {
    notFound()
  }

  // Check if project is recruiting
  if (project.trangThaiDuAn !== 'DangTuyen') {
    return (
      <div className="container mx-auto max-w-2xl py-10">
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Không thể ứng tuyển</AlertTitle>
          <AlertDescription>
            Dự án này hiện không còn nhận hồ sơ ứng tuyển.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href="/dashboard/tester/open-projects">
              <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Check if already applied
  const { data: existingApp } = await supabase
    .from('UngTuyen')
    .select('maUngTuyen')
    .eq('maDuAn', projectId)
    .eq('maUngVien', user.id)
    .maybeSingle()

  if (existingApp) {
    return (
      <div className="container mx-auto max-w-2xl py-10">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Đã ứng tuyển</AlertTitle>
          <AlertDescription>
            Bạn đã nộp hồ sơ ứng tuyển vào dự án này rồi. Vui lòng chờ phản hồi
            từ Client.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href="/dashboard/tester/open-projects">
              <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Parse questions
  let questions: any[] = []
  if (Array.isArray(project.cauHoiKhaoSat)) {
    questions = project.cauHoiKhaoSat
  }

  // If no questions, maybe just show a simple confirm button?
  // For now, based on requirements, we assume there are survey questions or we treat empty survey as just a confirm.
  // The ApplicationForm can handle empty questions by just showing submit button.

  return (
    <div className="container mx-auto space-y-6 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/tester/open-projects">
            <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Ứng tuyển: {project.tieuDe}</h1>
        </div>
      </div>

      <ApplicationForm projectId={projectId} questions={questions} />
    </div>
  )
}
