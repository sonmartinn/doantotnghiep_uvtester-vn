'use client'

import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/ui/form'
import { Input } from '@/ui/input'
import { Card, CardContent } from '@/ui/card'
import { Separator } from '@/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group'
import type { ProjectValues } from '../schema'
import { RichTextEditor } from '@/ui/rich-text-editor'
import { uploadFile } from '@/lib/upload_assests'

export function Step1GeneralInfo() {
  const { control } = useFormContext<ProjectValues>()

  const handleUploadImage = async (file: File) => {
    return uploadFile(file)
  }

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Thông tin chung</h2>
          <Separator />
        </div>

        <FormField
          control={control}
          name="tieuDe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tiêu đề dự án <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: Kiểm thử tính năng thanh toán..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormField
            control={control}
            name="loaiDuAn"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Loại dự án</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-y-0 space-x-3">
                      <FormControl>
                        <RadioGroupItem value="Exploratory" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Exploratory Testing
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-y-0 space-x-3">
                      <FormControl>
                        <RadioGroupItem value="TestCase" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Test Case Cycle
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="soLuongCanTuyen"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số lượng Tester</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="nganSach"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngân sách ước tính (VND)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="moTa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mô tả chi tiết <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <RichTextEditor
                  placeholder="Mô tả về dự án, mục tiêu kiểm thử..."
                  value={field.value || ''}
                  onChange={field.onChange}
                  onUploadImage={handleUploadImage}
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
