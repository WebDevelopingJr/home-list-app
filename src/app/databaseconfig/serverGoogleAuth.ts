import { createClient } from '../databaseconfig/client-component'

export async function registerGoogle() {

  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3000/auth/callback',
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}