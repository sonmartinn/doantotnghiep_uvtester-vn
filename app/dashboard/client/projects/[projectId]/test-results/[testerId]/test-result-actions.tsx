'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/ui/dialog'
import { Label } from '@/ui/label'
import { Textarea } from '@/ui/textarea'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { KetQuaKiemThu } from '@/app/_services/data-service'
import { updateTestResultStatus } from '@/app/dashboard/client/actions'

interface TestResultActionsProps {
  result: KetQuaKiemThu
}

export function TestResultActions({ result }: TestResultActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [isRejectOpen, setIsRejectOpen] = useState(false)

  const handleUpdateStatus = async (
    status: 'DaChapNhan' | 'TuChoi' | 'YeuCauChinhSua',
    feedback?: string
  ) => {
    setLoading(true)
    try {
      const res = await updateTestResultStatus(result, status, feedback)

      if (!res.success) {
        throw new Error(res.error)
      }

      toast.success(
        status === 'DaChapNhan'
          ? 'Đã chấp nhận kết quả'
          : status === 'TuChoi'
            ? 'Đã từ chối kết quả'
            : 'Đã yêu cầu chỉnh sửa'
      )

      setIsRejectOpen(false)
      setRejectReason('')
      router.refresh()
    } catch (error: any) {
      console.error('Error updating status:', error)
      toast.error('Có lỗi xảy ra: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3 pt-2">
      <Button
        variant={result.trangThaiDuyet === 'DaChapNhan' ? 'default' : 'outline'}
        size="sm"
        className={
          result.trangThaiDuyet === 'DaChapNhan'
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'hover:border-green-200 hover:bg-green-50 hover:text-green-600'
        }
        onClick={() => handleUpdateStatus('DaChapNhan')}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 className="mr-2 h-4 w-4" />
        )}
        Chấp nhận
      </Button>

      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogTrigger asChild>
          <Button
            variant={
              result.trangThaiDuyet === 'TuChoi' ? 'destructive' : 'outline'
            }
            size="sm"
            className={
              result.trangThaiDuyet === 'TuChoi'
                ? ''
                : 'hover:border-red-200 hover:bg-red-50 hover:text-red-600'
            }
            disabled={loading}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Từ chối
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối kết quả kiểm thử</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do từ chối để tester có thể chỉnh sửa hoặc kiểm
              tra lại.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reason" className="mb-2 block">
              Lý do / Phản hồi
            </Label>
            <Textarea
              id="reason"
              placeholder="Ví dụ: Kết quả không khớp với mô tả, thiếu bằng chứng..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsRejectOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleUpdateStatus('TuChoi', rejectReason)}
              disabled={loading || !rejectReason.trim()}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
