'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/ui/dialog'
import { Button } from '@/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'
import { Label } from '@/ui/label'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { inviteTesterToProject } from '@/app/dashboard/client/find-testers/action' // To be implemented

interface Project {
  maDuAn: number
  maDuAnHienThi: string
  tieuDe: string | null
}

interface InviteTesterModalProps {
  isOpen: boolean
  onClose: () => void
  testerId: string
  testerName: string
  projects: Project[]
}

export function InviteTesterModal({
  isOpen,
  onClose,
  testerId,
  testerName,
  projects
}: InviteTesterModalProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInvite = async () => {
    if (!selectedProjectId) {
      toast.error('Vui lòng chọn dự án để mời')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await inviteTesterToProject(
        testerId,
        parseInt(selectedProjectId)
      )
      if (result.success) {
        toast.success(`Đã gửi lời mời tới ${testerName}`)
        onClose()
      } else {
        toast.error(result.error || 'Có lỗi xảy ra khi gửi lời mời')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi lời mời')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Mời Tester tham gia dự án</DialogTitle>
          <DialogDescription>
            Gửi lời mời tham gia dự án tới <strong>{testerName}</strong>. Họ sẽ
            nhận được email và thông báo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="project">Chọn dự án</Label>
            <div className="relative">
              <Select
                value={selectedProjectId}
                onValueChange={setSelectedProjectId}
              >
                <SelectTrigger id="project">
                  <SelectValue placeholder="Chọn dự án..." />
                </SelectTrigger>
                <SelectContent>
                  {projects.length > 0 ? (
                    projects.map(project => (
                      <SelectItem
                        key={project.maDuAn}
                        value={project.maDuAn.toString()}
                      >
                        {project.maDuAnHienThi} -{' '}
                        {project.tieuDe || 'Không có tiêu đề'}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Không có dự án khả dụng
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            {projects.length === 0 && (
              <p className="text-secondary-foreground text-xs italic">
                Bạn cần có dự án đang mở hoặc đang tuyển để mời.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            type="submit"
            onClick={handleInvite}
            disabled={isSubmitting || !selectedProjectId}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi...
              </>
            ) : (
              'Gửi lời mời'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
