'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTestResultStatus(
  result: any, // Using any for now to avoid strict typing issues with exact DB row shape vs partial
  status: 'DaChapNhan' | 'TuChoi' | 'YeuCauChinhSua',
  feedback?: string
) {
  try {
    const supabase = createAdminClient()

    // Construct the update object
    const updateData: any = {
      trangThaiDuyet: status
    }

    if (feedback !== undefined) {
      updateData.phanHoiCuaClient = feedback
    }

    // Matching criteria
    const matchQuery = {
      maKichBan: result.maKichBan,
      maNguoiThucHien: result.maNguoiThucHien
    }

    console.log('Server Action: Updating KetQuaKiemThu', {
      matchQuery,
      updateData
    })

    const { data, error } = await supabase
      .from('KetQuaKiemThu')
      .update(updateData)
      .match(matchQuery)
      .select()

    if (error) {
      console.error('Server Action Error:', error)
      return { success: false, error: error.message }
    }

    console.log('Server Action Success:', data)

    // Revalidate the page to show new status
    // We don't have the exact path param here easily without passing it,
    // but we can revalidate the general path or try to be specific if passed.
    // For now, let the client trigger router.refresh() or we can revalidate the layout.
    revalidatePath(
      '/dashboard/client/projects/[projectId]/test-results/[testerId]',
      'page'
    )

    return { success: true, data }
  } catch (err: any) {
    console.error('Unexpected Server Action Error:', err)
    return { success: false, error: err.message }
  }
}
