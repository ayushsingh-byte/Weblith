import { useState } from 'react'
import Icons from '../components/ui/Icons'

export default function DomainPage({ sites }) {
  const [siteId, setSiteId] = useState(sites[0]?.id)
  const site = sites.find(s => s.id === siteId)
  const [domains, setDomains] = useState([
    { name: 'studio-halcyon.com', primary: true, status: 'live', ssl: 'auto', issued: 'Apr 12, 2026', expires: 'Jul 11, 2026' },
    { name: 'www.studio-halcyon.com', primary: false, status: 'live', ssl: 'auto', issued: 'Apr 12, 2026', expires: 'Jul 11, 2026' },
    { name: 'halcyon.studio', primary: false, status: 'pending', ssl: '—', issued: '—', expires: '—' },
  ])
  const [showWiz, setShowWiz] = useState(false)
  const [wizStep, setWizStep] = useState(1)
  const [wizDomain, setWizDomain] = useState('')
  const [verifying, setVerifying] = useState(false)

  const verify = () => {
    setVerifying(true)
    setTimeout(() => { setVerifying(false); setWizStep(3) }, 1600)
  }

  return (
    <div className="page fade-in">
      <div className="page-hero">
        <div>
          <div className="eyebrow">Domains · {site?.name}</div>
          <h1 className="display" style={{ fontSize: 30, marginTop: 10 }}>Connect a domain</h1>
          <p className="subtitle" style={{ fontSize: 14 }}>Map any domain you own to your site. Auto-SSL via Let's Encrypt.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="input" value={siteId} onChange={e => setSiteId(e.target.value)} style={{ width: 200, height: 36 }}>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button className="btn btn-primary press" onClick={() => { setShowWiz(true); setWizStep(1); setWizDomain('') }}>
            <Icons.plus size={13} /> Add domain
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 18, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent-ink)', display: 'grid', placeItems: 'center' }}>
          <Icons.bolt size={16} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>Default subdomain</div>
          <div className="mono" style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{site?.domain}</div>
        </div>
        <span className="chip chip-ok"><Icons.check size={11} /> Always available</span>
        <button className="btn btn-secondary btn-sm press"><Icons.external size={12} /> Visit</button>
      </div>

      <div className="card" style={{ overflow: 'hidden', marginBottom: 14 }}>
        <div className="section-bar">
          <div>
            <h3 className="eyebrow">Custom domains</h3>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{domains.length} connected</div>
          </div>
          <button className="btn btn-secondary btn-sm press"><Icons.refresh size={12} /> Re-check DNS</button>
        </div>
        {domains.map(d => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--bg-sunk)', display: 'grid', placeItems: 'center' }}>
              <Icons.globe size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong style={{ fontSize: 13.5 }} className="mono">{d.name}</strong>
                {d.primary && <span className="chip chip-accent">Primary</span>}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 4, display: 'flex', gap: 14 }}>
                {d.status === 'live'
                  ? <><span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}><Icons.lock size={10} /> SSL · {d.ssl}</span><span>Issued {d.issued}</span><span>Renews {d.expires}</span></>
                  : <span>Awaiting DNS verification</span>}
              </div>
            </div>
            <div>
              {d.status === 'live'
                ? <span className="chip chip-ok"><Icons.check size={11} /> Active</span>
                : <span className="chip chip-warn"><span className="spinner" style={{ width: 8, height: 8 }} /> Pending</span>}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="btn btn-icon btn-ghost btn-sm"><Icons.external size={13} /></button>
              <button className="btn btn-icon btn-ghost btn-sm"><Icons.more size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 className="eyebrow" style={{ marginBottom: 14 }}>SSL & security</h3>
          {[
            { l: "Auto-SSL (Let's Encrypt)", s: 'Renews 30 days before expiry', on: true },
            { l: 'HTTP → HTTPS redirect', s: 'Force secure connections', on: true },
            { l: 'HSTS preload', s: 'Browser-enforced HTTPS', on: false },
            { l: 'WWW redirect', s: 'www → root domain', on: true },
          ].map((x, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--line)' : 'none' }}>
              <Icons.shield size={16} style={{ color: 'var(--ink-3)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{x.l}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{x.s}</div>
              </div>
              <div className={`switch ${x.on ? 'on' : ''}`} />
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 className="eyebrow" style={{ marginBottom: 14 }}>Nameservers (optional)</h3>
          <p style={{ fontSize: 12.5, color: 'var(--ink-2)', marginBottom: 14 }}>For full DNS control via Forge, point your registrar to:</p>
          <div className="card" style={{ background: 'var(--bg-sunk)', padding: 14, marginBottom: 12 }}>
            {['ns1.forge.site', 'ns2.forge.site', 'ns3.forge.site', 'ns4.forge.site'].map((n, i) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < 3 ? '1px solid var(--line)' : 'none' }}>
                <span className="mono" style={{ fontSize: 12, flex: 1 }}>{n}</span>
                <button className="btn btn-icon btn-ghost btn-sm"><Icons.copy size={12} /></button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm press"><Icons.copy size={12} /> Copy all</button>
            <button className="btn btn-ghost btn-sm">Setup guide <Icons.external size={11} /></button>
          </div>
        </div>
      </div>

      {showWiz && (
        <div className="modal-overlay" onClick={() => setShowWiz(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 580 }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 600 }}>Add custom domain</h3>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>Step {wizStep} of 3</div>
              </div>
              <button className="btn btn-icon btn-ghost" onClick={() => setShowWiz(false)}><Icons.x size={14} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 22 }}>
                {[1,2,3].map(n => (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', flex: n < 3 ? 1 : 'none', gap: 4 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: n < wizStep || (n === 3 && wizStep === 3) ? 'var(--ok)' : n === wizStep ? 'var(--accent)' : 'var(--bg-sunk)',
                      color: n <= wizStep ? 'white' : 'var(--ink-3)',
                      display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600,
                      border: '1px solid ' + (n <= wizStep ? 'transparent' : 'var(--line)')
                    }}>{n < wizStep ? '✓' : n}</div>
                    {n < 3 && <div style={{ flex: 1, height: 2, background: n < wizStep ? 'var(--ok)' : 'var(--line)' }} />}
                  </div>
                ))}
              </div>

              {wizStep === 1 && (
                <>
                  <h4 style={{ fontSize: 15, marginBottom: 6 }}>Enter your domain</h4>
                  <p style={{ fontSize: 12.5, color: 'var(--ink-2)', marginBottom: 16 }}>Use a domain you've already purchased from any registrar.</p>
                  <input className="input" placeholder="example.com" value={wizDomain} onChange={e => setWizDomain(e.target.value)} autoFocus />
                  <button className="btn btn-primary press" disabled={!wizDomain} onClick={() => setWizStep(2)} style={{ width: '100%', marginTop: 14 }}>
                    Continue <Icons.arrowRight size={13} />
                  </button>
                </>
              )}

              {wizStep === 2 && (
                <>
                  <h4 style={{ fontSize: 15, marginBottom: 6 }}>Configure DNS</h4>
                  <p style={{ fontSize: 12.5, color: 'var(--ink-2)', marginBottom: 16 }}>Add these records in your registrar's DNS panel:</p>
                  <div className="card" style={{ background: 'var(--bg-sunk)', padding: 0, overflow: 'hidden', marginBottom: 14 }}>
                    <table className="tbl">
                      <thead><tr><th>Type</th><th>Name</th><th>Value</th><th>TTL</th></tr></thead>
                      <tbody>
                        <tr><td><span className="chip">A</span></td><td className="mono">@</td><td className="mono">76.76.21.21</td><td className="mono">3600</td></tr>
                        <tr><td><span className="chip">CNAME</span></td><td className="mono">www</td><td className="mono">cname.forge.site</td><td className="mono">3600</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary press" style={{ flex: 1 }} onClick={() => setWizStep(1)}><Icons.arrowLeft size={13} /> Back</button>
                    <button className="btn btn-primary press" style={{ flex: 2 }} onClick={verify} disabled={verifying}>
                      {verifying ? <><span className="spinner" /> Verifying...</> : <>Verify connection <Icons.arrowRight size={13} /></>}
                    </button>
                  </div>
                </>
              )}

              {wizStep === 3 && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ width: 56, height: 56, margin: '0 auto 16px', borderRadius: '50%', background: 'var(--ok-soft)', color: 'var(--ok)', display: 'grid', placeItems: 'center' }}>
                    <Icons.check size={26} />
                  </div>
                  <h4 style={{ fontSize: 17, marginBottom: 6 }}>Domain verified!</h4>
                  <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 4 }}>SSL certificate issued via Let's Encrypt.</p>
                  <p className="mono" style={{ fontSize: 13, color: 'var(--accent-ink)', marginBottom: 20 }}>{wizDomain}</p>
                  <button className="btn btn-primary press" style={{ width: '100%' }} onClick={() => {
                    setDomains(d => [...d, { name: wizDomain, primary: false, status: 'live', ssl: 'auto', issued: 'today', expires: '90 days' }])
                    setShowWiz(false)
                  }}>Done</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
