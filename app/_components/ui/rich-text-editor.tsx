'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Highlighter
} from 'lucide-react'
import { Button } from '@/ui/button'
import { Separator } from '@/ui/separator'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'
import { Input } from '@/ui/input'
import { useState, useCallback, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onUploadImage?: (file: File) => Promise<string>
}

const EditorToolbar = ({
  editor,
  onUploadImage
}: {
  editor: Editor | null
  onUploadImage?: (file: File) => Promise<string>
}) => {
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addImage = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl('')
    }
  }, [imageUrl, editor])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onUploadImage && editor) {
      try {
        setIsUploading(true)
        const url = await onUploadImage(file)
        editor.chain().focus().setImage({ src: url }).run()
      } catch (error) {
        console.error('Upload failed', error)
      } finally {
        setIsUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
  }

  const setLink = useCallback(() => {
    if (editor) {
      if (linkUrl === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
        return
      }
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run()
      setLinkUrl('')
    }
  }, [linkUrl, editor])

  if (!editor) return null

  const ToggleButton = ({
    isActive,
    onClick,
    children,
    label
  }: {
    isActive: boolean
    onClick: () => void
    children: React.ReactNode
    label: string
  }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        'h-8 w-8 p-0',
        isActive ? 'bg-muted text-foreground' : 'text-muted-foreground'
      )}
      title={label}
      type="button" // Prevent form submission
    >
      {children}
    </Button>
  )

  return (
    <div className="bg-muted/40 flex flex-wrap items-center gap-1 border-b p-1">
      <ToggleButton
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        label="Bold"
      >
        <Bold className="h-4 w-4" />
      </ToggleButton>

      <ToggleButton
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        label="Italic"
      >
        <Italic className="h-4 w-4" />
      </ToggleButton>

      <ToggleButton
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        label="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </ToggleButton>

      <ToggleButton
        isActive={editor.isActive('highlight')}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        label="Highlight"
      >
        <Highlighter className="h-4 w-4" />
      </ToggleButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToggleButton
        isActive={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        label="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </ToggleButton>

      <ToggleButton
        isActive={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        label="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </ToggleButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToggleButton
        isActive={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        label="Bullet List"
      >
        <List className="h-4 w-4" />
      </ToggleButton>

      <ToggleButton
        isActive={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        label="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </ToggleButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 w-8 p-0',
              editor.isActive('link')
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground'
            )}
            title="Link"
            type="button"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3">
          <div className="flex space-x-2">
            <Input
              placeholder="https://example.com"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
            />
            <Button size="sm" onClick={setLink} type="button">
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground h-8 w-8 p-0"
            title="Image"
            type="button"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 space-y-3 p-3">
          <div className="flex space-x-2">
            <Input
              placeholder="https://image.url/pic.png"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />
            <Button size="sm" onClick={addImage} type="button">
              Add
            </Button>
          </div>
          {onUploadImage && (
            <div className="text-center">
              <span className="text-muted-foreground text-xs">- OR -</span>
              <div className="mt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  type="button"
                >
                  {isUploading ? 'Uploading...' : 'Upload from Computer'}
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
          type="button"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
          type="button"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
  onUploadImage
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false
        }
      }),
      Image,
      Link.configure({
        openOnClick: false
      }),
      Highlight,
      Placeholder.configure({
        placeholder: placeholder || 'Nhập nội dung...'
      })
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'min-h-[150px] w-full max-w-none rounded-b-md border border-t-0 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm dark:prose-invert focus:prose-p:m-0'
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    immediatelyRender: false
  })

  // Sync value if changed externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // Check if the content is actually different to avoid loop
      // Just a simple check for now.
      // Note: editor.getHTML() returns <p></p> for empty, while value might be ''.
      if (editor.isEmpty && !value) return
      editor.commands.setContent(value)
    }
  }, [value, editor])

  return (
    <div className={cn('overflow-hidden rounded-md border', className)}>
      <EditorToolbar editor={editor} onUploadImage={onUploadImage} />
      <EditorContent editor={editor} />
      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
