import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getNguoiDung } from '@/app/_lib/data-service'
import Sidebar from '@/app/_components/dashboard/sidebar'
import Header from '@/app/_components/dashboard/header'

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const nguoiDung = await getNguoiDung(user.id, supabase)

  // Determine role from profile or metadata
  const role = nguoiDung?.vaiTro || user.user_metadata?.role

  return (
    <div className="bg-muted/40 flex min-h-dvh w-full">
      <div className="bg-background fixed inset-y-0 z-30 hidden border-r md:block md:w-64 lg:w-72">
        <Sidebar role={role} />
      </div>
      <div className="flex w-full flex-col md:pl-64 lg:pl-72">
        <Header user={user} profile={nguoiDung} role={role} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
