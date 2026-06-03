import { Params, ParamValue } from 'next/dist/server/request/params'
import { createClient } from './client-component'

type ProductType = {
  id: string
  name: string,
  email: string,
  image_url?: string
}

type ListDb = {
  id: ReturnType<typeof crypto.randomUUID>,
  name: string,
  type: string,
  brand: string | null,
  store?: string,
  image?: string,
  amount: number,
  maxAmount: number,
  avb: string
}

type databaseDataCreation = {
  id: string,
  name: string,
  people: string[],
  lastChange?: string,
  itemsList?: [],
  created_at?: string,
  stockAvg: null
}

export async function addUserdb(product: ProductType) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('users')
    .insert(product)

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function addListDb(product: databaseDataCreation) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('list-elements')
    .insert(product)

  if (error) {
    throw new Error(error.message)
  }

  return data
}


export async function editList(idList: ParamValue, itemArr: ListDb[]) {

  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('list-elements')
    .update({ itemsList: itemArr })
    .select('*')
    .eq('id', idList)

  if (error) throw new Error(error.message)

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

export async function getUserInfo(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
      
    if(error) {
      throw new Error(error.message)
    }
    return data
}