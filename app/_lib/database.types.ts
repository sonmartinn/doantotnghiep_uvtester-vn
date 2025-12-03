export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      BaoCaoLoi: {
        Row: {
          cacBuocTaiHien: Json | null
          fileBangChung: Json | null
          ketQuaMongDoi: string
          ketQuaThucTe: string
          khaNangTaiTao: string | null
          maDuAn: number
          maKetQuaKiemThu: number | null
          maLoi: number
          maLoiHienThi: string
          maNguoiBaoCao: string
          mucDoNghiemTrong: string | null
          ngayBaoCao: string | null
          phanHoiCuaClient: string | null
          thongTinTrinhDuyet: Json | null
          tieuDe: string
          trangThaiLoi: string | null
        }
        Insert: {
          cacBuocTaiHien?: Json | null
          fileBangChung?: Json | null
          ketQuaMongDoi: string
          ketQuaThucTe: string
          khaNangTaiTao?: string | null
          maDuAn: number
          maKetQuaKiemThu?: number | null
          maLoi?: number
          maLoiHienThi: string
          maNguoiBaoCao: string
          mucDoNghiemTrong?: string | null
          ngayBaoCao?: string | null
          phanHoiCuaClient?: string | null
          thongTinTrinhDuyet?: Json | null
          tieuDe: string
          trangThaiLoi?: string | null
        }
        Update: {
          cacBuocTaiHien?: Json | null
          fileBangChung?: Json | null
          ketQuaMongDoi?: string
          ketQuaThucTe?: string
          khaNangTaiTao?: string | null
          maDuAn?: number
          maKetQuaKiemThu?: number | null
          maLoi?: number
          maLoiHienThi?: string
          maNguoiBaoCao?: string
          mucDoNghiemTrong?: string | null
          ngayBaoCao?: string | null
          phanHoiCuaClient?: string | null
          thongTinTrinhDuyet?: Json | null
          tieuDe?: string
          trangThaiLoi?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'BaoCaoLoi_maDuAn_fkey'
            columns: ['maDuAn']
            isOneToOne: false
            referencedRelation: 'DuAn'
            referencedColumns: ['maDuAn']
          },
          {
            foreignKeyName: 'BaoCaoLoi_maKetQuaKiemThu_fkey'
            columns: ['maKetQuaKiemThu']
            isOneToOne: false
            referencedRelation: 'KetQuaKiemThu'
            referencedColumns: ['maKetQua']
          },
          {
            foreignKeyName: 'BaoCaoLoi_maNguoiBaoCao_fkey'
            columns: ['maNguoiBaoCao']
            isOneToOne: false
            referencedRelation: 'NguoiDung'
            referencedColumns: ['maNguoiDung']
          }
        ]
      }
      DuAn: {
        Row: {
          fileDinhKem: Json | null
          hanChotNopHoSo: string | null
          linhVuc: string | null
          maDuAn: number
          maNguoiDang: string
          moTaDuAn: string
          nganSach: number | null
          ngayDang: string | null
          ngayKetThucDuAn: string | null
          soLuongCanTuyen: number | null
          tenDuAn: string
          trangThaiDuAn: string | null
          yeuCauKyNang: Json | null
          yeuCauThietBi: Json | null
        }
        Insert: {
          fileDinhKem?: Json | null
          hanChotNopHoSo?: string | null
          linhVuc?: string | null
          maDuAn?: number
          maNguoiDang: string
          moTaDuAn: string
          nganSach?: number | null
          ngayDang?: string | null
          ngayKetThucDuAn?: string | null
          soLuongCanTuyen?: number | null
          tenDuAn: string
          trangThaiDuAn?: string | null
          yeuCauKyNang?: Json | null
          yeuCauThietBi?: Json | null
        }
        Update: {
          fileDinhKem?: Json | null
          hanChotNopHoSo?: string | null
          linhVuc?: string | null
          maDuAn?: number
          maNguoiDang?: string
          moTaDuAn?: string
          nganSach?: number | null
          ngayDang?: string | null
          ngayKetThucDuAn?: string | null
          soLuongCanTuyen?: number | null
          tenDuAn?: string
          trangThaiDuAn?: string | null
          yeuCauKyNang?: Json | null
          yeuCauThietBi?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'DuAn_maNguoiDang_fkey'
            columns: ['maNguoiDang']
            isOneToOne: false
            referencedRelation: 'NguoiDung'
            referencedColumns: ['maNguoiDung']
          }
        ]
      }
      HoSoClient: {
        Row: {
          linhVucHoatDong: string | null
          maNguoiDung: string
          maSoThue: string | null
          moTaCongTy: string | null
          quyMoCongTy: string | null
          tenCongTy: string | null
          website: string | null
        }
        Insert: {
          linhVucHoatDong?: string | null
          maNguoiDung: string
          maSoThue?: string | null
          moTaCongTy?: string | null
          quyMoCongTy?: string | null
          tenCongTy?: string | null
          website?: string | null
        }
        Update: {
          linhVucHoatDong?: string | null
          maNguoiDung?: string
          maSoThue?: string | null
          moTaCongTy?: string | null
          quyMoCongTy?: string | null
          tenCongTy?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'HoSoClient_maNguoiDung_fkey'
            columns: ['maNguoiDung']
            isOneToOne: true
            referencedRelation: 'NguoiDung'
            referencedColumns: ['maNguoiDung']
          }
        ]
      }
      HoSoTester: {
        Row: {
          chungChi: Json | null
          duAnDaLam: Json | null
          hocVan: Json | null
          kinhNghiem: Json | null
          kyNang: Json | null
          maNguoiDung: string
          mucLuongMongMuon: number | null
          thietBiHienCo: Json | null
          trangThaiLamViec: string | null
        }
        Insert: {
          chungChi?: Json | null
          duAnDaLam?: Json | null
          hocVan?: Json | null
          kinhNghiem?: Json | null
          kyNang?: Json | null
          maNguoiDung: string
          mucLuongMongMuon?: number | null
          thietBiHienCo?: Json | null
          trangThaiLamViec?: string | null
        }
        Update: {
          chungChi?: Json | null
          duAnDaLam?: Json | null
          hocVan?: Json | null
          kinhNghiem?: Json | null
          kyNang?: Json | null
          maNguoiDung?: string
          mucLuongMongMuon?: number | null
          thietBiHienCo?: Json | null
          trangThaiLamViec?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'HoSoTester_maNguoiDung_fkey'
            columns: ['maNguoiDung']
            isOneToOne: true
            referencedRelation: 'NguoiDung'
            referencedColumns: ['maNguoiDung']
          }
        ]
      }
      HoTro: {
        Row: {
          fileDinhKem: Json | null
          maNguoiGui: string | null
          maYeuCau: number
          ngayGui: string | null
          noiDung: string | null
          phanHoiAdmin: string | null
          tieuDe: string | null
          trangThaiHoTro: string | null
        }
        Insert: {
          fileDinhKem?: Json | null
          maNguoiGui?: string | null
          maYeuCau?: number
          ngayGui?: string | null
          noiDung?: string | null
          phanHoiAdmin?: string | null
          tieuDe?: string | null
          trangThaiHoTro?: string | null
        }
        Update: {
          fileDinhKem?: Json | null
          maNguoiGui?: string | null
          maYeuCau?: number
          ngayGui?: string | null
          noiDung?: string | null
          phanHoiAdmin?: string | null
          tieuDe?: string | null
          trangThaiHoTro?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'HoTro_maNguoiGui_fkey'
            columns: ['maNguoiGui']
            isOneToOne: false
            referencedRelation: 'NguoiDung'
            referencedColumns: ['maNguoiDung']
          }
        ]
      }
      KetQuaKiemThu: {
        Row: {
          danhGiaChatLuong: string | null
          fileBaoCaoTongHop: Json | null
          ghiChu: string | null
          maDuAn: number
          maKetQua: number
          maNguoiThucHien: string
          ngayHoanThanh: string | null
          soLoiNghiemTrong: number | null
          soLoiTimDuoc: number | null
        }
        Insert: {
          danhGiaChatLuong?: string | null
          fileBaoCaoTongHop?: Json | null
          ghiChu?: string | null
          maDuAn: number
          maKetQua?: number
          maNguoiThucHien: string
          ngayHoanThanh?: string | null
          soLoiNghiemTrong?: number | null
          soLoiTimDuoc?: number | null
        }
        Update: {
          danhGiaChatLuong?: string | null
          fileBaoCaoTongHop?: Json | null
          ghiChu?: string | null
          maDuAn?: number
          maKetQua?: number
          maNguoiThucHien?: string
          ngayHoanThanh?: string | null
          soLoiNghiemTrong?: number | null
          soLoiTimDuoc?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'KetQuaKiemThu_maDuAn_fkey'
            columns: ['maDuAn']
            isOneToOne: false
            referencedRelation: 'DuAn'
            referencedColumns: ['maDuAn']
          },
          {
            foreignKeyName: 'KetQuaKiemThu_maNguoiThucHien_fkey'
            columns: ['maNguoiThucHien']
            isOneToOne: false
            referencedRelation: 'NguoiDung'
            referencedColumns: ['maNguoiDung']
          }
        ]
      }
      NguoiDung: {
        Row: {
          anhDaiDien: string | null
          diaChi: Json | null
          email: string
          gioiThieu: string | null
          gioiTinh: string | null
          hoTen: string | null
          linkLinkedIn: string | null
          maNguoiDung: string
          ngaySinh: string | null
          ngayTao: string | null
          thongTinThanhToan: Json | null
          vaiTro: string
        }
        Insert: {
          anhDaiDien?: string | null
          diaChi?: Json | null
          email: string
          gioiThieu?: string | null
          gioiTinh?: string | null
          hoTen?: string | null
          linkLinkedIn?: string | null
          maNguoiDung: string
          ngaySinh?: string | null
          ngayTao?: string | null
          thongTinThanhToan?: Json | null
          vaiTro: string
        }
        Update: {
          anhDaiDien?: string | null
          diaChi?: Json | null
          email?: string
          gioiThieu?: string | null
          gioiTinh?: string | null
          hoTen?: string | null
          linkLinkedIn?: string | null
          maNguoiDung?: string
          ngaySinh?: string | null
          ngayTao?: string | null
          thongTinThanhToan?: Json | null
          vaiTro?: string
        }
        Relationships: []
      }
      ThanhToan: {
        Row: {
          maDuAn: number | null
          maGiaoDich: number
          maNguoiNhan: string | null
          moTaGiaoDich: string | null
          ngayGiaoDich: string | null
          soTien: number | null
          trangThaiThanhToan: string | null
        }
        Insert: {
          maDuAn?: number | null
          maGiaoDich?: number
          maNguoiNhan?: string | null
          moTaGiaoDich?: string | null
          ngayGiaoDich?: string | null
          soTien?: number | null
          trangThaiThanhToan?: string | null
        }
        Update: {
          maDuAn?: number | null
          maGiaoDich?: number
          maNguoiNhan?: string | null
          moTaGiaoDich?: string | null
          ngayGiaoDich?: string | null
          soTien?: number | null
          trangThaiThanhToan?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'ThanhToan_maDuAn_fkey'
            columns: ['maDuAn']
            isOneToOne: false
            referencedRelation: 'DuAn'
            referencedColumns: ['maDuAn']
          },
          {
            foreignKeyName: 'ThanhToan_maNguoiNhan_fkey'
            columns: ['maNguoiNhan']
            isOneToOne: false
            referencedRelation: 'NguoiDung'
            referencedColumns: ['maNguoiDung']
          }
        ]
      }
      TinNhan: {
        Row: {
          daXem: boolean | null
          maNguoiGui: string | null
          maNguoiNhan: string | null
          maTinNhan: number
          ngayGui: string | null
          noiDung: string | null
        }
        Insert: {
          daXem?: boolean | null
          maNguoiGui?: string | null
          maNguoiNhan?: string | null
          maTinNhan?: number
          ngayGui?: string | null
          noiDung?: string | null
        }
        Update: {
          daXem?: boolean | null
          maNguoiGui?: string | null
          maNguoiNhan?: string | null
          maTinNhan?: number
          ngayGui?: string | null
          noiDung?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'TinNhan_maNguoiGui_fkey'
            columns: ['maNguoiGui']
            isOneToOne: false
            referencedRelation: 'NguoiDung'
            referencedColumns: ['maNguoiDung']
          },
          {
            foreignKeyName: 'TinNhan_maNguoiNhan_fkey'
            columns: ['maNguoiNhan']
            isOneToOne: false
            referencedRelation: 'NguoiDung'
            referencedColumns: ['maNguoiDung']
          }
        ]
      }
      UngTuyen: {
        Row: {
          fileCV: Json | null
          ghiChuUngTuyen: string | null
          maDuAn: number
          maUngTuyen: number
          maUngVien: string
          ngayUngTuyen: string | null
          trangThaiUngTuyen: string | null
        }
        Insert: {
          fileCV?: Json | null
          ghiChuUngTuyen?: string | null
          maDuAn: number
          maUngTuyen?: number
          maUngVien: string
          ngayUngTuyen?: string | null
          trangThaiUngTuyen?: string | null
        }
        Update: {
          fileCV?: Json | null
          ghiChuUngTuyen?: string | null
          maDuAn?: number
          maUngTuyen?: number
          maUngVien?: string
          ngayUngTuyen?: string | null
          trangThaiUngTuyen?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'UngTuyen_maDuAn_fkey'
            columns: ['maDuAn']
            isOneToOne: false
            referencedRelation: 'DuAn'
            referencedColumns: ['maDuAn']
          },
          {
            foreignKeyName: 'UngTuyen_maUngVien_fkey'
            columns: ['maUngVien']
            isOneToOne: false
            referencedRelation: 'NguoiDung'
            referencedColumns: ['maNguoiDung']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
