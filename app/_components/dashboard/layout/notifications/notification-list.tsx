'use client'

import { Button } from '@/ui/button'
import { CardHeader, CardTitle } from '@/ui/card'
import { ScrollArea } from '@/ui/scroll-area'
import { Check } from 'lucide-react'
import { NotificationItem } from './notification-item'
import { ThongBao } from '@/app/_services/data-service'

interface NotificationListProps {
  notifications: ThongBao[]
  loading: boolean
  onMarkAllRead: () => void
  onMarkRead: (id: number) => void
  onItemClick?: () => void
}

export function NotificationList({
  notifications,
  loading,
  onMarkAllRead,
  onMarkRead,
  onItemClick
}: NotificationListProps) {
  return (
    <div className="flex w-[380px] flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h4 className="font-semibold">Thông báo</h4>
        {notifications.some(n => !n.daXem) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto px-2 text-xs"
            onClick={onMarkAllRead}
          >
            <Check className="mr-1 h-3 w-3" />
            Đánh dấu đã đọc
          </Button>
        )}
      </div>
      <ScrollArea className="h-[300px]">
        {loading ? (
          <div className="text-muted-foreground flex h-20 items-center justify-center text-sm">
            Đang tải...
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-muted-foreground flex h-20 items-center justify-center text-sm">
            Không có thông báo nào
          </div>
        ) : (
          <div className="flex flex-col">
            {notifications.map(notification => (
              <NotificationItem
                key={notification.maThongBao}
                notification={notification}
                onRead={onMarkRead}
                onClick={onItemClick}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
