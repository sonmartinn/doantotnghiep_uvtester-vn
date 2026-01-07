export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5'
  }
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
      CauHinhTesterDuAn: {
        Row: {
          maDuAn: number
          maNguoiDung: string
          thietBiDuocChon: Json | null
        }
        Insert: {
          maDuAn: number
          maNguoiDung: string
          thietBiDuocChon?: Json | null
        }
        Update: {
          maDuAn?: number
          maNguoiDung?: string
          thietBiDuocChon?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'CauHinhTesterDuAn_maDuAn_fkey'
            columns: ['maDuAn']
            isOneToOne: false
            referencedRelation: 'DuAn'
            referencedColumns: ['maDuAn']
          },
          {
            foreignKeyName: 'CauHinhTesterDuAn_maNguoiDung_fkey'
            columns: ['maNguoiDung']
            isOneToOne: false
            referencedRelation: 'NguoiDung'
            referencedColumns: ['maNguoiDung']
          }
        ]
      }
      DuAn: {
        Row: {
          cauHinhThanhToan: Json | null
          cauHoiKhaoSat: Json | null
          huongDanKyThuat: string | null
          huongDanTruyCap: string | null
          loaiDuAn: string
          maDuAn: number
          maDuAnHienThi: string
          maNguoiTao: string
          moTa: string | null
          nganSach: number
          ngayTao: string
          phamViTest: Json | null
          soLuongCanTuyen: number
          taiLieuDinhKem: Json | null
          thoiHanDuAn: string | null
          thoiHanUngTuyen: string | null
          tieuDe: string | null
          trangThaiDuAn: string
          yeuCauMoiTruong: Json | null
        }
        Insert: {
          cauHinhThanhToan?: Json | null
          cauHoiKhaoSat?: Json | null
          huongDanKyThuat?: string | null
          huongDanTruyCap?: string | null
          loaiDuAn: string
          maDuAn?: number
          maDuAnHienThi: string
          maNguoiTao: string
          moTa?: string | null
          nganSach: number
          ngayTao?: string
          phamViTest?: Json | null
          soLuongCanTuyen?: number
          taiLieuDinhKem?: Json | null
          thoiHanDuAn?: string | null
          thoiHanUngTuyen?: string | null
          tieuDe?: string | null
          trangThaiDuAn?: string
          yeuCauMoiTruong?: Json | null
        }
        Update: {
          cauHinhThanhToan?: Json | null
          cauHoiKhaoSat?: Json | null
          huongDanKyThuat?: string | null
          huongDanTruyCap?: string | null
          loaiDuAn?: string
          maDuAn?: number
          maDuAnHienThi?: string
          maNguoiTao?: string
          moTa?: string | null
          nganSach?: number
          ngayTao?: string
          phamViTest?: Json | null
          soLuongCanTuyen?: number
          taiLieuDinhKem?: Json | null
          thoiHanDuAn?: string | null
          thoiHanUngTuyen?: string | null
          tieuDe?: string | null
          trangThaiDuAn?: string
          yeuCauMoiTruong?: Json | null
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
          linhVucHoatDong: string
          maNguoiDung: string
          maSoThue: string
          quyMoCongTy: string
          soDienThoai: string | null
          tenCongTy: string
          viTriCongViec: string
          website: string
        }
        Insert: {
          linhVucHoatDong: string
          maNguoiDung: string
          maSoThue: string
          quyMoCongTy: string
          soDienThoai?: string | null
          tenCongTy: string
          viTriCongViec: string
          website: string
        }
        Update: {
          linhVucHoatDong?: string
          maNguoiDung?: string
          maSoThue?: string
          quyMoCongTy?: string
          soDienThoai?: string | null
          tenCongTy?: string
          viTriCongViec?: string
          website?: string
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
          ngonNguChinh: string | null
          ngonNguKhac: Json | null
          soNamKinhNghiem: number
          thongTinKiemThu: Json | null
          thongTinThietBi: Json | null
        }
        Insert: {
          maNguoiDung: string
          ngonNguChinh?: string | null
          ngonNguKhac?: Json | null
          soNamKinhNghiem: number
          thongTinKiemThu?: Json | null
          thongTinThietBi?: Json | null
        }
        Update: {
          maNguoiDung?: string
          ngonNguChinh?: string | null
          ngonNguKhac?: Json | null
          soNamKinhNghiem?: number
          thongTinKiemThu?: Json | null
          thongTinThietBi?: Json | null
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
      KenhChat: {
        Row: {
          loaiKenh: string | null
          maDuAn: number | null
          maKenh: number
          tenKenh: string | null
        }
        Insert: {
          loaiKenh?: string | null
          maDuAn?: number | null
          maKenh?: number
          tenKenh?: string | null
        }
        Update: {
          loaiKenh?: string | null
          maDuAn?: number | null
          maKenh?: number
          tenKenh?: string | null
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
          fileBangChung: Json | null
          ketQuaMongDoi: string | null
          ketQuaThucTeChung: string | null
          ketQuaTungBuoc: Json | null
          lyDoBiChan: string | null
          lyDoBoQua: string | null
          maBaoCaoLoiLienQuan: string | null
          maKetQua: number
          maKichBan: number
          maNguoiThucHien: string
          ngayThucHien: string | null
          phanHoiCuaClient: Json | null
          thietBiSuDung: Json | null
          thongTinBoSung: Json | null
          trangThaiChung: string | null
          trangThaiDuyet: string | null
        }
        Insert: {
          fileBangChung?: Json | null
          ketQuaMongDoi?: string | null
          ketQuaThucTeChung?: string | null
          ketQuaTungBuoc?: Json | null
          lyDoBiChan?: string | null
          lyDoBoQua?: string | null
          maBaoCaoLoiLienQuan?: string | null
          maKetQua?: number
          maKichBan: number
          maNguoiThucHien: string
          ngayThucHien?: string | null
          phanHoiCuaClient?: Json | null
          thietBiSuDung?: Json | null
          thongTinBoSung?: Json | null
          trangThaiChung?: string | null
          trangThaiDuyet?: string | null
        }
        Update: {
          fileBangChung?: Json | null
          ketQuaMongDoi?: string | null
          ketQuaThucTeChung?: string | null
          ketQuaTungBuoc?: Json | null
          lyDoBiChan?: string | null
          lyDoBoQua?: string | null
          maBaoCaoLoiLienQuan?: string | null
          maKetQua?: number
          maKichBan?: number
          maNguoiThucHien?: string
          ngayThucHien?: string | null
          phanHoiCuaClient?: Json | null
          thietBiSuDung?: Json | null
          thongTinBoSung?: Json | null
          trangThaiChung?: string | null
          trangThaiDuyet?: string | null
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
          cacBuocThucHien: Json
          cauHoiBoSung: Json
          dieuKienTienQuyet: string | null
          huongDanDacBiet: Json | null
          maDuAn: number
          maKichBan: number
          maKichBanHienThi: string
          ngayTao: string
          tieuDe: string
          yeuCauBangChung: string | null
        }
        Insert: {
          cacBuocThucHien: Json
          cauHoiBoSung: Json
          dieuKienTienQuyet?: string | null
          huongDanDacBiet?: Json | null
          maDuAn: number
          maKichBan?: number
          maKichBanHienThi: string
          ngayTao?: string
          tieuDe: string
          yeuCauBangChung?: string | null
        }
        Update: {
          cacBuocThucHien?: Json
          cauHoiBoSung?: Json
          dieuKienTienQuyet?: string | null
          huongDanDacBiet?: Json | null
          maDuAn?: number
          maKichBan?: number
          maKichBanHienThi?: string
          ngayTao?: string
          tieuDe?: string
          yeuCauBangChung?: string | null
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
          anhDaiDien: string | null
          diaChi: Json | null
          email: string
          gioiThieu: string | null
          gioiTinh: string
          hoTen: string
          linkLinkedIn: string | null
          maNguoiDung: string
          ngaySinh: string
          ngayTao: string | null
          thongTinThanhToan: Json | null
          vaiTro: string
        }
        Insert: {
          anhDaiDien?: string | null
          diaChi?: Json | null
          email: string
          gioiThieu?: string | null
          gioiTinh: string
          hoTen: string
          linkLinkedIn?: string | null
          maNguoiDung: string
          ngaySinh: string
          ngayTao?: string | null
          thongTinThanhToan?: Json | null
          vaiTro: string
        }
        Update: {
          anhDaiDien?: string | null
          diaChi?: Json | null
          email?: string
          gioiThieu?: string | null
          gioiTinh?: string
          hoTen?: string
          linkLinkedIn?: string | null
          maNguoiDung?: string
          ngaySinh?: string
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
          fileDinhKem: string | null
          maKenh: number | null
          maNguoiGui: string | null
          maTinNhan: number
          noiDung: string | null
          thoiGianGui: string | null
        }
        Insert: {
          fileDinhKem?: string | null
          maKenh?: number | null
          maNguoiGui?: string | null
          maTinNhan?: number
          noiDung?: string | null
          thoiGianGui?: string | null
        }
        Update: {
          fileDinhKem?: string | null
          maKenh?: number | null
          maNguoiGui?: string | null
          maTinNhan?: number
          noiDung?: string | null
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
          maDuAn: number
          maUngTuyen: number
          maUngVien: string
          ngayUngTuyen: string | null
          traLoiKhaoSat: Json | null
          trangThaiUngTuyen: string
        }
        Insert: {
          maDuAn: number
          maUngTuyen?: number
          maUngVien: string
          ngayUngTuyen?: string | null
          traLoiKhaoSat?: Json | null
          trangThaiUngTuyen?: string
        }
        Update: {
          maDuAn?: number
          maUngTuyen?: number
          maUngVien?: string
          ngayUngTuyen?: string | null
          traLoiKhaoSat?: Json | null
          trangThaiUngTuyen?: string
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
      handle_project_status_transitions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']] extends {
        Tables: infer T
        Views: infer V
      }
        ? T & V
        : never)
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']] extends {
      Tables: infer T
      Views: infer V
    }
    ? TableName extends keyof (T & V)
      ? (T & V)[TableName] extends {
          Row: infer R
        }
        ? R
        : never
      : never
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']] extends {
        Tables: infer T
      }
        ? T
        : never)
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']] extends { Tables: infer T }
    ? TableName extends keyof T
      ? T[TableName] extends {
          Insert: infer I
        }
        ? I
        : never
      : never
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']] extends {
        Tables: infer T
      }
        ? T
        : never)
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']] extends { Tables: infer T }
    ? TableName extends keyof T
      ? T[TableName] extends {
          Update: infer U
        }
        ? U
        : never
      : never
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicEnumNameOrOptions['schema']] extends {
        Enums: infer E
      }
        ? E
        : never)
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']] extends { Enums: infer E }
    ? EnumName extends keyof E
      ? E[EnumName]
      : never
    : never
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[PublicCompositeTypeNameOrOptions['schema']] extends {
        CompositeTypes: infer C
      }
        ? C
        : never)
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']] extends {
      CompositeTypes: infer C
    }
    ? CompositeTypeName extends keyof C
      ? C[CompositeTypeName]
      : never
    : never
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
