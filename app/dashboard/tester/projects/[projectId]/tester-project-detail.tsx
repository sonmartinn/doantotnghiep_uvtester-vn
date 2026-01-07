import { format, addDays } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import { Separator } from '@/ui/separator'
import { DuAn, UngTuyen } from '@/app/_services/data-service'
import {
  Calendar,
  CheckCircle2,
  DollarSign,
  Clock,
  Info,
  FileText,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

interface TesterProjectDetailProps {
  project: DuAn
  application: UngTuyen | null
}

export function TesterProjectDetail({
  project,
  application
}: TesterProjectDetailProps) {
  const scope = project.phamViTest as {
    inScope?: string[]
    outScope?: string[]
  } | null
  const isApplied = !!application
  const isPending = application?.trangThaiUngTuyen === 'ChoDuyet'
  const isRejected = application?.trangThaiUngTuyen === 'TuChoi'
  const isApproved = application?.trangThaiUngTuyen === 'DaDuyet'

  const estimatedStartDate = project.thoiHanUngTuyen
    ? format(addDays(new Date(project.thoiHanUngTuyen), 1), 'dd/MM/yyyy', {
        locale: vi
      })
    : 'N/A'

  const formattedProjectEndDate = project.thoiHanDuAn
    ? format(new Date(project.thoiHanDuAn), 'dd/MM/yyyy', { locale: vi })
    : 'Không giới hạn'

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

  const envRequirements = project.yeuCauMoiTruong as {
    devices?: string[]
    os?: string | string[]
    browser?: string | string[]
  } | null

  const devices = envRequirements?.devices || []

  const getList = (input?: string | string[]) => {
    if (Array.isArray(input)) return input
    if (typeof input === 'string') return input.split(',').map(s => s.trim())
    return []
  }

  const os = getList(envRequirements?.os)
  const browser = getList(envRequirements?.browser)

  return (
    <div className="space-y-6">
      {/* Header / Status Banner */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            {project.tieuDe}
          </h1>
          {isApplied ? (
            <Badge
              variant={
                isApproved
                  ? 'default' // Green-ish usually
                  : isRejected
                    ? 'destructive'
                    : 'secondary'
              }
              className={`px-3 py-1 text-sm ${
                isApproved
                  ? 'bg-green-600'
                  : isPending
                    ? 'bg-yellow-500 text-white'
                    : ''
              }`}
            >
              {isApproved
                ? 'Đã được duyệt'
                : isPending
                  ? 'Đang chờ duyệt'
                  : isRejected
                    ? 'Bị từ chối'
                    : application?.trangThaiUngTuyen}
            </Badge>
          ) : (
            <Button asChild>
              <Link href={`/dashboard/tester/projects/${project.maDuAn}/apply`}>
                Ứng tuyển ngay
              </Link>
            </Button>
          )}
        </div>
        <p className="text-muted-foreground flex flex-wrap gap-4">
          <span>{project.loaiDuAn}</span>
          <span>•</span>
          <span>Dự kiến bắt đầu: {estimatedStartDate}</span>
          <span>•</span>
          <span>Hạn dự án: {formattedProjectEndDate}</span>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 md:col-span-2">
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

          {/* Conditional Info for Approved Applicants (while project is still Recruiting) */}
          {isApproved && project.trangThaiDuAn === 'DangTuyen' && (
            <>
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
              {((project.taiLieuDinhKem as string[]) || []).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tài liệu đính kèm</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      {((project.taiLieuDinhKem as string[]) || []).map(
                        (url, index) => (
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
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* If applied and pending, show a message */}
          {isPending && (
            <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-yellow-600" />
                  <div className="space-y-1">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-400">
                      Hồ sơ đang được xem xét
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Client đang xem xét hồ sơ của bạn. Bạn sẽ nhận được thông
                      báo khi có kết quả.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* If approved but project not started */}
          {isApproved && project.trangThaiDuAn !== 'DangTienHanh' && (
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-10 w-10 text-blue-600" />
                  <div className="space-y-1">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-400">
                      Bạn đã được nhận!
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Vui lòng đọc kĩ thông tin dự án trước khi có thể truy cập
                      không gian làm việc vào ngày dự án bắt đầu tiến hành.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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
              <CardTitle className="text-lg">Thông tin thù lao</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Hoàn thành dự án:</span>
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
    </div>
  )
}
