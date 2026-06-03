import React from "react";
import { createClient } from "../databaseconfig/client-component";
import { getUserInfo } from "../databaseconfig/serverDb";

export async function UserLog() {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if(user) {
        return getUserInfo(user.id)
    }else {
        return 'Still dont get a user'
    }

}

export async function UserArr() {
    const supabase = await createClient()
    const { data: { user }} = await supabase.auth.getUser()
    if(!user) {
        throw new Error('User not identified')
    }
    
      const { data, error } = await supabase
          .from('list-elements')
          .select('*')
          .overlaps('people', [user.email]);
      
      if(error) {
        console.error('We couldnt get the user complete info')
        throw error
      }
      return data
}
