'use client'

import {
  useAuthUser,
  useKichBanByDuAn,
  useProjectsByUser
} from '@/app/_services/queries'
import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/ui/dialog'
import { ScrollArea } from '@/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/select'
import { Skeleton } from '@/ui/skeleton'
import { Loader2, Search } from 'lucide-react'
import { useState } from 'react'

interface ImportModalProps {
  onImport: (ids: number[]) => Promise<void>
}

export function ImportModal({ onImport }: ImportModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [selectedCases, setSelectedCases] = useState<number[]>([])
  const [isImporting, setIsImporting] = useState(false)

  // Fetch projects
  const { data: user } = useAuthUser()
  const { data: projects = [], isLoading: loadingProjects } = useProjectsByUser(
    user?.id
  )

  // Fetch test cases when project selected
  const { data: testCases = [], isLoading: loadingCases } = useKichBanByDuAn(
    selectedProject ? Number(selectedProject) : undefined
  )

  const handleSelectCase = (id: number) => {
    setSelectedCases(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCases(testCases.map(tc => tc.maKichBan))
    } else {
      setSelectedCases([])
    }
  }

  const handleImport = async () => {
    if (selectedCases.length === 0) return

    try {
      setIsImporting(true)
      await onImport(selectedCases)
      setOpen(false)
      // Reset state
      setSelectedProject('')
      setSelectedCases([])
    } catch (error) {
      console.error(error)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Search className="mr-2 h-4 w-4" />
          Import/Copy từ các dự án của bạn
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import/Copy Kịch bản</DialogTitle>
          <DialogDescription>
            Chọn dự án để sao chép kịch bản kiểm thử.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Chọn dự án nguồn</label>
            <Select
              value={selectedProject}
              onValueChange={val => {
                setSelectedProject(val)
                setSelectedCases([])
              }}
              disabled={loadingProjects}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn dự án..." />
              </SelectTrigger>
              <SelectContent>
                {projects.map(p => (
                  <SelectItem key={p.maDuAn} value={String(p.maDuAn)}>
                    {p.tieuDe}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProject && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Danh sách kịch bản ({testCases.length})
                </label>
                {testCases.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={
                        testCases.length > 0 &&
                        selectedCases.length === testCases.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                    <label
                      htmlFor="select-all"
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Chọn tất cả
                    </label>
                  </div>
                )}
              </div>

              <ScrollArea className="h-[300px] rounded-md border p-4">
                {loadingCases ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : testCases.length === 0 ? (
                  <div className="text-muted-foreground py-8 text-center text-sm">
                    Không có kịch bản nào.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {testCases.map(tc => (
                      <div
                        key={tc.maKichBan}
                        className="flex items-start space-x-3 rounded-md border p-3 hover:bg-slate-50 dark:hover:bg-slate-900"
                      >
                        <Checkbox
                          id={`tc-${tc.maKichBan}`}
                          checked={selectedCases.includes(tc.maKichBan)}
                          onCheckedChange={() => handleSelectCase(tc.maKichBan)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={`tc-${tc.maKichBan}`}
                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {tc.tieuDe}
                          </label>
                          <p className="text-muted-foreground text-xs">
                            {tc.maKichBanHienThi} •{' '}
                            {Array.isArray(tc.cacBuocThucHien)
                              ? (tc.cacBuocThucHien as any[]).length
                              : 0}{' '}
                            bước
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleImport}
            disabled={
              isImporting || !selectedProject || selectedCases.length === 0
            }
          >
            {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Import ({selectedCases.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
