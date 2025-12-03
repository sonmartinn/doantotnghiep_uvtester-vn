import { supabase } from './supabase'
import { Database } from './database.types'
import { SupabaseClient, User } from '@supabase/supabase-js'

// Define types for our tables
export type NguoiDung = Database['public']['Tables']['NguoiDung']['Row']
export type HoSoTester = Database['public']['Tables']['HoSoTester']['Row']
export type HoSoClient = Database['public']['Tables']['HoSoClient']['Row']

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
  const exists = await getNguoiDung(user.id, supabaseClient)

  if (exists) return exists

  const { data, error } = await supabaseClient
    .from('NguoiDung')
    .insert({
      maNguoiDung: user.id,
      email: user.email!,
      vaiTro: user.user_metadata?.role || 'tester',
      hoTen:
        user.user_metadata?.hoTen ||
        user.email?.split('@')[0] ||
        'Người dùng mới'
    })
    .select()
    .single()

  if (error) {
    console.error('ensureNguoiDungExists error:', error)
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
  const { error } = await supabaseClient
    .from('NguoiDung')
    .update(fields)
    .eq('maNguoiDung', maNguoiDung)

  if (error) {
    console.error('updateNguoiDung error:', error)
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
  const { error } = await supabaseClient.from('HoSoTester').upsert(
    {
      maNguoiDung,
      ...fields
    },
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
  const { error } = await supabaseClient.from('HoSoClient').upsert(
    {
      maNguoiDung,
      ...fields
    },
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
  nguoiDung: NguoiDung | null
): CompletionResult {
  if (!nguoiDung) return { percent: 0, missing: ['Hồ sơ chưa tồn tại'] }

  let score = 0
  let total = 0
  const missing: string[] = []

  // Các trường cơ bản (chung cho cả Tester và Client)
  const basicFields = [
    { key: 'hoTen', label: 'Họ tên', weight: 20 },
    { key: 'diaChi', label: 'Địa chỉ khu vực bạn sống', weight: 5 },
    { key: 'gioiThieu', label: 'Giới thiệu bản thân', weight: 20 },
    { key: 'thongTinThanhToan', label: 'Thông tin thanh toán', weight: 5 }
  ]

  // Các trường riêng cho Tester
  const testerFields = [
    { key: 'kyNang', label: 'Kỹ năng', weight: 25 },
    { key: 'kinhNghiem', label: 'Kinh nghiệm', weight: 25 }
  ]

  // Các trường riêng cho Client
  const clientFields = [
    { key: 'tenCongTy', label: 'Tên công ty', weight: 25 },
    { key: 'website', label: 'Website', weight: 25 }
  ]

  // Chọn bộ fields dựa trên vai trò
  let fieldsToCheck = [...basicFields]
  if (nguoiDung.vaiTro === 'tester') {
    fieldsToCheck = [...fieldsToCheck, ...testerFields]
  } else if (nguoiDung.vaiTro === 'client') {
    fieldsToCheck = [...fieldsToCheck, ...clientFields]
  }

  // Tính điểm
  fieldsToCheck.forEach(field => {
    total += field.weight
    // @ts-ignore - access dynamic key on NguoiDung
    const value = nguoiDung[field.key as keyof NguoiDung]

    if (value && (typeof value === 'string' ? value.length > 0 : true)) {
      score += field.weight
    } else {
      missing.push(field.label)
    }
  })

  // Chuẩn hóa về thang 100%
  const percent = Math.round((score / total) * 100)

  return { percent, missing }
}
