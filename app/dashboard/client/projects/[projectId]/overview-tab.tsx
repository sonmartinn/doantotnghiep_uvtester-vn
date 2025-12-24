'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Badge } from '@/ui/badge'
import { Monitor, Smartphone, Globe, CheckCircle2, XCircle } from 'lucide-react'
import DOMPurify from 'dompurify'

interface OverviewTabProps {
  project: any
}

export function OverviewTab({ project }: OverviewTabProps) {
  // Parse JSON fields safely
  const environments =
    typeof project.yeuCauMoiTruong === 'string'
      ? JSON.parse(project.yeuCauMoiTruong)
      : project.yeuCauMoiTruong || {}

  const hasEnvironments =
    (environments.devices && environments.devices.length > 0) ||
    (environments.os && environments.os.length > 0) ||
    (environments.browser && environments.browser.length > 0) ||
    (Array.isArray(environments) && environments.length > 0)

  const scope =
    typeof project.phamViTest === 'string'
      ? JSON.parse(project.phamViTest)
      : project.phamViTest || { inScope: [], outScope: [] }

  return (
    <div className="grid gap-6">
      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Mô tả dự án</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose-sm dark:prose-invert"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(project.moTa || '<p>Chưa có mô tả</p>')
            }}
          />
        </CardContent>
      </Card>

      {/* Environment */}
      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu môi trường</CardTitle>
        </CardHeader>
        <CardContent>
          {hasEnvironments ? (
            <div className="flex flex-col gap-4">
              {/* Handle Array format (Legacy) */}
              {Array.isArray(environments) && (
                <div className="flex flex-wrap gap-2">
                  {environments.map((env: any, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {env.type === 'desktop' ? (
                        <Monitor className="h-3 w-3" />
                      ) : env.type === 'mobile' ? (
                        <Smartphone className="h-3 w-3" />
                      ) : (
                        <Globe className="h-3 w-3" />
                      )}
                      {env.name} {env.os && `(${env.os})`}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Handle Object format (New) */}
              {!Array.isArray(environments) && (
                <div className="space-y-4">
                  {environments.devices?.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-muted-foreground text-sm font-medium">
                        Thiết bị:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {environments.devices.map(
                          (device: string, i: number) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <Monitor className="h-3 w-3" />
                              {device}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {environments.os?.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-muted-foreground text-sm font-medium">
                        Hệ điều hành:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {environments.os.map((os: string, i: number) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <Smartphone className="h-3 w-3" />
                            {os}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {environments.browser?.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-muted-foreground text-sm font-medium">
                        Trình duyệt:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {environments.browser.map(
                          (browser: string, i: number) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <Globe className="h-3 w-3" />
                              {browser}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Non-specific requirements
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tech Specs */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hướng dẫn truy cập</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose-sm dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  project.huongDanTruyCap || '<p>Chưa có hướng dẫn</p>'
                )
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hướng dẫn kỹ thuật</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose-sm dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  project.huongDanKyThuat || '<p>Chưa có hướng dẫn</p>'
                )
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Scope */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" /> In Scope
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scope.inScope?.length > 0 ? (
              <ul className="list-inside list-disc space-y-1 text-sm">
                {scope.inScope.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">Chưa xác định</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <XCircle className="h-5 w-5" /> Out of Scope
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scope.outScope?.length > 0 ? (
              <ul className="list-inside list-disc space-y-1 text-sm">
                {scope.outScope.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">Chưa xác định</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
