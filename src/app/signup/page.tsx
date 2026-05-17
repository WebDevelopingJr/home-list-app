'use client';
import Header from "../navegation/header"
import Link from 'next/link'
import Image from "next/image"

/* Database functions  */
import { registerUser } from '../databaseconfig/serverAuth'

import { createClient } from "../databaseconfig/client-component";

import { addUserdb } from '../databaseconfig/serverDb'
import googleIcon from '../../../public/login-img/googleLogo.png'
import mailIcon from '../../../public/login-img/main-icon.png'
import { useState } from "react"

export default function Signup () {
    /*Name, Email, password */
    const [ name, setName ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    const [ formError, setFormError ] = useState<boolean | string>(false)
    const [ checkMail, setCheckMail ] = useState(false)

    async function createUserDb(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()

        if(name !== '' && email !== '' && password !== '') {
          try {
              const authData = await registerUser(email, password)
              if (!authData?.user) {
              throw new Error("We couldnt get the id of the created user")
          }
  
          // 2. Pasamos el ID de Auth a tu base de datos
          await addUserdb({
              id: authData.user.id, // <-- AQUÍ se hace la magia
              name, 
              email,
              
          })
              setCheckMail(true)
          } catch (error) {
              console.error(error)
          }
        }else {
            setFormError(el => el == false ? 'Please fill all the inputs' : false)
        }   
    }

    /* Google function register  */
    async function registerGoogle() {
      const supabase = createClient()
      
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback',
        },
      })
    }
    
    return (
        <>
        <div className="w-full h-screen flex items-center justify-center  bg-linear-to-b from-[#cae0e5] via-[#c5d3d7] to-[#b9ccd1]">
            <div className="w-[90%] max-w-150 h-auto flex flex-col justify-center items-center bg-[#ffffff60] backdrop-blur-2xl p-10 rounded-2xl"> {/* Form container */}
              <div className="flex flex-col justify-center items-center gap-3">
                <h1 className="text-4xl text-center">Sign up to Home List</h1>
                <p className="text-gray-600">Already have an account? <Link href={'/login'} className="font-medium text-black">Log in</Link></p>
                <div className="bg-[#4d4d4d5b]/30 backdrop-blur-2xl border border-gray-400/30 box-border py-2 px-10 rounded-2xl mt-5 hover:bg-gray-100 transition duration-200">
                    <button className="flex justify-center items-center gap-3"><Image src={googleIcon} alt="googleIcon" width={30} height={30} onClick={registerGoogle}/> Sign up with Google</button>
                </div>
              </div>

              <div className="w-full flex justify-center items-center gap-3 mt-5">
                <span className="w-[45%] h-px bg-black/20"></span>
                <p>Or</p>
                <span className="w-[45%] h-px bg-black/20"></span>
              </div>

              <form onSubmit={(e)=> createUserDb(e)} method="POST" className="w-full my-10 flex flex-col items-center justify-center gap-10"> {/* Inputs contianers */}
                <div className="flex flex-col w-full relative"> {/* Name */}
                    <label className="absolute -top-4 left-1">Name</label>
                    <input type="text" name="name" className="border-b border-gray-500 py-2 px-2 text-xl focus:outline-none focus:ring-0" onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="flex flex-col w-full relative"> {/* Name */}
                    <label className="absolute -top-4 left-1">Email</label>
                    <input type="email" name="email" className="border-b border-gray-500 py-2 px-2 text-xl focus:outline-none focus:ring-0" onChange={(e) => setEmail(e.target.value)}  required />
                </div>

                <div className="w-full flex flex-col relative">
                    <span className="absolute -top-4 left-1">Password</span>
                    <input type="password" name="password" className="border-b border-gray-500 py-2 px-2 text-xl  focus:outline-none focus:ring-0" onChange={(e) => setPassword(e.target.value)} required />
                </div>

                {formError !== false && (
                  <div className="w-full rounded-2xl border border-red-400 bg-red-100 px-4 py-3 text-red-800 shadow-sm">
                    {typeof formError === 'string' ? formError : 'Please fill all the inputs'}
                  </div>
                )}

                <button className="w-full mt-6 bg-black text-white font-semibold py-3 px-6 rounded-full hover:bg-gray-800 active:bg-gray-900 transition duration-200 shadow-md hover:shadow-lg" >
                  Sign up
                </button>
                    
              </form>
            </div>
            <div className={`w-[90%] max-w-200 h-100 bg-gray-300 backdrop-blur-2xl shadow-2xs rounded-3xl absolute flex-col justify-center items-center gap-5 ${checkMail ? 'flex' : 'hidden'}`}>
                <Image src={mailIcon} alt="CheckMail" width={50} height={50} />
                <h1 className="text-2xl">Check your email for verification</h1>
            </div>
        </div>
        </>
    )
}