import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'

import loginArtwork from '../assets/Login.png'
import logoPayments from '../assets/Logo_P.png'

type LoginPageProps = {
  onLogin: (email: string, keepSignedIn: boolean) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(true)
  const [message, setMessage] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onLogin(email.trim(), keepSignedIn)
  }

  return (
    <main className="grid min-h-screen overflow-hidden bg-[#071a38] lg:grid-cols-[48%_52%]">
      <section className="relative z-10 hidden min-h-screen overflow-hidden bg-transparent text-white lg:flex lg:flex-col lg:px-12 lg:pt-[108px] xl:px-20">
        <img src={loginArtwork} alt="BNPRS Chat conversations, calls, and shared files" className="absolute bottom-0 left-[8%] h-[58%] w-[88%] object-cover object-center opacity-80" />
        <div className="relative z-10 w-full max-w-[560px]">
          <img src={logoPayments} alt="BNPRS Payments" className="mb-7 w-[280px] max-w-full object-contain object-left xl:w-[320px]" />
          <h1 className="text-[30px] font-semibold">Connect. Collaborate. <span className="text-[#ff9f2f]">Move Faster.</span></h1>
          <p className="mt-3 max-w-[460px] text-[18px] leading-7 text-white/70">Secure messaging and collaboration for the BNPRS team.</p>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-[#071a38] px-5 py-8 sm:px-8 lg:px-10">
        <div className="w-full max-w-[500px] rounded-xl border border-[#e5e7eb] bg-white px-6 py-8 shadow-[0_16px_44px_rgba(0,0,0,0.16)] sm:px-10 sm:py-10 lg:px-12">
          <div className="mb-9 text-center">
            <h2 className="text-[25px] font-semibold text-[#10264a]">Sign in to BNPRS Chat</h2>
            <p className="mt-2 text-[13px] text-[#6b7280]">Access your workspace to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <label className="flex h-[54px] items-center gap-4 rounded-md border border-[#d9e0eb] px-4 text-[#7b8799] transition-colors focus-within:border-[#F2992F] focus-within:ring-2 focus-within:ring-[#F2992F]/15">
              <Mail size={19} />
              <input required type="text" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email or Username" aria-label="Email or Username" className="h-full min-w-0 flex-1 border-0 bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#8792a5]" />
            </label>

            <label className="flex h-[54px] items-center gap-4 rounded-md border border-[#d9e0eb] px-4 text-[#7b8799] transition-colors focus-within:border-[#F2992F] focus-within:ring-2 focus-within:ring-[#F2992F]/15">
              <LockKeyhole size={18} />
              <input required type={passwordVisible ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" aria-label="Password" className="h-full min-w-0 flex-1 border-0 bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#8792a5]" />
              <button type="button" onClick={() => setPasswordVisible((visible) => !visible)} aria-label={passwordVisible ? 'Hide password' : 'Show password'} className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-[#7b8799] hover:text-[#F2992F]">
                {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>

            <div className="flex items-center justify-between gap-3 py-1 text-[12px]">
              <label className="flex items-center gap-2 text-[#4b5563]">
                <input type="checkbox" checked={keepSignedIn} onChange={(event) => setKeepSignedIn(event.target.checked)} className="h-4 w-4 accent-[#10264a]" />
                Keep me signed in
              </label>
              <button type="button" onClick={() => setMessage('Contact your workspace administrator to reset your password.')} className="text-[#1674dc] underline underline-offset-2">Forgot password?</button>
            </div>

            {message ? <p role="status" className="text-[12px] text-[#52627a]">{message}</p> : null}

            <button type="submit" className="mt-1 flex h-[54px] w-full items-center justify-center gap-2 rounded-md bg-[#F2992F] text-[15px] font-semibold text-white transition-colors hover:bg-[#e58b21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2992F]">
              Sign In
              <ArrowRight size={19} />
            </button>
          </form>

          <p className="mt-7 text-center text-[11px] text-[#7b8799]">© 2026 BNPRS. All rights reserved.</p>
        </div>
      </section>
    </main>
  )
}