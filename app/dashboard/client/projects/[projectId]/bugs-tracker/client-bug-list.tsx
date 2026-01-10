'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { CardContent } from '@/ui/card'
import { Loader2, ChevronDown, ChevronUp, FileText } from 'lucide-react'
import { BaoCaoLoi } from '@/app/_services/data-service'
import { Button } from '@/ui/button'

interface ClientBugListProps {
  loading: boolean
  bugs: BaoCaoLoi[]
  getStatusColor: (status: string | null) => string
  getStatusLabel: (status: string | null) => string
  onSelectBug: (bug: BaoCaoLoi) => void
}

function ClientBugItem({
  bug,
  getStatusColor,
  getStatusLabel,
  onSelectBug
}: {
  bug: BaoCaoLoi
  getStatusColor: (_s: string | null) => string
  getStatusLabel: (_s: string | null) => string
  onSelectBug: (bug: BaoCaoLoi) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return format(new Date(dateString), 'dd MMM yyyy HH:mm')
  }

  const steps = Array.isArray(bug.cacBuocTaiHien)
    ? (bug.cacBuocTaiHien as string[])
    : []
  const attachments = Array.isArray(bug.fileBangChung)
    ? (bug.fileBangChung as string[])
    : []

  return (
    <div className="rounded-lg bg-slate-50 transition-all dark:bg-slate-900">
      <div className="flex flex-col p-4 md:flex-row md:items-start md:justify-between">
        {/* Header Section */}
        <div
          className="flex-1 cursor-pointer space-y-1"
          onClick={() => onSelectBug(bug)}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-indigo-600 hover:underline">
              {bug.maLoiHienThi}
            </span>
          </div>
          <p className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
            {bug.tieuDe}
          </p>
        </div>

        {/* Meta Info Section - Hidden on small screens if needed or stacked */}
        <div className="mt-4 flex shrink-0 flex-wrap gap-x-8 gap-y-4 md:mt-0 md:justify-end">
          <div className="flex flex-col gap-1 md:text-right">
            <span className="text-xs text-gray-500 uppercase">SECTION</span>
            <span className="text-sm font-medium">Test Case</span>
          </div>

          <div className="flex flex-col gap-1 md:text-right">
            <span className="text-xs text-gray-500">
              {formatDate(bug.ngayBaoCao)?.split(' ')[0]}{' '}
              {formatDate(bug.ngayBaoCao)?.split(' ')[1]}{' '}
              {formatDate(bug.ngayBaoCao)?.split(' ')[2]}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(bug.ngayBaoCao)?.split(' ').slice(3).join(' ')}
            </span>
          </div>

          <div className="flex flex-col gap-1 md:w-[160px] md:text-right">
            <span className="text-xs text-gray-500 uppercase">Status</span>
            <div className="flex items-center gap-2 md:justify-end">
              <span
                className={`h-2 w-2 rounded-full ${getStatusColor(bug.trangThaiLoi)}`}
              ></span>
              <span className="text-sm">
                {getStatusLabel(bug.trangThaiLoi)}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle</span>
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-gray-200 px-4 pb-4 dark:border-gray-800">
          <div className="mt-4 grid gap-8 md:grid-cols-2">
            {/* Rejection Reason Alert */}
            {bug.trangThaiLoi === 'TuChoi' && bug.phanHoiCuaClient && (
              <div className="col-span-full rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
                <h4 className="flex items-center gap-2 text-sm font-bold text-red-800 dark:text-red-400">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Lý do từ chối
                </h4>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {bug.phanHoiCuaClient}
                </p>
              </div>
            )}

            {/* Left Column: Steps */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase">
                Các bước tái hiện
              </h4>
              <div className="space-y-2">
                {steps.length > 0 ? (
                  steps.map((step, index) => (
                    <div key={index} className="flex gap-3 text-sm">
                      <span className="font-medium text-gray-500">
                        {index + 1}.
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {step}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No steps provided.
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Results */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase">
                  Kết quả thực tế
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {bug.ketQuaThucTe}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase">
                  Kết quả mong đợi
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {bug.ketQuaMongDoi}
                </p>
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          {attachments.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase">
                Attachments
              </h4>
              <div className="flex flex-wrap gap-2">
                {attachments.map((url, index) => {
                  // Simple loose check for image extension
                  const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i)
                  return (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-100 transition-colors hover:border-indigo-500 dark:border-gray-800 dark:bg-gray-800"
                    >
                      {isImage ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={url}
                          alt={`Attachment ${index + 1}`}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <FileText className="h-6 w-6 text-gray-500 group-hover:text-indigo-500" />
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <Button size="sm" onClick={() => onSelectBug(bug)}>
              Chi tiết & Xử lý
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function ClientBugList({
  loading,
  bugs,
  getStatusColor,
  getStatusLabel,
  onSelectBug
}: ClientBugListProps) {
  return (
    <CardContent>
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {bugs.length > 0 ? (
            bugs.map(bug => (
              <ClientBugItem
                key={bug.maLoi}
                bug={bug}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
                onSelectBug={onSelectBug}
              />
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">
              No bugs found matching your criteria.
            </div>
          )}
        </div>
      )}
    </CardContent>
  )
}
