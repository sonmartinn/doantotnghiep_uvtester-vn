import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/ui/accordion'
import { Badge } from '@/ui/badge'
import { Card, CardContent } from '@/ui/card'

interface TestCaseReadOnlyListProps {
  items: any[]
  isLoading: boolean
}

export function TestCaseReadOnlyList({
  items,
  isLoading
}: TestCaseReadOnlyListProps) {
  if (isLoading) {
    return (
      <div className="text-muted-foreground py-8 text-center">Đang tải...</div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-muted-foreground rounded-lg border-2 border-dashed py-8 text-center">
        Chưa có kịch bản kiểm thử nào.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((tc, index) => (
        <Card key={tc.maKichBan}>
          <CardContent className="p-0">
            <Accordion type="single" collapsible>
              <AccordionItem
                value={`item-${tc.maKichBan}`}
                className="border-none"
              >
                <AccordionTrigger className="px-6 hover:no-underline">
                  <div className="flex flex-1 items-center gap-4 text-left">
                    <Badge variant="outline" className="font-mono">
                      TC-{String(index + 1).padStart(2, '0')}
                    </Badge>
                    <span className="font-medium">{tc.tieuDe}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-muted-foreground mb-1 text-sm font-semibold">
                          Điều kiện tiên quyết
                        </h4>
                        <p className="text-sm">
                          {tc.dieuKienTienQuyet || '_ _'}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-muted-foreground mb-1 text-sm font-semibold">
                          Các bước thực hiện
                        </h4>
                        <ol className="list-inside list-decimal space-y-1 text-sm">
                          {Array.isArray(tc.cacBuocThucHien) &&
                            tc.cacBuocThucHien.map((step: any, i: number) => (
                              <li key={i}>
                                <span className="font-medium">
                                  {step.moTa || step}
                                </span>
                                {step.ketQuaMongDoi && (
                                  <span className="text-muted-foreground ml-2">
                                    (Mong đợi: {step.ketQuaMongDoi})
                                  </span>
                                )}
                              </li>
                            ))}
                        </ol>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {tc.yeuCauBangChung && (
                        <div>
                          <h4 className="text-muted-foreground mb-1 text-sm font-semibold">
                            Yêu cầu bằng chứng
                          </h4>
                          <p className="text-sm">{tc.yeuCauBangChung}</p>
                        </div>
                      )}

                      {tc.huongDanDacBiet && (
                        <div>
                          <h4 className="text-muted-foreground mb-1 text-sm font-semibold">
                            Hướng dẫn đặc biệt
                          </h4>
                          <p className="text-sm">{tc.huongDanDacBiet}</p>
                        </div>
                      )}

                      <div>
                        <h4 className="text-muted-foreground mb-1 text-sm font-semibold">
                          Câu hỏi bổ sung
                        </h4>
                        {!tc.cauHoiBoSung ||
                        (Array.isArray(tc.cauHoiBoSung) &&
                          tc.cauHoiBoSung.length === 0) ? (
                          <p className="text-sm">_ _</p>
                        ) : Array.isArray(tc.cauHoiBoSung) ? (
                          <ul className="list-inside list-disc space-y-1 text-sm">
                            {tc.cauHoiBoSung.map((q: any, i: number) => (
                              <li key={i}>{q.cauHoi || q}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm">{tc.cauHoiBoSung}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
