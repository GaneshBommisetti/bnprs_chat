import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'

import loginArtwork from '../assets/Login.png'
import logoPayments from '../assets/logo-lockup-dark.png'
import './Login.css'

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
    <main className="login-layout">
      <section className="login-form-panel" aria-labelledby="login-heading">
        <div className="login-form-content">
          <header className="login-brand-row">
            <img src={logoPayments} alt="BNPRS Chat" className="login-logo" />
            <span className="login-workspace-label"><i /> TEAM WORKSPACE</span>
          </header>

          <div className="login-intro">
            <p className="login-eyebrow">YOUR TEAM, IN SYNC</p>
            <h1 id="login-heading">Welcome back</h1>
            <p>Sign in to pick up where your team left off.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field-group">
              <label htmlFor="login-email">Email or username</label>
              <div className="login-input-wrap">
                <Mail size={19} aria-hidden="true" />
                <input id="login-email" name="username" required type="text" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" />
              </div>
            </div>

            <div className="login-field-group">
              <label htmlFor="login-password">Password</label>
              <div className="login-input-wrap">
                <LockKeyhole size={18} aria-hidden="true" />
                <input id="login-password" name="password" required type={passwordVisible ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" />
                <button type="button" onClick={() => setPasswordVisible((visible) => !visible)} aria-label={passwordVisible ? 'Hide password' : 'Show password'}>
                  {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="login-remember">
                <input type="checkbox" checked={keepSignedIn} onChange={(event) => setKeepSignedIn(event.target.checked)} />
                Keep me signed in
              </label>
              <button type="button" onClick={() => setMessage('Contact your workspace administrator to reset your password.')}>Forgot password?</button>
            </div>

            {message ? <p role="status" className="login-message">{message}</p> : null}

            <button type="submit" className="login-submit">
              Sign in <ArrowRight size={19} />
            </button>
          </form>

          <div className="login-assurance"><ShieldCheck size={17} /><span>Private access for your BNPRS workspace</span></div>
          <footer className="login-copyright">© 2026 BNPRS. All rights reserved.</footer>
        </div>
      </section>

      <aside className="login-hero" aria-label="BNPRS Chat collaboration tools">
        <img src={loginArtwork} alt="A preview of BNPRS team chat, video meetings, and shared files" className="login-hero-art" />
        <div className="login-hero-copy">
          <p className="login-eyebrow">BUILT FOR THE WAY YOU WORK</p>
          <h2>One team.<br />Every conversation in sync.</h2>
          <p>Chat, meet, and share files in one focused workspace.</p>
        </div>
        <div className="login-hero-footer"><span /><span>BNPRS CHAT</span><span>MESSAGING · MEETINGS · FILES</span></div>
      </aside>
    </main>
  )
}