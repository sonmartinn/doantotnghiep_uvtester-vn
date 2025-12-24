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
import { Archive, Edit, MoreHorizontal, PauseCircle } from 'lucide-react'
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

  const handleCloseProject = async () => {
    try {
      await updateDuAnMutation.mutateAsync({
        maDuAn: projectId,
        data: { trangThaiDuAn: 'DaDong' }
      })
      toast.success('Đã đóng dự án.')
      router.refresh()
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message)
    } finally {
      setOpenClose(false)
    }
  }

  const isRecruiting = status === 'DangTuyen'
  const isClosed = status === 'DaDong'

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
            <DropdownMenuItem
              onClick={() => setOpenClose(true)}
              className="text-destructive focus:text-destructive"
            >
              <Archive className="mr-2 h-4 w-4" />
              Đóng dự án
            </DropdownMenuItem>
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
            <AlertDialogTitle>Đóng dự án?</AlertDialogTitle>
            <AlertDialogDescription>
              Dự án sẽ chuyển sang trạng thái &quot;Đã đóng&quot;. Mọi hoạt động
              sẽ dừng lại.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCloseProject}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Đóng dự án
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
