import { z } from 'zod'

export const stepSchema = z.object({
  buoc: z.number(),
  moTa: z.string().min(1, 'Mô tả bước không được để trống'),
  ketQuaMongDoi: z.string().min(1, 'Kết quả mong đợi không được để trống')
})

export const testCaseSchema = z.object({
  tieuDe: z.string().min(1, 'Tiêu đề không được để trống'),
  dieuKienTienQuyet: z.string().optional(),
  yeuCauBangChung: z.string().optional(),
  cacBuocThucHien: z.array(stepSchema).min(1, 'Cần ít nhất 1 bước thực hiện'),
  cauHoiBoSung: z
    .array(
      z.object({ cauHoi: z.string().min(1, 'Câu hỏi không được để trống') })
    )
    .optional()
})

export type TestCaseValues = z.infer<typeof testCaseSchema>
