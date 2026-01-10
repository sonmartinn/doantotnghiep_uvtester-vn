'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Mail, Briefcase, Globe } from 'lucide-react'
import { TesterProfile } from '@/app/_services/data-service'
import { InviteTesterModal } from './invite-modal'
import { TesterDetailDialog } from './tester-detail-dialog'

interface TesterCardProps {
  tester: TesterProfile
  projects: any[]
}

export function TesterCard({ tester, projects }: TesterCardProps) {
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const hoso = tester.HoSoTester

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Chưa cập nhật'
    try {
      return new Date(dateString).toLocaleDateString('vi-VN')
    } catch (e) {
      return dateString
    }
  }

  const renderAddress = (addr: any) => {
    if (!addr || (!addr.city && !addr.tinhThanh)) return 'Chưa cập nhật'
    return addr.city || addr.tinhThanh
  }

  return (
    <>
      <Card className="flex flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={tester.anhDaiDien || ''}
              alt={tester.hoTen || 'Avatar'}
            />
            <AvatarFallback>
              {tester.hoTen?.charAt(0).toUpperCase() || 'T'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-lg">{tester.hoTen}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <span className="truncate">{tester.email}</span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Briefcase className="h-4 w-4" />
            <span>{hoso?.soNamKinhNghiem || 0} năm kinh nghiệm</span>
          </div>

          <div className="space-y-2">
            <h4 className="text-muted-foreground text-xs font-semibold uppercase">
              Hồ sơ
            </h4>
            <div className="bg-muted/40 grid gap-1 rounded-md p-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Giới tính:</span>
                <span className="font-medium">{tester.gioiTinh || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ngày sinh:</span>
                <span className="font-medium">
                  {formatDate(tester.ngaySinh)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-muted-foreground mt-0.5 shrink-0">
                  Địa chỉ:
                </span>
                <span className="flex-1 text-right font-medium break-words">
                  {renderAddress(tester.diaChi)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsDetailOpen(true)}
          >
            <Globe className="mr-2 h-4 w-4" />
            Chi tiết
          </Button>
          <Button className="w-full" onClick={() => setIsInviteOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Mời
          </Button>
        </CardFooter>
      </Card>

      <InviteTesterModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        testerId={tester.maNguoiDung}
        testerName={tester.hoTen || 'Tester'}
        projects={projects}
      />

      <TesterDetailDialog
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        tester={tester}
        onInvite={() => setIsInviteOpen(true)}
      />
    </>
  )
}
