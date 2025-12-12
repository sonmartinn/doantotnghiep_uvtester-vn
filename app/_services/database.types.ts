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
          maLoi: number
          maDuAn: number
          maNguoiBaoCao: string
          maKetQuaKiemThu: number | null
          maLoiHienThi: string
          tieuDe: string
          cacBuocTaiHien: Json | null
          ketQuaThucTe: string
          ketQuaMongDoi: string
          mucDoNghiemTrong: string | null
          khaNangTaiTao: string | null
          fileBangChung: Json | null
          thongTinTrinhDuyet: Json | null
          trangThaiLoi: string | null
          phanHoiCuaClient: string | null
          ngayBaoCao: string | null
        }
        Insert: {
          maLoi?: number
          maDuAn: number
          maNguoiBaoCao: string
          maKetQuaKiemThu?: number | null
          maLoiHienThi: string
          tieuDe: string
          cacBuocTaiHien?: Json | null
          ketQuaThucTe: string
          ketQuaMongDoi: string
          mucDoNghiemTrong?: string | null
          khaNangTaiTao?: string | null
          fileBangChung?: Json | null
          thongTinTrinhDuyet?: Json | null
          trangThaiLoi?: string | null
          phanHoiCuaClient?: string | null
          ngayBaoCao?: string | null
        }
        Update: {
          maLoi?: number
          maDuAn?: number
          maNguoiBaoCao?: string
          maKetQuaKiemThu?: number | null
          maLoiHienThi?: string
          tieuDe?: string
          cacBuocTaiHien?: Json | null
          ketQuaThucTe?: string
          ketQuaMongDoi?: string
          mucDoNghiemTrong?: string | null
          khaNangTaiTao?: string | null
          fileBangChung?: Json | null
          thongTinTrinhDuyet?: Json | null
          trangThaiLoi?: string | null
          phanHoiCuaClient?: string | null
          ngayBaoCao?: string | null
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
          maDuAn: number
          maNguoiTao: string
          maDuAnHienThi: string
          tieuDe: string | null
          moTa: string | null
          loaiDuAn: string
          cauHoiKhaoSat: Json | null
          nganSach: number
          yeuCauMoiTruong: Json | null
          phamViTest: Json | null
          huongDanTruyCap: string | null
          huongDanKyThuat: string | null
          taiLieuDinhKem: Json | null
          cauHinhThanhToan: Json | null
          soLuongCanTuyen: number
          thoiHanNopBai: string | null
          thoiHanDuAn: string | null
          trangThaiDuAn: string
          ngayTao: string
        }
        Insert: {
          maDuAn?: number
          maNguoiTao: string
          maDuAnHienThi: string
          tieuDe?: string | null
          moTa?: string | null
          loaiDuAn: string
          cauHoiKhaoSat?: Json | null
          nganSach: number
          yeuCauMoiTruong?: Json | null
          phamViTest?: Json | null
          huongDanTruyCap?: string | null
          huongDanKyThuat?: string | null
          taiLieuDinhKem?: Json | null
          cauHinhThanhToan?: Json | null
          soLuongCanTuyen?: number
          thoiHanNopBai?: string | null
          thoiHanDuAn?: string | null
          trangThaiDuAn?: string
          ngayTao?: string
        }
        Update: {
          maDuAn?: number
          maNguoiTao?: string
          maDuAnHienThi?: string
          tieuDe?: string | null
          moTa?: string | null
          loaiDuAn?: string
          cauHoiKhaoSat?: Json | null
          nganSach?: number
          yeuCauMoiTruong?: Json | null
          phamViTest?: Json | null
          huongDanTruyCap?: string | null
          huongDanKyThuat?: string | null
          taiLieuDinhKem?: Json | null
          cauHinhThanhToan?: Json | null
          soLuongCanTuyen?: number
          thoiHanNopBai?: string | null
          thoiHanDuAn?: string | null
          trangThaiDuAn?: string
          ngayTao?: string
        }
        Relationships: [
          {
            foreignKeyName: 'DuAn_maNguoiTao_fkey'
            columns: ['maNguoiTao']
            isOneToOne: false
            referencedRelation: 'NguoiDung'
            referencedColumns: ['maNguoiDung']
          }
        ]
      }
      HoSoClient: {
        Row: {
          maNguoiDung: string
          tenCongTy: string
          maSoThue: string
          website: string
          quyMoCongTy: string
          linhVucHoatDong: string
          viTriCongViec: string
          soDienThoai: string | null
        }
        Insert: {
          maNguoiDung: string
          tenCongTy: string
          maSoThue: string
          website: string
          quyMoCongTy: string
          linhVucHoatDong: string
          viTriCongViec: string
          soDienThoai?: string | null
        }
        Update: {
          maNguoiDung?: string
          tenCongTy?: string
          maSoThue?: string
          website?: string
          quyMoCongTy?: string
          linhVucHoatDong?: string
          viTriCongViec?: string
          soDienThoai?: string | null
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
          maNguoiDung: string
          soNamKinhNghiem: number
          ngonNguChinh: string | null
          ngonNguKhac: Json | null
          thongTinThietBi: Json | null
          thongTinKiemThu: Json | null
        }
        Insert: {
          maNguoiDung: string
          soNamKinhNghiem: number
          ngonNguChinh?: string | null
          ngonNguKhac?: Json | null
          thongTinThietBi?: Json | null
          thongTinKiemThu?: Json | null
        }
        Update: {
          maNguoiDung?: string
          soNamKinhNghiem?: number
          ngonNguChinh?: string | null
          ngonNguKhac?: Json | null
          thongTinThietBi?: Json | null
          thongTinKiemThu?: Json | null
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
          maYeuCau: number
          maNguoiGui: string | null
          tieuDe: string | null
          noiDung: string | null
          fileDinhKem: Json | null
          trangThaiHoTro: string | null
          phanHoiAdmin: string | null
          ngayGui: string | null
        }
        Insert: {
          maYeuCau?: number
          maNguoiGui?: string | null
          tieuDe?: string | null
          noiDung?: string | null
          fileDinhKem?: Json | null
          trangThaiHoTro?: string | null
          phanHoiAdmin?: string | null
          ngayGui?: string | null
        }
        Update: {
          maYeuCau?: number
          maNguoiGui?: string | null
          tieuDe?: string | null
          noiDung?: string | null
          fileDinhKem?: Json | null
          trangThaiHoTro?: string | null
          phanHoiAdmin?: string | null
          ngayGui?: string | null
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
      KenhChat: {
        Row: {
          maKenh: number
          maDuAn: number | null
          tenKenh: string | null
          loaiKenh: string | null
        }
        Insert: {
          maKenh?: number
          maDuAn?: number | null
          tenKenh?: string | null
          loaiKenh?: string | null
        }
        Update: {
          maKenh?: number
          maDuAn?: number | null
          tenKenh?: string | null
          loaiKenh?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'KenhChat_maDuAn_fkey'
            columns: ['maDuAn']
            isOneToOne: false
            referencedRelation: 'DuAn'
            referencedColumns: ['maDuAn']
          }
        ]
      }
      KetQuaKiemThu: {
        Row: {
          maKetQua: number
          maKichBan: number
          maNguoiThucHien: string
          thietBiSuDung: Json | null
          ketQuaTungBuoc: Json | null
          trangThaiChung: string | null
          ketQuaThucTeChung: string | null
          maBaoCaoLoiLienQuan: string | null
          lyDoBiChan: string | null
          lyDoBoQua: string | null
          thongTinBoSung: Json | null
          fileBangChung: Json | null
          trangThaiDuyet: string | null
          phanHoiCuaClient: Json | null
          ngayThucHien: string | null
        }
        Insert: {
          maKetQua?: number
          maKichBan: number
          maNguoiThucHien: string
          thietBiSuDung?: Json | null
          ketQuaTungBuoc?: Json | null
          trangThaiChung?: string | null
          ketQuaThucTeChung?: string | null
          maBaoCaoLoiLienQuan?: string | null
          lyDoBiChan?: string | null
          lyDoBoQua?: string | null
          thongTinBoSung?: Json | null
          fileBangChung?: Json | null
          trangThaiDuyet?: string | null
          phanHoiCuaClient?: Json | null
          ngayThucHien?: string | null
        }
        Update: {
          maKetQua?: number
          maKichBan?: number
          maNguoiThucHien?: string
          thietBiSuDung?: Json | null
          ketQuaTungBuoc?: Json | null
          trangThaiChung?: string | null
          ketQuaThucTeChung?: string | null
          maBaoCaoLoiLienQuan?: string | null
          lyDoBiChan?: string | null
          lyDoBoQua?: string | null
          thongTinBoSung?: Json | null
          fileBangChung?: Json | null
          trangThaiDuyet?: string | null
          phanHoiCuaClient?: Json | null
          ngayThucHien?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'KetQuaKiemThu_maKichBan_fkey'
            columns: ['maKichBan']
            isOneToOne: false
            referencedRelation: 'KichBanKiemThu'
            referencedColumns: ['maKichBan']
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
      KichBanKiemThu: {
        Row: {
          maKichBan: number
          maDuAn: number
          maKichBanHienThi: string
          tieuDe: string
          dieuKienTienQuyet: string | null
          huongDanDacBiet: Json | null
          cacBuocThucHien: Json
          cauHoiBoSung: Json
          yeuCauBangChung: string | null
          ngayTao: string
        }
        Insert: {
          maKichBan?: number
          maDuAn: number
          maKichBanHienThi: string
          tieuDe: string
          dieuKienTienQuyet?: string | null
          huongDanDacBiet?: Json | null
          cacBuocThucHien: Json
          cauHoiBoSung: Json
          yeuCauBangChung?: string | null
          ngayTao?: string
        }
        Update: {
          maKichBan?: number
          maDuAn?: number
          maKichBanHienThi?: string
          tieuDe?: string
          dieuKienTienQuyet?: string | null
          huongDanDacBiet?: Json | null
          cacBuocThucHien?: Json
          cauHoiBoSung?: Json
          yeuCauBangChung?: string | null
          ngayTao?: string
        }
        Relationships: [
          {
            foreignKeyName: 'KichBanKiemThu_maDuAn_fkey'
            columns: ['maDuAn']
            isOneToOne: false
            referencedRelation: 'DuAn'
            referencedColumns: ['maDuAn']
          }
        ]
      }
      NguoiDung: {
        Row: {
          maNguoiDung: string
          email: string
          hoTen: string
          anhDaiDien: string | null
          vaiTro: string
          gioiTinh: string
          ngaySinh: string
          diaChi: Json | null
          gioiThieu: string | null
          linkLinkedIn: string | null
          ngayTao: string | null
          thongTinThanhToan: Json | null
        }
        Insert: {
          maNguoiDung: string
          email: string
          hoTen: string
          anhDaiDien?: string | null
          vaiTro: string
          gioiTinh: string
          ngaySinh: string
          diaChi?: Json | null
          gioiThieu?: string | null
          linkLinkedIn?: string | null
          ngayTao?: string | null
          thongTinThanhToan?: Json | null
        }
        Update: {
          maNguoiDung?: string
          email?: string
          hoTen?: string
          anhDaiDien?: string | null
          vaiTro?: string
          gioiTinh?: string
          ngaySinh?: string
          diaChi?: Json | null
          gioiThieu?: string | null
          linkLinkedIn?: string | null
          ngayTao?: string | null
          thongTinThanhToan?: Json | null
        }
        Relationships: []
      }
      ThanhToan: {
        Row: {
          maGiaoDich: number
          maDuAn: number | null
          maNguoiNhan: string | null
          soTien: number | null
          moTaGiaoDich: string | null
          trangThaiThanhToan: string | null
          ngayGiaoDich: string | null
        }
        Insert: {
          maGiaoDich?: number
          maDuAn?: number | null
          maNguoiNhan?: string | null
          soTien?: number | null
          moTaGiaoDich?: string | null
          trangThaiThanhToan?: string | null
          ngayGiaoDich?: string | null
        }
        Update: {
          maGiaoDich?: number
          maDuAn?: number | null
          maNguoiNhan?: string | null
          soTien?: number | null
          moTaGiaoDich?: string | null
          trangThaiThanhToan?: string | null
          ngayGiaoDich?: string | null
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
          maTinNhan: number
          maKenh: number | null
          maNguoiGui: string | null
          noiDung: string | null
          fileDinhKem: string | null
          thoiGianGui: string | null
        }
        Insert: {
          maTinNhan?: number
          maKenh?: number | null
          maNguoiGui?: string | null
          noiDung?: string | null
          fileDinhKem?: string | null
          thoiGianGui?: string | null
        }
        Update: {
          maTinNhan?: number
          maKenh?: number | null
          maNguoiGui?: string | null
          noiDung?: string | null
          fileDinhKem?: string | null
          thoiGianGui?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'TinNhan_maKenh_fkey'
            columns: ['maKenh']
            isOneToOne: false
            referencedRelation: 'KenhChat'
            referencedColumns: ['maKenh']
          },
          {
            foreignKeyName: 'TinNhan_maNguoiGui_fkey'
            columns: ['maNguoiGui']
            isOneToOne: false
            referencedRelation: 'NguoiDung'
            referencedColumns: ['maNguoiDung']
          }
        ]
      }
      UngTuyen: {
        Row: {
          maUngTuyen: number
          maDuAn: number
          maUngVien: string
          traLoiKhaoSat: Json | null
          trangThaiUngTuyen: string
          ngayUngTuyen: string | null
        }
        Insert: {
          maUngTuyen?: number
          maDuAn: number
          maUngVien: string
          traLoiKhaoSat?: Json | null
          trangThaiUngTuyen: string
          ngayUngTuyen?: string | null
        }
        Update: {
          maUngTuyen?: number
          maDuAn?: number
          maUngVien?: string
          traLoiKhaoSat?: Json | null
          trangThaiUngTuyen?: string
          ngayUngTuyen?: string | null
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
