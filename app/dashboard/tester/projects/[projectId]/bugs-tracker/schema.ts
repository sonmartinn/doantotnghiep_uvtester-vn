import * as z from 'zod'

export const bugReportSchema = z.object({
  tieuDe: z.string().min(1, 'Tiêu đề không được để trống'),
  cacBuocTaiHien: z
    .array(
      z.object({
        step: z.string().min(1, 'Bước không được để trống')
      })
    )
    .min(1, 'Cần ít nhất 1 bước tái hiện'),
  ketQuaThucTe: z.string().min(1, 'Kết quả thực tế không được để trống'),
  ketQuaMongDoi: z.string().min(1, 'Kết quả mong đợi không được để trống'),
  mucDoNghiemTrong: z.string().min(1, 'Vui lòng chọn mức độ nghiêm trọng'),
  khaNangTaiTao: z.string().min(1, 'Vui lòng chọn khả năng tái tạo')
})

export type BugReportFormValues = z.infer<typeof bugReportSchema>
