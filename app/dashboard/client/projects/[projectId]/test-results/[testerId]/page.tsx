import { createClient } from '@/lib/supabase/server'
import {
  getDuAn,
  getHoSoTester,
  getKetQuaByDuAnAndUser,
  getKichBanByDuAn,
  getNguoiDung
} from '@/app/_services/data-service'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/ui/breadcrumb'
import { Badge } from '@/ui/badge'
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
import { notFound } from 'next/navigation'
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  PlayCircle,
  Image as ImageIcon,
  Video
} from 'lucide-react'
import { Button } from '@/ui/button'
import Link from 'next/link'
import { TestResultActions } from './test-result-actions'

export default async function TesterTestResultsPage(props: {
  params: Promise<{ projectId: string; testerId: string }>
}) {
  const params = await props.params
  const projectId = Number(params.projectId)
  const testerId = params.testerId

  const supabase = await createClient()

  // Parallel data fetching
  const [project, tester, testerProfile, testCases, testResults] =
    await Promise.all([
      getDuAn(projectId, supabase),
      getNguoiDung(testerId, supabase),
      getHoSoTester(testerId, supabase),
      getKichBanByDuAn(projectId, supabase),
      getKetQuaByDuAnAndUser(projectId, testerId, supabase)
    ])

  if (!project || !tester) {
    notFound()
  }

  // Create a map for easy lookup of results by KichBan ID
  const resultsMap = new Map()
  testResults.forEach(result => {
    resultsMap.set(result.maKichBan, result)
  })

  // Calculate statistics
  const total = testCases.length
  const executed = testResults.length
  const passCount = testResults.filter(r => r.trangThaiChung === 'Pass').length
  const failCount = testResults.filter(r => r.trangThaiChung === 'Fail').length

  return (
    <div className="container mx-auto max-w-7xl space-y-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/client/projects">
              Dự án
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/dashboard/client/projects/${projectId}`}>
              {project.maDuAnHienThi}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Chi tiết kết quả</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Info */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
        <div className="flex items-start gap-4">
          <Avatar className="border-primary/10 h-16 w-16 border-2">
            <AvatarImage src={tester.anhDaiDien || ''} />
            <AvatarFallback className="text-xl">
              {tester.hoTen?.charAt(0) || 'T'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{tester.hoTen}</h1>
            <p className="text-muted-foreground">{tester.email}</p>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline">
                {testerProfile?.soNamKinhNghiem} năm KN
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid w-full grid-cols-2 gap-4 md:w-auto md:grid-cols-4">
          <Card className="bg-muted/50">
            <CardContent className="p-4 text-center">
              <p className="text-muted-foreground text-sm font-medium">
                Tổng TC
              </p>
              <p className="text-2xl font-bold">{total}</p>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium text-green-700">Pass</p>
              <p className="text-2xl font-bold text-green-700">{passCount}</p>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium text-red-700">Fail</p>
              <p className="text-2xl font-bold text-red-700">{failCount}</p>
            </CardContent>
          </Card>
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium text-orange-700">Chưa làm</p>
              <p className="text-2xl font-bold text-orange-700">
                {total - executed}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Danh sách Test Cases</h2>
        <div className="space-y-4">
          {testCases.map((tc, index) => {
            const result = resultsMap.get(tc.maKichBan)

            return (
              <Card
                key={tc.maKichBan}
                className={!result ? 'border-dashed opacity-70' : ''}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <Badge variant="secondary" className="font-mono">
                          {tc.maKichBanHienThi}
                        </Badge>
                        {tc.tieuDe}
                        {result?.trangThaiChung && (
                          <Badge
                            variant={
                              result.trangThaiChung === 'Pass'
                                ? 'default'
                                : result.trangThaiChung === 'Fail'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                            className={
                              result.trangThaiChung === 'Pass'
                                ? 'bg-green-600 hover:bg-green-700'
                                : ''
                            }
                          >
                            {result.trangThaiChung}
                          </Badge>
                        )}
                      </CardTitle>
                    </div>
                    <div className="shrink-0">
                      {result ? (
                        (() => {
                          switch (result.trangThaiDuyet) {
                            case 'ChoDuyet':
                              return (
                                <Badge className="border-yellow-200 bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                                  <AlertCircle className="mr-1 h-3 w-3" /> Chờ
                                  duyệt
                                </Badge>
                              )
                            case 'DaChapNhan':
                              return (
                                <Badge className="border-green-200 bg-green-100 text-green-700 hover:bg-green-200">
                                  <CheckCircle2 className="mr-1 h-3 w-3" /> Đã
                                  chấp nhận
                                </Badge>
                              )
                            case 'TuChoi':
                              return (
                                <Badge className="border-red-200 bg-red-100 text-red-700 hover:bg-red-200">
                                  <XCircle className="mr-1 h-3 w-3" /> Từ chối
                                </Badge>
                              )
                            case 'YeuCauChinhSua':
                              return (
                                <Badge variant="secondary">
                                  Yêu cầu chỉnh sửa
                                </Badge>
                              )
                            default:
                              return (
                                <Badge variant="secondary">Chưa xác định</Badge>
                              )
                          }
                        })()
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          Chưa thực hiện
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                {result && (
                  <>
                    <CardContent className="pt-0">
                      <div className="mt-4 grid gap-6 border-t pt-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <span className="text-muted-foreground block text-sm font-medium">
                            Kết quả thực tế:
                          </span>
                          <p className="bg-muted rounded-md p-3 text-sm">
                            {result.ketQuaThucTeChung || 'Không có mô tả'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <span className="text-muted-foreground block text-sm font-medium">
                            Bằng chứng (Ảnh/Video):
                          </span>
                          {result.fileBangChung &&
                          Array.isArray(result.fileBangChung) &&
                          result.fileBangChung.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {result.fileBangChung.map(
                                (url: string, i: number) => (
                                  <Link
                                    key={i}
                                    href={url}
                                    target="_blank"
                                    className="bg-secondary hover:bg-secondary/80 flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
                                  >
                                    {/* Simple heuristic for icon */}
                                    {url.toLowerCase().endsWith('.mp4') ||
                                    url.toLowerCase().endsWith('.mov') ||
                                    url.toLowerCase().endsWith('.webm') ? (
                                      <Video className="h-4 w-4 text-blue-500" />
                                    ) : (
                                      <ImageIcon className="h-4 w-4 text-green-500" />
                                    )}
                                    View Evidence {i + 1}
                                  </Link>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-opacity-70 text-sm italic">
                              Không có bằng chứng đính kèm
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Step Results */}
                      {result.ketQuaTungBuoc &&
                        Array.isArray(result.ketQuaTungBuoc) &&
                        result.ketQuaTungBuoc.length > 0 && (
                          <div className="mt-6 space-y-3 border-t pt-4">
                            <h4 className="text-sm font-semibold">
                              Kết quả từng bước:
                            </h4>
                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[80px]">
                                      Bước
                                    </TableHead>
                                    <TableHead className="w-[120px]">
                                      Trạng thái
                                    </TableHead>
                                    <TableHead>Ghi chú / Kết quả</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {result.ketQuaTungBuoc.map(
                                    (step: any, idx: number) => (
                                      <TableRow key={idx}>
                                        <TableCell className="font-medium">
                                          {step.buoc || idx + 1}
                                        </TableCell>
                                        <TableCell>
                                          <Badge
                                            variant={
                                              step.status === 'Pass'
                                                ? 'outline' // Greenish look handled by class
                                                : step.status === 'Fail'
                                                  ? 'destructive'
                                                  : 'secondary'
                                            }
                                            className={
                                              step.status === 'Pass'
                                                ? 'border-green-500 bg-green-50 text-green-700'
                                                : step.status === 'Blocked'
                                                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                  : ''
                                            }
                                          >
                                            {step.status || 'N/A'}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                          {step.note || '-'}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}
                    </CardContent>
                    {/* Actions for Client */}
                    <div className="flex items-center justify-between border-t bg-slate-50/50 px-6 py-3 dark:bg-slate-900/50">
                      <div className="text-muted-foreground text-xs">
                        {result.trangThaiDuyet === 'ChoDuyet' &&
                          'Đang chờ duyệt'}
                        {result.trangThaiDuyet === 'DaChapNhan' &&
                          'Đã chấp nhận'}
                        {result.trangThaiDuyet === 'TuChoi' && 'Đã từ chối'}
                        {result.trangThaiDuyet === 'YeuCauChinhSua' &&
                          'Yêu cầu chỉnh sửa'}
                      </div>
                      <TestResultActions result={result} />
                    </div>
                  </>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
