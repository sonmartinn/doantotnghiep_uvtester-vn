import { DuAn, UngTuyen } from '@/app/_services/data-service'
import { Badge } from '@/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Separator } from '@/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import { differenceInDays, format } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  AlertTriangle,
  CalendarClock,
  ExternalLink,
  FileText,
  Info
} from 'lucide-react'
import Link from 'next/link'
import { TesterTestCaseList } from './tester-test-case-list'

interface TesterProjectWorkspaceProps {
  project: DuAn
  application: UngTuyen
  testCaseCount: number
}

export function TesterProjectWorkspace({
  project,
  application,
  testCaseCount
}: TesterProjectWorkspaceProps) {
  // Parsing Helpers
  const envRequirements = project.yeuCauMoiTruong as {
    devices?: string[]
    os?: string | string[]
    browser?: string | string[]
  } | null

  const getList = (input?: string | string[]) => {
    if (Array.isArray(input)) return input
    if (typeof input === 'string') return input.split(',').map(s => s.trim())
    return []
  }

  const devices = envRequirements?.devices || []
  const os = getList(envRequirements?.os)
  const browser = getList(envRequirements?.browser)

  const scope = project.phamViTest as {
    inScope?: string[]
    outScope?: string[]
  } | null

  const attachments = (project.taiLieuDinhKem as string[]) || []

  const paymentConfig = project.cauHinhThanhToan as any
  const paymentAmount = paymentConfig?.perCompletion || 0
  const perBugAmount = paymentConfig?.perBug || 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formattedPayment = formatCurrency(paymentAmount)
  const formattedPerBug = formatCurrency(perBugAmount)

  // Deadline Logic
  const deadline = project.thoiHanDuAn ? new Date(project.thoiHanDuAn) : null
  const formattedDeadline = deadline
    ? format(deadline, 'dd/MM/yyyy', { locale: vi })
    : 'Không giới hạn'

  const daysLeft = deadline ? differenceInDays(deadline, new Date()) : null
  const isOverdue = daysLeft !== null && daysLeft < 0
  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {project.maDuAnHienThi} - {project.tieuDe}
        </h1>
        <p
          className={`flex items-center gap-2 font-medium ${
            project.trangThaiDuAn === 'DangTienHanh'
              ? 'text-green-600'
              : project.trangThaiDuAn === 'HoanThanh'
                ? 'text-blue-600'
                : 'text-gray-600'
          }`}
        >
          <span className="relative flex h-3 w-3">
            {project.trangThaiDuAn === 'DangTienHanh' && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex h-3 w-3 rounded-full ${
                project.trangThaiDuAn === 'DangTienHanh'
                  ? 'bg-green-500'
                  : project.trangThaiDuAn === 'HoanThanh'
                    ? 'bg-blue-500'
                    : 'bg-gray-500'
              }`}
            ></span>
          </span>
          {project.trangThaiDuAn === 'DangTienHanh'
            ? 'Dự án đang tiến hành'
            : project.trangThaiDuAn === 'HoanThanh'
              ? 'Dự án đã hoàn thành'
              : project.trangThaiDuAn}
        </p>
      </div>

      <Tabs defaultValue="information" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="information">Thông tin dự án</TabsTrigger>
          <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
          <TabsTrigger value="bugs">Báo lỗi</TabsTrigger>
          <TabsTrigger value="chat">Thảo luận</TabsTrigger>
        </TabsList>

        <TabsContent value="information" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Mô tả dự án</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: project.moTa || '' }}
                  />
                </CardContent>
              </Card>

              {/* Scope */}
              <Card>
                <CardHeader>
                  <CardTitle>Phạm vi kiểm thử (Scope)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 font-semibold text-green-600">
                        In Scope (Trong phạm vi)
                      </h4>
                      <ul className="list-disc space-y-1 pl-5">
                        {scope?.inScope &&
                        Array.isArray(scope.inScope) &&
                        scope.inScope.length > 0 ? (
                          scope.inScope.map((item: string, index: number) => (
                            <li key={index} className="text-sm">
                              {item}
                            </li>
                          ))
                        ) : (
                          <li className="text-muted-foreground list-none pl-0 text-sm">
                            Không có thông tin
                          </li>
                        )}
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="mb-2 font-semibold text-red-600">
                        Out Scope (Ngoài phạm vi)
                      </h4>
                      <ul className="list-disc space-y-1 pl-5">
                        {scope?.outScope &&
                        Array.isArray(scope.outScope) &&
                        scope.outScope.length > 0 ? (
                          scope.outScope.map((item: string, index: number) => (
                            <li key={index} className="text-sm">
                              {item}
                            </li>
                          ))
                        ) : (
                          <li className="text-muted-foreground list-none pl-0 text-sm">
                            Không có thông tin
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Hướng dẫn chi tiết</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="mb-2 font-semibold">Hướng dẫn truy cập</h4>
                    <div
                      className="prose dark:prose-invert max-w-none text-sm"
                      dangerouslySetInnerHTML={{
                        __html:
                          project.huongDanTruyCap ||
                          'Không có hướng dẫn truy cập'
                      }}
                    />
                  </div>
                  <Separator />
                  <div>
                    <h4 className="mb-2 font-semibold">Hướng dẫn kỹ thuật</h4>
                    <div
                      className="prose dark:prose-invert max-w-none text-sm"
                      dangerouslySetInnerHTML={{
                        __html:
                          project.huongDanKyThuat ||
                          'Không có hướng dẫn kỹ thuật cụ thể'
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Attachments */}
              {attachments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tài liệu đính kèm</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      {attachments.map((url, index) => (
                        <Link
                          key={index}
                          href={url}
                          target="_blank"
                          className="flex items-center gap-2 text-blue-600 hover:underline"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Tài liệu {index + 1}</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Deadline & Reminder Card */}
              <Card
                className={`border-l-4 ${
                  isOverdue
                    ? 'border-l-red-500 bg-red-50 dark:bg-red-900/10'
                    : isUrgent
                      ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
                      : 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10'
                }`}
              >
                <CardHeader className="pb-2">
                  <CardTitle
                    className={`flex items-center gap-2 text-lg ${
                      isOverdue
                        ? 'text-red-700 dark:text-red-400'
                        : isUrgent
                          ? 'text-yellow-700 dark:text-yellow-400'
                          : 'text-blue-700 dark:text-blue-400'
                    }`}
                  >
                    {isOverdue ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : (
                      <CalendarClock className="h-5 w-5" />
                    )}
                    Thời hạn dự án
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-bold">
                      {formattedDeadline}
                    </span>
                    {deadline && (
                      <span
                        className={`text-sm font-medium ${
                          isOverdue
                            ? 'text-red-600'
                            : isUrgent
                              ? 'text-yellow-600'
                              : 'text-blue-600'
                        }`}
                      >
                        {isOverdue
                          ? `Đã quá hạn ${Math.abs(daysLeft || 0)} ngày`
                          : `Còn ${daysLeft} ngày còn lại`}
                      </span>
                    )}
                    <p className="text-muted-foreground mt-2 text-xs italic">
                      * Vui lòng hoàn thành kiểm thử và báo cáo lỗi trước thời
                      hạn.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Environment Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Yêu cầu môi trường</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Devices */}
                    <div>
                      <h4 className="text-muted-foreground mb-2 text-sm font-semibold">
                        Thiết bị
                      </h4>
                      {devices.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {devices.map((device, index) => (
                            <Badge key={index} variant="outline">
                              {device}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          Không có yêu cầu thiết bị cụ thể.
                        </p>
                      )}
                    </div>

                    <Separator />

                    {/* OS */}
                    <div>
                      <h4 className="text-muted-foreground mb-2 text-sm font-semibold">
                        Hệ điều hành
                      </h4>
                      {os.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {os.map((item, index) => (
                            <Badge key={index} variant="secondary">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          Không có yêu cầu HĐH cụ thể.
                        </p>
                      )}
                    </div>

                    <Separator />

                    {/* Browser */}
                    <div>
                      <h4 className="text-muted-foreground mb-2 text-sm font-semibold">
                        Trình duyệt
                      </h4>
                      {browser.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {browser.map((item, index) => (
                            <Badge key={index} variant="secondary">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          Không có yêu cầu trình duyệt cụ thể.
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tiến độ kiểm thử</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Test Case cần làm:
                      </span>
                      <Badge
                        variant="outline"
                        className="bg-slate-100 px-3 py-1 text-lg dark:bg-slate-800"
                      >
                        {testCaseCount}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-2 text-xs">
                      * Số lượng kịch bản kiểm thử bạn cần thực hiện trong dự
                      án.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin thù lao</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Hoàn thành dự án:
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      {formattedPayment}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-green-600">
                      + {formattedPerBug}{' '}
                      <span className="text-muted-foreground">
                        / mỗi báo cáo lỗi được duyệt
                      </span>
                    </span>
                  </div>
                  <p className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Info className="h-3 w-3" />
                    Việc bỏ qua các test case sẽ không được tính thù lao
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Thanh toán trong vòng 1-2 tuần sau khi hoàn thành dự án.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="test-cases" className="mt-6">
          <TesterTestCaseList
            projectId={project.maDuAn}
            userId={application.maUngVien}
          />
        </TabsContent>

        <TabsContent value="bugs" className="mt-6">
          <Card>
            <CardContent className="text-muted-foreground flex h-[400px] items-center justify-center pt-6">
              Chức năng Báo lỗi đang được phát triển
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <Card>
            <CardContent className="text-muted-foreground flex h-[400px] items-center justify-center pt-6">
              Chức năng Thảo luận đang được phát triển
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
