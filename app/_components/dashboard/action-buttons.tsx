'use client'

import { Button } from '@/ui/button'
import {
  checkProfileCompletion,
  type NguoiDung,
  type HoSoTester,
  type HoSoClient
} from '@/app/_services/data-service'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ActionButtonProps {
  profile: NguoiDung | null
  hoSo: HoSoTester | HoSoClient | null
}

export function PostProjectButton({ profile, hoSo }: ActionButtonProps) {
  const router = useRouter()
  const { percent } = checkProfileCompletion(profile, hoSo)

  const handleClick = () => {
    if (percent < 100) {
      toast.error('Vui lòng hoàn thiện hồ sơ trước khi đăng dự án!')
      return
    }
    router.push('/dashboard/client/post-project')
  }

  return <Button onClick={handleClick}>Đăng dự án mới</Button>
}

export function FindJobButton({ profile, hoSo }: ActionButtonProps) {
  const router = useRouter()
  const { percent } = checkProfileCompletion(profile, hoSo)

  const handleClick = () => {
    if (percent < 100) {
      toast.error('Vui lòng hoàn thiện hồ sơ để bắt đầu tìm việc!')
      return
    }
    router.push('/jobs')
  }

  return <Button onClick={handleClick}>Tìm việc mới</Button>
}
