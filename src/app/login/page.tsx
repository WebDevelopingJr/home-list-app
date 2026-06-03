'use client';
import Link from 'next/link'
import Image from "next/image"

import googleIcon from '../../../public/login-img/googleLogo.png'
import seePass from '../../../public/login-img/see-password.png'
import noSeePass from '../../../public/login-img/no-see-password.png'
import { useState } from "react"
import { loginUser } from "../databaseconfig/serverAuth";
import { registerGoogle } from '../databaseconfig/serverGoogleAuth'
import { useRouter } from "next/navigation";

// ── Validation helpers ──────────────────────────────────────────────────────

function validateEmail(email: string): string | null {
  if (!email) return null
  if (!email.includes('@'))             return 'Email must contain @'
  const [local, domain] = email.split('@')
  if (!local || local.length === 0)     return 'Missing name before @'
  if (!domain || !domain.includes('.')) return 'Domain must contain a dot (e.g. gmail.com)'
  const parts = domain.split('.')
  if (parts.some(p => p.length === 0))  return 'Domain is not valid'
  return null
}

function validatePassword(password: string): string | null {
  if (!password) return null
  if (password.length < 6)         return 'Password must be at least 6 characters'
  if (!/[a-zA-Z]/.test(password))  return 'Password must contain at least one letter'
  return null
}

// ── Component ───────────────────────────────────────────────────────────────

export default function LogIn() {
  const afterLogin = useRouter()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [touched, setTouched]   = useState({ email: false, password: false })
  const [formError, setFormError] = useState<string | null>(null)

  const emailError    = touched.email    ? validateEmail(email)       : null
  const passwordError = touched.password ? validatePassword(password) : null
  const hasValidationErrors = !!(emailError || passwordError)

  async function logUserIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (validateEmail(email) || validatePassword(password)) return

    try {
      const loginSuccesfull = await loginUser(email, password)
      if (loginSuccesfull) {
        afterLogin.push('/dashboard')
      } else {
        setFormError('Incorrect email or password. Please try again.')
      }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An error occurred while creating the account. Please try again.'
        setFormError(message)
    }
  }

  return (
    <>
      <div className="w-full h-screen flex items-center justify-center bg-linear-to-b from-[#cae0e5] via-[#c5d3d7] to-[#b9ccd1]">
        <div className="w-[90%] max-w-150 h-auto flex flex-col justify-center items-center bg-[#ffffff60] backdrop-blur-2xl p-10 rounded-2xl">

          <div className="flex flex-col justify-center items-center gap-3">
            <h1 className="text-4xl text-center">Log in to Home List</h1>
            <p className="text-gray-600">Don't have an account? <Link href={'/signup'} className="font-medium text-black">Sign up</Link></p>
            <div className="bg-[#4d4d4d5b]/30 backdrop-blur-2xl border border-gray-400/30 box-border py-2 px-10 rounded-2xl mt-5 hover:bg-gray-100 transition duration-200">
              <button className="flex justify-center items-center gap-3 cursor-pointer" onClick={registerGoogle}>
                <Image src={googleIcon} alt="googleIcon" width={30} height={30} />
                Log in with Google
              </button>
            </div>
          </div>

          <div className="w-full flex justify-center items-center gap-3 mt-5">
            <span className="w-[45%] h-px bg-black/20"></span>
            <p>Or</p>
            <span className="w-[45%] h-px bg-black/20"></span>
          </div>

          <form onSubmit={logUserIn} method="POST" className="w-full my-10 flex flex-col items-center justify-center gap-10">

            {/* ── Email ── */}
            <div className="flex flex-col w-full relative gap-1">
              <label className="absolute -top-4 left-1">Email</label>
              <input
                type="text"
                name="email"
                className={`border-b py-2 px-2 text-xl focus:outline-none focus:ring-0 transition-colors ${emailError ? 'border-red-400' : 'border-gray-500'}`}
                onChange={(e) => { setEmail(e.target.value); setFormError(null) }}
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
                  onChange={(e) => { setPassword(e.target.value); setFormError(null) }}
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
            </div>

            {/* ── General form error ── */}
            {formError && (
              <div className="w-full rounded-2xl border border-red-400 bg-red-100 px-4 py-3 text-red-800 shadow-sm">
                {formError}
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-6 bg-black text-white font-semibold py-3 px-6 rounded-full hover:bg-gray-800 active:bg-gray-900 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={hasValidationErrors && (touched.email || touched.password)}
            >
              Log in
            </button>

          </form>
        </div>
      </div>
    </>
  )
}