import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { Button } from '@/ui/button'
import { ProjectTester } from '@/app/_services/chat-service'
import { MessageSquare } from 'lucide-react'

interface TesterListProps {
  testers: ProjectTester[]
  onSelect: (tester: ProjectTester) => void
}

export function TesterList({ testers, onSelect }: TesterListProps) {
  if (testers.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-8 text-center text-sm">
        <MessageSquare className="h-8 w-8 opacity-20" />
        <p>Chưa có Tester nào tham gia dự án.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-muted-foreground px-1 text-xs font-semibold">
        Danh sách Tester ({testers.length})
      </div>
      {testers.map(tester => (
        <Button
          key={tester.maNguoiDung}
          variant="ghost"
          className="h-auto w-full items-center justify-start gap-3 px-2 py-3"
          onClick={() => onSelect(tester)}
        >
          <div className="relative">
            <Avatar className="h-9 w-9 border">
              <AvatarImage src={tester.anhDaiDien} />
              <AvatarFallback>{tester.hoTen[0]}</AvatarFallback>
            </Avatar>
            <span className="border-background absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 bg-green-500" />
          </div>
          <div className="flex flex-1 flex-col items-start gap-0.5 overflow-hidden text-left">
            <span className="truncate text-sm font-medium">{tester.hoTen}</span>
            <span className="text-muted-foreground truncate text-xs">
              {tester.email}
            </span>
          </div>
          <MessageSquare className="text-muted-foreground h-4 w-4 opacity-50" />
        </Button>
      ))}
    </div>
  )
}
