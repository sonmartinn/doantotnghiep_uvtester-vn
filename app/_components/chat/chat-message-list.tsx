'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { ScrollArea } from '@/ui/scroll-area'
import { Message } from '@/app/_services/chat-service'
import { FileIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { Badge } from '@/ui/badge'

interface ChatMessageListProps {
  messages: Message[]
  currentUserId: string
  projectOwnerId?: string
}

export function ChatMessageList({
  messages,
  currentUserId,
  projectOwnerId
}: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <ScrollArea className="flex-1 pr-4">
      <div className="space-y-4 py-4">
        {messages.map(msg => {
          const isMe = msg.maNguoiGui === currentUserId
          const isClient =
            projectOwnerId && msg.maNguoiGui === projectOwnerId && !isMe

          return (
            <div
              key={msg.maTinNhan}
              className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={msg.nguoiGui?.anhDaiDien}
                  alt={msg.nguoiGui?.hoTen}
                />
                <AvatarFallback>
                  {msg.nguoiGui?.hoTen?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div
                className={`flex max-w-[80%] flex-col gap-1 ${
                  isMe ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500">
                    {msg.nguoiGui?.hoTen || 'Unknown'}
                  </span>
                  {isClient && (
                    <Badge
                      variant="secondary"
                      className="h-5 border-blue-200 bg-blue-50 px-1 py-0 text-[10px] font-normal text-blue-700"
                    >
                      Client
                    </Badge>
                  )}

                  <span className="text-[10px] text-gray-400">
                    {new Date(msg.thoiGianGui).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div
                  className={`rounded-lg px-3 py-2 text-sm shadow-sm ${
                    isMe
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                  }`}
                >
                  {msg.noiDung && <div className="mb-1">{msg.noiDung}</div>}
                  {msg.fileDinhKem && msg.fileDinhKem.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {msg.fileDinhKem.map((file, idx) => {
                        const isImage =
                          file.type?.startsWith('image/') ||
                          /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
                        return (
                          <div key={idx} className="mt-1">
                            {isImage ? (
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={file.url}
                                  alt={file.name}
                                  className="max-h-48 rounded-md object-cover"
                                />
                              </a>
                            ) : (
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 rounded-md p-2 text-xs hover:underline ${
                                  isMe
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-gray-200 text-gray-800'
                                }`}
                              >
                                <FileIcon className="h-4 w-4" />
                                <span className="max-w-[150px] truncate">
                                  {file.name}
                                </span>
                              </a>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
