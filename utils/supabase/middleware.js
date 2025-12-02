import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        }
      }
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/register') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/') &&
    !request.nextUrl.pathname.startsWith('/about') &&
    !request.nextUrl.pathname.startsWith('/contact')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    // const url = request.nextUrl.clone()
    // url.pathname = '/login'
    // return NextResponse.redirect(url)
  }

  // Nếu đã login
  if (user) {
    const role = user.user_metadata?.role

    // 1. Chặn vào trang login/register
    if (
      request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/register')
    ) {
      const url = request.nextUrl.clone()
      if (role === 'client') {
        url.pathname = '/dashboard/client'
      } else {
        url.pathname = '/dashboard/tester'
      }
      return NextResponse.redirect(url)
    }

    // 2. Chặn Tester vào trang Client
    if (
      request.nextUrl.pathname.startsWith('/dashboard/client') &&
      role !== 'client'
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard/tester'
      return NextResponse.redirect(url)
    }

    // 3. Chặn Client vào trang Tester
    if (
      request.nextUrl.pathname.startsWith('/dashboard/tester') &&
      role !== 'tester'
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard/client'
      return NextResponse.redirect(url)
    }
  } else if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Nếu chưa login mà vào dashboard -> redirect về login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
