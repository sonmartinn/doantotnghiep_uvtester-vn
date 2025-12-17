import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export const uploadFile = async (
  file: File,
  bucket: string = 'project_assets'
): Promise<string> => {
  const sanitizeFileName = (name: string) => {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9._-]/g, '')
  }

  const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`
  const { error } = await supabase.storage.from(bucket).upload(fileName, file)

  if (error) {
    toast.error('Upload failed: ' + error.message)
    throw error
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from(bucket).getPublicUrl(fileName)

  return publicUrl
}

export const deleteFile = async (
  path: string,
  bucket: string = 'project_assets'
): Promise<boolean> => {
  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    toast.error('Delete failed: ' + error.message)
    return false
  }
  return true
}
