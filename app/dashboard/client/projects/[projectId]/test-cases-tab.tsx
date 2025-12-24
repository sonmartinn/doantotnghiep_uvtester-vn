'use client'

import { DuAn } from '@/app/_services/data-service'
import { useKichBanByDuAn } from '@/app/_services/queries'
import { Button } from '@/ui/button'
import { Edit } from 'lucide-react'
import Link from 'next/link'
import { TestCaseReadOnlyList } from './test-case-read-only-list'

interface TestCasesTabProps {
  projectId: number
  project?: DuAn
}

export function TestCasesTab({ projectId, project }: TestCasesTabProps) {
  const { data: testCases = [], isLoading } = useKichBanByDuAn(projectId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Danh sách Kịch bản kiểm thử</h3>
        <Button asChild>
          <Link
            href={`/dashboard/client/projects/${projectId}/setup-test-cases`}
          >
            <Edit className="mr-2 h-4 w-4" />
            Quản lý Test Case
          </Link>
        </Button>
      </div>

      {!isLoading &&
        testCases.length === 0 &&
        project?.loaiDuAn === 'Exploratory' && (
          <div className="rounded-md bg-blue-50 p-4 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200">
            <span className="font-bold">Nhắc nhở:</span> Dự án này thuộc loại
            Exploratory Testing, nhưng bạn vẫn có thể thêm các Test Case nếu cần
            thiết.
          </div>
        )}

      <TestCaseReadOnlyList items={testCases} isLoading={isLoading} />
    </div>
  )
}
