'use client'

import { useState, useEffect, use } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Input } from '@/ui/input'
import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'
import {
  BaoCaoLoi,
  getBugsByProjectId,
  getAuthUser,
  getDuAn,
  DuAn
} from '@/app/_services/data-service'
import { supabase } from '@/lib/supabase/client'
import { Loader2, Plus, Search } from 'lucide-react'

import { Badge } from '@/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { BugList } from './bug-list'
import { BugReportForm } from './bug-report-form'
import { vi } from 'date-fns/locale'
import { format } from 'date-fns'

export default function BugsTrackerPage({
  params
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = use(params)
  const [bugs, setBugs] = useState<BaoCaoLoi[]>([])
  const [project, setProject] = useState<DuAn | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [onlyMyBugs, setOnlyMyBugs] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const user = await getAuthUser()
        setCurrentUserId(user?.id || null)

        const [projectData, bugsData] = await Promise.all([
          getDuAn(Number(projectId)),
          getBugsByProjectId(Number(projectId))
        ])

        setProject(projectData)
        setBugs(bugsData)
      } catch (error) {
        console.error('Error fetching bugs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [projectId])

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`bugs-tracker-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'BaoCaoLoi',
          filter: `maDuAn=eq.${projectId}`
        },
        payload => {
          console.log('Realtime change:', payload)
          if (payload.eventType === 'INSERT') {
            setBugs(prev => [payload.new as BaoCaoLoi, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setBugs(prev =>
              prev.map(b =>
                b.maLoi === (payload.new as BaoCaoLoi).maLoi
                  ? (payload.new as BaoCaoLoi)
                  : b
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setBugs(prev =>
              prev.filter(b => b.maLoi !== (payload.old as any).maLoi)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId])

  const filteredBugs = bugs.filter(bug => {
    const matchesSearch =
      bug.tieuDe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.maLoiHienThi.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesOwner = onlyMyBugs ? bug.maNguoiBaoCao === currentUserId : true

    // Status matching logic
    const matchesStatus =
      filterStatus === 'all' || bug.trangThaiLoi === filterStatus

    return matchesSearch && matchesOwner && matchesStatus
  })

  // Helper to format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ''
    return format(new Date(dateStr), 'dd MMM yy HH:mm', { locale: vi })
  }

  // Helper for status badge color
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'DaChapNhan':
        return 'bg-green-500'
      case 'TuChoi':
        return 'bg-red-500'
      case 'ChinhSuaVaChapNhan':
        return 'bg-teal-500'
      case 'DangXuLy':
      default:
        return 'bg-blue-500'
    }
  }

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'DaChapNhan':
        return 'Đã chấp nhận'
      case 'TuChoi':
        return 'Từ chối'
      case 'ChinhSuaVaChapNhan':
        return 'Đã chỉnh sửa & chấp nhận'
      case 'DangXuLy':
        return 'Đang xử lý'
      default:
        return 'Đang xử lý'
    }
  }

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">
            Trình theo dõi lỗi (Bug tracker)
          </h1>
          {project && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {project.maDuAnHienThi} - {project.tieuDe}
              </span>
            </div>
          )}
        </div>

        {project && (
          <div className="flex flex-col items-end gap-1">
            <div
              className={`flex items-center gap-2 font-medium ${
                project.trangThaiDuAn === 'DangTienHanh'
                  ? 'text-green-600'
                  : project.trangThaiDuAn === 'HoanThanh'
                    ? 'text-blue-600'
                    : 'text-gray-600'
              }`}
            >
              <span className="relative flex h-3 w-3">
                {project.trangThaiDuAn === 'DangTienHanh' && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex h-3 w-3 rounded-full ${
                    project.trangThaiDuAn === 'DangTienHanh'
                      ? 'bg-green-500'
                      : project.trangThaiDuAn === 'HoanThanh'
                        ? 'bg-blue-500'
                        : 'bg-gray-500'
                  }`}
                ></span>
              </span>
              {project.trangThaiDuAn === 'DangTienHanh'
                ? 'Dự án đang tiến hành'
                : project.trangThaiDuAn === 'HoanThanh'
                  ? 'Dự án đã hoàn thành'
                  : project.trangThaiDuAn}
            </div>
            <span className="text-muted-foreground text-xs">
              Dự án này sẽ sớm kết thúc
            </span>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end">
            <div className="w-full md:w-1/4">
              <label className="text-muted-foreground mb-2 block text-xs font-medium uppercase">
                Lọc theo trạng thái:
              </label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="DangXuLy">Đang xử lý</SelectItem>
                  <SelectItem value="DaChapNhan">Đã chấp nhận</SelectItem>
                  <SelectItem value="TuChoi">Từ chối</SelectItem>
                  <SelectItem value="ChinhSuaVaChapNhan">
                    Đã sửa & chấp nhận
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/2">
              <label className="text-muted-foreground mb-2 block text-xs font-medium uppercase">
                Bug search
              </label>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                <Input
                  placeholder="e.g. upload button crash"
                  className="pl-9"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-1/4">
              <Sheet open={isReportOpen} onOpenChange={setIsReportOpen}>
                <SheetTrigger asChild>
                  <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4" />
                    Báo lỗi mới
                  </Button>
                </SheetTrigger>
                <SheetContent className="max-w-[650px] min-w-[500px] overflow-y-auto">
                  <SheetHeader className="px-6 pt-6">
                    <SheetTitle>Báo cáo lỗi mới</SheetTitle>
                    <SheetDescription>
                      Điền thông tin chi tiết về lỗi bạn tìm thấy. Nhấn gửi khi
                      hoàn tất.
                    </SheetDescription>
                  </SheetHeader>
                  {currentUserId && (
                    <BugReportForm
                      projectId={Number(projectId)}
                      userId={currentUserId}
                      projectCode={project?.maDuAnHienThi || 'PRJ'}
                      onSuccess={() => setIsReportOpen(false)}
                    />
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-muted-foreground mb-4 text-xs font-bold tracking-wider uppercase">
              Reported Bugs
            </h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="my-bugs"
                checked={onlyMyBugs}
                onCheckedChange={checked => setOnlyMyBugs(checked as boolean)}
              />
              <label
                htmlFor="my-bugs"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Only show my bugs
              </label>
            </div>
          </div>

          <BugList
            loading={loading}
            bugs={filteredBugs}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
          />
        </CardContent>
      </Card>
    </div>
  )
}
