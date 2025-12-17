'use client'

import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/ui/dropdown-menu'
import { MoreHorizontal, FileEdit, Archive, Eye } from 'lucide-react'
import Link from 'next/link'

interface ProjectActionsProps {
  projectId: number
}

export function ProjectActions({ projectId }: ProjectActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Mở menu thao tác</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/client/projects/${projectId}`}>
            <Eye className="mr-2 h-4 w-4" />
            Xem chi tiết
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/dashboard/client/projects/${projectId}/setup-test-cases`}
          >
            <FileEdit className="mr-2 h-4 w-4" />
            Thiết lập kịch bản
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 focus:text-red-600">
          <Archive className="mr-2 h-4 w-4" />
          Đóng dự án
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
