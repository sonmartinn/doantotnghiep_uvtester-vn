'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog'
import { ScrollArea } from '@/ui/scroll-area'
import { Button } from '@/ui/button'
import { Code } from 'lucide-react'

interface SurveyAnswersDialogProps {
  isOpen: boolean
  onClose: () => void
  answers: any
  candidateName?: string
}

export function SurveyAnswersDialog({
  isOpen,
  onClose,
  answers,
  candidateName
}: SurveyAnswersDialogProps) {
  const renderSurveyAnswers = (data: any) => {
    if (!data || (Array.isArray(data) && data.length === 0))
      return (
        <div className="text-muted-foreground p-4 text-center italic">
          Chưa có câu trả lời nào.
        </div>
      )

    // Helper to render single answer
    const renderAnswer = (ans: any) => {
      if (typeof ans === 'string') return ans
      if (Array.isArray(ans)) return ans.join(', ')
      return JSON.stringify(ans)
    }

    return (
      <div className="space-y-3">
        <h4 className="flex items-center gap-2 font-semibold">
          <Code className="text-primary h-4 w-4" />
          Câu trả lời của {candidateName || 'ứng viên'}
        </h4>
        <div className="bg-muted/30 grid gap-3 rounded-lg border p-3 text-sm">
          {Array.isArray(data) ? (
            data.map((item: any, index: number) => (
              <div
                key={index}
                className="flex flex-col gap-1 border-b pb-2 last:border-0 last:pb-0"
              >
                <span className="text-muted-foreground font-medium">
                  {item.question || `Câu hỏi ${index + 1}`}
                </span>
                <span className="pl-2 font-medium">
                  {renderAnswer(item.answer)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground italic">
              Định dạng không hỗ trợ: {JSON.stringify(data)}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[60vh] flex-col p-0 sm:max-w-[500px]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Kết quả khảo sát</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 pb-6">{renderSurveyAnswers(answers)}</div>
        </ScrollArea>
        <div className="mt-auto flex justify-end gap-2 border-t p-6 pt-2">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
