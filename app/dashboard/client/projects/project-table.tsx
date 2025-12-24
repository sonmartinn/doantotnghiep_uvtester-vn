import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/ui/table'
import { Badge } from '@/ui/badge'
import { ProjectActions } from './project-actions'
import { getStatusColor, getStatusLabel } from '@/lib/project-helpers'

interface Project {
  maDuAn: number
  maDuAnHienThi: string
  tieuDe: string
  loaiDuAn: string
  trangThaiDuAn: string
  soLuongCanTuyen: number
  ngayTao: string
  pendingCount?: number
  acceptedCount?: number
}

export function ProjectTable({ projects }: { projects: Project[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Mã dự án</TableHead>
            <TableHead>Tên dự án</TableHead>
            <TableHead>Vị trí</TableHead>
            <TableHead>Ứng viên chờ duyệt</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map(project => {
            return (
              <TableRow key={project.maDuAn}>
                <TableCell className="font-mono font-bold">
                  {project.maDuAnHienThi || `#${project.maDuAn}`}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{project.tieuDe}</span>
                    <span className="text-muted-foreground text-xs">
                      {project.loaiDuAn}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-green-600">
                    {project.acceptedCount}
                  </span>
                  /{project.soLuongCanTuyen}
                </TableCell>
                <TableCell className="font-medium text-orange-500">
                  {project.pendingCount}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(project.trangThaiDuAn)}>
                    {getStatusLabel(project.trangThaiDuAn)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(project.ngayTao).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <ProjectActions
                    projectId={project.maDuAn}
                    currentStatus={project.trangThaiDuAn}
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
