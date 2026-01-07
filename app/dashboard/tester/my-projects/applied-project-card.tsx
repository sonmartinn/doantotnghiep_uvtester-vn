import { addDays, format } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Eye,
  FileText,
  XCircle
} from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ui/card'
import { Separator } from '@/ui/separator'

import { DuAn, UngTuyen } from '@/app/_services/data-service'

interface AppliedProjectCardProps {
  application: UngTuyen & { DuAn: DuAn | null }
}

export function AppliedProjectCard({ application }: AppliedProjectCardProps) {
  const project = application.DuAn

  // If project is null (shouldn't happen with inner join but good for safety)
  if (!project) return null

  // Format statuses
  const getAppStatusConfig = (status: string) => {
    switch (status) {
      case 'ChoDuyet':
        return {
          label: 'Chờ duyệt',
          color: 'bg-yellow-500 text-white hover:bg-yellow-600',
          icon: Clock
        }
      case 'DaDuyet':
        return {
          label: 'Đã nhận',
          color: 'bg-green-600 text-white hover:bg-green-700',
          icon: CheckCircle2
        }
      case 'TuChoi':
        return {
          label: 'Từ chối',
          color: 'bg-red-500 text-white hover:bg-red-600',
          icon: XCircle
        }
      default:
        return {
          label: status,
          color: 'bg-gray-500 text-white',
          icon: FileText
        }
    }
  }

  const appStatus = getAppStatusConfig(application.trangThaiUngTuyen || '')
  const StatusIcon = appStatus.icon

  // Format budget
  const paymentConfig = project.cauHinhThanhToan as {
    perCompletion?: number
  } | null
  const paymentAmount = paymentConfig?.perCompletion || 0

  const formattedPayment = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(paymentAmount)

  const formattedAppliedDate = application.ngayUngTuyen
    ? format(new Date(application.ngayUngTuyen), 'dd/MM/yyyy HH:mm', {
        locale: vi
      })
    : 'N/A'

  const startDate = project.thoiHanUngTuyen
    ? format(addDays(new Date(project.thoiHanUngTuyen), 1), 'dd/MM/yyyy', {
        locale: vi
      })
    : 'N/A'

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between pt-2">
          <div className="min-w-0 space-y-1">
            <span className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
              <Calendar className="h-3 w-3" />
              Ứng tuyển ngày: {formattedAppliedDate}
            </span>
            <CardTitle className="text-lg">
              {project.maDuAnHienThi} -{' '}
              {project.tieuDe || 'Dự án chưa có tiêu đề'}
            </CardTitle>
            <div className="text-muted-foreground mt-1 flex flex-col gap-1 text-xs">
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" /> Loại dự án:{' '}
                {project.loaiDuAn || 'Dự án'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Dự kiến bắt đầu: {startDate}
              </span>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={`absolute top-2 right-2 shrink-0 whitespace-nowrap ${appStatus.color}`}
          >
            <StatusIcon className="mr-1 h-3 w-3" />
            {appStatus.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <div className="text-primary flex items-baseline gap-1 text-lg font-bold">
          <DollarSign className="text-muted-foreground h-4 w-4" />
          {formattedPayment} <span className="text-xs">/ Tester</span>
        </div>

        <Separator className="my-3" />

        <div className="text-sm">
          <span className="text-muted-foreground">Trạng thái dự án: </span>
          <span
            className={`${
              project.trangThaiDuAn === 'DangTuyen'
                ? 'text-green-600'
                : project.trangThaiDuAn === 'DangTienHanh'
                  ? 'text-blue-600'
                  : project.trangThaiDuAn === 'ChoQuyetToan'
                    ? 'text-orange-600'
                    : project.trangThaiDuAn === 'DaHoanThanh'
                      ? 'text-purple-600'
                      : project.trangThaiDuAn === 'DaDong' ||
                          project.trangThaiDuAn === 'HoanThanh'
                        ? 'text-gray-600'
                        : 'text-muted-foreground'
            } font-medium`}
          >
            {project.trangThaiDuAn === 'DangTuyen'
              ? 'Đang tuyển'
              : project.trangThaiDuAn === 'DangTienHanh'
                ? 'Đang tiến hành'
                : project.trangThaiDuAn === 'ChoQuyetToan'
                  ? 'Chờ quyết toán'
                  : project.trangThaiDuAn === 'DaHoanThanh'
                    ? 'Đã hoàn thành'
                    : project.trangThaiDuAn === 'DaDong'
                      ? 'Đã đóng'
                      : project.trangThaiDuAn === 'HoanThanh'
                        ? 'Đã kết thúc'
                        : project.trangThaiDuAn}
          </span>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/20 p-4">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/dashboard/tester/projects/${project.maDuAn}`}>
            <Eye className="mr-2 h-4 w-4" />
            Truy cập dự án
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
