'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/ui/sheet'
import { Button } from '@/ui/button'
import { MessageCircle, ArrowLeft } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
  Channel,
  getProjectChannels,
  getProjectTesters,
  ProjectTester,
  getOrCreatePrivateChannel
} from '@/app/_services/chat-service'
import { ChatChannel } from '@/app/_components/chat/chat-channel'
import { toast } from 'sonner'
import { TesterList } from './tester-list'

interface ClientChatSheetProps {
  projectId: number
  projectCode?: string
  projectTitle?: string
}

export function ClientChatSheet({
  projectId,
  projectCode,
  projectTitle
}: ClientChatSheetProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('public')
  const [publicChannel, setPublicChannel] = useState<Channel | null>(null)

  // Private Chat State
  const [testers, setTesters] = useState<ProjectTester[]>([])
  const [selectedTester, setSelectedTester] = useState<ProjectTester | null>(
    null
  )
  const [privateChannel, setPrivateChannel] = useState<Channel | null>(null)

  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (open) {
      const init = async () => {
        try {
          const {
            data: { user }
          } = await supabase.auth.getUser()
          if (!user) return
          setUserId(user.id)

          // 1. Fetch Public Channel
          const { public: pub } = await getProjectChannels(
            supabase,
            projectId,
            user.id,
            user.id // As client, I am the owner
          )
          setPublicChannel(pub)

          // 2. Fetch Testers
          const projectTesters = await getProjectTesters(supabase, projectId)
          setTesters(projectTesters)
        } catch (error) {
          console.error('Failed to init chat:', error)
          toast.error('Không thể tải dữ liệu chat')
        } finally {
          setLoading(false)
        }
      }
      init()
    }
  }, [open, projectId])

  const handleSelectTester = async (tester: ProjectTester) => {
    if (!userId) return
    try {
      setLoading(true)
      setSelectedTester(tester)
      const channel = await getOrCreatePrivateChannel(
        supabase,
        projectId,
        userId,
        tester.maNguoiDung
      )
      setPrivateChannel(channel)
    } catch (error) {
      console.error('Failed to open private chat:', error)
      toast.error('Không thể mở đoạn chat này')
      setSelectedTester(null)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToList = () => {
    setSelectedTester(null)
    setPrivateChannel(null)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageCircle className="mr-2 h-4 w-4" />
          Chat
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="bg-muted/40 border-b px-4 py-3">
          <SheetTitle className="flex flex-col gap-0.5">
            <span className="text-base font-bold">Trao đổi dự án</span>
            {projectCode && (
              <span className="text-muted-foreground text-xs font-normal">
                #{projectCode} - {projectTitle}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {loading && !publicChannel ? (
            <div className="flex h-full items-center justify-center">
              <span className="text-sm text-gray-400">Đang tải...</span>
            </div>
          ) : (
            <Tabs
              defaultValue="public"
              className="flex h-full flex-col"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <div className="border-b px-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="public">Public Chat</TabsTrigger>
                  <TabsTrigger value="private">
                    {selectedTester ? 'Chat riêng' : 'Chat với Tester'}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="public"
                className="mt-0 flex-1 overflow-hidden p-0 data-[state=active]:flex data-[state=active]:flex-col"
              >
                {publicChannel && userId && (
                  <ChatChannel channel={publicChannel} currentUserId={userId} />
                )}
              </TabsContent>

              <TabsContent
                value="private"
                className="mt-0 flex-1 overflow-hidden p-0 data-[state=active]:flex data-[state=active]:flex-col"
              >
                {selectedTester && privateChannel && userId ? (
                  <div className="flex h-full flex-col">
                    <div className="flex items-center gap-2 border-b bg-gray-50/50 p-2 px-4 shadow-sm">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleBackToList}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={selectedTester.anhDaiDien} />
                          <AvatarFallback>
                            {selectedTester.hoTen[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {selectedTester.hoTen}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <ChatChannel
                        channel={privateChannel}
                        currentUserId={userId}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-4">
                    <TesterList
                      testers={testers}
                      onSelect={handleSelectTester}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
