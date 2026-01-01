import { getFullUser } from '@/app/_services/data-service'
import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/app/_components/dashboard/settings/settings-form'

export default async function ClientSettingsPage() {
  const supabase = await createClient()
  const { user, nguoiDung } = await getFullUser(supabase)

  const paymentNote = (
    <p className="text-muted-foreground">
      <span className="font-semibold text-red-600 dark:text-red-500">
        Lưu ý!
      </span>{' '}
      Nếu sau này bạn thanh toán cho Tester bằng thông tin tài khoản ngân hàng
      khác, thì nếu có vấn đề xảy ra, chúng tôi sẽ không chịu trách nhiệm.
    </p>
  )

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin tài khoản và thanh toán của bạn.
        </p>
      </div>

      <SettingsForm
        user={user}
        nguoiDung={nguoiDung}
        paymentTitle="Phương thức thanh toán"
        paymentDescription="Thông tin tài khoản thanh toán của công ty, doanh nghiệp hoặc tổ chức sẽ sử dụng để thanh toán cho Tester"
        paymentNote={paymentNote}
      />
    </div>
  )
}
