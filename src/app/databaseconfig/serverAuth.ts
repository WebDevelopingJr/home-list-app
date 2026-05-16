import { createClient } from './client-component'

export async function registerUser(
  email: string,
  password: string
) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}


// databaseconfig/auth.ts

export async function loginUser(
  email: string,
  password: string
) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}


export async function logoutUser() {
  const supabase = createClient()

  await supabase.auth.signOut()
}