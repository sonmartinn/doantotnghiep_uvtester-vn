'use client'

import {
  BaoCaoLoi,
  DuAn,
  getBugsByProjectId,
  getDuAn
} from '@/app/_services/data-service'
import {
  getStatusColor as getProjectStatusColor,
  getStatusLabel as getProjectStatusLabel
} from '@/lib/project-helpers'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/ui/card'
import { Input } from '@/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'
import { ClientBugDetailSheet } from './client-bug-detail-sheet'
import { ClientBugList } from './client-bug-list'

export default function ClientBugsTrackerPage() {
  const params = useParams()
  const projectId = parseInt(params.projectId as string)

  const [project, setProject] = useState<DuAn | null>(null)
  const [bugs, setBugs] = useState<BaoCaoLoi[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBug, setSelectedBug] = useState<BaoCaoLoi | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchData = async () => {
    try {
      setLoading(true)
      const [projectData, bugsData] = await Promise.all([
        getDuAn(projectId),
        getBugsByProjectId(projectId)
      ])

      setBugs(bugsData)
      if (projectData) setProject(projectData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Realtime subscription
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
        async payload => {
          // Refresh data on any change
          const bugsData = await getBugsByProjectId(projectId)
          setBugs(bugsData)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId])

  const filteredBugs = bugs.filter(bug => {
    const matchesSearch =
      bug.tieuDe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bug.maLoiHienThi.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      filterStatus === 'all' || bug.trangThaiLoi === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleSelectBug = (bug: BaoCaoLoi) => {
    setSelectedBug(bug)
    setIsDetailOpen(true)
  }

  const handleDetailUpdate = () => {
    fetchData()
  }

  // Helper for status badge color (Bug Status)
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
    <div className="container mx-auto space-y-6 px-4 py-6 md:px-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">
            Trình quản lý lỗi (Bug Manager)
          </h1>
          {project && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {project.maDuAnHienThi || 'PRJ'}
              </span>
              <span>-</span>
              <span>{project.tieuDe}</span>
              <Badge
                className={`ml-2 ${getProjectStatusColor(
                  project.trangThaiDuAn
                )}`}
              >
                {getProjectStatusLabel(project.trangThaiDuAn)}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Danh sách lỗi</CardTitle>
            <CardDescription>Quản lý các báo cáo lỗi từ Tester</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Tìm kiếm lỗi..."
                className="pl-9"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex w-full items-center gap-2 md:w-auto">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Lọc theo trạng thái:
              </span>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
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
          </div>

          <ClientBugList
            loading={loading}
            bugs={filteredBugs}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
            onSelectBug={handleSelectBug}
          />
        </CardContent>
      </Card>

      <ClientBugDetailSheet
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        bug={selectedBug}
        onUpdate={handleDetailUpdate}
      />
    </div>
  )
}
