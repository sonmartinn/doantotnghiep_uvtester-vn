'use client'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Plus, Trash2, GripVertical, Info } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  useCreateKichBan,
  useDeleteKichBan,
  useKichBanByDuAn,
  useUpdateKichBanOrder
} from '@/app/_services/queries'
import { Button } from '@/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/ui/form'
import { Input } from '@/ui/input'
import { Separator } from '@/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/ui/tooltip'
import { Textarea } from '@/ui/textarea'

import { testCaseSchema, type TestCaseValues } from './schema'

interface SortableRowProps {
  id: number
  children: React.ReactNode
}

function SortableRow({ id, children }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    position: isDragging ? 'relative' : 'static'
  } as React.CSSProperties

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'bg-muted opacity-50' : ''}
    >
      <TableCell className="w-[50px]">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground cursor-move"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
      </TableCell>
      {children}
    </TableRow>
  )
}

export default function SetupTestCasesPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = Number(params.projectId)

  // Queries & Mutations
  const { data: testCases = [], isLoading } = useKichBanByDuAn(projectId)
  const createMutation = useCreateKichBan()
  const deleteMutation = useDeleteKichBan()
  const updateOrderMutation = useUpdateKichBanOrder()

  // Local state for drag and drop
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    setItems(prev => {
      if (JSON.stringify(prev) === JSON.stringify(testCases)) return prev
      return testCases
    })
  }, [testCases])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setItems(items => {
        const oldIndex = items.findIndex(item => item.maKichBan === active.id)
        const newIndex = items.findIndex(item => item.maKichBan === over?.id)

        const newItems = arrayMove(items, oldIndex, newIndex)

        // Update database
        const updates = newItems.map((item, index) => ({
          maKichBan: item.maKichBan,
          soThuTu: index,
          maDuAn: projectId // Required for RLS
        }))
        updateOrderMutation.mutate({ items: updates, maDuAn: projectId })

        return newItems
      })
    }
  }

  // Form
  const form = useForm<TestCaseValues>({
    resolver: zodResolver(testCaseSchema),
    defaultValues: {
      tieuDe: '',
      dieuKienTienQuyet: '',
      yeuCauBangChung: '',
      cacBuocThucHien: [{ buoc: 1, moTa: '', ketQuaMongDoi: '' }],
      cauHoiBoSung: []
    }
  })

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep
  } = useFieldArray({
    control: form.control,
    name: 'cacBuocThucHien'
  })

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion
  } = useFieldArray({
    control: form.control,
    name: 'cauHoiBoSung'
  })

  // Handlers
  const onSubmit = async (values: TestCaseValues) => {
    try {
      const payload = {
        maDuAn: projectId,
        maKichBanHienThi: `TC-${String(items.length + 1).padStart(2, '0')}`, // Initial display ID (will be recalculated on render)
        tieuDe: values.tieuDe,
        dieuKienTienQuyet: values.dieuKienTienQuyet,
        yeuCauBangChung: values.yeuCauBangChung,
        cacBuocThucHien: JSON.parse(JSON.stringify(values.cacBuocThucHien)), // Ensure JSON
        cauHoiBoSung: values.cauHoiBoSung
          ? JSON.parse(JSON.stringify(values.cauHoiBoSung))
          : [], // Ensure JSON
        soThuTu: items.length // Set order to end of list
      }

      await createMutation.mutateAsync(payload)
      toast.success('Thêm kịch bản thành công!')

      // Reset form
      form.reset({
        tieuDe: '',
        dieuKienTienQuyet: '',
        yeuCauBangChung: '',
        cacBuocThucHien: [{ buoc: 1, moTa: '', ketQuaMongDoi: '' }],
        cauHoiBoSung: []
      })
    } catch (error: any) {
      console.error(error)
      toast.error('Lỗi khi thêm kịch bản: ' + error.message)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa kịch bản này?')) return
    try {
      await deleteMutation.mutateAsync({ id, maDuAn: projectId })
      toast.success('Đã xóa kịch bản')
    } catch (error: any) {
      toast.error('Lỗi xóa: ' + error.message)
    }
  }

  const handleFinish = async () => {
    if (items.length === 0) {
      toast.error('Cần ít nhất 1 kịch bản để hoàn tất')
      return
    }

    try {
      toast.info('Đang đồng bộ dữ liệu...')

      // Sync final order and IDs
      const updates = items.map((item, index) => ({
        maKichBan: item.maKichBan,
        soThuTu: index,
        maKichBanHienThi: `TC-${String(index + 1).padStart(2, '0')}`,
        maDuAn: projectId // Required for RLS
      }))

      await updateOrderMutation.mutateAsync({
        items: updates,
        maDuAn: projectId
      })

      toast.success('Thiết lập dự án hoàn tất!')
      router.push('/dashboard/client/projects')
    } catch (error) {
      toast.error('Lỗi đồng bộ: ' + (error as Error).message)
    }
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto max-w-5xl space-y-8 py-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Thiết lập Kịch bản Kiểm thử (Test Cases)
          </h1>
          <p className="text-muted-foreground">
            Dự án của bạn cần có các kịch bản kiểm thử cụ thể để Tester thực
            hiện.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thêm Kịch bản mới</CardTitle>
                <CardDescription>
                  Mô tả các bước cần thực hiện và kết quả mong đợi.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="tieuDe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Tiêu đề kịch bản{' '}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="VD: Đăng nhập thành công"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dieuKienTienQuyet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Điều kiện tiên quyết (nếu có)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="VD: Đã có tài khoản active"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel>
                          Các bước thực hiện{' '}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            appendStep({
                              buoc: stepFields.length + 1,
                              moTa: '',
                              ketQuaMongDoi: ''
                            })
                          }
                        >
                          <Plus className="mr-2 h-4 w-4" /> Thêm bước
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {stepFields.map((field, index) => (
                          <Card
                            key={field.id}
                            className="bg-muted/20 relative p-3"
                          >
                            <div className="absolute top-2 right-2">
                              {stepFields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-destructive h-6 w-6"
                                  onClick={() => removeStep(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            <div className="grid gap-3">
                              <div className="text-muted-foreground text-xs font-medium">
                                Bước {index + 1}
                              </div>

                              <FormField
                                control={form.control}
                                name={`cacBuocThucHien.${index}.moTa`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Mô tả hành động..."
                                        className="min-h-[60px]"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`cacBuocThucHien.${index}.ketQuaMongDoi`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder="Kết quả mong đợi..."
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </Card>
                        ))}
                      </div>
                      <FormMessage>
                        {form.formState.errors.cacBuocThucHien?.message ||
                          form.formState.errors.cacBuocThucHien?.root?.message}
                      </FormMessage>
                    </div>

                    <FormField
                      control={form.control}
                      name="yeuCauBangChung"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <FormLabel>Yêu cầu bằng chứng</FormLabel>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="cursor-pointer">
                                  <Info className="text-muted-foreground hover:text-foreground h-4 w-4" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-popover text-popover-foreground max-w-sm p-4 text-sm shadow-xl">
                                <p>
                                  Lời yêu cầu để Tester cung cấp các file
                                  ảnh/video bằng chứng đính kèm. Bạn có thể để
                                  trống trường này!
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <FormControl>
                            <Input
                              placeholder="VD: Ảnh chụp màn hình, Video..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Additional Questions Section */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center gap-2">
                          Câu hỏi bổ sung (nếu có)
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="cursor-pointer">
                                <Info className="text-muted-foreground hover:text-foreground h-4 w-4" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-popover text-popover-foreground max-w-sm p-4 text-sm shadow-xl">
                              <p>
                                Các câu hỏi bổ sung (nếu có) để Tester trả lời.
                                VD: &quot;Bạn đã sử dụng phương tiện gì để di
                                chuyển đến địa điểm đại lý trên?&quot;
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => appendQuestion({ cauHoi: '' })}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Thêm câu hỏi
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {questionFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="flex items-start gap-2"
                          >
                            <FormField
                              control={form.control}
                              name={`cauHoiBoSung.${index}.cauHoi`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      placeholder={`Câu hỏi ${index + 1}...`}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive mt-0.5 shrink-0"
                              onClick={() => removeQuestion(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending
                        ? 'Đang thêm...'
                        : 'Thêm vào danh sách'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: List & Finish */}
          <div className="space-y-6">
            <Card className="flex h-full flex-col">
              <CardHeader>
                <CardTitle>Danh sách Kịch bản ({items.length})</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                {isLoading ? (
                  <div className="text-muted-foreground py-8 text-center">
                    Đang tải...
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-muted-foreground rounded-lg border-2 border-dashed py-8 text-center">
                    Chưa có kịch bản nào. Hãy thêm kịch bản ở bên trái.
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead className="w-[100px]">
                              Test Case
                            </TableHead>
                            <TableHead>Tiêu đề</TableHead>
                            <TableHead className="w-[80px] text-center">
                              Bước
                            </TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <SortableContext
                            items={items.map(tc => tc.maKichBan)}
                            strategy={verticalListSortingStrategy}
                          >
                            {items.map((tc, index) => (
                              <SortableRow key={tc.maKichBan} id={tc.maKichBan}>
                                <TableCell className="font-mono text-xs">
                                  TC-{String(index + 1).padStart(2, '0')}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {tc.tieuDe}
                                </TableCell>
                                <TableCell className="text-center">
                                  {Array.isArray(tc.cacBuocThucHien)
                                    ? tc.cacBuocThucHien.length
                                    : 0}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive/90"
                                    onClick={() => handleDelete(tc.maKichBan)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </SortableRow>
                            ))}
                          </SortableContext>
                        </TableBody>
                      </Table>
                    </DndContext>
                  </div>
                )}
              </CardContent>

              <div className="mt-auto p-6 pt-0">
                <Separator className="mb-6" />
                <div className="space-y-4">
                  <div className="rounded-md bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                    Lưu ý: Bạn cần thêm ít nhất 1 kịch bản để có thể hoàn tất
                    việc đăng dự án.
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleFinish}
                    disabled={items.length === 0}
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Hoàn tất & Đăng dự án
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
