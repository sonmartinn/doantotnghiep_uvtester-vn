'use client'

import { supabase } from '@/lib/supabase/client'
import {
  Channel,
  getMessages,
  Message,
  sendMessage,
  Attachment
} from '@/app/_services/chat-service'
import { useEffect, useState } from 'react'
import { ChatInput } from './chat-input'
import { ChatMessageList } from './chat-message-list'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface ChatChannelProps {
  channel: Channel
  currentUserId: string
  projectOwnerId?: string
}

export function ChatChannel({
  channel,
  currentUserId,
  projectOwnerId
}: ChatChannelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const initialMessages = await getMessages(supabase, channel.maKenh)
        setMessages(initialMessages)
      } catch (error) {
        console.error('Failed to fetch messages:', error)
        toast.error('Không thể tải tin nhắn')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()

    const subscription = supabase
      .channel(`chat:${channel.maKenh}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'TinNhan',
          filter: `maKenh=eq.${channel.maKenh}`
        },
        async payload => {
          const newMessageId = payload.new.maTinNhan
          // Fetch full message to get sender info (join)
          // Simplified: In a real app, we might optimize this.
          // For now, let's just refetch or rely on payload if we don't need avatar immediately.
          // But we need avatar. Let's fetch the single message.
          const { data, error } = await supabase
            .from('TinNhan')
            .select(`*, nguoiGui:NguoiDung(hoTen, anhDaiDien)`)
            .eq('maTinNhan', newMessageId)
            .single()

          if (data && !error) {
            setMessages(prev => [...prev, data as any as Message])
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [channel.maKenh])

  const handleSendMessage = async (content: string, files: File[]) => {
    if (isSending) return
    setIsSending(true)
    try {
      let attachments: Attachment[] | null = null

      if (files.length > 0) {
        attachments = []
        for (const file of files) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${channel.maKenh}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
          const { error: uploadError } = await supabase.storage
            .from('chat_attachments')
            .upload(fileName, file)

          if (uploadError) throw uploadError

          const { data: publicUrlData } = supabase.storage
            .from('chat_attachments')
            .getPublicUrl(fileName)

          attachments.push({
            name: file.name,
            url: publicUrlData.publicUrl,
            type: file.type,
            size: file.size
          })
        }
      }

      await sendMessage(
        supabase,
        channel.maKenh,
        currentUserId,
        content,
        attachments
      )
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('Không thể gửi tin nhắn')
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="bg-muted/30 mb-2 shrink-0 rounded border px-3 py-2 text-xs text-gray-500">
        Kênh: {channel.tenKenh}
      </div>

      <ChatMessageList
        messages={messages}
        currentUserId={currentUserId}
        projectOwnerId={projectOwnerId}
      />

      <ChatInput onSendMessage={handleSendMessage} isLoading={isSending} />
    </div>
  )
}
