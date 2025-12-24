'use client'

import {
  useDeleteKichBan,
  useDuAn,
  useImportKichBan,
  useKichBanByDuAn,
  useUpdateDuAn,
  useUpdateKichBanOrder
} from '@/app/_services/queries'
import { TooltipProvider } from '@/ui/tooltip'
import { arrayMove } from '@dnd-kit/sortable'
import { DragEndEvent } from '@dnd-kit/core'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { TestCaseForm } from './test-case-form'
import { TestCaseList } from './test-case-list'

export default function SetupTestCasesPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = Number(params.projectId)

  // Queries & Mutations
  const { data: project } = useDuAn(projectId)
  const { data: testCases = [], isLoading } = useKichBanByDuAn(projectId)
  const deleteMutation = useDeleteKichBan()
  const updateOrderMutation = useUpdateKichBanOrder()
  const importMutation = useImportKichBan()
  const updateDuAnMutation = useUpdateDuAn()

  // Local state for drag and drop
  const [items, setItems] = useState<any[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    setItems(prev => {
      // Basic check to see if we should update local state from server state
      // This helps avoid resetting local DnD state while dragging if refetch happens
      // But ensures we get new items added by other means
      if (JSON.stringify(prev) === JSON.stringify(testCases)) return prev
      return testCases
    })
  }, [testCases])

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

  // Handlers
  const handleEdit = (item: any) => {
    setEditingId(item.maKichBan)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const handleImport = async (sourceIds: number[]) => {
    try {
      await importMutation.mutateAsync({
        targetProjectId: projectId,
        sourceKichBanIds: sourceIds
      })
      toast.success(`Đã import ${sourceIds.length} kịch bản!`)
    } catch (error: any) {
      toast.error('Import thất bại: ' + error.message)
    }
  }

  const handleDelete = async (id: number) => {
    if (editingId === id) handleCancelEdit()
    await deleteMutation.mutateAsync({ id, maDuAn: projectId })
    toast.success('Đã xóa kịch bản')
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

      // Update project status to DangTuyen
      try {
        await updateDuAnMutation.mutateAsync({
          maDuAn: projectId,
          data: { trangThaiDuAn: 'DangTuyen' }
        })
      } catch (err) {
        console.error('Failed to update project status:', err)
        throw new Error(
          'Dự án đã được tạo nhưng không thể cập nhật trạng thái sang "Đang tuyển". Vui lòng kiểm tra lại quyền truy cập.'
        )
      }

      toast.success('Thiết lập dự án hoàn tất!')
      router.push('/dashboard/client/projects')
    } catch (error) {
      toast.error('Lỗi: ' + (error as Error).message)
    }
  }

  const editingItem = items.find(item => item.maKichBan === editingId) || null

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
          {project?.loaiDuAn === 'Exploratory' && (
            <div className="mt-4 rounded-md bg-blue-50 p-4 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200">
              <span className="font-bold">Nhắc nhở:</span> Dự án này thuộc loại
              Exploratory Testing, nhưng bạn vẫn có thể thêm các Test Case nếu
              cần thiết.
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Form */}
          <TestCaseForm
            projectId={projectId}
            editingId={editingId}
            initialData={editingItem}
            nextIdSuffix={items.length + 1}
            onCancelEdit={handleCancelEdit}
            onSuccess={() => {
              if (editingId) handleCancelEdit()
            }}
            onImport={handleImport}
          />

          {/* Right Column: List & Finish */}
          <TestCaseList
            items={items}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDragEnd={handleDragEnd}
            onFinish={handleFinish}
          />
        </div>
      </div>
    </TooltipProvider>
  )
}
