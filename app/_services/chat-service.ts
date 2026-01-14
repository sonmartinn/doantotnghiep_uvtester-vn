import { SupabaseClient } from '@supabase/supabase-js'

export type Channel = {
  maKenh: number
  maDuAn: number
  tenKenh: string
  loaiKenh: 'PUBLIC' | 'PRIVATE'
  thanhVien?: string[] | null
}

export type Attachment = {
  name: string
  url: string
  type: string
  size: number
}

export type Message = {
  maTinNhan: number
  maKenh: number
  maNguoiGui: string
  noiDung: string
  fileDinhKem: Attachment[] | null
  thoiGianGui: string
  nguoiGui?: {
    hoTen: string
    anhDaiDien: string
  }
}

export async function getProjectChannels(
  supabase: SupabaseClient,
  projectId: number,
  userId: string,
  clientUserId: string // The Project Owner ID
): Promise<{ public: Channel; private: Channel }> {
  // 1. Fetch existing channels for this project
  const { data: channels, error } = await supabase
    .from('KenhChat')
    .select('*')
    .eq('maDuAn', projectId)

  if (error) throw error

  let publicChannel = channels?.find(c => c.loaiKenh === 'PUBLIC')
  let privateChannel = channels?.find(
    c =>
      c.loaiKenh === 'PRIVATE' &&
      Array.isArray(c.thanhVien) &&
      c.thanhVien.includes(userId) &&
      c.thanhVien.includes(clientUserId)
  )

  // 2. Create Public Channel if missing
  if (!publicChannel) {
    const { data: newPublic, error: createError } = await supabase
      .from('KenhChat')
      .insert({
        maDuAn: projectId,
        tenKenh: 'Public',
        loaiKenh: 'PUBLIC'
      })
      .select()
      .single()

    if (createError) throw createError
    publicChannel = newPublic
  }

  // 3. Create Private Channel if missing (Tester <-> Client)
  if (!privateChannel) {
    const { data: newPrivate, error: createPrivateError } = await supabase
      .from('KenhChat')
      .insert({
        maDuAn: projectId,
        tenKenh: `Private: Tester-${userId.slice(0, 4)}`,
        loaiKenh: 'PRIVATE',
        thanhVien: [userId, clientUserId]
      })
      .select()
      .single()

    if (createPrivateError) throw createPrivateError
    privateChannel = newPrivate
  }

  return {
    public: publicChannel!,
    private: privateChannel!
  }
}

export async function getMessages(
  supabase: SupabaseClient,
  channelId: number
): Promise<Message[]> {
  const { data, error } = await supabase
    .from('TinNhan')
    .select(
      `
      *,
      nguoiGui:NguoiDung(hoTen, anhDaiDien)
    `
    )
    .eq('maKenh', channelId)
    .order('thoiGianGui', { ascending: true })

  if (error) throw error
  return data || []
}

export async function sendMessage(
  supabase: SupabaseClient,
  channelId: number,
  userId: string,
  content: string,
  attachments: Attachment[] | null = null
) {
  const { error } = await supabase.from('TinNhan').insert({
    maKenh: channelId,
    maNguoiGui: userId,
    noiDung: content,
    fileDinhKem: attachments
  })
  if (error) throw error
}

export type ProjectTester = {
  maNguoiDung: string
  hoTen: string
  anhDaiDien: string
  email: string
}

export async function getProjectTesters(
  supabase: SupabaseClient,
  projectId: number
): Promise<ProjectTester[]> {
  const { data, error } = await supabase
    .from('UngTuyen')
    .select(
      `
      maUngVien,
      tester:NguoiDung(maNguoiDung, hoTen, anhDaiDien, email)
    `
    )
    .eq('maDuAn', projectId)
    .eq('trangThaiUngTuyen', 'DaDuyet')

  if (error) throw error

  return data.map((item: any) => item.tester)
}

export async function getOrCreatePrivateChannel(
  supabase: SupabaseClient,
  projectId: number,
  currentUserId: string,
  otherUserId: string
): Promise<Channel> {
  // Check if channel exists - fetch all private channels for project and filter strictly in JS
  // This avoids "invalid input syntax for type json" error with .contains() on JSONB column
  const { data: channels, error } = await supabase
    .from('KenhChat')
    .select('*')
    .eq('maDuAn', projectId)
    .eq('loaiKenh', 'PRIVATE')

  if (error) throw error

  const existingChannel = channels?.find(
    c =>
      Array.isArray(c.thanhVien) &&
      c.thanhVien.includes(currentUserId) &&
      c.thanhVien.includes(otherUserId)
  )

  if (existingChannel) {
    return existingChannel
  }

  const { data: newChannel, error: createError } = await supabase
    .from('KenhChat')
    .insert({
      maDuAn: projectId,
      tenKenh: `Private Chat`,
      loaiKenh: 'PRIVATE',
      thanhVien: [currentUserId, otherUserId]
    })
    .select()
    .single()

  if (createError) throw createError

  return newChannel
}
