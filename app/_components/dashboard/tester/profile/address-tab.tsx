'use client'

import * as React from 'react'
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useFormContext } from 'react-hook-form'

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

export function AddressTab() {
  const { control, setValue, watch } = useFormContext()
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
    <Card>
      <CardHeader>
        <CardTitle>Địa chỉ liên hệ</CardTitle>
        <CardDescription>Nơi bạn đang sinh sống và làm việc.</CardDescription>
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
                  value={field.value}
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
                  value={field.value}
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
                  placeholder="Số nhà, tên đường..."
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
  )
}
