'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/ui/alert-dialog'
import { Button } from '@/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
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
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckCircle2, Edit, GripVertical, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

interface TestCaseListProps {
  items: any[]
  isLoading: boolean
  onEdit?: (item: any) => void
  onDelete?: (id: number) => Promise<void>
  onDragEnd?: (event: DragEndEvent) => void
  onFinish?: () => void
  readonly?: boolean
}

interface SortableRowProps {
  id: number
  children: React.ReactNode
  disabled?: boolean
}

function SortableRow({ id, children, disabled }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id, disabled })

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
      {!disabled && (
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
      )}
      {children}
    </TableRow>
  )
}

export function TestCaseList({
  items,
  isLoading,
  onEdit,
  onDelete,
  onDragEnd,
  onFinish,
  readonly = false
}: TestCaseListProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDeleteClick = (id: number) => {
    setDeleteId(id)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await onDelete(deleteId)
    } catch (error: any) {
      toast.error('Lỗi xóa: ' + error.message)
    } finally {
      setDeleteId(null)
    }
  }

  return (
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
                onDragEnd={onDragEnd}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      {!readonly && (
                        <TableHead className="w-[50px]"></TableHead>
                      )}
                      <TableHead className="w-[100px]">Test Case</TableHead>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead className="w-[80px] text-center">
                        Bước
                      </TableHead>
                      {!readonly && (
                        <TableHead className="w-[50px]"></TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SortableContext
                      items={items.map(tc => tc.maKichBan)}
                      strategy={verticalListSortingStrategy}
                    >
                      {items.map((tc, index) => (
                        <SortableRow
                          key={tc.maKichBan}
                          id={tc.maKichBan}
                          disabled={readonly}
                        >
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
                          {!readonly && (
                            <TableCell>
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                  onClick={() => onEdit?.(tc)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    {/* Span wrapper to allow tooltip on disabled button */}
                                    <span tabIndex={-1}>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive/90 hover:bg-red-50 disabled:opacity-50"
                                        onClick={() =>
                                          handleDeleteClick(tc.maKichBan)
                                        }
                                        disabled={items.length <= 1}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </span>
                                  </TooltipTrigger>
                                  {items.length <= 1 && (
                                    <TooltipContent>
                                      <p>
                                        Không thể xóa. Cần ít nhất 1 kịch bản.
                                      </p>
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </div>
                            </TableCell>
                          )}
                        </SortableRow>
                      ))}
                    </SortableContext>
                  </TableBody>
                </Table>
              </DndContext>
            </div>
          )}
        </CardContent>

        {!readonly && (
          <div className="mt-auto p-6 pt-0">
            <Separator className="mb-6" />
            <div className="space-y-4">
              <div className="rounded-md bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                Lưu ý: Bạn cần thêm ít nhất 1 kịch bản để có thể hoàn tất việc
                đăng dự án.
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={onFinish}
                disabled={items.length === 0}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Hoàn tất & Đăng dự án
              </Button>
            </div>
          </div>
        )}
      </Card>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={open => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có chắc muốn xóa kịch bản này?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Kịch bản sẽ bị xóa vĩnh viễn
              khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
