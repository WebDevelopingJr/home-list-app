'use client';

import React, { useEffect, useState, useRef } from "react";
import { UserLog } from "../userInfo/userLog";
import Image from "next/image";
import { logoutUser } from "../databaseconfig/serverAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* images */
import nonUser from '../../../public/header-img/user-icon.png'
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
      <div className="flex items-center justify-center bg-[#1b345f]">
        <div className="w-[90%] max-w-500 flex justify-between items-center py-5 border-b border-gray-100">
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Welcome back</p>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Hi, {userData.name}</h1>
          </div>

          {/* ── Menu button ── */}
          <div className="relative" ref={menuRef}>
            <div className="cursor-pointer" onClick={() => setOpenMenu(prev => !prev)}>
              <Image
                src={userData.imgProfile ? userData.imgProfile : nonUser}
                className="rounded-xl object-cover border-2 border-gray-200 hover:border-gray-400 transition-colors"
                width={42} height={42} alt="profile"
              />
            </div>

            {/* ── Dropdown ── */}
            {openMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">

                {/* User info */}
                <div className="px-4 py-3.5 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-900 truncate">{userData.name}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{userData.email}</p>
                </div>

                {/* Options */}
                <div className="py-1.5">
                  <Link href="/" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenMenu(false)}>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Main page
                  </Link>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 py-1.5">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    onClick={handleLogout}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log out
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    : <></>}
    </>
  )
}