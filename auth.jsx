/* global React, Icons, MOCK_USER */
const { useState } = React;

function AuthScreen({ mode, onSwitch, onAuth }) {
  const [email, setEmail] = useState(mode === 'login' ? "alex@studio.dev" : "");
  const [password, setPassword] = useState(mode === 'login' ? "••••••••" : "");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!email.includes('@')) { setError("Enter a valid email"); setShake(true); setTimeout(() => setShake(false), 400); return; }
    if (password.length < 4) { setError("Password is too short"); setShake(true); setTimeout(() => setShake(false), 400); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onAuth({ email, name: name || MOCK_USER.name }); }, 900);
  };

  return (
    <div className="auth-shell">
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
      <div className="auth-form-wrap">
        <form className={`auth-form fade-in${shake ? ' shake' : ''}`} onSubmit={submit}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>{mode === 'login' ? 'Welcome back' : 'Create your workspace'}</div>
            <h2 className="title" style={{ fontSize: 28, marginBottom: 6 }}>{mode === 'login' ? 'Sign in to Weblith' : 'Get started — it\'s free'}</h2>
            <p className="subtitle">{mode === 'login' ? 'Continue editing your sites.' : 'Build up to 3 sites on the free plan.'}</p>
          </div>

          {mode === 'register' && (
            <div>
              <label className="field-label">Full name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Chen" autoFocus />
            </div>
          )}
          <div>
            <label className="field-label">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.dev" autoFocus={mode === 'login'} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="field-label">Password</label>
              {mode === 'login' && <a className="field-label" style={{ color: 'var(--accent)', cursor: 'pointer' }}>Forgot?</a>}
            </div>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          {error && (
            <div style={{ background: 'oklch(0.96 0.04 25)', color: 'var(--err)', padding: '10px 12px', borderRadius: 8, fontSize: 13, border: '1px solid oklch(0.88 0.06 25)' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? <><span className="spinner" /> {mode === 'login' ? 'Signing in…' : 'Creating account…'}</> : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--ink-3)', fontSize: 12 }}>
            <hr className="divider" style={{ flex: 1, margin: 0 }} />
            <span>or continue with</span>
            <hr className="divider" style={{ flex: 1, margin: 0 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button type="button" className="btn btn-secondary"><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>G</span> Google</button>
            <button type="button" className="btn btn-secondary"><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{'</>'}</span> GitHub</button>
          </div>

          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-2)', marginTop: 4 }}>
            {mode === 'login' ? "New to Weblith? " : "Already have an account? "}
            <a onClick={onSwitch} style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>
              {mode === 'login' ? 'Create an account' : 'Sign in'}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

window.AuthScreen = AuthScreen;
