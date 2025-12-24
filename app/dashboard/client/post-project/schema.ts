import { z } from 'zod'

// -----------------------------------------------------------------------------
// Zod Schema Definitions
// -----------------------------------------------------------------------------

// Question Schema for Survey Builder
export const questionSchema = z.object({
  question: z.string().min(1, 'Câu hỏi không được để trống'),
  type: z.enum(['Text', 'Radio', 'Checkbox']),
  options: z.array(z.string()).optional() // Only for Radio/Checkbox
})

// Main Project Schema
export const projectSchema = z
  .object({
    // STEP 1: General Info
    tieuDe: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
    loaiDuAn: z.enum(['Exploratory', 'TestCase'] as const),
    moTa: z.string().min(20, 'Mô tả dự án phải có ít nhất 20 ký tự'),
    nganSach: z.coerce.number({ message: 'Vui lòng nhập ngân sách' }).min(0),
    soLuongCanTuyen: z.coerce
      .number({ message: 'Vui lòng nhập số lượng' })
      .min(1, 'Cần tuyển ít nhất 1 người'),

    // STEP 2: Technical & Environment
    huongDanTruyCap: z.string().min(1, 'Hướng dẫn truy cập là bắt buộc'),
    huongDanKyThuat: z.string().optional(),
    taiLieuDinhKem: z.array(z.string()).optional(),

    // Mapped to JSONB: { devices: string, os: string, browser: string }
    // Simplified for UI as separate fields, will construct JSON on submit
    env_device: z
      .string()
      .min(1, 'Thiết bị yêu cầu là bắt buộc')
      .regex(
        /^[a-zA-Z0-9\s\.\-\(\)\u00C0-\u1EF9]+(,\s*[a-zA-Z0-9\s\.\-\(\)\u00C0-\u1EF9]+)*$/,
        'Định dạng không hợp lệ. Ví dụ: iPhone 12, Samsung S21'
      )
      .refine(
        val => val.split(',').every(item => item.trim().length > 0),
        'Không được để dấu phẩy ở cuối hoặc để trống giữa các mục'
      ),
    env_os: z
      .string()
      .min(1, 'Hệ điều hành yêu cầu là bắt buộc')
      .regex(
        /^[a-zA-Z0-9\s\.\-\(\)\u00C0-\u1EF9]+(,\s*[a-zA-Z0-9\s\.\-\(\)\u00C0-\u1EF9]+)*$/,
        'Định dạng không hợp lệ. Ví dụ: iOS 15, Android 12'
      )
      .refine(
        val => val.split(',').every(item => item.trim().length > 0),
        'Không được để dấu phẩy ở cuối hoặc để trống giữa các mục'
      ),
    env_browser: z
      .string()
      .optional()
      .refine(val => {
        if (!val) return true
        return /^[a-zA-Z0-9\s\.\-\(\)\u00C0-\u1EF9]+(,\s*[a-zA-Z0-9\s\.\-\(\)\u00C0-\u1EF9]+)*$/.test(
          val
        )
      }, 'Định dạng không hợp lệ. Ví dụ: Chrome, Safari')
      .refine(val => {
        if (!val) return true
        return val.split(',').every(item => item.trim().length > 0)
      }, 'Không được để dấu phẩy ở cuối hoặc để trống giữa các mục'),

    // STEP 3: Scope & Survey
    // Mapped to JSONB: { inScope: string[], outScope: string[] }
    scope_in: z
      .array(z.object({ value: z.string().min(1, 'Cannot be empty') }))
      .min(1, 'Cần ít nhất 1 mục In Scope')
      .optional(),
    scope_out: z
      .array(z.object({ value: z.string().min(1, 'Cannot be empty') }))
      .min(1, 'Cần ít nhất 1 mục Out Scope')
      .optional(),

    // Mapped to JSONB: array of questions
    cauHoiKhaoSat: z
      .array(questionSchema)
      .min(1, 'Cần ít nhất 1 câu hỏi khảo sát'),

    // STEP 4: Timeline & Payment
    thoiHanUngTuyen: z.date({ message: 'Vui lòng chọn hạn ứng tuyển' }),
    thoiHanDuAn: z.date({ message: 'Vui lòng chọn hạn dự án' }),

    // Mapped to JSONB: { perBug: number, perCompletion: number }
    pay_perBug: z.coerce.number().min(0).optional(),
    pay_perCompletion: z.coerce.number().min(0).optional()
  })
  .refine(
    data => {
      // Custom validation: End date must be after application deadline
      if (
        data.thoiHanDuAn &&
        data.thoiHanUngTuyen &&
        data.thoiHanDuAn < data.thoiHanUngTuyen
      ) {
        return false
      }
      return true
    },
    {
      message: 'Hạn dự án phải sau hạn ứng tuyển',
      path: ['thoiHanDuAn']
    }
  )

export type ProjectValues = z.infer<typeof projectSchema>
