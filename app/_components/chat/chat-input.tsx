import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Loader2, Paperclip, Send, X } from 'lucide-react'
import { useRef, useState } from 'react'

interface ChatInputProps {
  onSendMessage: (content: string, files: File[]) => void
  disabled?: boolean
  isLoading?: boolean
}

export function ChatInput({
  onSendMessage,
  disabled,
  isLoading
}: ChatInputProps) {
  const [input, setInput] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if ((!input.trim() && files.length === 0) || isLoading) return
    onSendMessage(input, files)
    setInput('')
    setFiles([])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-2 border-t pt-4">
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 px-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="bg-muted text-foreground relative flex items-center gap-2 rounded-md border px-2 py-1 text-xs"
            >
              <span className="max-w-[100px] truncate">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-red-500"
                disabled={isLoading}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="file"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
          disabled={disabled || isLoading}
        />
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled || isLoading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-4 w-4 text-gray-500" />
        </Button>
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !isLoading && handleSend()}
          placeholder="Type your message..."
          disabled={disabled || isLoading}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={
            disabled || isLoading || (!input.trim() && files.length === 0)
          }
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
