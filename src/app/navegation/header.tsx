'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
/* Images */
import logoWeb from '../../../public/header-img/home-list-nobg.png'
import hamMeny from '../../../public/header-img/ham-menu.png'
import closeMeny from '../../../public/header-img/close-icon.svg'
import nonUser from '../../../public/header-img/user-icon.png'

import { useRouter } from 'next/navigation'
import { getUserInfo } from "../databaseconfig/serverDb";
import { logoutUser } from "../databaseconfig/serverAuth";
import { createClient } from "../databaseconfig/client-component";

export default function Header() {
    const [ menuLog, setMenuLog ] = useState(false)
    const [ userInfo, setUserInfo ] = useState<any>(null)
    const [ userMenu, setUserMenu ] = useState(false)
    const router = useRouter()

    const supabase = createClient()

    async function logOutUserFunction() {
        try {
            await logoutUser()
            setUserInfo(null)
            setUserMenu(false)
        }catch(error) {
            console.log(error)
        }
        router.refresh()
    }

    useEffect(() => {
      async function getUserConfirmation() {
        try {
          const { data, error } = await supabase.auth.getUser()

          if (error || !data.user) return

          // Busca el usuario en tu tabla users
          const info = await getUserInfo(data.user.id)
          setUserInfo(info)

        } catch (error) {
          console.error(error)
        }
      }
      getUserConfirmation()
    }, [])

    return (
      <div className="w-full flex items-center justify-center mt-5">
        <div className="w-[90%] max-w-200 flex justify-between items-center py-3 px-5 z-10 relative bg-white border border-gray-200 rounded-2xl shadow-sm">

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={()=> router.push('/')}>
            <Image src={logoWeb} alt="logoImg" className="w-8 h-8"/>
            <p className="font-bold text-gray-900 text-lg tracking-tight">HomeList</p>
          </div>

          {userInfo ?
            <div className="relative">
              <Image src={userInfo.imgProfile ? userInfo.imgProfile : nonUser} className="cursor-pointer rounded-xl object-cover border-2 border-gray-200 hover:border-gray-400 transition-colors" width={38} height={38} alt="noprofilepic"
                onClick={()=> setUserMenu(el => !el)}/>

              {userMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3.5 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-900 truncate">{userInfo.name}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{userInfo.email}</p>
                  </div>
                  <div className="py-1.5">
                    <Link href={'/dashboard'} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={()=> setUserMenu(false)}>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Dashboard
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 py-1.5">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      onClick={()=> logOutUserFunction()}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          :
            <div className="flex items-center gap-2">
              <Link className="h-9 px-4 flex items-center text-sm font-medium text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors" href={'/login'}>
                Log in
              </Link>
              <Link className="h-9 px-4 flex items-center text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-700 transition-colors" href={'/signup'}>
                Sign up
              </Link>
            </div>
          }

        </div>
      </div>
    )
}
