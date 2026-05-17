import { createClient } from '../databaseconfig/server-component'

export async function registerGoogle() {
  const supabase = await createClient()

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