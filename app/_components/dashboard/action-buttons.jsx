'use client'

import { Button } from '@/ui/button'
import { checkProfileCompletion } from '@/app/_lib/data-service'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function PostProjectButton({ profile }) {
  const router = useRouter()
  const { percent } = checkProfileCompletion(profile)

  const handleClick = () => {
    if (percent < 100) {
      toast.error('Vui lòng hoàn thiện hồ sơ trước khi đăng dự án!')
      return
    }
    router.push('/dashboard/client/post-project')
  }

  return <Button onClick={handleClick}>Đăng dự án mới</Button>
}

export function FindJobButton({ profile }) {
  const router = useRouter()
  const { percent } = checkProfileCompletion(profile)

  const handleClick = () => {
    if (percent < 100) {
      toast.error('Vui lòng hoàn thiện hồ sơ để bắt đầu tìm việc!')
      return
    }
    router.push('/jobs')
  }

  return <Button onClick={handleClick}>Tìm việc mới</Button>
}
