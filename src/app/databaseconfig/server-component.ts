import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    
    // ← Crea el response PRIMERO
    const response = NextResponse.redirect(`${origin}/`)
    
    // ← Crea el cliente con el response, no con cookieStore directamente
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            // ← Setea en AMBOS: cookieStore Y response
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
              response.cookies.set(name, value, options) // ← esta línea es la clave
            })
          },
        },
      }
    )

    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError) {
      console.error('❌ Session error:', sessionError.message)
      return NextResponse.redirect(`${origin}/`)
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (!existingUser) {
        await supabase.from('users').insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata.full_name,
          imgProfile: user.user_metadata.avatar_url
        })
      }
    }

    // ← Retorna el response que ya tiene las cookies seteadas
    return response
  }

  return NextResponse.redirect(`${origin}/`)
}