'use client'

import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  ThongBao
} from '@/app/_services/data-service'
import { supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<ThongBao[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch initial data
  const fetchNotifications = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const [list, count] = await Promise.all([
        getNotifications(userId),
        getUnreadNotificationCount(userId)
      ])
      setNotifications(list)
      setUnreadCount(count)
    } catch (error) {
      console.error('Failed to fetch notifications', error)
    } finally {
      setLoading(false)
    }
  }

  // Subscribe to Realtime
  useEffect(() => {
    if (!userId) return

    fetchNotifications()

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ThongBao',
          filter: `maNguoiNhan=eq.${userId}`
        },
        payload => {
          const newNotification = payload.new as ThongBao
          setNotifications(prev => [newNotification, ...prev])
          setUnreadCount(prev => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const markAsRead = async (id: number) => {
    // Optimistic update
    setNotifications(prev =>
      prev.map(n => (n.maThongBao === id ? { ...n, daXem: true } : n))
    )
    setUnreadCount(prev => Math.max(0, prev - 1))

    await markNotificationAsRead(id)
  }

  const markAllAsRead = async () => {
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, daXem: true })))
    setUnreadCount(0)

    if (userId) {
      await markAllNotificationsAsRead(userId)
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    refresh: fetchNotifications,
    markAsRead,
    markAllAsRead
  }
}
