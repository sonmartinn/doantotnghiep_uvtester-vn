'use server'

import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/app/_services/data-service'
import { sendInvitationEmail } from '@/app/_services/email-service'
import { revalidatePath } from 'next/cache'

export async function inviteTesterToProject(
  testerId: string,
  projectId: number
) {
  const supabase = await createClient()
  const user = await getAuthUser(supabase)

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  // 1. Get project details to verify ownership and get info for email
  const { data: project } = await supabase
    .from('DuAn')
    .select('tieuDe, maNguoiTao, maDuAnHienThi')
    .eq('maDuAn', projectId)
    .single()

  if (!project) {
    return { success: false, error: 'Project not found' }
  }

  if (project.maNguoiTao !== user.id) {
    return { success: false, error: 'You are not the owner of this project' }
  }

  // // 2. Insert notification (ThongBao)
  // const { error: notifError } = await supabase.from('ThongBao').insert({
  //   maNguoiNhan: testerId,
  //   tieuDe: `Lời mời tham gia dự án: ${project.tieuDe}`,
  //   noiDung: `Client đã mời bạn tham gia dự án "${project.tieuDe}" (${project.maDuAnHienThi}).`,
  //   loaiThongBao: 'LoiMoiDuAn',
  //   duongDan: `/dashboard/tester/projects/${projectId}`, // Or verify link
  //   daXem: false
  // })

  // if (notifError) {
  //   console.error('Error creating notification:', notifError)
  //   return { success: false, error: 'Failed to create notification' }
  // }

  // 3. Send Email
  // Fetch tester email
  const { data: tester } = await supabase
    .from('NguoiDung')
    .select('email, hoTen')
    .eq('maNguoiDung', testerId)
    .single()

  // Fetch client name
  const { data: clientWrapper } = await supabase
    .from('NguoiDung')
    .select('hoTen, HoSoClient(tenCongTy)')
    .eq('maNguoiDung', user.id)
    .single()

  const clientName =
    clientWrapper?.HoSoClient?.tenCongTy || clientWrapper?.hoTen || 'Một Client'

  if (tester?.email) {
    const projectLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/tester/projects/${projectId}`
    await sendInvitationEmail(
      tester.email,
      clientName,
      project.tieuDe || 'Dự án mới',
      projectLink
    )
  }

  revalidatePath('/dashboard/client/find-testers')
  return { success: true }
}
