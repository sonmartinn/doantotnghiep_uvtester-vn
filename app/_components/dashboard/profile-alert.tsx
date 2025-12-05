'use client'

import { AlertTriangle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/ui/button'
import {
  checkProfileCompletion,
  type NguoiDung
} from '@/app/_services/data-service'

interface ProfileAlertProps {
  profile: NguoiDung | null
}

export default function ProfileAlert({ profile }: ProfileAlertProps) {
  const { percent, missing } = checkProfileCompletion(profile)

  // Nếu hoàn thiện 100% thì không hiện gì
  if (percent === 100) return null

  return (
    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/50">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-amber-900 dark:text-amber-200">
            Hồ sơ chưa hoàn thiện ({percent}%)
          </h3>
          <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
            Bạn cần cập nhật thêm: <strong>{missing.join(', ')}</strong> để có
            thể ứng tuyển hoặc đăng dự án.
          </p>
          <div className="mt-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900"
            >
              <Link href="/dashboard/settings">
                Cập nhật ngay <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
