import { createClient } from '@/app/databaseconfig/server-component'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()

    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError.message)
      return NextResponse.redirect(`${origin}/`)
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log('✅ User:', user?.email)
    console.log('❌ User error:', userError?.message)

    if (user) {
      const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      console.log('Existing user:', existingUser)
      console.log('Select error:', selectError?.message)

      if (!existingUser) {
        const { error: insertError } = await supabase.from('users').insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata.full_name,
          imgProfile: user.user_metadata.avatar_url
        })
        console.log('Insert error:', insertError?.message)
      }
    }
  }

  return NextResponse.redirect(`${origin}/`)
}