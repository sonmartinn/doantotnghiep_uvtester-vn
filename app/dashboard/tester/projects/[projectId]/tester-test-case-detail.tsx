import { useState } from 'react'
import { Button } from '@/ui/button'
import { Label } from '@/ui/label'
import { Textarea } from '@/ui/textarea'
import { Input } from '@/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'
import {
  ArrowLeft,
  Laptop,
  Smartphone,
  Tablet,
  Loader2,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Ban,
  SkipForward
} from 'lucide-react'
import { KichBan, KetQuaKiemThu } from '@/app/_services/data-service'
import { Badge } from '@/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface Device {
  id?: string
  name: string
  os: string
  osVersion: string
  type: string
}

interface Step {
  buoc: number
  moTa: string
  ketQuaMongDoi: string
}

interface StepResult {
  buoc: number
  status: 'Pass' | 'Fail' | 'Blocked' | 'Skipped' | null
  note?: string // ketQuaThucTe / moTaBiChan / lyDoBoQua based on status
}

export interface SubmissionData {
  testCaseId: number
  ketQuaTungBuoc: StepResult[]
  trangThaiChung: string
  ketQuaThucTeChung?: string
  maBaoCaoLoiLienQuan?: string
  lyDoBiChan?: string
  lyDoBoQua?: string
  thongTinBoSung?: Record<string, string> // key is question text or index
  fileBangChung: string[] // uploaded URLs
  device?: Device
}

interface TesterTestCaseDetailProps {
  testCase: KichBan
  device: Device | null
  initialData?: KetQuaKiemThu | null
  submitting: boolean
  onBack: () => void
  onSubmit: (data: SubmissionData) => void
}

