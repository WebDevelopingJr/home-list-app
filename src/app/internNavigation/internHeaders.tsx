'use client';

import React, { useEffect, useState, useRef } from "react";
import { UserLog } from "../userInfo/userLog";
import Image from "next/image";
import { logoutUser } from "../databaseconfig/serverAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* images */
import Logout from '../../../public/header-img/logout.png'

export default function HeaderDash() {
  const [userData, setUserData] = useState<any>('')
  const [openMenu, setOpenMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const changeData = async () => {
      const userDataInfo = await UserLog()
      if (userDataInfo) {
        setUserData(userDataInfo)
      }
    }
    changeData()
  }, [])

  // Cierra el menú si clickea fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logoutUser()
    router.push('/login')
  }

  return (
    <>
      {userData ?
        <div className="flex items-center justify-center">
          <div className="w-[90%] max-w-500 flex justify-between items-center py-5 border-b border-gray-400">
            <div className="flex flex-col gap-1">
              <p>Welcome</p>
              <h1 className="text-3xl">Hi {userData.name}</h1>
            </div>

            {/* ── Menu button ── */}
            <div className="relative" ref={menuRef}>
              <div className="bg-blue-300 rounded-xl p-2 cursor-pointer hover:bg-blue-400 transition duration-200" onClick={() => setOpenMenu(prev => !prev)} >
                <Image src={Logout} alt="MenuButton" width={25} height={25} />
              </div>

              {/* ── Dropdown ── */}
              {openMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <Link href="/" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition duration-150" onClick={() => setOpenMenu(false)} >
                    Main page
                  </Link>
                  <button className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition duration-150" onClick={handleLogout} >
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
        : <></>}
    </>
  )
}