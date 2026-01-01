import * as z from 'zod'

export const paymentSchema = z
  .object({
    method: z.enum(['bank', 'momo']),
    fullName: z
      .string()
      .min(1, 'Vui lòng nhập họ và tên chủ tài khoản')
      .regex(/^[^0-9]*$/, 'Họ và tên không được chứa số')
      .transform(val => val.toUpperCase()),
    bankName: z.string().optional(),
    accountNumber: z
      .string()
      .min(1, 'Vui lòng nhập số tài khoản')
      .regex(/^\d+$/, 'Số tài khoản chỉ được chứa chữ số')
  })
  .superRefine((data, ctx) => {
    if (data.method === 'bank' && !data.bankName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vui lòng nhập tên ngân hàng',
        path: ['bankName']
      })
    }
  })

export const passwordChangeSchema = z
  .object({
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword']
  })

export type PaymentFormValues = z.infer<typeof paymentSchema>
export type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>
