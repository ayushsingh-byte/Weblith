import { useState } from 'react'
import Icons from '../components/ui/Icons'

export default function DeployPage({ sites }) {
  const [siteId, setSiteId] = useState(sites[0]?.id)
  const site = sites.find(s => s.id === siteId)
  const [running, setRunning] = useState(false)
  const [stage, setStage] = useState(3)
  const [log, setLog] = useState([])
  const [tab, setTab] = useState('pipeline')
  const [envs, setEnvs] = useState([
    { k: 'API_URL', v: 'https://api.weblith.site', secret: false },
    { k: 'SUPABASE_KEY', v: '••••••••••••••••', secret: true },
    { k: 'STRIPE_PK', v: 'pk_live_••••', secret: true },
  ])
  const [newK, setNewK] = useState('')
  const [newV, setNewV] = useState('')

  const stages = ['Queued', 'Building', 'Bundling', 'Uploading', 'Live']

  const deploy = () => {
    setRunning(true); setStage(0); setLog([])
    const lines = [
      { t: 'info', m: '$ weblith deploy --prod' },
      { t: 'info', m: 'Resolving build environment...' },
      { t: 'info', m: '✓ Node 20.11.0 · npm 10.4.0' },
      { t: 'info', m: '→ Installing dependencies (cached)' },
      { t: 'ok',   m: '✓ 142 packages restored in 1.8s' },
      { t: 'info', m: '→ Building site bundle' },
      { t: 'info', m: '  · Optimizing 12 images' },
      { t: 'info', m: '  · Generating static HTML for 4 pages' },
      { t: 'ok',   m: '✓ Build completed (4.2s) · 312KB gzipped' },
      { t: 'info', m: '→ Uploading to edge CDN (38 PoPs)' },
      { t: 'info', m: '  · Invalidating cache' },
      { t: 'ok',   m: `✓ Deploy live · ${site?.slug || 'site'}.weblith.site` },
    ]
    lines.forEach((l, i) => {
      setTimeout(() => {
        setLog(prev => [...prev, l])
        if (i === 4) setStage(1)
        if (i === 8) setStage(2)
        if (i === 10) setStage(3)
        if (i === lines.length - 1) { setStage(4); setRunning(false) }
      }, 280 * (i + 1))
    })
  }

  const deploys = [
    { id: 'd9', sha: '3a4f81c', branch: 'main', msg: 'Updated hero copy and added testimonials section', status: 'live', when: 'just now', dur: '4.2s', author: 'AC' },
    { id: 'd8', sha: '8e21fa0', branch: 'main', msg: 'Added work grid layout with hover states', status: 'previous', when: '2h ago', dur: '3.8s', author: 'AC' },
    { id: 'd7', sha: '0c19b22', branch: 'feat/about', msg: 'Drafted about page with team carousel', status: 'previous', when: 'yesterday', dur: '6.1s', author: 'MR' },
    { id: 'd6', sha: 'b71f902', branch: 'main', msg: 'Initial publish', status: 'previous', when: '3 days ago', dur: '5.4s', author: 'AC' },
    { id: 'd5', sha: 'e0aa334', branch: 'main', msg: 'Setup project scaffold', status: 'failed', when: '5 days ago', dur: '—', author: 'AC' },
  ]

  const tabItems = [
    { id: 'pipeline', label: 'Build log', icon: Icons.code },
    { id: 'history', label: 'Deployments', icon: Icons.history },
    { id: 'env', label: 'Environment vars', icon: Icons.key },
    { id: 'settings', label: 'Build settings', icon: Icons.settings },
  ]

  return (
    <div className="page fade-in">
      <div className="page-hero">
        <div>
          <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="live-pill"><span className="live-dot" /> Production live</span>
          </div>
          <h1 className="display" style={{ fontSize: 30, marginTop: 10 }}>Deploy</h1>
          <p className="subtitle" style={{ fontSize: 14 }}>Ship the latest commit to the global edge in seconds.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="input" value={siteId} onChange={e => setSiteId(e.target.value)} style={{ width: 200, height: 36 }}>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button className="btn btn-secondary press"><Icons.history size={13} /> Rollback</button>
          <button className="btn btn-primary press" onClick={deploy} disabled={running}>
            {running ? <><span className="spinner" /> Deploying</> : <><Icons.bolt size={13} /> Deploy now</>}
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '8px 32px 24px', marginBottom: 16 }}>
        <div className="pipeline">
          {stages.map((s, i) => (
            <div key={s} className={`pipeline-step ${i < stage ? 'done' : i === stage && running ? 'active' : i === stage && !running && stage === 4 ? 'done' : ''}`}>
              <div className="pipeline-node">
                {i < stage || (i === stage && stage === 4 && !running) ? <Icons.check size={14} /> : <span style={{ fontSize: 12, fontWeight: 600 }}>{i + 1}</span>}
              </div>
              <div className="pipeline-label">{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 14, borderBottom: '1px solid var(--line)' }}>
        {tabItems.map(t => {
          const I = t.icon
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className="press" style={{
              padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer',
              borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              color: tab === t.id ? 'var(--ink)' : 'var(--ink-3)', fontSize: 13, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 7, marginBottom: -1
            }}>
              <I size={13} /> {t.label}
            </button>
          )
        })}
      </div>

      {tab === 'pipeline' && (
        <div className="card" style={{ background: 'oklch(0.16 0.01 270)', color: 'oklch(0.92 0.005 80)', border: 'none', overflow: 'hidden', minHeight: 360 }}>
          <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid oklch(1 0 0 / 0.08)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            <span className="live-dot" />
            <span>deploy.{site?.slug || 'site'}.log</span>
            <span style={{ marginLeft: 'auto', color: 'oklch(0.6 0.01 80)' }}>{running ? 'streaming…' : log.length === 0 ? 'idle' : 'completed'}</span>
            <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'oklch(0.7 0.01 80)' }}><Icons.copy size={12} /></button>
          </div>
          <pre style={{ margin: 0, padding: 18, fontFamily: 'var(--font-mono)', fontSize: 12, minHeight: 320, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {log.length === 0 && <span style={{ opacity: 0.5 }}># Press "Deploy now" to ship the latest build...</span>}
            {log.map((l, i) => (
              <div key={i} className="fade-in">
                <span style={{ color: 'oklch(0.5 0.01 80)' }}>[{new Date().toLocaleTimeString()}]</span>{' '}
                <span style={{ color: l.t === 'ok' ? 'oklch(0.78 0.14 155)' : 'oklch(0.92 0.005 80)' }}>{l.m}</span>
              </div>
            ))}
            {running && <span>▍</span>}
          </pre>
        </div>
      )}

      {tab === 'history' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="tbl">
            <thead><tr><th>Status</th><th>Commit</th><th>Branch</th><th>Author</th><th>Duration</th><th>When</th><th></th></tr></thead>
            <tbody>
              {deploys.map(d => (
                <tr key={d.id}>
                  <td>
                    {d.status === 'live' && <span className="chip chip-ok"><Icons.check size={10} /> Live</span>}
                    {d.status === 'previous' && <span className="chip">Previous</span>}
                    {d.status === 'failed' && <span className="chip chip-err"><Icons.x size={10} /> Failed</span>}
                  </td>
                  <td>
                    <div style={{ fontSize: 12.5, fontWeight: 500 }}>{d.msg}</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{d.sha}</div>
                  </td>
                  <td><span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-2)' }}>{d.branch}</span></td>
                  <td><div className="avatar" style={{ width: 24, height: 24, fontSize: 9.5, background: 'var(--accent)' }}>{d.author}</div></td>
                  <td className="mono" style={{ color: 'var(--ink-2)' }}>{d.dur}</td>
                  <td style={{ color: 'var(--ink-2)' }}>{d.when}</td>
                  <td style={{ textAlign: 'right' }}>
                    {d.status === 'previous'
                      ? <button className="btn btn-ghost btn-sm">Rollback</button>
                      : <button className="btn btn-icon btn-ghost btn-sm"><Icons.more size={13} /></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'env' && (
        <div className="card" style={{ padding: 22 }}>
          <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 16 }}>Environment variables are encrypted at rest and exposed at build time.</p>
          {envs.map((e, i) => (
            <div key={i} className="kv-row">
              <span className="kv-key">{e.k}</span>
              <input className="input mono" defaultValue={e.v} type={e.secret ? 'password' : 'text'} style={{ height: 34 }} />
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="btn btn-icon btn-ghost btn-sm"><Icons.eye size={13} /></button>
                <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setEnvs(es => es.filter((_, j) => j !== i))} style={{ color: 'var(--err)' }}><Icons.trash size={13} /></button>
              </div>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--line)', marginTop: 16, paddingTop: 16 }}>
            <div className="kv-row">
              <input className="input mono" placeholder="KEY_NAME" value={newK} onChange={e => setNewK(e.target.value)} style={{ height: 34 }} />
              <input className="input mono" placeholder="value" value={newV} onChange={e => setNewV(e.target.value)} style={{ height: 34 }} />
              <button className="btn btn-primary btn-sm press" disabled={!newK}
                onClick={() => { setEnvs(es => [...es, { k: newK, v: newV, secret: false }]); setNewK(''); setNewV('') }}>
                <Icons.plus size={12} /> Add
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="card" style={{ padding: 22 }}>
            <h3 className="eyebrow" style={{ marginBottom: 14 }}>Build configuration</h3>
            <label className="field"><span>Framework preset</span>
              <select className="input" defaultValue="static">
                <option value="static">Static (auto-detect)</option>
                <option>Next.js</option><option>Astro</option><option>Vite</option>
              </select>
            </label>
            <label className="field"><span>Build command</span><input className="input mono" defaultValue="npm run build" /></label>
            <label className="field"><span>Output directory</span><input className="input mono" defaultValue="dist" /></label>
            <label className="field"><span>Node version</span>
              <select className="input" defaultValue="20"><option>20</option><option>18</option><option>16</option></select>
            </label>
          </div>
          <div className="card" style={{ padding: 22 }}>
            <h3 className="eyebrow" style={{ marginBottom: 14 }}>Deploy hooks</h3>
            <p style={{ fontSize: 12.5, color: 'var(--ink-2)', marginBottom: 14 }}>Trigger production builds from external services via these hooks.</p>
            {[
              { name: 'CMS publish', url: 'https://weblith.site/hooks/d9f3...', when: 'last fired 2h ago' },
              { name: 'Cron daily refresh', url: 'https://weblith.site/hooks/8e2a...', when: 'fires daily at 04:00 UTC' },
            ].map(h => (
              <div key={h.name} style={{ padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: 13 }}>{h.name}</strong>
                  <button className="btn btn-icon btn-ghost btn-sm"><Icons.copy size={12} /></button>
                </div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{h.url}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>{h.when}</div>
              </div>
            ))}
            <button className="btn btn-secondary btn-sm press" style={{ marginTop: 12 }}><Icons.plus size={12} /> New hook</button>
          </div>
        </div>
      )}
    </div>
  )
}
