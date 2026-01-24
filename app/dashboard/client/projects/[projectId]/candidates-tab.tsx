'use client'

import { useUngTuyenByDuAn, useUpdateUngTuyen } from '@/app/_services/queries'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { format } from 'date-fns'
import { Check, X, Loader2, User } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import { TesterDetailDialog } from '@/app/dashboard/client/find-testers/tester-detail-dialog'
import { SurveyAnswersDialog } from './survey-answers-dialog'

interface CandidatesTabProps {
  projectId: number
}

export function CandidatesTab({ projectId }: CandidatesTabProps) {
  const { data: candidates, isLoading } = useUngTuyenByDuAn(projectId)
  const updateMutation = useUpdateUngTuyen()

  const handleUpdateStatus = async (maUngTuyen: number, status: string) => {
    try {
      await updateMutation.mutateAsync({
        maUngTuyen,
        status,
        maDuAn: projectId
      })
      toast.success(
        status === 'DaDuyet' ? 'Đã duyệt ứng viên' : 'Đã từ chối ứng viên'
      )
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message)
    }
  }

  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [viewingSurvey, setViewingSurvey] = useState<any>(null)

  if (isLoading) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        Đang tải danh sách ứng viên...
      </div>
    )
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
        <User className="mb-4 h-8 w-8 opacity-50" />
        <p>Chưa có ứng viên nào nộp hồ sơ.</p>
      </div>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách ứng viên ({candidates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ứng viên</TableHead>
                <TableHead>Khảo sát</TableHead>
                <TableHead>Ngày nộp</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map(candidate => (
                <TableRow key={candidate.maUngTuyen}>
                  <TableCell>
                    <div
                      className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-80"
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <Avatar>
                        <AvatarImage
                          src={candidate.UngVien?.anhDaiDien || ''}
                        />
                        <AvatarFallback>
                          {candidate.UngVien?.hoTen?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium hover:underline">
                          {candidate.UngVien?.hoTen || 'Người dùng ẩn'}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {candidate.UngVien?.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {candidate.traLoiKhaoSat &&
                    (Array.isArray(candidate.traLoiKhaoSat)
                      ? candidate.traLoiKhaoSat.length > 0
                      : Object.keys(candidate.traLoiKhaoSat as object).length >
                        0) ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80 h-8 px-2"
                        onClick={() => setViewingSurvey(candidate)}
                      >
                        View
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        Không có
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {candidate.ngayUngTuyen
                      ? format(
                          new Date(candidate.ngayUngTuyen),
                          'dd/MM/yyyy HH:mm'
                        )
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={candidate.trangThaiUngTuyen} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {candidate.trangThaiUngTuyen === 'ChoDuyet' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                            onClick={() =>
                              handleUpdateStatus(
                                candidate.maUngTuyen,
                                'DaDuyet'
                              )
                            }
                            disabled={updateMutation.isPending}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive h-8 w-8 p-0 hover:bg-red-50"
                            onClick={() =>
                              handleUpdateStatus(candidate.maUngTuyen, 'TuChoi')
                            }
                            disabled={updateMutation.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedCandidate && selectedCandidate.UngVien && (
        <TesterDetailDialog
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          tester={selectedCandidate.UngVien}
        />
      )}

      {viewingSurvey && (
        <SurveyAnswersDialog
          isOpen={!!viewingSurvey}
          onClose={() => setViewingSurvey(null)}
          answers={viewingSurvey.traLoiKhaoSat}
          candidateName={viewingSurvey.UngVien?.hoTen}
        />
      )}
    </>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'DaDuyet':
      return <Badge className="bg-green-500 hover:bg-green-600">Đã duyệt</Badge>
    case 'TuChoi':
      return <Badge variant="destructive">Từ chối</Badge>
    case 'ChoDuyet':
    default:
      return <Badge variant="secondary">Chờ duyệt</Badge>
  }
}
