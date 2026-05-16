'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
/* Images */
import logoWeb from '../../../public/header-img/home-list-resize.png'
import hamMeny from '../../../public/header-img/ham-menu.png'
import closeMeny from '../../../public/header-img/close-icon.svg'
export default function Header() {
    const [ menuLog, setMenuLog ] = useState(false)
    return (
      <>
          <div className="flex justify-around items-center py-3 border-b border-gray-300 z-10">
            <div className="flex justify-center items-center gap-2">
                <Image src={logoWeb} alt="logoImg" className="size-15"/>
                <p className="font-bold text-blue-400 text-2xl ">HOME LIST</p>
            </div>
            <div className="flex cursor-pointer" onClick={() => setMenuLog(el => !el)}>
                {menuLog ? 
                    <Image src={closeMeny} alt="menuIcon" width={45} height={45}/>
                    :
                    <Image src={hamMeny} alt="menuIcon" width={45} height={45}/>
                }
            </div>
            <div className={`w-auto bg-[#f9fafb] flex flex-col items-end absolute z-5 top-22 right-136 gap-3 rounded-s-[10px] overflow-hidden ${menuLog ? 'p-5 h-auto' : 'p-0 h-0'}`}>
                <Link className="w-80 h-10 texts-start flex items-cente text-gray-900 font-semibold px-3 rounded-[5px]" href={'/login'} onClick={()=> setMenuLog(false)}>Log in</Link>
                <Link className="w-80 h-10 texts-start flex items-center bg-blue-400 text-white font-semibold px-3 rounded-[5px]" href={'/signup'} onClick={()=> setMenuLog(false)}>Sign up</Link>
            </div>
          </div>
      </>
    )
}