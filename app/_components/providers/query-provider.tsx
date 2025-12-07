'use client'

import {
  QueryClient,
  QueryClientProvider,
  useQueryClient
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { KEYS } from '@/app/_services/queries'

function AuthListener() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(event => {
      if (
        event === 'SIGNED_IN' ||
        event === 'TOKEN_REFRESHED' ||
        event === 'SIGNED_OUT'
      ) {
        // Invalidate user query to force refetch
        queryClient.invalidateQueries({ queryKey: KEYS.USER })

        // If signed out, we might want to clear everything
        if (event === 'SIGNED_OUT') {
          queryClient.clear()
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [queryClient])

  return null
}

export default function QueryProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false
          }
        }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthListener />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
