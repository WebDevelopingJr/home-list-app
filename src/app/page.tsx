'use client';

import Image from "next/image";
import Link  from "next/link";

import Header from './navegation/header';

import iconImage from '../../public/home-img/storage-icon.png'
import notebook from '../../public/home-img/notebook-icon.svg'
import targetIcon from '../../public/home-img/target-icon.svg'
import userIcon from '../../public/home-img/users-icons.svg'
import lockIcon from '../../public/home-img/lock-icon.svg'
import { useState, useEffect } from "react";


import { createClient } from './databaseconfig/client-component'

export default function Home() {

  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
 
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)
    }

    getUser()
  }, [])
  return (  
   <>
      <Header />
      <main className="w-full flex flex-col items-center mt-20"> 
          <div className="size-25 bg-[#B0E0E6]/40 border border-blue-500/20 p-5 rounded-2xl">
            <Image src={iconImage} alt="Icon" />
          </div>
          <div className="w-[90%] text-center mt-5 max-w-2xl">
            <h1 className="text-3xl mb-5 font-semiboldbold ">Home List TEST</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni delectus rem beatae expedita explicabo culpa a velit hic in. Voluptas natus doloremque, accusantium nemo quam aliquam delectus pariatur harum libero.</p>  
          </div>  
          <div className="w-[90%] max-w-xl flex items-center justify-center flex-row mt-8 gap-6">
            <Link className="w-60 h-12 flex justify-center text-center items-center drop-shadow-sm bg-gray-300/15 backdrop-blur-2xl text-xl rounded-3xl transition duration-200 hover:bg-white/60" href={'/login'}>Log in</Link>
            <Link className="w-60 h-12 flex justify-center text-center items-center drop-shadow-sm bg-[#1cc0d65b]/40 text-xl rounded-3xl transition duration-200 hover:bg-[#1fbed3a6]/50 hover:text-white" href={'/signup'}>Create Account</Link>
          </div>
          <div className="w-[90%] max-w-3xl h-0.5 bg-gray-100 my-10"></div>
          
          <div className="w-[90%] max-w-3xl lg:grid-cols-2 grid grid-cols-1 gap-4">{/* Info icons container */}

            <div className="flex flex-col items-start justify-center gap-3 bg-[#b5ddec8b] p-6 rounded-lg border border-[#95d4eb]"> {/* Icon container info 1 */}
              <div className="flex items-center justify-center gap-3">
                <Image src={notebook} alt="notebookIcon" className="bg-blue-400 p-2 rounded-lg"  width={60} height={60} />
                <p className="text-2xl">Lists</p>  
              </div>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur velit optio adipisci dolorem ex placeat eaque?</p>
            </div> 
             
            <div className="flex flex-col items-start justify-center gap-3 bg-[#ffe2ad9b] p-6 rounded-lg border border-[#ffd485]"> {/* Icon container info 2 */}
              <div className="flex items-center justify-center gap-3">
                <Image src={userIcon} alt="notebookIcon" className="bg-[#FFA500] p-2 rounded-lg"  width={60} height={60} />
                <p className="text-2xl">Lists</p>  
              </div>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur velit optio adipisci dolorem ex placeat eaque?</p>
            </div>

            <div className="flex flex-col items-start justify-center gap-3 bg-[#ffc2c296] p-6 rounded-lg border border-[#ffa5a5]"> {/* Icon container info 3 */}
              <div className="flex items-center justify-center gap-3">
                <Image src={lockIcon} alt="notebookIcon" className="bg-[#FF6B6B] p-2 rounded-lg"  width={60} height={60} />
                <p className="text-2xl">Lists</p>  
              </div>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur velit optio adipisci dolorem ex placeat eaque?</p>
            </div>

            <div className="flex flex-col items-start justify-center gap-3 bg-[#7e80829e] p-6 rounded-lg border border-[#747b81]"> {/* Icon container info 4 */}
              <div className="flex items-center justify-center gap-3">
                <Image src={targetIcon} alt="notebookIcon" className="bg-[#2C3E50] p-2 rounded-lg"  width={60} height={60} />
                <p className="text-2xl">Lists</p>  
              </div>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur velit optio adipisci dolorem ex placeat eaque?</p>
            </div>
          </div>        
      </main>
   </>
  );
}

