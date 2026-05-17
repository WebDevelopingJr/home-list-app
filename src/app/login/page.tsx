'use client';
import Header from "../navegation/header"
import Link from 'next/link'
import Image from "next/image"

import googleIcon from '../../../public/login-img/googleLogo.png'
import { useState } from "react"
import { loginUser } from "../databaseconfig/serverAuth";
import { useRouter } from "next/navigation";
export default function LogIn() {
  const [ activeInput, setActiveInput] = useState()

  const afterLogin = useRouter()

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  async function logUserIn(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    
    try {
      const loginSuccesfull = await loginUser(email, password)
      if(loginSuccesfull) {
        afterLogin.push('/')
      }
    }catch(error) {
      console.log(error)
    }
    
  }
    return (
        <>
        <div className="w-full h-screen flex items-center justify-center  bg-linear-to-b from-[#cae0e5] via-[#c5d3d7] to-[#b9ccd1]">
            <div className="w-[90%] max-w-150 h-auto flex flex-col justify-center items-center bg-[#ffffff60] backdrop-blur-2xl p-10 rounded-2xl"> {/* Form container */}
              <div className="flex flex-col justify-center items-center gap-3">
                <h1 className="text-4xl">Log in to Home List</h1>
                <p className="text-gray-600">Dont have an account? <Link href={'/signup'} className="font-medium text-black">Sign up</Link></p>
                <div className="bg-[#4d4d4d5b]/30 backdrop-blur-2xl border border-gray-400/30 box-border py-2 px-10 rounded-2xl mt-5 hover:bg-gray-100 transition duration-200">
                    <button className="flex justify-center items-center gap-3"><Image src={googleIcon} alt="googleIcon" width={30} height={30}/> Log in with Google</button>
                </div>
              </div>

              <div className="w-full flex justify-center items-center gap-3 mt-5">
                <span className="w-[45%] h-px bg-black/20"></span>
                <p>Or</p>
                <span className="w-[45%] h-px bg-black/20"></span>
              </div>

              <form onSubmit={(e)=> logUserIn(e)} method="POST" className="w-full my-10 flex flex-col items-center justify-center gap-10"> {/* Inputs contianers */}
                <div className="flex flex-col w-full relative"> {/* Name */}
                    <label className="absolute -top-4 left-1">Email</label>
                    <input type="text" name="name" className="border-b border-gray-500 py-2 px-2 text-xl focus:outline-none focus:ring-0" onChange={(e) => setEmail(e.target.value)} required/>
                </div>

                <div className="w-full flex flex-col relative">
                    <span className="absolute -top-4 left-1">Password</span>
                    <input type="text" name="email" className="border-b border-gray-500 py-2 px-2 text-xl  focus:outline-none focus:ring-0" onChange={(e) => setPassword(e.target.value)} required/>
                </div>

                <button type="submit" className="w-full mt-6 bg-black text-white font-semibold py-3 px-6 rounded-full hover:bg-gray-800 active:bg-gray-900 transition duration-200 shadow-md hover:shadow-lg">
                  Log in
                </button>
              </form>
            </div> 
        </div>
        </>
    )
}