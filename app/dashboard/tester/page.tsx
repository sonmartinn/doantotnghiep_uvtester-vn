import { getFullUser } from '@/app/_lib/data-service'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { FileText, DollarSign, Clock, CheckCircle } from 'lucide-react'
import ProfileAlert from '@/app/_components/dashboard/profile-alert'

import { FindJobButton } from '@/app/_components/dashboard/action-buttons'

export default async function TesterDashboard() {
  const supabase = await createClient()
  const { nguoiDung } = await getFullUser(supabase)

  return (
    <div className="flex flex-col gap-6">
      <ProfileAlert profile={nguoiDung} />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
        <div className="flex items-center gap-2">
          <FindJobButton profile={nguoiDung} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dự án đang tham gia
            </CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-muted-foreground text-xs">
              +1 dự án trong tháng này
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Thu nhập tháng này
            </CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.200.000 ₫</div>
            <p className="text-muted-foreground text-xs">
              +20% so với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giờ làm việc</CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42h</div>
            <p className="text-muted-foreground text-xs">Trong 7 ngày qua</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lỗi đã báo cáo
            </CardTitle>
            <CheckCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-muted-foreground text-xs">
              15 lỗi đã được xác nhận
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Dự án gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Placeholder for project list */}
              <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="text-sm leading-none font-medium">
                    E-commerce Mobile App
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Test chức năng thanh toán
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="focus:ring-ring inline-flex items-center rounded-full border border-transparent bg-green-500/15 px-2.5 py-0.5 text-xs font-semibold text-green-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none">
                    Đang chạy
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="text-sm leading-none font-medium">
                    Website Bất Động Sản
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Test giao diện responsive
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="focus:ring-ring inline-flex items-center rounded-full border border-transparent bg-yellow-500/15 px-2.5 py-0.5 text-xs font-semibold text-yellow-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none">
                    Chờ duyệt
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Thông báo mới</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Lỗi #123 đã được fix</p>
                  <p className="text-muted-foreground text-xs">2 giờ trước</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-2 text-green-600">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Đã nhận thanh toán dự án A
                  </p>
                  <p className="text-muted-foreground text-xs">1 ngày trước</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
