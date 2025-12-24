import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getNguoiDung,
  getHoSoTester,
  getHoSoClient,
  updateNguoiDung,
  upsertHoSoTester,
  upsertHoSoClient,
  type NguoiDung,
  type HoSoTester,
  type HoSoClient,
  type DuAn
} from './data-service'
import { supabase } from '@/lib/supabase/client'

// QUERY KEYS
export const KEYS = {
  USER: ['auth_user'],
  NGUOI_DUNG: (id: string) => ['nguoi_dung', id],
  HOSO_TESTER: (id: string) => ['hoso_tester', id],
  HOSO_CLIENT: (id: string) => ['hoso_client', id]
}

// 1. Auth User
export function useAuthUser() {
  return useQuery({
    queryKey: KEYS.USER,
    queryFn: async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      return user
    }
  })
}

// 2. Nguoi Dung
export function useNguoiDung(userId: string | undefined) {
  return useQuery({
    queryKey: KEYS.NGUOI_DUNG(userId!),
    queryFn: () => getNguoiDung(userId!),
    enabled: !!userId
  })
}

// 3. Ho So Tester
export function useHoSoTester(
  userId: string | undefined,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: KEYS.HOSO_TESTER(userId!),
    queryFn: () => getHoSoTester(userId!),
    enabled: !!userId && (options?.enabled ?? true)
  })
}

// 4. Ho So Client
export function useHoSoClient(
  userId: string | undefined,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: KEYS.HOSO_CLIENT(userId!),
    queryFn: () => getHoSoClient(userId!),
    enabled: !!userId && (options?.enabled ?? true)
  })
}

// MUTATIONS

export function useUpdateNguoiDung() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data
    }: {
      id: string
      data: Partial<NguoiDung>
    }) => {
      const success = await updateNguoiDung(id, data)
      if (!success) throw new Error('Update NguoiDung failed')
      return success
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: KEYS.NGUOI_DUNG(id) })
    }
  })
}

export function useUpdateHoSoTester() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data
    }: {
      id: string
      data: Partial<HoSoTester>
    }) => {
      const success = await upsertHoSoTester(id, data)
      if (!success) throw new Error('Update HoSoTester failed')
      return success
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: KEYS.HOSO_TESTER(id) })
    }
  })
}

export function useUpdateHoSoClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data
    }: {
      id: string
      data: Partial<HoSoClient>
    }) => {
      const success = await upsertHoSoClient(id, data)
      if (!success) throw new Error('Update HoSoClient failed')
      return success
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: KEYS.HOSO_CLIENT(id) })
    }
  })
}

// 5. Create Project Mutation
export function useCreateDuAn() {
  return useMutation({
    mutationFn: async (projectData: any) => {
      const { createDuAn } = await import('./data-service')
      const result = await createDuAn(projectData)
      if (!result) throw new Error('Create project failed')
      return result
    },
    onSuccess: () => {
      // Invalidate project list query when available
      // queryClient.invalidateQueries({ queryKey: KEYS.PROJECTS })
    }
  })
}

export function useUpdateDuAn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      maDuAn,
      data
    }: {
      maDuAn: number
      data: Partial<DuAn>
    }) => {
      const { updateDuAn } = await import('./data-service')
      const success = await updateDuAn(maDuAn, data)
      if (!success) throw new Error('Update Project failed')
      return success
    },
    onSuccess: (_, { maDuAn }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['du_an', maDuAn] })
    }
  })
}

export function useDuAn(maDuAn: number) {
  return useQuery({
    queryKey: ['du_an', maDuAn],
    queryFn: async () => {
      const { getDuAn } = await import('./data-service')
      return getDuAn(maDuAn)
    },
    enabled: !!maDuAn
  })
}

// 6. Kich Ban Kiem Thu
export function useKichBanByDuAn(maDuAn: number | undefined) {
  return useQuery({
    queryKey: ['kich_ban', maDuAn],
    queryFn: async () => {
      const { getKichBanByDuAn } = await import('./data-service')
      return getKichBanByDuAn(maDuAn!)
    },
    enabled: !!maDuAn
  })
}

export function useCreateKichBan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const { createKichBan } = await import('./data-service')
      const result = await createKichBan(data)
      if (!result) throw new Error('Create KichBan failed')
      return result
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['kich_ban', variables.maDuAn]
      })
    }
  })
}

export function useDeleteKichBan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id }: { id: number; maDuAn: number }) => {
      const { deleteKichBan } = await import('./data-service')
      const success = await deleteKichBan(id)
      if (!success) throw new Error('Delete KichBan failed')
      return success
    },
    onSuccess: (_, { maDuAn }) => {
      queryClient.invalidateQueries({ queryKey: ['kich_ban', maDuAn] })
    }
  })
}

export function useUpdateKichBanOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      items
    }: {
      items: {
        maKichBan: number
        soThuTu: number
        maKichBanHienThi?: string
        maDuAn: number
      }[]
      maDuAn: number
    }) => {
      const { updateKichBanOrder } = await import('./data-service')
      const success = await updateKichBanOrder(items)
      if (!success) throw new Error('Update order failed')
      return success
    },
    onSuccess: (_, { maDuAn }) => {
      queryClient.invalidateQueries({ queryKey: ['kich_ban', maDuAn] })
    }
  })
}

export function useUpdateKichBan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      maKichBan,
      data
    }: {
      maKichBan: number
      data: any
    }) => {
      const { updateKichBan } = await import('./data-service')
      const success = await updateKichBan(maKichBan, data)
      if (!success) throw new Error('Update KichBan failed')
      return success
    },
    onSuccess: (_, { data }) => {
      if (data.maDuAn) {
        queryClient.invalidateQueries({ queryKey: ['kich_ban', data.maDuAn] })
      }
    }
  })
}

export function useProjectsByUser(userId: string | undefined) {
  return useQuery({
    queryKey: ['projects', userId],
    queryFn: async () => {
      const { getProjectsByUser } = await import('./data-service')
      return getProjectsByUser(userId!)
    },
    enabled: !!userId
  })
}

export function useImportKichBan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      targetProjectId,
      sourceKichBanIds
    }: {
      targetProjectId: number
      sourceKichBanIds: number[]
    }) => {
      const { importKichBan } = await import('./data-service')
      const success = await importKichBan(targetProjectId, sourceKichBanIds)
      if (!success) throw new Error('Import KichBan failed')
      return success
    },
    onSuccess: (_, { targetProjectId }) => {
      queryClient.invalidateQueries({ queryKey: ['kich_ban', targetProjectId] })
    }
  })
}

export function useUngTuyenByDuAn(maDuAn: number) {
  return useQuery({
    queryKey: ['ung_tuyen', maDuAn],
    queryFn: async () => {
      const { getUngTuyenByDuAn } = await import('./data-service')
      return getUngTuyenByDuAn(maDuAn)
    },
    enabled: !!maDuAn
  })
}

export function useUpdateUngTuyen() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      maUngTuyen,
      status
    }: {
      maUngTuyen: number
      status: string
      maDuAn: number
    }) => {
      const { updateUngTuyenStatus } = await import('./data-service')
      const success = await updateUngTuyenStatus(maUngTuyen, status)
      if (!success) throw new Error('Update UngTuyen failed')
      return success
    },
    onSuccess: (_, { maDuAn }) => {
      queryClient.invalidateQueries({ queryKey: ['ung_tuyen', maDuAn] })
    }
  })
}
