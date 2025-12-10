'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/ui/card'
import { Input } from '@/ui/input'
import { Button } from '@/ui/button'
import { Separator } from '@/ui/separator'
import { Plus, Trash2 } from 'lucide-react'
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
import { useFormContext, useFieldArray } from 'react-hook-form'
import { LANGUAGES } from '@/app/_constants/languages'

export function LanguagesTab() {
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ngonNguKhac'
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ngôn ngữ</CardTitle>
        <CardDescription>
          Khả năng ngôn ngữ giúp bạn tiếp cận nhiều dự án hơn.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="ngonNguChinh"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngôn ngữ chính (Mẹ đẻ)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-5/6">
                    <SelectValue placeholder="Chọn ngôn ngữ chính" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[200px]">
                  {LANGUAGES.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Ngôn ngữ khác / Ngoại ngữ</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({ id: crypto.randomUUID(), name: '', level: 'Cơ bản' })
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Thêm ngôn ngữ
            </Button>
          </div>

          {fields.length === 0 && (
            <p className="text-muted-foreground text-sm italic">
              Chưa có ngôn ngữ nào được thêm.
            </p>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="flex items-baseline-last gap-10">
              <div className="flex-1 space-y-1">
                <FormField
                  control={control}
                  name={`ngonNguKhac.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs">
                        Tên ngôn ngữ
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn ngôn ngữ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[200px]">
                          {LANGUAGES.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-[180px] space-y-1">
                <FormField
                  control={control}
                  name={`ngonNguKhac.${index}.level`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs">
                        Trình độ
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cơ bản">Cơ bản</SelectItem>
                          <SelectItem value="Trung bình">Trung bình</SelectItem>
                          <SelectItem value="Thành thạo">Thành thạo</SelectItem>
                          <SelectItem value="Chuyên gia">Chuyên gia</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
