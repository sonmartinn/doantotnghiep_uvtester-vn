'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAuthUser, createNotification } from '@/app/_services/data-service'

export async function applyToProject(
  projectId: number,
  answers: { question: string; answer: string | string[] }[]
) {
  const supabase = await createClient()
  const user = await getAuthUser(supabase)

  if (!user) {
    throw new Error('Bạn cần đăng nhập để thực hiện chức năng này')
  }

  // 1. Validate project status
  const { data: project, error: projectError } = await supabase
    .from('DuAn')
    .select('trangThaiDuAn, cauHoiKhaoSat, maNguoiTao, tieuDe')
    .eq('maDuAn', projectId)
    .single()

  if (projectError || !project) {
    throw new Error('Dự án không tồn tại')
  }

  if (project.trangThaiDuAn !== 'DangTuyen') {
    throw new Error('Dự án này hiện không nhận ứng tuyển')
  }

  // 2. Check if already applied
  const { data: existingApp, error: appError } = await supabase
    .from('UngTuyen')
    .select('maUngTuyen')
    .eq('maDuAn', projectId)
    .eq('maUngVien', user.id)
    .maybeSingle()

  if (existingApp) {
    throw new Error('Bạn đã ứng tuyển vào dự án này rồi')
  }

  // 3. Create application
  const { error: insertError } = await supabase.from('UngTuyen').insert({
    maDuAn: projectId,
    maUngVien: user.id,
    ngayUngTuyen: new Date().toISOString(),
    trangThaiUngTuyen: 'ChoDuyet',
    traLoiKhaoSat: answers
  })

  if (insertError) {
    console.error('Error applying to project:', insertError)
    throw new Error('Có lỗi xảy ra khi gửi đơn ứng tuyển. Vui lòng thử lại.')
  }

  // 4. Notify Client
  if (project.maNguoiTao) {
    const adminSupabase = createAdminClient()
    await createNotification(
      {
        maNguoiNhan: project.maNguoiTao,
        tieuDe: 'Ứng viên mới',
        noiDung: `Dự án "${project.tieuDe || '...'}" có ứng viên mới ứng tuyển.`,
        loaiThongBao: 'UngTuyen',
        duongDan: `/dashboard/client/projects/${projectId}`,
        daXem: false,
        ngayTao: new Date().toISOString()
      },
      adminSupabase
    )
  }

  // 5. Revalidate and Redirect
  revalidatePath(`/dashboard/tester/open-projects`)
  revalidatePath(`/dashboard/tester/projects/${projectId}`) // For when we have the detail page

  // Note: We'll redirect from the client side or here.
  // Returning success/true might be better for handling UI feedback first.
  return { success: true }
}
