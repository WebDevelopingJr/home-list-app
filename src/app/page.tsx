'use client';

import Image from "next/image";
import Link  from "next/link";

import Header from './navegation/header';

import iconImage from '../../public/home-img/storage-icon.png'
import notebook from '../../public/home-img/notebook-icon.svg'
import targetIcon from '../../public/home-img/target-icon.svg'
import userIcon from '../../public/home-img/users-icons.svg'
import lockIcon from '../../public/home-img/lock-icon.svg'
import { getUserInfo } from "./databaseconfig/serverDb";
import { useState, useEffect } from "react";


import { createClient } from './databaseconfig/client-component'

export default function Home() {

    const [ userInfo, setUserInfo ] = useState<any>(null)


    const supabase = createClient()

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
   <>
      <Header />
      <main className="w-full flex flex-col items-center">

        {/* Hero */}
        <div className="w-full flex flex-col items-center text-center px-6 pt-20 pb-16">
          <div className="w-14 h-14 bg-sky-50 border border-sky-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Image src={iconImage} alt="Icon" className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight max-w-lg leading-tight">
            Manage your home inventory, together
          </h1>
          <p className="text-gray-400 mt-4 max-w-md text-base leading-relaxed">
            Create shared lists, track stock levels, and always know what you have at home — for free.
          </p>

          {userInfo ?
            /* Usuario loggeado */
            <div className="flex flex-col items-center gap-3 mt-8">
              <Link className="h-11 px-8 flex items-center text-sm font-semibold text-white bg-sky-500 rounded-xl hover:bg-sky-600 transition-colors shadow-sm" href={'/dashboard'}>
                Go to Dashboard →
              </Link>
              <p className="text-xs text-gray-400">Logged in as <span className="text-gray-600 font-medium">{userInfo.email}</span></p>
            </div>
          :
            /* No loggeado */
            <div className="flex items-center gap-3 mt-8">
              <Link className="h-11 px-6 flex items-center text-sm font-medium text-gray-700 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm" href={'/login'}>
                Log in
              </Link>
              <Link className="h-11 px-6 flex items-center text-sm font-medium text-white bg-sky-500 rounded-xl hover:bg-sky-600 transition-colors shadow-sm" href={'/signup'}>
                Create free account →
              </Link>
            </div>
          }
        </div>

        {/* Divider */}
        <div className="w-[90%] max-w-3xl h-px bg-gray-100 mb-12" />

        {/* Feature cards */}
        <div className="w-[90%] max-w-3xl grid grid-cols-1 lg:grid-cols-2 gap-3 pb-20">

          <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-[#61a1bb] border border-sky-200 rounded-xl flex items-center justify-center">
              <Image src={notebook} alt="notebookIcon" width={22} height={22} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Shared Lists</p>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">Create lists and invite family or roommates to manage inventory together in real time.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-[orange] border border-orange-200 rounded-xl flex items-center justify-center">
              <Image src={userIcon} alt="userIcon" width={22} height={22} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Members</p>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">Invite people by email and control who has access to each list.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-[#ff8a8a] border border-red-200 rounded-xl flex items-center justify-center">
              <Image src={lockIcon} alt="lockIcon" width={22} height={22} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Secure & Private</p>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">Your data is protected. Only members you invite can see your lists.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-[#3b6bc1] border border-sky-200 rounded-xl flex items-center justify-center">
              <Image src={targetIcon} alt="targetIcon" width={22} height={22} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Stock Tracking</p>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">Track quantity and capacity for every product with visual stock indicators.</p>
            </div>
          </div>

        </div>

      </main>
   </>
  );
}

