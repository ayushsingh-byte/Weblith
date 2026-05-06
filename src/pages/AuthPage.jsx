import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Icons from '../components/ui/Icons'

export default function AuthPage() {
  const [mode, setMode]         = useState('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [info, setInfo]         = useState('')
  const [shake, setShake]       = useState(false)
  const [showPw, setShowPw]     = useState(false)
  const [forgotMode, setForgotMode] = useState(false)

  const triggerShake = (msg) => {
    setError(msg); setShake(true); setTimeout(() => setShake(false), 400)
  }

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setInfo('')
    if (!email.includes('@')) return triggerShake('Enter a valid email address')
    if (!forgotMode && password.length < 6) return triggerShake('Password must be at least 6 characters')
    setLoading(true)

    if (forgotMode) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      })
      setLoading(false)
      if (error) return triggerShake(error.message)
      setInfo('Check your email — we sent a reset link.')
      return
    }

    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { name: name || email.split('@')[0] } },
      })
      setLoading(false)
      if (error) return triggerShake(error.message)
      setInfo('Check your email to confirm your account.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (error) return triggerShake(error.message)
      // session handled by onAuthStateChange in App.jsx
    }
  }

  const oAuth = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    })
  }

  return (
    <div className="auth-shell">
      {/* Left brand panel */}
      <div className="auth-art">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
          <div className="brand-mark" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>W</div>
          <span style={{ fontWeight: 600, letterSpacing: '-0.02em', fontSize: 16 }}>Weblith</span>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="eyebrow" style={{ color: 'oklch(0.7 0.04 268)', marginBottom: 18 }}>Build · Edit · Publish</div>
          <h1 className="display" style={{ color: 'var(--bg)', fontSize: 44, lineHeight: 1.05, marginBottom: 18, maxWidth: 460 }}>
            The quiet way to ship a website.
          </h1>
          <p style={{ color: 'oklch(0.78 0.01 80)', fontSize: 15, lineHeight: 1.55, maxWidth: 420 }}>
            Templates, an AI co-writer, and a publisher that just works. No drag-and-drop maze — just clean forms and live preview.
          </p>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 28, color: 'oklch(0.7 0.01 80)', fontSize: 12 }}>
          <div><span style={{ color: 'var(--bg)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', display: 'block' }}>12k+</span>sites published</div>
          <div><span style={{ color: 'var(--bg)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', display: 'block' }}>99.98%</span>uptime</div>
          <div><span style={{ color: 'var(--bg)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', display: 'block' }}>3 min</span>avg. setup</div>
        </div>
      </div>

      {/* Right form */}
      <div className="auth-form-wrap">
        <form className={`auth-form fade-in${shake ? ' shake' : ''}`} onSubmit={submit} style={{ animation: shake ? 'shake .4s' : undefined }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              {forgotMode ? 'Password reset' : mode === 'login' ? 'Welcome back' : 'Create your workspace'}
            </div>
            <h2 className="title" style={{ fontSize: 28, marginBottom: 6 }}>
              {forgotMode ? 'Reset your password' : mode === 'login' ? 'Sign in to Weblith' : "Get started — it's free"}
            </h2>
            <p className="subtitle">
              {forgotMode ? "We'll email you a reset link." : mode === 'login' ? 'Continue editing your sites.' : 'Build up to 3 sites on the free plan.'}
            </p>
          </div>

          {mode === 'register' && !forgotMode && (
            <div>
              <label className="field-label">Full name</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Alex Chen" autoFocus />
            </div>
          )}
          <div>
            <label className="field-label">Email</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@studio.dev" autoFocus={mode === 'login'} required />
          </div>
          {!forgotMode && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="field-label">Password</label>
                {mode === 'login' && (
                  <button type="button" className="field-label" style={{ color: 'var(--accent)', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                    onClick={() => setForgotMode(true)}>Forgot?</button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ paddingRight: 40 }} required />
                <button type="button" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--ink-3)', cursor: 'pointer', padding: 4 }}
                  onClick={() => setShowPw(v => !v)}>
                  {showPw ? <Icons.eyeOff size={14} /> : <Icons.eye size={14} />}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: 'var(--err-soft)', color: 'var(--err)', padding: '10px 12px', borderRadius: 8, fontSize: 13, border: '1px solid oklch(0.88 0.06 25)' }}>
              {error}
            </div>
          )}
          {info && (
            <div style={{ background: 'var(--ok-soft)', color: 'var(--ok)', padding: '10px 12px', borderRadius: 8, fontSize: 13, border: '1px solid oklch(0.85 0.08 155)' }}>
              {info}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading
              ? <><span className="spinner" /> {forgotMode ? 'Sending…' : mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
              : forgotMode ? 'Send reset link' : mode === 'login' ? 'Sign in' : 'Create account'
            }
          </button>

          {forgotMode ? (
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-2)' }}>
              <button type="button" onClick={() => { setForgotMode(false); setError(''); setInfo('') }}
                style={{ color: 'var(--accent)', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 500 }}>
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--ink-3)', fontSize: 12 }}>
                <hr className="divider" style={{ flex: 1, margin: 0 }} />
                <span>or continue with</span>
                <hr className="divider" style={{ flex: 1, margin: 0 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button type="button" className="btn btn-secondary press" onClick={() => oAuth('google')}>
                  <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button type="button" className="btn btn-secondary press" onClick={() => oAuth('github')}>
                  <Icons.github size={14} /> GitHub
                </button>
              </div>
              <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-2)', marginTop: 4 }}>
                {mode === 'login' ? 'New to Weblith? ' : 'Already have an account? '}
                <button type="button" onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); setInfo('') }}
                  style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 500, background: 'none', border: 'none' }}>
                  {mode === 'login' ? 'Create an account' : 'Sign in'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
