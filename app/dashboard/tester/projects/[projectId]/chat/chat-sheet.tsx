'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/ui/sheet'
import { Button } from '@/ui/button'
import { MessageCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Channel, getProjectChannels } from '@/app/_services/chat-service'
import { ChatChannel } from '@/app/_components/chat/chat-channel'
import { Loader2 } from 'lucide-react'

interface ChatSheetProps {
  projectId: number
  userId: string
  projectOwnerId: string // Needed to find/create private channel
  projectCode: string
  projectTitle: string
}

export function ChatSheet({
  projectId,
  userId,
  projectOwnerId,
  projectCode,
  projectTitle
}: ChatSheetProps) {
  const [open, setOpen] = useState(false)
  const [channels, setChannels] = useState<{
    public: Channel
    private: Channel
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && !channels) {
      const initChannels = async () => {
        setIsLoading(true)
        try {
          // Pass supabase client to service
          const data = await getProjectChannels(
            supabase,
            projectId,
            userId,
            projectOwnerId
          )
          setChannels(data)
        } catch (error) {
          console.error('Error loading channels:', error)
        } finally {
          setIsLoading(false)
        }
      }
      initChannels()
    }
  }, [open, channels, projectId, userId, projectOwnerId])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          Chat
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-[400px] flex-col sm:max-w-[500px]">
        <SheetHeader>
          <SheetTitle>Trao đổi dự án</SheetTitle>
          <SheetDescription>
            Trao đổi trực tiếp với quản lý hoặc các tester khác.
          </SheetDescription>
          <div className="pt-4 text-sm font-medium text-gray-500">
            {projectCode} - {projectTitle}
          </div>
        </SheetHeader>

        <div className="flex flex-1 flex-col overflow-hidden pt-4">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : channels ? (
            <Tabs defaultValue="public" className="flex h-full flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="public">Public Chat</TabsTrigger>
                <TabsTrigger value="private">Chat với Test Manager</TabsTrigger>
              </TabsList>

              <TabsContent
                value="public"
                className="mt-2 flex min-h-0 flex-1 flex-col data-[state=active]:flex"
              >
                <ChatChannel
                  channel={channels.public}
                  currentUserId={userId}
                  projectOwnerId={projectOwnerId}
                />
              </TabsContent>

              <TabsContent
                value="private"
                className="mt-2 flex min-h-0 flex-1 flex-col data-[state=active]:flex"
              >
                <ChatChannel
                  channel={channels.private}
                  currentUserId={userId}
                  projectOwnerId={projectOwnerId}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-red-500">
              Có lỗi xảy ra khi tải kênh chat.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