export function TesterTestCaseDetail({
  testCase,
  device,
  initialData,
  submitting,
  onBack,
  onSubmit
}: TesterTestCaseDetailProps) {
  // --- STATE ---
  const [stepResults, setStepResults] = useState<Record<number, StepResult>>(
    () => {
      if (!initialData?.ketQuaTungBuoc) return {}
      try {
        const parsed = initialData.ketQuaTungBuoc as unknown as StepResult[]
        const map: Record<number, StepResult> = {}
        if (Array.isArray(parsed)) {
          parsed.forEach((s, idx) => {
            // Adjust 0-based index key, assume array order matches steps
            map[idx] = s
          })
        }
        return map
      } catch {
        return {}
      }
    }
  )

  const [overallStatus, setOverallStatus] = useState<string>(
    initialData?.trangThaiChung || 'Pass'
  )

  // Overall result fields
  const [generalActualResult, setGeneralActualResult] = useState(
    initialData?.ketQuaThucTeChung || ''
  )
  const [bugReportId, setBugReportId] = useState(
    initialData?.maBaoCaoLoiLienQuan || ''
  )
  const [blockedReason, setBlockedReason] = useState(
    initialData?.lyDoBiChan || ''
  )
  const [skippedReason, setSkippedReason] = useState(
    initialData?.lyDoBoQua || ''
  )

  const [additionalAnswers, setAdditionalAnswers] = useState<
    Record<string, string>
  >(() => {
    if (!initialData?.thongTinBoSung) return {}
    return initialData.thongTinBoSung as Record<string, string>
  })

  // We can't easily turn URL strings back into File objects for input[type=file]
  // So we maintain `selectedFiles` for NEW files, and maybe `existingFiles` for display
  const [existingFiles, setExistingFiles] = useState<string[]>(() => {
    if (!initialData?.fileBangChung) return []
    return (initialData.fileBangChung as unknown as string[]) || []
  })

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // --- PARSE DATA ---
  let steps: Step[] = []
  try {
    if (typeof testCase.cacBuocThucHien === 'string') {
      try {
        steps = JSON.parse(testCase.cacBuocThucHien)
      } catch {
        steps = [
          {
            buoc: 1,
            moTa: testCase.cacBuocThucHien,
            ketQuaMongDoi: 'Execute as described'
          }
        ]
      }
    } else if (Array.isArray(testCase.cacBuocThucHien)) {
      steps = testCase.cacBuocThucHien as unknown as Step[]
    }
  } catch (e) {
    console.error('Error parsing steps', e)
    steps = []
  }

  const questions = Array.isArray(testCase.cauHoiBoSung)
    ? (testCase.cauHoiBoSung as any[])
    : []

  // --- HANDLERS ---
  const getDeviceIcon = (type: string) => {
    const t = type.toLowerCase()
    if (t.includes('mobile') || t.includes('phone'))
      return <Smartphone className="h-5 w-5" />
    if (t.includes('tablet') || t.includes('ipad'))
      return <Tablet className="h-5 w-5" />
    return <Laptop className="h-5 w-5" />
  }

  const handleStepStatus = (index: number, status: StepResult['status']) => {
    setStepResults(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        buoc: index + 1,
        status,
        note: status === 'Pass' ? '' : prev[index]?.note || ''
      }
    }))
  }

  const handleStepNote = (index: number, note: string) => {
    setStepResults(prev => ({
      ...prev,
      [index]: { ...prev[index], buoc: index + 1, note }
    }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setSelectedFiles(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (idx: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async () => {
    // Basic validation
    // Check if overall status is selected
    if (!overallStatus) {
      toast.error('Please select an overall status.')
      return
    }

    setIsUploading(true)
    const uploadedUrls: string[] = []

    try {
      // 1. Upload files
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
          const filePath = `${testCase.maDuAn}/${testCase.maKichBan}/${fileName}`

          // Assuming 'evidence' bucket exists. If not, this might fail.
          // Fallback to 'public' or 'attachments' if needed, but 'evidence' is semantic.
          // Using a standard bucket name 'attachments' is safer if 'evidence' isn't known.
          // Let's try 'attachments' first as it is more generic.
          const { data, error } = await supabase.storage
            .from('test_cases_attachments')
            .upload(filePath, file)

          if (error) {
            console.error('Upload error:', error)
            // Try fallback to 'evidence' just in case? Or just throw.
            toast.error(`Upload failed for ${file.name}: ${error.message}`)
            throw error
          }

          if (data) {
            const { data: publicData } = supabase.storage
              .from('test_cases_attachments')
              .getPublicUrl(filePath)
            uploadedUrls.push(publicData.publicUrl)
          }
        }
      }

      // 2. Construct Data
      // Combine existing URLs with new ones
      const finalFileUrls = [...existingFiles, ...uploadedUrls]

      const submissionData: SubmissionData = {
        testCaseId: testCase.maKichBan,
        ketQuaTungBuoc: Object.values(stepResults),
        trangThaiChung: overallStatus,
        fileBangChung: finalFileUrls,
        device: device || undefined,
        thongTinBoSung: additionalAnswers
      }

      if (overallStatus === 'Fail') {
        submissionData.ketQuaThucTeChung = generalActualResult
        submissionData.maBaoCaoLoiLienQuan = bugReportId
      } else if (overallStatus === 'Blocked') {
        submissionData.lyDoBiChan = blockedReason
      } else if (overallStatus === 'Skipped') {
        submissionData.lyDoBoQua = skippedReason
      }

      // 3. Submit
      onSubmit(submissionData)
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to process submission. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="-ml-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight">
                {testCase.maKichBanHienThi}
              </h2>
              {initialData?.trangThaiChung ? (
                <Badge
                  className={cn(
                    initialData.trangThaiChung === 'Pass' &&
                      'bg-green-500 hover:bg-green-600',
                    initialData.trangThaiChung === 'Fail' &&
                      'bg-red-500 hover:bg-red-600',
                    initialData.trangThaiChung === 'Blocked' &&
                      'bg-orange-500 hover:bg-orange-600',
                    initialData.trangThaiChung === 'Skipped' &&
                      'bg-slate-500 hover:bg-slate-600'
                  )}
                >
                  {initialData.trangThaiChung}
                </Badge>
              ) : (
                <Badge variant="outline">Chưa thực hiện</Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold">{testCase.tieuDe}</h1>
            <p className="text-muted-foreground text-sm">
              {steps.length} instructions
            </p>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-8">
        {steps.map((step, index) => {
          const result = stepResults[index] || { buoc: index + 1, status: null }
          return (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold">
                Bước {step.buoc || index + 1}
              </h3>
              <div className="space-y-2">
                <div className="text-sm whitespace-pre-wrap">{step.moTa}</div>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-semibold">Kết quả mong đợi:</span>
                <div className="text-muted-foreground text-sm whitespace-pre-wrap">
                  {step.ketQuaMongDoi}
                </div>
              </div>

              {/* Status Selection */}
              <div className="space-y-3 pt-2 pb-4">
                <div className="text-sm font-medium text-blue-600">
                  Hãy chọn kết quả của bước này
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Pass', 'Fail', 'Blocked', 'Skipped'].map(s => (
                    <Button
                      key={s}
                      variant={result.status === s ? 'default' : 'outline'}
                      size="sm"
                      className={cn(
                        'min-w-[80px]',
                        result.status === s &&
                          s === 'Pass' &&
                          'bg-green-600 hover:bg-green-700',
                        result.status === s &&
                          s === 'Fail' &&
                          'bg-red-600 hover:bg-red-700',
                        result.status === s &&
                          s === 'Blocked' &&
                          'bg-orange-500 hover:bg-orange-600'
                      )}
                      onClick={() => handleStepStatus(index, s as any)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>

                {/* Conditional Inputs for Steps */}
                {result.status === 'Fail' && (
                  <div className="animate-in fade-in slide-in-from-top-2 space-y-2">
                    <Label className="text-red-600">Kết quả thực tế</Label>
                    <Textarea
                      placeholder="Nhập kết quả thực tế..."
                      value={result.note || ''}
                      onChange={e => handleStepNote(index, e.target.value)}
                      className="border-red-200 focus-visible:ring-red-500"
                    />
                  </div>
                )}
                {result.status === 'Blocked' && (
                  <div className="animate-in fade-in slide-in-from-top-2 space-y-2">
                    <Label className="text-orange-600">Mô tả bị chặn</Label>
                    <Textarea
                      placeholder="Tại sao bạn bị chặn ở bước này?..."
                      value={result.note || ''}
                      onChange={e => handleStepNote(index, e.target.value)}
                      className="border-orange-200 focus-visible:ring-orange-500"
                    />
                  </div>
                )}
                {result.status === 'Skipped' && (
                  <div className="animate-in fade-in slide-in-from-top-2 space-y-2">
                    <Label>Lí do bỏ qua</Label>
                    <Textarea
                      placeholder="Tại sao bạn bỏ qua bước này?..."
                      value={result.note || ''}
                      onChange={e => handleStepNote(index, e.target.value)}
                    />
                  </div>
                )}
              </div>

              {index < steps.length - 1 && <div className="my-6 border-b" />}
            </div>
          )
        })}
      </div>

      {/* Special Instructions */}
      {(testCase as any).huongDanDacBiet && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-semibold">Special instructions:</h3>
          <div className="bg-muted/30 rounded-md border p-4 text-sm whitespace-pre-wrap">
            {typeof (testCase as any).huongDanDacBiet === 'string'
              ? (testCase as any).huongDanDacBiet
              : JSON.stringify((testCase as any).huongDanDacBiet)}
          </div>
        </div>
      )}

      {/* Additional Questions */}
      {questions.length > 0 && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-semibold">Câu hỏi bổ sung:</h3>
          {questions.map((q: any, idx) => (
            <div key={idx} className="space-y-2">
              <Label>{q.cauHoi}</Label>
              <Textarea
                placeholder="Nhập câu trả lời của bạn..."
                value={additionalAnswers[String(idx)] || ''}
                onChange={e =>
                  setAdditionalAnswers(prev => ({
                    ...prev,
                    [String(idx)]: e.target.value
                  }))
                }
                className="resize-y bg-white dark:bg-slate-950"
              />
            </div>
          ))}
        </div>
      )}

      {/* Proof Requirement */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-semibold">Bằng chứng (nếu có):</h3>
        <div className="space-y-2">
          <Label>
            {testCase.yeuCauBangChung
              ? `Vui lòng cung cấp ${testCase.yeuCauBangChung} ở dưới đây`
              : 'Vui lòng cung cấp file/hình ảnh đính kèm ở dưới đây'}
          </Label>
          <div className="space-y-3">
            {/* Existing Files Display */}
            {existingFiles.length > 0 && (
              <div className="mb-2 space-y-2">
                <Label className="text-muted-foreground text-xs">
                  Đã tải lên:
                </Label>
                {existingFiles.map((url, idx) => (
                  <div
                    key={`exist-${idx}`}
                    className="bg-muted/50 flex items-center justify-between rounded border p-2 text-sm"
                  >
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="max-w-[200px] truncate text-blue-600 hover:underline"
                    >
                      {url.split('/').pop()}
                    </a>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button
                variant="outline"
                className="dashed flex h-20 w-full cursor-pointer flex-col items-center justify-center gap-1 border-2"
                asChild
              >
                <label htmlFor="file-upload">
                  <Upload className="text-muted-foreground h-5 w-5" />
                  <span>Click to upload files</span>
                </label>
              </Button>
            </div>
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="bg-muted flex items-center justify-between rounded border p-2 text-sm"
                  >
                    <span className="max-w-[200px] truncate">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(idx)}
                      className="text-destructive hover:bg-destructive/10 h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FINAL RESULT FORM */}
      <div className="mt-12 space-y-6 rounded-lg border-t bg-slate-50 p-6 pt-8 dark:bg-slate-900/50">
        <h4 className="text-lg font-bold">
          Kết quả cuối cùng của toàn test case
        </h4>

        {device && (
          <div className="text-muted-foreground mb-4 flex items-center gap-3 text-sm">
            <div className="bg-primary/10 text-primary rounded-full p-2">
              {getDeviceIcon(device.type)}
            </div>
            <span>
              Testing on{' '}
              <span className="text-foreground font-semibold">
                {device.name}
              </span>{' '}
              ({device.os} {device.osVersion})
            </span>
          </div>
        )}

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Kết quả chung</Label>
            <Select value={overallStatus} onValueChange={setOverallStatus}>
              <SelectTrigger className="bg-white dark:bg-slate-950">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pass">Pass</SelectItem>
                <SelectItem value="Fail">Fail</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
                <SelectItem value="Skipped">Skipped</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Fields for Overall Result */}
          {overallStatus === 'Fail' && (
            <div className="animate-in fade-in slide-in-from-top-2 space-y-4 border-l-4 border-red-500 py-2 pl-4">
              <div className="space-y-2">
                <Label className="text-red-600">
                  Kết quả thực tế chung <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder="Mô tả lỗi xảy ra..."
                  value={generalActualResult}
                  onChange={e => setGeneralActualResult(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Nhập mã báo cáo lỗi liên quan</Label>
                <Input
                  placeholder="VD: BUG-123"
                  value={bugReportId}
                  onChange={e => setBugReportId(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>
          )}

          {overallStatus === 'Blocked' && (
            <div className="animate-in fade-in slide-in-from-top-2 space-y-2 border-l-4 border-orange-500 py-2 pl-4">
              <Label className="text-orange-600">
                Mô tả bị chặn <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Lí do test case bị chặn..."
                value={blockedReason}
                onChange={e => setBlockedReason(e.target.value)}
                className="bg-white"
              />
            </div>
          )}

          {overallStatus === 'Skipped' && (
            <div className="animate-in fade-in slide-in-from-top-2 space-y-2">
              <Label>
                Lí do bỏ qua <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Tại sao bỏ qua test case này?..."
                value={skippedReason}
                onChange={e => setSkippedReason(e.target.value)}
                className="bg-white"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={submitting || isUploading}
        >
          Hủy bỏ
        </Button>
        <Button onClick={handleSubmit} disabled={submitting || isUploading}>
          {(submitting || isUploading) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isUploading ? 'Uploading...' : 'Gửi kết quả'}
        </Button>
      </div>
    </div>
  )
}
