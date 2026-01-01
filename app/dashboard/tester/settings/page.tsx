import { getFullUser } from '@/app/_services/data-service'
import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/app/_components/dashboard/settings/settings-form'

export default async function TesterSettingsPage() {
  const supabase = await createClient()
  const { user, nguoiDung } = await getFullUser(supabase)

  const paymentNote = (
    <p className="text-muted-foreground">
      <span className="font-semibold text-red-600 dark:text-red-500">
        Lưu ý!
      </span>{' '}
      Tên chủ tài khoản phải trùng khớp với tên của bạn (không phân biệt
      hoa/thường) trên nền tảng này để tránh các vấn đề phát sinh. Tên tài khoản
      hiện tại của bạn trên nền tảng này là:{' '}
      <span className="text-foreground font-medium">{nguoiDung?.hoTen}</span>
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
        paymentDescription="Thông tin để nhận thanh toán từ dự án (lương, thưởng...)"
        paymentNote={paymentNote}
      />
    </div>
  )
}
