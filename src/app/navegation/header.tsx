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
    const [loading, setLoading] = useState(true)
    useEffect(() => {
      async function getUserConfirmation() {
        try {
          // ← Cambia getSession() por getUser()
          const { data: { user }, error } = await supabase.auth.getUser()
          
          if (user) {
            const finalInfo = await getUserInfo(user.id)
            setUserInfo(finalInfo)
          } else {
            setUserInfo(null)
          }
        } catch (error) {
          console.error('Unexpected error:', error)
          setUserInfo(null)
        }
      }

      getUserConfirmation()

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth event:', event) // ← para debuggear
          if (session?.user) {
            const finalInfo = await getUserInfo(session.user.id)
            setUserInfo(finalInfo)
          } else {
            setUserInfo(null)
          }
          router.refresh()
        }
      )

      return () => subscription.unsubscribe()
    }, [])

    return (
      <div className="w-full flex items-center justify-center mt-5">
          <div className="w-[90%] max-w-200 flex justify-around items-center py-3 z-10 relative bg-white/30 backdrop-blur-2xl rounded-3xl">
            <div className="flex justify-center items-center gap-2 cursor-pointer" onClick={()=> router.push('/')}>
                <Image src={logoWeb} alt="logoImg" className="size-15"/>
                <p className="font-bold text-blue-400 text-2xl ">HOME LIST</p>
            </div>
            {userInfo ? 
            <>
              <div className="relative">
                <Image src={userInfo.imgProfile ? userInfo.imgProfile : nonUser} className="cursor-pointer rounded-2xl" width={45} height={45} alt="noprofilepic" onClick={()=> setUserMenu(el => !el)}/>

                <div className={`absolute w-80 bg-[#f9fafb]/90 backdrop-blur-xs top-20 right-0 p-8 flex gap-2 flex-col rounded-2xl ${userMenu ? 'flex' : 'hidden'}`}>
                    <p>{userInfo.name}</p>
                    <p>{userInfo.email}</p>
                    <Link href={'/dashboard'} className="mt-2 bg-sky-300 text-center py-2 rounded-xl">DASHBOARD</Link>
                    <button className="mt-2 border border-gray-400 text-center py-2 rounded-xl hover:bg-red-400 hover:text-white" onClick={()=> logOutUserFunction()}>Log out</button>
                </div>

              </div>
            </> 
            : 
            <>
              <div className="flex cursor-pointer relative" onClick={() => setMenuLog(el => !el)}>
                {menuLog ? 
                    <Image src={closeMeny} alt="menuIcon" width={35} height={35}/>
                    :
                    <Image src={hamMeny} alt="menuIcon" width={45} height={45}/>
                }
                <div className={`w-auto bg-[#f9fafb]/60 backdrop-blur-xs flex flex-col items-end absolute z-5 top-20 right-5 transform gap-3 rounded-[10px] overflow-hidden ${menuLog ? 'p-5 h-auto' : 'p-0 h-0'}`}>
                    <Link className="w-80 h-10 texts-start flex items-cente text-gray-900 font-semibold px-3 rounded-[5px]" href={'/login'} onClick={()=> setMenuLog(false)}>Log in</Link>
                    <Link className="w-80 h-10 texts-start flex items-center bg-blue-400 text-white font-semibold px-3 rounded-[5px]" href={'/signup'} onClick={()=> setMenuLog(false)}>Sign up</Link>
                </div>
              </div>
            </>}
            
          </div>
      </div>
    )
}
