import { createClient } from '@/app/databaseconfig/server-component'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {

  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get('code')

  if (code) {

    const supabase = await createClient()

    // Crear sesión
    await supabase.auth.exchangeCodeForSession(code)

    // Obtener usuario autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Si existe usuario
    if (user) {

      // Verificar si ya existe en la tabla users
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      // Si no existe, crearlo
      if (!existingUser) {
        await supabase.from('users').insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata.full_name,
          imgProfile: user.user_metadata.avatar_url
        })
      }
    }
  }

  return NextResponse.redirect(`${origin}/`)
}