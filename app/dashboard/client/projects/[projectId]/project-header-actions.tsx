'use client'

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
import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/ui/dropdown-menu'
import {
  Archive,
  Edit,
  MoreHorizontal,
  PauseCircle,
  RotateCcw,
  CheckCircle,
  Bug
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { useUpdateDuAn } from '@/app/_services/queries'

interface ProjectHeaderActionsProps {
  projectId: number
  status: string
}

export function ProjectHeaderActions({
  projectId,
  status
}: ProjectHeaderActionsProps) {
  const router = useRouter()
  const updateDuAnMutation = useUpdateDuAn()
  const [openStop, setOpenStop] = useState(false)
  const [openClose, setOpenClose] = useState(false)
  const [openComplete, setOpenComplete] = useState(false)

  const handleStopRecruiting = async () => {
    try {
      await updateDuAnMutation.mutateAsync({
        maDuAn: projectId,
        data: { trangThaiDuAn: 'DangTienHanh' }
      })
      toast.success('Đã dừng tuyển dụng. Dự án chuyển sang Đang Tiến Hành.')
      router.refresh()
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message)
    } finally {
      setOpenStop(false)
    }
  }

  const isRecruiting = status === 'DangTuyen'
  const isClosed = status === 'DaDong'
  const isPendingSettlement = status === 'ChoQuyetToan'
  const showCloseAction = ![
    'DangTienHanh',
    'ChoQuyetToan',
    'DaHoanThanh'
  ].includes(status)
  const actionLabel = isClosed ? 'Mở lại dự án' : 'Đóng dự án'

  const handleCloseProject = async () => {
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
      setOpenClose(false)
    }
  }

  const handleCompleteProject = async () => {
    try {
      await updateDuAnMutation.mutateAsync({
        maDuAn: projectId,
        data: { trangThaiDuAn: 'DaHoanThanh' }
      })
      toast.success('Đã hoàn thành dự án.')
      router.refresh()
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message)
    } finally {
      setOpenComplete(false)
    }
  }

  // if (isClosed) return null

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/client/projects/${projectId}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Link>
        </Button>

        <Button variant="default" size="sm" asChild>
          <Link
            href={`/dashboard/client/projects/${projectId}/bugs-tracker`}
            target="_blank"
          >
            <Bug className="mr-2 h-4 w-4" />
            Trình quản lý lỗi
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isRecruiting && (
              <DropdownMenuItem onClick={() => setOpenStop(true)}>
                <PauseCircle className="mr-2 h-4 w-4" />
                Dừng tuyển dụng
              </DropdownMenuItem>
            )}
            {isPendingSettlement && (
              <DropdownMenuItem
                onClick={() => setOpenComplete(true)}
                className="text-green-600 focus:text-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Hoàn thành dự án
              </DropdownMenuItem>
            )}
            {showCloseAction && (
              <DropdownMenuItem
                onClick={() => setOpenClose(true)}
                className={
                  isClosed
                    ? 'text-blue-600 focus:text-blue-600'
                    : 'text-destructive focus:text-destructive'
                }
              >
                {isClosed ? (
                  <RotateCcw className="mr-2 h-4 w-4" />
                ) : (
                  <Archive className="mr-2 h-4 w-4" />
                )}
                {actionLabel}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stop Recruiting Dialog */}
      <AlertDialog open={openStop} onOpenChange={setOpenStop}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dừng tuyển dụng?</AlertDialogTitle>
            <AlertDialogDescription>
              Dự án sẽ chuyển sang trạng thái &quot;Đang tiến hành&quot;. Các
              ứng viên sẽ không thể nộp hồ sơ nữa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleStopRecruiting}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Close Project Dialog */}
      <AlertDialog open={openClose} onOpenChange={setOpenClose}>
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
                    làm mới. Bạn hãy cân nhắc!
                  </span>
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCloseProject}
              className={
                isClosed
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
              }
            >
              {isClosed ? 'Mở lại' : 'Đóng dự án'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complete Project Dialog */}
      <AlertDialog open={openComplete} onOpenChange={setOpenComplete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hoàn thành dự án?</AlertDialogTitle>
            <AlertDialogDescription>
              Dự án sẽ chuyển sang trạng thái &quot;Đã hoàn thành&quot;. Hãy đảm
              bảo bạn đã thanh toán đầy đủ cho các ứng viên.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCompleteProject}
              className="bg-green-600 hover:bg-green-700"
            >
              Hoàn thành
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
