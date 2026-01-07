'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/ui/form'
import { Input } from '@/ui/input'
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group'
import { Checkbox } from '@/ui/checkbox'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/ui/card'
import { Separator } from '@/ui/separator'
import { applyToProject } from '../../actions'

type Question = {
  question: string
  type: 'Text' | 'Radio' | 'Checkbox'
  options?: string[]
}

type ApplicationFormProps = {
  projectId: number
  questions: Question[]
}

// Helper to create dynamic schema based on questions
const createSchema = (questions: Question[]) => {
  const shape: Record<string, any> = {}

  questions.forEach((q, index) => {
    if (q.type === 'Checkbox') {
      shape[`question_${index}`] = z
        .array(z.string())
        .min(1, 'Vui lòng chọn ít nhất một lựa chọn')
    } else {
      shape[`question_${index}`] = z
        .string()
        .min(1, 'Vui lòng trả lời câu hỏi này')
    }
  })

  return z.object(shape)
}

export function ApplicationForm({
  projectId,
  questions
}: ApplicationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const schema = createSchema(questions)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: questions.reduce(
      (acc, q, index) => {
        acc[`question_${index}`] = q.type === 'Checkbox' ? [] : ''
        return acc
      },
      {} as Record<string, any>
    )
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    setIsSubmitting(true)
    try {
      // Transform values to array format expected by backend
      const answers = questions.map((q, index) => ({
        question: q.question,
        answer: values[`question_${index}`] as string | string[]
      }))

      await applyToProject(projectId, answers)

      toast.success('Gửi hồ sơ ứng tuyển thành công!')
      router.push('/dashboard/tester/open-projects')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>Khảo sát ứng tuyển</CardTitle>
        <CardDescription>
          Vui lòng trả lời các câu hỏi sau để hoàn tất hồ sơ ứng tuyển.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {questions.map((q, index) => (
              <div key={index} className="space-y-4">
                <div className="text-base font-semibold">
                  {index + 1}. {q.question}{' '}
                </div>

                {q.type === 'Text' && (
                  <FormField
                    control={form.control}
                    name={`question_${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            value={(field.value as string) || ''}
                            placeholder="Nhập câu trả lời của bạn"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {q.type === 'Radio' && q.options && (
                  <FormField
                    control={form.control}
                    name={`question_${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value as string}
                            className="flex flex-col space-y-2"
                          >
                            {q.options?.map((opt, optIndex) => (
                              <FormItem
                                key={optIndex}
                                className="flex items-center space-y-0 space-x-3"
                              >
                                <FormControl>
                                  <RadioGroupItem value={opt} />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {opt}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {q.type === 'Checkbox' && q.options && (
                  <FormField
                    control={form.control}
                    name={`question_${index}`}
                    render={() => (
                      <FormItem>
                        <div className="flex flex-col space-y-2">
                          {q.options?.map((opt, optIndex) => (
                            <FormField
                              key={optIndex}
                              control={form.control}
                              name={`question_${index}`}
                              render={({ field }) => {
                                const currentValues =
                                  (field.value as string[]) || []
                                return (
                                  <FormItem
                                    key={optIndex}
                                    className="flex flex-row items-start space-y-0 space-x-3"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={currentValues.includes(opt)}
                                        onCheckedChange={checked => {
                                          return checked
                                            ? field.onChange([
                                                ...currentValues,
                                                opt
                                              ])
                                            : field.onChange(
                                                currentValues.filter(
                                                  (value: string) =>
                                                    value !== opt
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {opt}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            ))}

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Gửi hồ sơ ứng tuyển
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
