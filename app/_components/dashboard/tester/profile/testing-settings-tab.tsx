'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/ui/card'
import { Input } from '@/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/ui/dropdown-menu'
import { X } from 'lucide-react'

// Mock Data for Testing Settings (Dynamic Config)
export const TESTING_CONFIG = [
  {
    id: 'willing_to_travel',
    label:
      'Bạn có sẵn sàng cho việc di chuyển trong quá trình kiểm thử không (Bạn sẽ được hoàn tiền cho chi phí đi lại)?',
    type: 'switch',
    options: []
  },
  {
    id: 'willing_to_payment_testing',
    label:
      'Bạn có sẵn sàng cho việc tham gia các quy trình kiểm thử thanh toán không?',
    type: 'switch',
    options: []
  },
  {
    id: 'testing_fields',
    label: 'Loại hình kiểm thử mà đã từng làm?',
    type: 'multi-select',
    options: [
      'Exploratory testing',
      'Test case testing',
      'Usability testing',
      'Performance testing',
      'Security testing',
      'Không có',
      'Tất cả loại hình trên',
      'Khác'
    ]
  },
  {
    id: 'programming_languages',
    label: 'Ngôn ngữ lập trình sở trường',
    type: 'multi-select',
    options: [
      'Java',
      'Python',
      'C#',
      'C++',
      'HTML/CSS',
      'JavaScript',
      'TypeScript',
      'SQL',
      'Không có',
      'Khác'
    ]
  },
  {
    id: 'app_types',
    label: 'Loại ứng dụng mà bạn sẵn sàng kiểm thử?',
    type: 'multi-select',
    options: [
      'Ứng dụng hẹn hò',
      'Ứng dụng chat',
      'Ứng dụng du lịch',
      'Ứng dụng video',
      'Game',
      'Ứng dụng tài chính',
      'Ứng dụng mạng xã hội (VD: Facebook, Instagram,..)',
      'Ứng dụng thương mại điện tử (VD: Shopee, Lazada,..)',
      'Ứng dụng đa phương tiện (VD: Canva, Microsoft 365,...)',
      'Ứng dụng giáo dục',
      'Không có',
      'Tất cả loại hình trên',
      'Khác'
    ]
  },

  {
    id: 'payment_testing',
    label: 'Phương thức thanh toán mà bạn có thể thử nghiệm?',
    type: 'multi-select',
    options: [
      'PayPal',
      'ViettelPay',
      'Momo',
      'VNPay',
      'ZaloPay',
      'ApplePay',
      'Không có',
      'Khác'
    ]
  },
  {
    id: 'internet_providers',
    label: 'Nhà cung cấp dịch vụ internet của bạn?',
    type: 'text',
    placeholder: 'Viettel, Mobifone, Vinaphone,..'
  },
  {
    id: 'weekly_availability',
    label: 'Thời gian rảnh trong tuần (giờ/tuần)?',
    type: 'number',
    placeholder: '10'
  }
]

interface TestingSettingsTabProps {}

import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Switch } from '@/ui/switch'

export function TestingSettingsTab() {
  const { control } = useFormContext()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cài đặt Kiểm thử</CardTitle>
        <CardDescription>
          Thông tin về môi trường và sở trường kiểm thử của bạn.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {TESTING_CONFIG.map(field => (
          <div key={field.id} className="space-y-2">
            <FormField
              control={control}
              name={`thongTinKiemThu.${field.id}`}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>{field.label}</FormLabel>
                  {/* Render inputs based on 'type' */}
                  <FormControl>
                    {field.type === 'text' ? (
                      <Input
                        placeholder={field.placeholder}
                        {...formField}
                        value={formField.value || ''}
                      />
                    ) : field.type === 'number' ? (
                      <Input
                        type="number"
                        placeholder={field.placeholder}
                        {...formField}
                        value={formField.value || ''}
                      />
                    ) : field.type === 'select' ? (
                      <Select
                        onValueChange={formField.onChange}
                        defaultValue={formField.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn một tùy chọn" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {field.options &&
                            field.options.map((opt: string) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === 'multi-select' ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <FormControl>
                            <div className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex min-h-[40px] w-full cursor-pointer flex-wrap gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                              {formField.value?.length > 0 ? (
                                formField.value.map((val: string) => (
                                  <div
                                    key={val}
                                    className="bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-ring inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                  >
                                    {val}
                                    <X
                                      className="ml-1 h-3 w-3 cursor-pointer"
                                      onPointerDown={e => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        formField.onChange(
                                          formField.value?.filter(
                                            (v: string) => v !== val
                                          )
                                        )
                                      }}
                                    />
                                  </div>
                                ))
                              ) : (
                                <span className="text-muted-foreground">
                                  Chọn một hoặc nhiều tùy chọn
                                </span>
                              )}
                            </div>
                          </FormControl>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full" align="start">
                          {field.options &&
                            field.options.map((opt: string) => (
                              <DropdownMenuCheckboxItem
                                key={opt}
                                checked={formField.value?.includes(opt)}
                                onCheckedChange={checked => {
                                  const current = formField.value || []
                                  if (checked) {
                                    formField.onChange([...current, opt])
                                  } else {
                                    formField.onChange(
                                      current.filter((v: string) => v !== opt)
                                    )
                                  }
                                }}
                              >
                                {opt}
                              </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : field.type === 'switch' ? (
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formField.value}
                          onCheckedChange={formField.onChange}
                        />
                        <span className="text-sm text-slate-500">
                          {formField.value ? 'Có' : 'Không'}
                        </span>
                      </div>
                    ) : null}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}

        <div className="bg-muted text-muted-foreground mt-4 rounded-lg p-4 text-sm">
          <p>
            Lưu ý: Các thông tin này sẽ giúp hệ thống gợi ý các dự án phù hợp
            nhất cho bạn. Bạn cung cấp càng nhiều thông tin, số lượng dự án bạn
            được nhận càng nhiều hơn.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
