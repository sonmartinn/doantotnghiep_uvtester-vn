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
import {
  Archive,
  Eye,
  FileEdit,
  MoreHorizontal,
  RotateCcw,
  Edit,
  CheckCircle
} from 'lucide-react'
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
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'

interface ProjectActionsProps {
  projectId: number
  currentStatus: string
  thoiHanUngTuyen?: string
  thoiHanDuAn?: string
}

export function ProjectActions({
  projectId,
  currentStatus,
  thoiHanUngTuyen,
  thoiHanDuAn
}: ProjectActionsProps) {
  const [open, setOpen] = useState(false)
  const [openComplete, setOpenComplete] = useState(false)
  const [openReopenDialog, setOpenReopenDialog] = useState(false)

  // State for Reopen Date Update
  const [appDeadline, setAppDeadline] = useState('')
  const [projDeadline, setProjDeadline] = useState('')

  const updateDuAnMutation = useUpdateDuAn()

  const isClosed = currentStatus === 'DaDong'
  const isPendingSettlement = currentStatus === 'ChoQuyetToan'
  const showCloseAction = ![
    'DangTienHanh',
    'ChoQuyetToan',
    'DaHoanThanh'
  ].includes(currentStatus)
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

  const validateAndOpenReopen = (e: any) => {
    e.preventDefault()

    if (!isClosed) {
      setOpen(true)
      return
    }

    // Check deadlines if reopening
    const now = new Date()
    const appDate = thoiHanUngTuyen ? new Date(thoiHanUngTuyen) : null

    // If no deadline set or deadline passed/soon (< 48h)
    // Diff in hours
    const diffHours = appDate
      ? (appDate.getTime() - now.getTime()) / (1000 * 60 * 60)
      : -1

    if (diffHours < 48) {
      // Initialize inputs with current or tomorrow's date
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 7) // Default 7 days for app
      setAppDeadline(tomorrow.toISOString().split('T')[0])

      const projDate = new Date()
      projDate.setDate(projDate.getDate() + 30) // Default 30 days for project
      setProjDeadline(projDate.toISOString().split('T')[0])

      // Attempt to use existing if future, but for simplicity let's default to future
      if (thoiHanDuAn && new Date(thoiHanDuAn) > now) {
        setProjDeadline(new Date(thoiHanDuAn).toISOString().split('T')[0])
      }

      setOpenReopenDialog(true)
    } else {
      setOpen(true)
    }
  }

  const handleReopenWithDates = async () => {
    if (!appDeadline || !projDeadline) {
      toast.error('Vui lòng chọn đầy đủ thời hạn')
      return
    }

    if (new Date(projDeadline) <= new Date(appDeadline)) {
      toast.error('Thời hạn dự án phải sau thời hạn ứng tuyển')
      return
    }

    try {
      await updateDuAnMutation.mutateAsync({
        maDuAn: projectId,
        data: {
          trangThaiDuAn: 'DangTuyen',
          thoiHanUngTuyen: new Date(appDeadline).toISOString(),
          thoiHanDuAn: new Date(projDeadline).toISOString()
        }
      })
      toast.success('Đã mở lại dự án và cập nhật thời hạn.')
      router.refresh()
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message)
    } finally {
      setOpenReopenDialog(false)
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
            <Link href={`/dashboard/client/projects/${projectId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa dự án
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
          {isPendingSettlement && (
            <DropdownMenuItem
              className="text-green-600 focus:text-green-600"
              onSelect={e => {
                e.preventDefault()
                setOpenComplete(true)
              }}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Hoàn thành dự án
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />

          {showCloseAction && (
            <DropdownMenuItem
              className={
                isClosed ? 'text-blue-600' : 'text-red-600 focus:text-red-600'
              }
              onSelect={validateAndOpenReopen}
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
                    làm mới. Bạn hãy cân nhắc!
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

      {/* Reopen with Date Update Dialog */}
      <AlertDialog open={openReopenDialog} onOpenChange={setOpenReopenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cập nhật thời hạn dự án</AlertDialogTitle>
            <AlertDialogDescription>
              Thời hạn ứng tuyển của dự án đã qua hoặc sắp hết hạn (&lt; 2
              ngày). Vui lòng cập nhật lại thời hạn để mở lại dự án.
            </AlertDialogDescription>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="appDeadline">Hạn ứng tuyển mới</Label>
                <Input
                  id="appDeadline"
                  type="date"
                  value={appDeadline}
                  onChange={e => setAppDeadline(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="projDeadline">Hạn dự án mới</Label>
                <Input
                  id="projDeadline"
                  type="date"
                  value={projDeadline}
                  onChange={e => setProjDeadline(e.target.value)}
                />
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReopenWithDates}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Cập nhật & Mở lại
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
