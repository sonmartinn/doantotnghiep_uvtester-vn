'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'
import { useFormContext } from 'react-hook-form'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/ui/tooltip'
import { Info } from 'lucide-react'
import * as React from 'react'

// API Types
interface AddressUnit {
  id: string
  name: string
  name_en: string
  full_name: string
  full_name_en: string
  latitude: string
  longitude: string
}

interface ApiResponse {
  error: number
  error_text: string
  data_name: string
  data: AddressUnit[]
}

export function CompanyInfoTab() {
  const { control, watch, setValue } = useFormContext()
  const [provinces, setProvinces] = React.useState<AddressUnit[]>([])
  const [wards, setWards] = React.useState<AddressUnit[]>([])
  const [isLoadingProvinces, setIsLoadingProvinces] = React.useState(false)
  const [isLoadingWards, setIsLoadingWards] = React.useState(false)

  // Fetch Provinces on mount
  React.useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingProvinces(true)
      try {
        const res = await fetch('https://esgoo.net/api-tinhthanh-new/1/0.htm')
        const data: ApiResponse = await res.json()
        if (data.error === 0) {
          setProvinces(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch provinces', error)
      } finally {
        setIsLoadingProvinces(false)
      }
    }
    fetchProvinces()
  }, [])

  // Watch for City selection to trigger Ward fetching
  const selectedCityName = watch('diaChi.city')

  React.useEffect(() => {
    const fetchWards = async () => {
      if (!selectedCityName) {
        setWards([])
        return
      }

      const selectedProvince = provinces.find(
        p => p.full_name === selectedCityName
      )
      if (!selectedProvince) return

      setIsLoadingWards(true)
      try {
        const res = await fetch(
          `https://esgoo.net/api-tinhthanh-new/2/${selectedProvince.id}.htm`
        )
        const data: ApiResponse = await res.json()

        if (data.error === 0) {
          setWards(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch wards', error)
        setWards([])
      } finally {
        setIsLoadingWards(false)
      }
    }

    fetchWards()
  }, [selectedCityName, provinces])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin Công ty</CardTitle>
          <CardDescription>
            Thông tin về công ty,doanh nghiệp hoặc tổ chức của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={control}
              name="tenCongTy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên Công ty <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên công ty" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="soDienThoai"
              render={({ field }) => {
                // Split value into code and number if exists
                // Format assumed: "+84 905123456" or just "0905123456"
                const value = field.value || ''
                let defaultCode = '+84'
                let defaultNumber = ''

                if (value.includes(' ')) {
                  const parts = value.split(' ')
                  if (parts[0].startsWith('+')) {
                    defaultCode = parts[0]
                    defaultNumber = parts.slice(1).join(' ')
                  } else {
                    defaultNumber = value
                  }
                } else if (value) {
                  defaultNumber = value
                }

                return (
                  <FormItem className="col-span-1">
                    <FormLabel>
                      Số điện thoại liên hệ{' '}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <div className="flex space-x-2">
                      <Select
                        defaultValue={defaultCode}
                        onValueChange={newCode => {
                          const newNumber = defaultNumber
                          field.onChange(`${newCode} ${newNumber}`)
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="+84" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="+84">VN (+84)</SelectItem>
                          <SelectItem value="+1">US (+1)</SelectItem>
                          <SelectItem value="+81">JP (+81)</SelectItem>
                          <SelectItem value="+82">KR (+82)</SelectItem>
                          <SelectItem value="+44">UK (+44)</SelectItem>
                          <SelectItem value="+65">SG (+65)</SelectItem>
                          <SelectItem value="+61">AU (+61)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormControl>
                        <Input
                          placeholder="905 123 456"
                          value={defaultNumber}
                          onChange={e => {
                            const newNumber = e.target.value
                            field.onChange(`${defaultCode} ${newNumber}`)
                          }}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <FormField
              control={control}
              name="maSoThue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mã số thuế <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập mã số thuế"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Website/Link nền tảng mạng xã hội
                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <Info className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-popover text-popover-foreground max-w-sm p-4 text-sm shadow-xl">
                          <p>
                            Nhập website chính thức hoặc trang mạng xã hội của
                            công ty. Trường này không bắt buộc, nhưng nó giúp
                            tôi nền tảng chúng tôi xác thực công ty của bạn tốt
                            hơn.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://congtyA.com"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="linhVucHoatDong"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Lĩnh vực hoạt động{' '}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Fintech, E-commerce..."
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="quyMoCongTy"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>
                    Quy mô công ty <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn quy mô" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 nhân viên</SelectItem>
                      <SelectItem value="11-50">11-50 nhân viên</SelectItem>
                      <SelectItem value="51-200">51-200 nhân viên</SelectItem>
                      <SelectItem value="201-500">201-500 nhân viên</SelectItem>
                      <SelectItem value="500+">Trên 500 nhân viên</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Địa chỉ công ty</CardTitle>
          <CardDescription>
            Địa chỉ trụ sở chính hoặc địa chỉ liên hệ của công ty.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={control}
              name="diaChi.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tỉnh / Thành phố <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={val => {
                      field.onChange(val)
                      // Reset Ward when City changes
                      setValue('diaChi.ward', '')
                    }}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingProvinces
                              ? 'Đang tải...'
                              : 'Chọn Tỉnh/Thành phố'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map(p => (
                        <SelectItem key={p.id} value={p.full_name}>
                          {p.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="diaChi.ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phường / Xã <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                    disabled={!selectedCityName || isLoadingWards}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingWards
                              ? 'Đang tải Phường/Xã...'
                              : 'Chọn Phường/Xã'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px]">
                      {wards.map(d => (
                        <SelectItem key={d.id} value={d.full_name}>
                          {d.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name="diaChi.details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Địa chỉ cụ thể <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Số nhà, tên đường, tòa nhà..."
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  )
}
