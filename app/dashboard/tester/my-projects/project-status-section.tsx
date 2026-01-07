'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/ui/button'
import { Badge } from '@/ui/badge'

interface ProjectStatusSectionProps {
  title: string
  count: number
  color: string
  children: React.ReactNode
  defaultExpanded?: boolean
}

export function ProjectStatusSection({
  title,
  count,
  color,
  children,
  defaultExpanded = true
}: ProjectStatusSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  if (count === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          {title}
          <Badge variant="secondary" className={`${color} text-white`}>
            {count}
          </Badge>
        </h3>
      </div>

      {isExpanded && (
        <div className="ml-3 grid gap-6 border-l-2 pl-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {children}
        </div>
      )}
    </div>
  )
}
