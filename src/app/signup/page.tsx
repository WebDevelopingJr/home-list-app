'use client';
import Header from "../navegation/header"
import Link from 'next/link'
import Image from "next/image"

/* Database functions  */
import { registerUser } from '../databaseconfig/serverAuth'

import { registerGoogle } from "../databaseconfig/serverGoogleAuth";

import { addUserdb } from '../databaseconfig/serverDb'
import googleIcon from '../../../public/login-img/googleLogo.png'
import mailIcon from '../../../public/login-img/main-icon.png'
import seePass from '../../../public/login-img/see-password.png'
import noSeePass from '../../../public/login-img/no-see-password.png'

import { useState } from "react"


function validateEmail(email: string): string | null {
  if (!email) return null
  if (!email.includes('@'))          return 'The email must contain an @ symbol.'
  const [local, domain] = email.split('@')
  if (!local || local.length === 0)  return 'The name is missing before the @.'
  if (!domain || !domain.includes('.')) return 'El dominio debe contener un punto (ej. gmail.com)'
  const parts = domain.split('.')
  if (parts.some(p => p.length === 0)) return 'The domain is invalid.'
  return null
}

function validatePassword(password: string): string | null {
  if (!password) return null
  if (password.length < 6)           return 'The password must have at least 6 characters.'
  if (!/[a-zA-Z]/.test(password))    return 'The password must contain at least one letter.'
  return null
}

function validateName(name: string): string | null {
  if (!name) return null
  if (name.trim().length < 2)        return 'The name must have at least 2 characters.'
  return null
}


export default function Signup () {
  const [name, setName]       = useState("")
  const [email, setEmail]     = useState("")
  const [password, setPassword] = useState("")

  // Touched state — only show errors after the user has interacted with the field
  const [touched, setTouched] = useState({ name: false, email: false, password: false })

  const [formError, setFormError]   = useState<boolean | string>(false)
  const [checkMail, setCheckMail]   = useState(false)

  // Derived errors (only shown when field is touched)
  const nameError     = touched.name     ? validateName(name)         : null
  const emailError    = touched.email    ? validateEmail(email)        : null
  const passwordError = touched.password ? validatePassword(password)  : null

  const hasValidationErrors = !!(nameError || emailError || passwordError)

  async function createUserDb(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Mark all as touched so errors appear on submit
    setTouched({ name: true, email: true, password: true })

    // Run validations one more time synchronously
    if (validateName(name) || validateEmail(email) || validatePassword(password)) return

    if (name !== '' && email !== '' && password !== '') {
      try {
        const authData = await registerUser(email, password)
        if (!authData?.user) throw new Error("We couldn't get the id of the created user")
        await addUserdb({ id: authData.user.id, name, email })
        setCheckMail(true)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred while creating the account. Please try again.'
        setFormError(message)
      }
    } else {
      setFormError('Please complete all fields.')
    }
  }

  const [showPassword, setShowPassword] = useState(false)
    /* Google function register  */

    
    return (
    <>
      <div className="w-full h-screen flex items-center justify-center bg-linear-to-b from-[#cae0e5] via-[#c5d3d7] to-[#b9ccd1]">
        <div className="w-[90%] max-w-150 h-auto flex flex-col justify-center items-center bg-[#ffffff60] backdrop-blur-2xl p-10 rounded-2xl">
          <div className="flex flex-col justify-center items-center gap-3">
            <h1 className="text-4xl text-center">Sign up to Home List</h1>
            <p className="text-gray-600">Already have an account? <Link href={'/login'} className="font-medium text-black">Log in</Link></p>
            <div className="bg-[#4d4d4d5b]/30 backdrop-blur-2xl border border-gray-400/30 box-border py-2 px-10 rounded-2xl mt-5 hover:bg-gray-100 transition duration-200">
              <button className="flex justify-center items-center gap-3 cursor-pointer" onClick={registerGoogle}>
                <Image src={googleIcon} alt="googleIcon" width={30} height={30} />
                Sign up with Google
              </button>
            </div>
          </div>

          <div className="w-full flex justify-center items-center gap-3 mt-5">
            <span className="w-[45%] h-px bg-black/20"></span>
            <p>Or</p>
            <span className="w-[45%] h-px bg-black/20"></span>
          </div>

          <form onSubmit={createUserDb} method="POST" className="w-full my-10 flex flex-col items-center justify-center gap-10">

            {/* ── Name ── */}
            <div className="flex flex-col w-full relative gap-1">
              <label className="absolute -top-4 left-1">Name</label>
              <input
                type="text"
                name="name"
                className={`border-b py-2 px-2 text-xl focus:outline-none focus:ring-0 transition-colors ${nameError ? 'border-red-400' : 'border-gray-500'}`}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, name: true }))}
                required
              />
              {nameError && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠</span> {nameError}
                </p>
              )}
            </div>

            {/* ── Email ── */}
            <div className="flex flex-col w-full relative gap-1">
              <label className="absolute -top-4 left-1">Email</label>
              <input
                type="text"
                name="email"
                className={`border-b py-2 px-2 text-xl focus:outline-none focus:ring-0 transition-colors ${emailError ? 'border-red-400' : 'border-gray-500'}`}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, email: true }))}
                required
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span>⚠</span> {emailError}
                </p>
              )}
            </div>

            {/* ── Password ── */}
            <div className="w-full flex flex-col relative gap-1">
            <span className="absolute -top-4 left-1">Password</span>
            <div className="relative flex items-center">
                <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`w-full border-b py-2 px-2 pr-10 text-xl focus:outline-none focus:ring-0 transition-colors ${passwordError ? 'border-red-400' : 'border-gray-500'}`}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, password: true }))}
                required
                />
                <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                tabIndex={-1}
                >
                <Image
                    src={showPassword ? noSeePass : seePass}
                    alt={showPassword ? "Hide password" : "Show password"}
                    width={22}
                    height={22}
                />
                </button>
            </div>
            {passwordError && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <span>⚠</span> {passwordError}
                </p>
            )}
            {touched.password && !passwordError && password.length > 0 && (
                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <span>✓</span> Contraseña válida
                </p>
            )}
            </div>

            {/* ── General form error ── */}
            {formError !== false && (
              <div className="w-full rounded-2xl border border-red-400 bg-red-100 px-4 py-3 text-red-800 shadow-sm">
                {typeof formError === 'string' ? formError : 'Please fill all the inputs'}
              </div>
            )}

            <button
              className="w-full mt-6 bg-black text-white font-semibold py-3 px-6 rounded-full hover:bg-gray-800 active:bg-gray-900 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={hasValidationErrors && (touched.name || touched.email || touched.password)}
            >
              Sign up
            </button>
          </form>
        </div>

        {/* ── Check email modal (mejorado) ── */}
        {checkMail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-[90%] max-w-md bg-white/80 backdrop-blur-2xl shadow-2xl rounded-3xl flex flex-col justify-center items-center gap-5 px-10 py-14 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shadow-inner">
                <Image src={mailIcon} alt="CheckMail" width={36} height={36} />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                  We sent a verification link to <span className="font-medium text-black">{email}</span>. 
                  Please check your inbox (and spam folder) to activate your account.
                </p>
              </div>
              <Link
                href="/login"
                className="mt-2 text-sm text-gray-500 underline underline-offset-2 hover:text-black transition-colors"
              >
                Back to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
    )
}