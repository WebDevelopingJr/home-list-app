import { createClient } from './client-component'

type ProductType = {
  name: string,
  email: string,
  image_url?: string
}

export async function addUserdb(product: ProductType) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('Users')
    .insert(product)

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteUserdb(id: number) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('Users')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    return data
}
