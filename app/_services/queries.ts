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
  type HoSoClient
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
export function useHoSoTester(userId: string | undefined) {
  return useQuery({
    queryKey: KEYS.HOSO_TESTER(userId!),
    queryFn: () => getHoSoTester(userId!),
    enabled: !!userId
  })
}

// 4. Ho So Client
export function useHoSoClient(userId: string | undefined) {
  return useQuery({
    queryKey: KEYS.HOSO_CLIENT(userId!),
    queryFn: () => getHoSoClient(userId!),
    enabled: !!userId
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
