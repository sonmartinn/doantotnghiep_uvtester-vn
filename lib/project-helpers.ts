export const getStatusColor = (status: string) => {
  switch (status) {
    case 'DangTuyen':
      return 'bg-green-500 hover:bg-green-600'
    case 'DangTienHanh':
      return 'bg-blue-500 hover:bg-blue-600'
    case 'ChoDuyet':
      return 'bg-yellow-500 hover:bg-yellow-600'
    case 'DaDong':
      return 'bg-gray-500 hover:bg-gray-600'
    default:
      return 'bg-slate-500 hover:bg-slate-600'
  }
}

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'DangTuyen':
      return 'Đang tuyển'
    case 'DangTienHanh':
      return 'Đang tiến hành'
    case 'ChoDuyet':
      return 'Chờ duyệt'
    case 'DaDong':
      return 'Đã đóng'
    case 'Nhap':
      return 'Nháp'
    default:
      return status
  }
}
