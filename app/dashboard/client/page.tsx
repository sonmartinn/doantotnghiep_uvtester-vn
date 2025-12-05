import { getFullUser } from '@/app/_services/data-service'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { FileText, Users, AlertCircle, CheckCircle } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/ui/avatar'
import ProfileAlert from '@/app/_components/dashboard/profile-alert'

import { PostProjectButton } from '@/app/_components/dashboard/action-buttons'

export default async function ClientDashboard() {
  const supabase = await createClient()
  const { nguoiDung } = await getFullUser(supabase)

  return (
    <div className="flex flex-col gap-6">
      <ProfileAlert profile={nguoiDung} />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
        <div className="flex items-center gap-2">
          <PostProjectButton profile={nguoiDung} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dự án đang chạy
            </CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-muted-foreground text-xs">
              1 dự án sắp hoàn thành
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tester đang thuê
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-muted-foreground text-xs">
              +2 tester mới tuần này
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lỗi chưa xử lý
            </CardTitle>
            <AlertCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-muted-foreground text-xs">3 lỗi nghiêm trọng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ứng viên chờ duyệt
            </CardTitle>
            <CheckCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-muted-foreground text-xs">
              Cho dự án &quot;App Mobile&quot;
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tiến độ dự án</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">E-commerce App Phase 1</span>
                  <span className="text-muted-foreground">75%</span>
                </div>
                <div className="bg-muted h-2 w-full rounded-full">
                  <div className="bg-primary h-full w-3/4 rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Website Landing Page</span>
                  <span className="text-muted-foreground">30%</span>
                </div>
                <div className="bg-muted h-2 w-full rounded-full">
                  <div className="h-full w-[30%] rounded-full bg-yellow-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>T1</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Nguyễn Văn A đã báo cáo lỗi mới
                  </p>
                  <p className="text-muted-foreground text-xs">15 phút trước</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>T2</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Trần Thị B đã nộp ứng tuyển
                  </p>
                  <p className="text-muted-foreground text-xs">1 giờ trước</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
