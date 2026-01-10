'use client'

import { ThongBao } from '@/app/_services/data-service'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Check, Info, Mail } from 'lucide-react'
import Link from 'next/link'
import { MouseEvent } from 'react'

interface NotificationItemProps {
  notification: ThongBao
  onRead?: (id: number) => void
  onClick?: () => void
}

export function NotificationItem({
  notification,
  onRead,
  onClick
}: NotificationItemProps) {
  const isRead = notification.daXem
  const href = notification.duongDan || '#'

  const handleClick = (e: MouseEvent) => {
    if (onRead && !isRead) {
      onRead(notification.maThongBao)
    }
    if (onClick) {
      onClick()
    }
    // If it's just a div (no link), we stop propagation if needed,
    // but here we let Link handle navigation if href exists.
  }

  const Icon = notification.loaiThongBao === 'LoiMoiDuAn' ? Mail : Info

  const Content = (
    <div
      className={cn(
        'hover:bg-muted/50 flex w-full items-start gap-3 p-3 transition-colors',
        !isRead && 'bg-blue-50/50 dark:bg-blue-900/10'
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          'mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
          !isRead
            ? 'border-primary/20 bg-primary/10 text-primary'
            : 'border-muted bg-muted text-muted-foreground'
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <p
          className={cn(
            'text-sm leading-none font-medium',
            !isRead && 'text-primary font-semibold'
          )}
        >
          {notification.tieuDe}
        </p>
        <p className="text-muted-foreground line-clamp-2 text-xs">
          {notification.noiDung}
        </p>
        <p className="text-muted-foreground text-[10px]">
          {notification.ngayTao
            ? formatDistanceToNow(new Date(notification.ngayTao), {
                addSuffix: true,
                locale: vi
              })
            : 'Vừa xong'}
        </p>
      </div>
      {!isRead && <div className="mt-2 h-2 w-2 rounded-full bg-blue-600" />}
    </div>
  )

  if (notification.duongDan) {
    return (
      <Link
        href={notification.duongDan}
        className="block w-full"
        onClick={handleClick}
      >
        {Content}
      </Link>
    )
  }

  return <div className="cursor-pointer">{Content}</div>
}
