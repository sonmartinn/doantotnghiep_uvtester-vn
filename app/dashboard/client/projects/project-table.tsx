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

interface Project {
  maDuAn: number
  maDuAnHienThi: string
  tieuDe: string
  loaiDuAn: string
  trangThaiDuAn: string
  soLuongCanTuyen: number
  ngayTao: string
}

const statusMap: Record<
  string,
  {
    label: string
    variant:
      | 'default'
      | 'secondary'
      | 'outline'
      | 'destructive'
      | 'success'
      | 'warning'
  }
> = {
  Nhap: { label: 'Nháp', variant: 'secondary' },
  ChoDuyet: { label: 'Chờ duyệt', variant: 'warning' },
  DangTuyen: { label: 'Đang tuyển', variant: 'success' },
  DangTienHanh: { label: 'Đang tiến hành', variant: 'default' },
  ChoQuyetToan: { label: 'Chờ quyết toán', variant: 'warning' },
  DaDong: { label: 'Đã đóng', variant: 'outline' },
  BiTuChoi: { label: 'Bị từ chối', variant: 'destructive' }
}

export function ProjectTable({ projects }: { projects: Project[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Mã dự án</TableHead>
            <TableHead>Tên dự án</TableHead>
            <TableHead>Ứng viên</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map(project => {
            const status = statusMap[project.trangThaiDuAn] || {
              label: project.trangThaiDuAn,
              variant: 'outline'
            }
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
                <TableCell>{project.soLuongCanTuyen} Vị trí</TableCell>
                <TableCell>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </TableCell>
                <TableCell>
                  {new Date(project.ngayTao).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <ProjectActions projectId={project.maDuAn} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
