'use client'

import { SurveyOptions } from '@/app/_components/dashboard/client/post-edit/survey-options'
import { Button } from '@/ui/button'
import { Card, CardContent } from '@/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/ui/form'
import { Input } from '@/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'
import { Separator } from '@/ui/separator'
import { Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import type { ProjectValues } from '../../../../../dashboard/client/post-project/schema'

export function Step3ScopeSurvey({ disabled }: { disabled?: boolean }) {
  const { control } = useFormContext<ProjectValues>()

  // Field Arrays are used here directly
  const {
    fields: inScopeFields,
    append: appendInScope,
    remove: removeInScope
  } = useFieldArray({
    control,
    name: 'scope_in'
  })

  const {
    fields: outScopeFields,
    append: appendOutScope,
    remove: removeOutScope
  } = useFieldArray({
    control,
    name: 'scope_out'
  })

  const {
    fields: surveyFields,
    append: appendSurvey,
    remove: removeSurvey
  } = useFieldArray({
    control,
    name: 'cauHoiKhaoSat'
  })

  return (
    <div className="space-y-8">
      {/* Scope */}
      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Phạm vi kiểm thử</h2>
            <Separator />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* In Scope */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base text-green-600">
                  In Scope (Phạm vi Test){' '}
                  <span className="text-red-500">*</span>
                </FormLabel>
                {!disabled && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendInScope({ value: '' })}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Thêm
                  </Button>
                )}
              </div>
              {inScopeFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={control}
                    name={`scope_in.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Chức năng a..."
                            {...field}
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!disabled && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeInScope(index)}
                      disabled={inScopeFields.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Out Scope */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base text-red-600">
                  Out for Scope (Không Test){' '}
                  <span className="text-red-500">*</span>
                </FormLabel>
                {!disabled && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendOutScope({ value: '' })}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Thêm
                  </Button>
                )}
              </div>
              {outScopeFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={control}
                    name={`scope_out.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Không test phần..."
                            {...field}
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!disabled && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOutScope(index)}
                      disabled={outScopeFields.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Survey */}
      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">
                Câu hỏi khảo sát (Screening){' '}
                <span className="text-red-500">*</span>
              </h2>
              <p className="text-muted-foreground text-sm">
                Tạo câu hỏi để lọc Tester phù hợp với dự án.
              </p>
            </div>
            {!disabled && (
              <Button
                type="button"
                onClick={() =>
                  appendSurvey({
                    question: '',
                    type: 'Text',
                    options: []
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Thêm câu hỏi
              </Button>
            )}
          </div>
          <Separator />

          <div className="space-y-6">
            <FormField
              control={control}
              name="cauHoiKhaoSat"
              render={() => (
                <>
                  <div className="bg-muted text-muted-foreground mt-4 rounded-lg p-4 text-sm">
                    <p>
                      <span className="font-semibold text-red-500">
                        Quan trọng:
                      </span>{' '}
                      Tester khi ứng tuyển vào dự án của bạn, sẽ bắt buộc phải
                      hoàn thành bài khảo sát này trước khi được chấp nhận vào
                      dự án.
                    </p>
                  </div>
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />

            {surveyFields.map((field, index) => (
              <Card key={field.id} className="bg-muted/50">
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                      <FormField
                        control={control}
                        name={`cauHoiKhaoSat.${index}.question`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Câu hỏi {index + 1}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập nội dung câu hỏi..."
                                {...field}
                                disabled={disabled}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`cauHoiKhaoSat.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loại câu trả lời</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={disabled}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn loại" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Text">
                                  Văn bản (Text)
                                </SelectItem>
                                <SelectItem value="Radio">
                                  Chọn một (Radio)
                                </SelectItem>
                                <SelectItem value="Checkbox">
                                  Chọn nhiều (Checkbox)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {!disabled && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSurvey(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>

                  <SurveyOptions
                    index={index}
                    control={control}
                    disabled={disabled}
                  />
                </CardContent>
              </Card>
            ))}
            {surveyFields.length === 0 && !disabled && (
              <div className="text-muted-foreground py-8 text-center">
                Chưa có câu hỏi nào. Nhấn nút &quot;Thêm câu hỏi&quot; để bắt
                đầu.
              </div>
            )}
            {surveyFields.length === 0 && disabled && (
              <div className="text-muted-foreground py-8 text-center">
                Không có câu hỏi khảo sát.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
