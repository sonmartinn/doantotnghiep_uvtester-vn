'use client'

import {
  useAllTestResultsByProject,
  useUngTuyenByDuAn
} from '@/app/_services/queries'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
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
import {
  CheckCircle2,
  ChevronRight,
  XCircle,
  AlertCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface TestResultsTabProps {
  projectId: number
}

// Helper to calculate progress and status for a tester
function calculateTesterProgress(testerId: string, testResults: any[]) {
  // Filter results for this tester
  const testerResults = testResults.filter(r => r.maNguoiThucHien === testerId)

  const total = testerResults.length
  // Assuming total test cases is constant for all for now, or we can just show executed count.
  // Better: We can compare with total Test Cases of the project if we fetched them.
  // For now, let's just show what they have done.

  const passCount = testerResults.filter(
    r => r.ketQuaThucTeChung === 'Dat'
  ).length
  const failCount = testerResults.filter(
    r => r.ketQuaThucTeChung === 'KhongDat'
  ).length
  // 'ChuaDat' or other statuses
  const pendingCount = total - passCount - failCount

  return { total, passCount, failCount, pendingCount }
}

export function TestResultsTab({ projectId }: TestResultsTabProps) {
  // 1. Get all approved candidates (testers)
  const { data: candidates, isLoading: isLoadingCandidates } =
    useUngTuyenByDuAn(projectId)

  // 2. Get all test results
  const { data: allResults, isLoading: isLoadingResults } =
    useAllTestResultsByProject(projectId)

  if (isLoadingCandidates || isLoadingResults) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        Đang tải dữ liệu kiểm thử...
      </div>
    )
  }

  // Filter only approved testers
  const approvedTesters =
    candidates?.filter(c => c.trangThaiUngTuyen === 'DaDuyet') || []

  if (approvedTesters.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
        <p>Chưa có Tester nào tham gia dự án.</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Tiến độ kiểm thử ({approvedTesters.length} Testers)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tester</TableHead>
              <TableHead className="text-center">Đã thực hiện</TableHead>
              <TableHead className="text-center">Kết quả</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvedTesters.map(candidate => {
              const progress = calculateTesterProgress(
                candidate.maUngVien,
                allResults || []
              )

              return (
                <TableRow key={candidate.maUngTuyen}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={candidate.UngVien?.anhDaiDien || ''}
                        />
                        <AvatarFallback>
                          {candidate.UngVien?.hoTen?.charAt(0) || 'T'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {candidate.UngVien?.hoTen || 'Người dùng ẩn'}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {candidate.UngVien?.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono">
                      {progress.total} TCs
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      {progress.passCount > 0 && (
                        <div
                          className="flex items-center text-xs font-medium text-green-600"
                          title="Đạt"
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          {progress.passCount}
                        </div>
                      )}
                      {progress.failCount > 0 && (
                        <div
                          className="flex items-center text-xs font-medium text-red-600"
                          title="Không đạt"
                        >
                          <XCircle className="mr-1 h-3 w-3" />
                          {progress.failCount}
                        </div>
                      )}
                      {progress.pendingCount > 0 && (
                        <div
                          className="flex items-center text-xs font-medium text-orange-500"
                          title="Chưa xác định/Đang làm"
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          {progress.pendingCount}
                        </div>
                      )}
                      {progress.total === 0 && (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={`/dashboard/client/projects/${projectId}/test-results/${candidate.maUngVien}`}
                        className="text-primary flex items-center"
                      >
                        Xem chi tiết <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
