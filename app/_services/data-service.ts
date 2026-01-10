import { supabase } from '@/lib/supabase/client'
import { Database } from './database-types'
import { SupabaseClient, User } from '@supabase/supabase-js'

// Define types for our tables
export type NguoiDung = Database['public']['Tables']['NguoiDung']['Row']
export type HoSoTester = Database['public']['Tables']['HoSoTester']['Row']
export type HoSoClient = Database['public']['Tables']['HoSoClient']['Row']
export type DuAn = Database['public']['Tables']['DuAn']['Row']
export type DuAnInsert = Database['public']['Tables']['DuAn']['Insert']
export type CauHinhTesterDuAn =
  Database['public']['Tables']['CauHinhTesterDuAn']['Row']
export type BaoCaoLoi = Database['public']['Tables']['BaoCaoLoi']['Row']

/* =========================================================
   AUTH HELPERS
   ========================================================= */

// Lấy user đang đăng nhập
export async function getAuthUser(
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<User | null> {
  const { data, error } = await supabaseClient.auth.getUser()
  if (error) {
    console.error('getAuthUser error:', error)
    return null
  }
  return data?.user || null
}

/* =========================================================
   NguoiDung (profile cơ bản)
   ========================================================= */

export async function getNguoiDung(
  maNguoiDung: string,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<NguoiDung | null> {
  const { data, error } = await supabaseClient
    .from('NguoiDung')
    .select('*')
    .eq('maNguoiDung', maNguoiDung)
    .maybeSingle()

  if (error) {
    console.error('getNguoiDung error:', error)
    return null
  }

  return data
}

export async function ensureNguoiDungExists(
  user: User,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<NguoiDung | null> {
  // 1. Check if user already exists
  const existingUser = await getNguoiDung(user.id, supabaseClient)
  if (existingUser) {
    return existingUser
  }

  // 2. If not, insert with defaults
  const { data, error } = await supabaseClient
    .from('NguoiDung')
    .insert({
      maNguoiDung: user.id,
      email: user.email!,
      vaiTro: user.user_metadata?.role || 'tester',
      hoTen:
        user.user_metadata?.hoTen ||
        user.email?.split('@')[0] ||
        'Người dùng mới',
      // Default values for new users only
      gioiTinh: 'Khác',
      ngaySinh: '1990-01-01',
      diaChi: {}
    })
    .select()
    .single()

  if (error) {
    console.error('ensureNguoiDungExists create error:', error)
    return null
  }

  return data
}

// Update NguoiDung (họ tên, avatar…)
export async function updateNguoiDung(
  maNguoiDung: string,
  fields: Partial<NguoiDung>,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<boolean> {
  const { data, error } = await supabaseClient
    .from('NguoiDung')
    .update(fields)
    .eq('maNguoiDung', maNguoiDung)
    .select()

  if (error) {
    console.error('updateNguoiDung error:', error)
    return false
  }

  if (!data || data.length === 0) {
    console.warn('updateNguoiDung: No rows updated! Check RLS or ID.', {
      maNguoiDung
    })
    return false
  }

  return true
}

/* =========================================================
   HoSoTester
   ========================================================= */

export async function getHoSoTester(
  maNguoiDung: string,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<HoSoTester | null> {
  const { data, error } = await supabaseClient
    .from('HoSoTester')
    .select('*')
    .eq('maNguoiDung', maNguoiDung)
    .maybeSingle()

  if (error) {
    console.error('getHoSoTester error:', error)
    return null
  }

  return data
}

export async function upsertHoSoTester(
  maNguoiDung: string,
  fields: Partial<HoSoTester>,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<boolean> {
  // @ts-ignore: Partial fields might miss required columns for INSERT, but we trust logic or it's an update
  const { error } = await supabaseClient.from('HoSoTester').upsert(
    {
      maNguoiDung,
      ...fields
    } as any,
    { onConflict: 'maNguoiDung' }
  )

  if (error) {
    console.error('upsertHoSoTester error:', error)
    return false
  }

  return true
}

/* =========================================================
   HoSoClient
   ========================================================= */

export async function getHoSoClient(
  maNguoiDung: string,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<HoSoClient | null> {
  const { data, error } = await supabaseClient
    .from('HoSoClient')
    .select('*')
    .eq('maNguoiDung', maNguoiDung)
    .maybeSingle()

  if (error) {
    console.error('getHoSoClient error:', error)
    return null
  }

  return data
}

export async function upsertHoSoClient(
  maNguoiDung: string,
  fields: Partial<HoSoClient>,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<boolean> {
  // @ts-ignore: Partial fields might miss required columns for INSERT
  const { error } = await supabaseClient.from('HoSoClient').upsert(
    {
      maNguoiDung,
      ...fields
    } as any,
    { onConflict: 'maNguoiDung' }
  )

  if (error) {
    console.error('upsertHoSoClient error:', error)
    return false
  }

  return true
}

/* =========================================================
   COMBINED USER LOADER (Auth + NguoiDung + HoSo)
   ========================================================= */

export type FullUser = {
  user: User | null
  nguoiDung: NguoiDung | null
  hoSo: HoSoTester | HoSoClient | null
}

// Hàm tiện lợi cho Navbar & Dashboard – load FULL profile
export async function getFullUser(
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<FullUser> {
  const user = await getAuthUser(supabaseClient)
  if (!user) return { user: null, nguoiDung: null, hoSo: null }

  const nguoiDung = await ensureNguoiDungExists(user, supabaseClient)

  let hoSo: HoSoTester | HoSoClient | null = null
  if (nguoiDung?.vaiTro === 'tester') {
    hoSo = await getHoSoTester(user.id, supabaseClient)
  } else if (nguoiDung?.vaiTro === 'client') {
    hoSo = await getHoSoClient(user.id, supabaseClient)
  }

  return { user, nguoiDung, hoSo }
}

/* =========================================================
   HELPERS
   ========================================================= */

type CompletionResult = {
  percent: number
  missing: string[]
}

export function checkProfileCompletion(
  nguoiDung: NguoiDung | null,
  hoSo: HoSoTester | HoSoClient | null
): CompletionResult {
  if (!nguoiDung) return { percent: 0, missing: ['Hồ sơ chưa tồn tại'] }

  let score = 0
  let total = 0
  const missing: string[] = []

  // Các trường cơ bản (NguoiDung)
  const basicFields = [
    { key: 'hoTen', label: 'Họ tên', weight: 5 },
    { key: 'gioiTinh', label: 'Giới tính', weight: 5 },
    { key: 'ngaySinh', label: 'Ngày sinh', weight: 5 },
    { key: 'diaChi', label: 'Địa chỉ', weight: 5 },
    { key: 'gioiThieu', label: 'Giới thiệu', weight: 5 },
    { key: 'thongTinThanhToan', label: 'Thông tin thanh toán', weight: 5 }
  ]

  // Check basic fields
  basicFields.forEach(field => {
    total += field.weight
    // @ts-ignore
    const value = nguoiDung[field.key as keyof NguoiDung]
    if (value && (typeof value === 'string' ? value.length > 0 : true)) {
      score += field.weight
    } else {
      missing.push(field.label)
    }
  })

  // Các trường riêng cho Tester (HoSoTester)
  if (nguoiDung.vaiTro === 'tester') {
    const testerFields = [
      { key: 'soNamKinhNghiem', label: 'Số năm kinh nghiệm', weight: 15 },
      { key: 'ngonNguChinh', label: 'Ngôn ngữ', weight: 15 },
      { key: 'thongTinThietBi', label: 'Thiết bị', weight: 15 },
      { key: 'thongTinKiemThu', label: 'Thông tin kiểm thử', weight: 15 }
    ]

    testerFields.forEach(field => {
      total += field.weight
      // @ts-ignore
      const value = hoSo
        ? (hoSo as HoSoTester)[field.key as keyof HoSoTester]
        : null
      if (value && (typeof value === 'string' ? value.length > 0 : true)) {
        score += field.weight
      } else {
        missing.push(field.label)
      }
    })
  }

  // Các trường riêng cho Client (HoSoClient)
  else if (nguoiDung.vaiTro === 'client') {
    const clientFields = [
      { key: 'tenCongTy', label: 'Tên công ty', weight: 15 },
      { key: 'soDienThoai', label: 'Số điện thoại liên hệ', weight: 15 },
      { key: 'linhVucHoatDong', label: 'Lĩnh vực hoạt động', weight: 15 },
      { key: 'maSoThue', label: 'Mã số thuế', weight: 15 }
    ]

    clientFields.forEach(field => {
      total += field.weight
      // @ts-ignore
      const value = hoSo
        ? (hoSo as HoSoClient)[field.key as keyof HoSoClient]
        : null
      if (value && (typeof value === 'string' ? value.length > 0 : true)) {
        score += field.weight
      } else {
        missing.push(field.label)
      }
    })
  }

  // Chuẩn hóa về thang 100%
  const percent = total === 0 ? 0 : Math.round((score / total) * 100)

  return { percent, missing }
}

/* =========================================================
   DuAn (Projects)
   ========================================================= */

export async function createDuAn(
  projectData: DuAnInsert,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<DuAn | null> {
  const { data, error } = await supabaseClient
    .from('DuAn')
    .insert(projectData)
    .select()
    .single()

  if (error) {
    console.error('createDuAn error:', error)
    return null
  }
  return data
}

export async function updateDuAn(
  maDuAn: number,
  fields: Partial<DuAn>,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<boolean> {
  const { data, error } = await supabaseClient
    .from('DuAn')
    .update(fields)
    .eq('maDuAn', maDuAn)
    .select()

  if (error) {
    console.error('updateDuAn error:', error)
    return false
  }

  if (!data || data.length === 0) {
    console.error(
      'updateDuAn: No rows updated. Possibly RLS blocking or invalid ID.',
      {
        maDuAn
      }
    )
    return false
  }

  return true
}

export async function getDuAn(
  maDuAn: number,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<DuAn | null> {
  const { data, error } = await supabaseClient
    .from('DuAn')
    .select('*')
    .eq('maDuAn', maDuAn)
    .maybeSingle()

  if (error) {
    console.error('getDuAn error:', error)
    return null
  }

  return data
}

/* =========================================================
   KichBanKiemThu (Test Cases)
   ========================================================= */

export type KichBanInsert =
  Database['public']['Tables']['KichBanKiemThu']['Insert']
export type KichBan = Database['public']['Tables']['KichBanKiemThu']['Row']

export async function getKichBanByDuAn(
  maDuAn: number,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<KichBan[]> {
  const { data, error } = await supabaseClient
    .from('KichBanKiemThu')
    .select('*')
    .eq('maDuAn', maDuAn)
    .order('soThuTu', { ascending: true })
    .order('maKichBan', { ascending: true })

  if (error) {
    console.error('getKichBanByDuAn error:', error)
    return []
  }
  return data
}

export async function getTestCaseCount(
  maDuAn: number,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<number> {
  const { count, error } = await supabaseClient
    .from('KichBanKiemThu')
    .select('*', { count: 'exact', head: true })
    .eq('maDuAn', maDuAn)

  if (error) {
    console.error('getTestCaseCount error:', error)
    return 0
  }
  return count || 0
}

export async function createKichBan(
  kichBanData: KichBanInsert,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<KichBan | null> {
  const { data, error } = await supabaseClient
    .from('KichBanKiemThu')
    .insert(kichBanData)
    .select()
    .single()

  if (error) {
    console.error('createKichBan error:', error)
    return null
  }
  return data
}

export async function deleteKichBan(
  maKichBan: number,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<boolean> {
  const { error } = await supabaseClient
    .from('KichBanKiemThu')
    .delete()
    .eq('maKichBan', maKichBan)

  if (error) {
    console.error('deleteKichBan error:', error)
    return false
  }
  return true
}

export async function updateKichBanOrder(
  items: {
    maKichBan: number
    soThuTu: number
    maKichBanHienThi?: string
    maDuAn: number
  }[],
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<boolean> {
  const { error } = await supabaseClient.from('KichBanKiemThu').upsert(
    items.map(item => ({
      maKichBan: item.maKichBan,
      soThuTu: item.soThuTu,
      maDuAn: item.maDuAn, // Required for RLS
      ...(item.maKichBanHienThi
        ? { maKichBanHienThi: item.maKichBanHienThi }
        : {})
    })) as any, // Cast to any to avoid type errors with missing required fields (we only update subset)
    { onConflict: 'maKichBan' }
  )

  if (error) {
    console.error('updateKichBanOrder error:', error)
    return false
  }
  return true
}

export async function updateKichBan(
  maKichBan: number,
  fields: Partial<KichBan>,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<boolean> {
  const { error } = await supabaseClient
    .from('KichBanKiemThu')
    .update(fields)
    .eq('maKichBan', maKichBan)

  if (error) {
    console.error('updateKichBan error:', error)
    return false
  }
  return true
}

export async function getOpenProjects(
  query: string = '',
  filter?: { device?: string; sort?: string; type?: string },
  supabaseClient: SupabaseClient<Database> = supabase,
  excludeAppliedByUser?: string
): Promise<(DuAn & { soLuongUngVien: number })[]> {
  // 1. If excluding by user, fetch their applied project IDs first
  let excludedIds: number[] = []
  if (excludeAppliedByUser) {
    const { data: applications } = await supabaseClient
      .from('UngTuyen')
      .select('maDuAn')
      .eq('maUngVien', excludeAppliedByUser)

    if (applications) {
      excludedIds = applications.map(app => app.maDuAn)
    }
  }

  let dbQuery = supabaseClient
    .from('DuAn')
    .select('*, so_luong_da_duyet')
    .eq('trangThaiDuAn', 'DangTuyen')

  // Apply exclusion
  if (excludedIds.length > 0) {
    dbQuery = dbQuery.not('maDuAn', 'in', `(${excludedIds.join(',')})`)
  }

  // Search
  if (query) {
    dbQuery = dbQuery.ilike('tieuDe', `%${query}%`)
  }

  // Filter by Device
  if (filter?.device && filter.device !== 'all') {
    // Check if yeuCauMoiTruong->devices contains the selected device
    dbQuery = dbQuery.contains('yeuCauMoiTruong', {
      devices: [filter.device]
    })
  }

  // Filter by Type
  if (filter?.type && filter.type !== 'all') {
    dbQuery = dbQuery.eq('loaiDuAn', filter.type)
  }

  // Default Sort (if not price sort)
  if (!filter?.sort || filter.sort === 'latest') {
    dbQuery = dbQuery.order('ngayTao', { ascending: false })
  }

  const { data, error } = await dbQuery

  if (error) {
    console.error('getOpenProjects error:', error)
    return []
  }

  let projects = (data || []).map((item: any) => ({
    ...item,
    soLuongUngVien: item.so_luong_da_duyet || 0
  }))

  // In-memory Sort for Price (JSONB field)
  if (filter?.sort === 'price_asc') {
    projects.sort((a, b) => {
      const priceA = (a.cauHinhThanhToan as any)?.perCompletion || 0
      const priceB = (b.cauHinhThanhToan as any)?.perCompletion || 0
      return priceA - priceB
    })
  } else if (filter?.sort === 'price_desc') {
    projects.sort((a, b) => {
      const priceA = (a.cauHinhThanhToan as any)?.perCompletion || 0
      const priceB = (b.cauHinhThanhToan as any)?.perCompletion || 0
      return priceB - priceA
    })
  }

  return projects
}

export async function getProjectsByUser(
  userId: string,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<DuAn[]> {
  const { data, error } = await supabaseClient
    .from('DuAn')
    .select('*')
    .eq('maNguoiTao', userId)
    .order('ngayTao', { ascending: false })

  if (error) {
    console.error('getProjectsByUser error:', error)
    return []
  }
  return data
}

export async function importKichBan(
  targetProjectId: number,
  sourceKichBanIds: number[],
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<boolean> {
  // 1. Fetch source test cases
  const { data: sourceCases, error: fetchError } = await supabaseClient
    .from('KichBanKiemThu')
    .select('*')
    .in('maKichBan', sourceKichBanIds)

  if (fetchError || !sourceCases || sourceCases.length === 0) {
    console.error('importKichBan fetch error:', fetchError)
    return false
  }

  // 2. Fetch current test cases in target project to determine next ID and Order
  const { data: currentCases } = await supabaseClient
    .from('KichBanKiemThu')
    .select('maKichBan')
    .eq('maDuAn', targetProjectId)

  const currentCount = currentCases?.length || 0

  // 3. Prepare new items
  const newItems = sourceCases.map((item, index) => {
    const nextIndex = currentCount + index + 1
    // Filter out id/created_at fields by only picking what we want
    return {
      maDuAn: targetProjectId,
      maKichBanHienThi: `TC-${String(nextIndex).padStart(2, '0')}`,
      tieuDe: item.tieuDe,
      dieuKienTienQuyet: item.dieuKienTienQuyet,
      cacBuocThucHien: item.cacBuocThucHien,
      yeuCauBangChung: item.yeuCauBangChung,
      huongDanDacBiet: item.huongDanDacBiet,
      cauHoiBoSung: item.cauHoiBoSung,
      soThuTu: currentCount + index // Correct order logic
    }
  })

  // 4. Bulk Insert
  const { error: insertError } = await supabaseClient
    .from('KichBanKiemThu')
    .insert(newItems as any)

  if (insertError) {
    console.error('importKichBan insert error:', insertError)
    return false
  }

  return true
}

/* =========================================================
   Ung Tuyen (Applications)
   ========================================================= */

export type UngTuyen = Database['public']['Tables']['UngTuyen']['Row']

export async function getUngTuyenByDuAn(
  maDuAn: number,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<(UngTuyen & { UngVien: NguoiDung | null })[]> {
  const { data, error } = await supabaseClient
    .from('UngTuyen')
    .select('*, UngVien:NguoiDung(*)')
    .eq('maDuAn', maDuAn)

  if (error) {
    console.error('getUngTuyenByDuAn error:', error)
    return []
  }

  // @ts-ignore
  return data
}

export async function updateUngTuyenStatus(
  maUngTuyen: number,
  status: string,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<boolean> {
  const { error } = await supabaseClient
    .from('UngTuyen')
    .update({ trangThaiUngTuyen: status })
    .eq('maUngTuyen', maUngTuyen)

  if (error) {
    console.error('updateUngTuyenStatus error:', error)
    return false
  }
  return true
}

export async function getAppliedProjects(
  userId: string,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<(UngTuyen & { DuAn: DuAn | null })[]> {
  const { data, error } = await supabaseClient
    .from('UngTuyen')
    .select('*, DuAn:DuAn(*)')
    .eq('maUngVien', userId)
    .order('ngayUngTuyen', { ascending: false })

  if (error) {
    console.error('getAppliedProjects error:', error)
    return []
  }

  // @ts-ignore
  return data
}

export async function getUngTuyenByUserAndProject(
  userId: string,
  projectId: number,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<UngTuyen | null> {
  const { data, error } = await supabaseClient
    .from('UngTuyen')
    .select('*')
    .eq('maUngVien', userId)
    .eq('maDuAn', projectId)
    .maybeSingle()

  if (error) {
    console.error('getUngTuyenByUserAndProject error:', error)
    return null
  }
  return data
}

/* =========================================================
   KetQuaKiemThu (Test Results)
   ========================================================= */

export type KetQuaKiemThu = Database['public']['Tables']['KetQuaKiemThu']['Row']
export type KetQuaKiemThuInsert =
  Database['public']['Tables']['KetQuaKiemThu']['Insert']

export async function getKetQuaByDuAnAndUser(
  maDuAn: number,
  userId: string,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<KetQuaKiemThu[]> {
  // Join with KichBanKiemThu to filter by maDuAn
  const { data, error } = await supabaseClient
    .from('KetQuaKiemThu')
    .select('*, KichBanKiemThu!inner(maDuAn)')
    .eq('maNguoiThucHien', userId)
    .eq('KichBanKiemThu.maDuAn', maDuAn)

  if (error) {
    console.error('getKetQuaByDuAnAndUser error:', error)
    return []
  }

  // @ts-ignore
  return data
}

export async function upsertKetQuaKiemThu(
  resultData: KetQuaKiemThuInsert,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<KetQuaKiemThu | null> {
  const { data, error } = await supabaseClient
    .from('KetQuaKiemThu')
    .upsert(resultData, { onConflict: 'maKichBan, maNguoiThucHien' })
    .select()
    .single()

  if (error) {
    console.error('upsertKetQuaKiemThu error:', error)
    return null
  }
  return data
}

/* =========================================================
   CauHinhTesterDuAn (Tester Project Config)
   ========================================================= */

export async function getTesterProjectConfig(
  maDuAn: number,
  maNguoiDung: string,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<CauHinhTesterDuAn | null> {
  const { data, error } = await supabaseClient
    .from('CauHinhTesterDuAn')
    .select('*')
    .eq('maDuAn', maDuAn)
    .eq('maNguoiDung', maNguoiDung)
    .maybeSingle()

  if (error) {
    console.error('getTesterProjectConfig error:', error)
    return null
  }
  return data
}

export async function upsertTesterProjectConfig(
  maDuAn: number,
  maNguoiDung: string,
  config: { thietBiDuocChon?: any },
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<boolean> {
  const { error } = await supabaseClient.from('CauHinhTesterDuAn').upsert(
    {
      maDuAn,
      maNguoiDung,
      thietBiDuocChon: config.thietBiDuocChon
    },
    { onConflict: 'maDuAn, maNguoiDung' }
  )

  if (error) {
    console.error('upsertTesterProjectConfig error:', error)
    return false
  }
  return true
}

export async function getBugsByProjectId(
  projectId: number,
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<BaoCaoLoi[]> {
  const { data, error } = await supabaseClient
    .from('BaoCaoLoi')
    .select('*')
    .eq('maDuAn', projectId)
    .order('ngayBaoCao', { ascending: false })

  if (error) {
    console.error('getBugsByProjectId error:', error)
    return []
  }
  return data
}

/* =========================================================
   FIND TESTERS (For Client)
   ========================================================= */

export type TesterProfile = NguoiDung & {
  HoSoTester: HoSoTester | null
}

export async function getTesters(
  query: string = '',
  experience: string = 'all',
  supabaseClient: SupabaseClient<Database> = supabase
): Promise<TesterProfile[]> {
  let queryBuilder = supabaseClient
    .from('NguoiDung')
    .select('*, HoSoTester(*)')
    .eq('vaiTro', 'tester')

  if (query) {
    queryBuilder = queryBuilder.ilike('hoTen', `%${query}%`)
  }

  // Filter by experience is tricky because it's in the joined table
  // Supabase postgrest-js doesn't support deep filtering easily on joined tables with !inner unless we use .not.is('HoSoTester', null)
  // But let's try to filter in memory for now or use !inner if strict
  // For 'experience', we need to check HoSoTester.soNamKinhNghiem
  if (experience !== 'all') {
    // This requires HoSoTester to be NOT NULL and match criteria
    // We use !inner to enforce Inner Join behavior so we can filter on it
    queryBuilder = supabaseClient
      .from('NguoiDung')
      .select('*, HoSoTester!inner(*)')
      .eq('vaiTro', 'tester')

    const minYears = parseInt(experience)
    queryBuilder = queryBuilder.gte('HoSoTester.soNamKinhNghiem', minYears)

    if (query) {
      queryBuilder = queryBuilder.ilike('hoTen', `%${query}%`)
    }
  }

  const { data, error } = await queryBuilder

  if (error) {
    console.error('getTesters error:', error)
    return []
  }

  // Map to exclude those without HoSoTester if using left join (default)
  // If using !inner, they are already filtered
  return (data as TesterProfile[]) || []
}
