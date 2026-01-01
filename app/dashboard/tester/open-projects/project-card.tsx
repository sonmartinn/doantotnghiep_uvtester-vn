import Link from 'next/link'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  Calendar,
  DollarSign,
  ArrowRight,
  Eye,
  Briefcase,
  User
} from 'lucide-react'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ui/card'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Separator } from '@/ui/separator'

import { DuAn } from '@/app/_services/data-service'

interface ProjectCardProps {
  project: DuAn & { soLuongUngVien?: number }
}

export function ProjectCard({ project }: ProjectCardProps) {
  // Format budget with dots for thousands
  // Cast payment config to expected type
  const paymentConfig = project.cauHinhThanhToan as {
    perCompletion?: number
  } | null
  const paymentAmount = paymentConfig?.perCompletion || 0

  const formattedPayment = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(paymentAmount)

  const formattedDeadline = project.thoiHanUngTuyen
    ? format(new Date(project.thoiHanUngTuyen), 'dd/MM/yyyy', {
        locale: vi
      })
    : 'N/A'

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between pt-2">
          <div className="min-w-0 space-y-1">
            <span className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
              <User className="h-3 w-3" />{' '}
              <div>
                <span className="text-primary font-semibold">
                  {project.soLuongUngVien || 0}
                </span>
                /{project.soLuongCanTuyen} ứng viên
              </div>
            </span>
            <CardTitle className="text-lg">
              {project.tieuDe || 'Dự án chưa có tiêu đề'}
            </CardTitle>
            <div className="text-muted-foreground mt-1 flex flex-col gap-1 text-xs">
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" /> Loại dự án:{' '}
                {project.loaiDuAn || 'Dự án'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Thời hạn ứng tuyển:{' '}
                {formattedDeadline}
              </span>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 shrink-0 bg-green-600 whitespace-nowrap text-white hover:bg-green-700 dark:bg-green-900/30 dark:text-green-400"
          >
            Đang tuyển
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <div className="text-primary flex items-baseline gap-1 text-lg font-bold">
          <DollarSign className="text-muted-foreground h-4 w-4" />
          {formattedPayment} <span className="text-xs">/ Tester</span>
        </div>

        <Separator className="my-3" />

        <p className="text-muted-foreground line-clamp-3 text-sm">
          {project.moTa?.replace(/<[^>]+>/g, '') ||
            'Chưa có mô tả cho dự án này.'}
        </p>
      </CardContent>

      <CardFooter className="bg-muted/20 grid grid-cols-2 gap-2 p-4">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/dashboard/tester/projects/${project.maDuAn}`}>
            <Eye className="mr-2 h-4 w-4" />
            Chi tiết
          </Link>
        </Button>
        <Button size="sm" className="w-full" asChild>
          <Link href={`/dashboard/tester/projects/${project.maDuAn}/apply`}>
            Ứng tuyển
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
