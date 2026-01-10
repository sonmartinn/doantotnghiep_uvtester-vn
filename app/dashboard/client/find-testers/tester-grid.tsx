import { getTesters } from '@/app/_services/data-service'
import { TesterCard } from './tester-card'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/app/_services/data-service'
import { getOpenProjects } from '@/app/_services/data-service' // Need to fetch client's projects

interface TesterGridProps {
  query: string
  experience: string
}

export async function TesterGrid({ query, experience }: TesterGridProps) {
  const testers = await getTesters(query, experience)
  const supabase = await createClient()
  const user = await getAuthUser(supabase)

  // Fetch projects that the client can invite testers to (Open or Recruiting)
  let projects: any[] = []
  if (user) {
    // We reuse getOpenProjects but filter by client ID?
    // Actually we need a specific function for client's own projects
    // For now let's assume getClientProjects or similar
    const { data } = await supabase
      .from('DuAn')
      .select('maDuAn, maDuAnHienThi, tieuDe')
      .eq('maNguoiTao', user.id)
      .in('trangThaiDuAn', ['DangTuyen', 'DangMo'])

    projects = data || []
  }

  if (testers.length === 0) {
    return (
      <div className="text-muted-foreground flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <p className="text-lg font-medium">Không tìm thấy Tester phù hợp</p>
        <p className="text-sm">Hãy thử thay đổi tiêu chí tìm kiếm</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {testers.map(tester => (
        <TesterCard
          key={tester.maNguoiDung}
          tester={tester}
          projects={projects}
        />
      ))}
    </div>
  )
}
