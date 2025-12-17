'use client'

import { useWatch, Control, useFieldArray } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'

import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/ui/form'

import type { ProjectValues } from '@/app/dashboard/client/post-project/schema'

export function SurveyOptions({
  index,
  control
}: {
  index: number
  control: Control<ProjectValues>
}) {
  const type = useWatch({
    control,
    name: `cauHoiKhaoSat.${index}.type`
  })

  // We need to typecase control because useFieldArray expects generic FieldValues
  const { fields, append, remove } = useFieldArray({
    control,
    name: `cauHoiKhaoSat.${index}.options` as any
  })

  if (type === 'Text') return null

  return (
    <div className="border-muted mt-4 space-y-3 border-l-2 pl-4">
      <div className="flex items-center justify-between">
        <FormLabel className="text-sm">
          Các lựa chọn {type === 'Radio' ? '(Chọn một)' : '(Chọn nhiều)'}
        </FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append('Lựa chọn mới')}
        >
          <Plus className="mr-2 h-4 w-4" /> Thêm lựa chọn
        </Button>
      </div>
      <div className="space-y-2">
        {fields.map((field, optionIndex) => (
          <div key={field.id} className="flex gap-2">
            <FormField
              control={control}
              name={`cauHoiKhaoSat.${index}.options.${optionIndex}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder={`Lựa chọn ${optionIndex + 1}`}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(optionIndex)}
              className="text-muted-foreground hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {fields.length === 0 && (
          <p className="text-sm text-red-500">
            Vui lòng thêm ít nhất một lựa chọn.
          </p>
        )}
      </div>
    </div>
  )
}
