'use client'

import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/ui/dropdown-menu'
import { Archive, Eye, FileEdit, MoreHorizontal, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { useUpdateDuAn } from '@/app/_services/queries'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/ui/alert-dialog'

interface ProjectActionsProps {
  projectId: number
  currentStatus: string
}

export function ProjectActions({
  projectId,
  currentStatus
}: ProjectActionsProps) {
  const [open, setOpen] = useState(false)
  const updateDuAnMutation = useUpdateDuAn()

  const isClosed = currentStatus === 'DaDong'
  const actionLabel = isClosed ? 'Mở lại dự án' : 'Đóng dự án'

  const router = useRouter()
  const handleToggleStatus = async () => {
    try {
      const newStatus = isClosed ? 'DangTuyen' : 'DaDong'
      await updateDuAnMutation.mutateAsync({
        maDuAn: projectId,
        data: { trangThaiDuAn: newStatus }
      })
      toast.success(
        isClosed ? 'Đã mở lại dự án thành công' : 'Đã đóng dự án thành công'
      )
      router.refresh()
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message)
    } finally {
      setOpen(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Mở menu thao tác</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/client/projects/${projectId}`}>
              <Eye className="mr-2 h-4 w-4" />
              Xem chi tiết
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/client/projects/${projectId}/setup-test-cases`}
            >
              <FileEdit className="mr-2 h-4 w-4" />
              Thiết lập kịch bản
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={
              isClosed ? 'text-blue-600' : 'text-red-600 focus:text-red-600'
            }
            onSelect={e => {
              e.preventDefault()
              setOpen(true)
            }}
          >
            {isClosed ? (
              <RotateCcw className="mr-2 h-4 w-4" />
            ) : (
              <Archive className="mr-2 h-4 w-4" />
            )}
            {actionLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isClosed ? 'Xác nhận mở lại dự án?' : 'Xác nhận đóng dự án?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isClosed ? (
                'Dự án sẽ được chuyển sang trạng thái "Đang tuyển". Các ứng viên có thể tiếp tục ứng tuyển.'
              ) : (
                <span className="flex flex-col gap-2">
                  <span>
                    Dự án sẽ được chuyển sang trạng thái &quot;Đã đóng&quot;.
                    Bạn có thể mở lại dự án nhưng chỉ có thể mở lại trước thời
                    hạn ứng tuyển!
                  </span>
                  <span className="font-bold text-red-600">
                    Lưu ý: Các hoạt động và dữ liệu ứng tuyển sẽ bị tạm dừng và
                    xóa. Bạn hãy cân nhắc!
                  </span>
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              className={
                isClosed
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {isClosed ? 'Mở lại' : 'Đóng dự án'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
