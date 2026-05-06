import { useState } from 'react'
import Icons from '../components/ui/Icons'

export default function DomainPage({ sites }) {
  const [siteId, setSiteId]     = useState(sites[0]?.id ?? '')
  const site = sites.find(s => s.id === siteId) ?? sites[0]
  const [domains, setDomains]   = useState([])
  const [showWiz, setShowWiz]   = useState(false)
  const [wizStep, setWizStep]   = useState(1)
  const [wizDomain, setWizDomain] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [provisionMode, setProvisionMode] = useState('manual')
  const [cfToken, setCfToken]   = useState('')
  const [cfZone, setCfZone]     = useState('')
  const [autoProvisioning, setAutoProvisioning] = useState(false)

  const verify = () => {
    setVerifying(true)
    setTimeout(() => { setVerifying(false); setWizStep(3) }, 1600)
  }

  const autoProvision = () => {
    setAutoProvisioning(true)
    setTimeout(() => {
      setAutoProvisioning(false)
      setWizStep(3)
    }, 2200)
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
          <button className="btn btn-primary press" onClick={() => { setShowWiz(true); setWizStep(1); setWizDomain(''); setProvisionMode('manual') }}>
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
        {domains.length === 0 ? (
          <div style={{ padding: '36px 24px', textAlign: 'center', color: 'var(--ink-3)' }}>
            <Icons.globe size={28} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.2 }} />
            <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 6 }}>No custom domains yet</div>
            <div style={{ fontSize: 12.5, marginBottom: 14 }}>Add a domain you own to make it point to this site.</div>
            <button className="btn btn-primary btn-sm press" onClick={() => { setShowWiz(true); setWizStep(1) }}>
              <Icons.plus size={12} /> Connect a domain
            </button>
          </div>
        ) : (
          domains.map(d => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderBottom: '1px solid var(--line)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--bg-sunk)', display: 'grid', placeItems: 'center' }}>
                <Icons.globe size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong style={{ fontSize: 13.5 }} className="mono">{d.name}</strong>
                  {d.primary && <span className="chip chip-accent">Primary</span>}
                  {d.auto && <span className="chip" style={{ fontSize: 10 }}>Auto-provisioned</span>}
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
          ))
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 className="eyebrow" style={{ marginBottom: 14 }}>SSL & security</h3>
          {[
            { l: "Auto-SSL (Let's Encrypt)", s: 'Renews 30 days before expiry',  on: true  },
            { l: 'HTTP → HTTPS redirect',    s: 'Force secure connections',       on: true  },
            { l: 'HSTS preload',             s: 'Browser-enforced HTTPS',         on: false },
            { l: 'WWW redirect',             s: 'www → root domain',              on: true  },
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
          <p style={{ fontSize: 12.5, color: 'var(--ink-2)', marginBottom: 14 }}>For full DNS control via Weblith, point your registrar to:</p>
          <div className="card" style={{ background: 'var(--bg-sunk)', padding: 14, marginBottom: 12 }}>
            {['ns1.weblith.site', 'ns2.weblith.site', 'ns3.weblith.site', 'ns4.weblith.site'].map((n, i) => (
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
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 600 }}>Add custom domain</h3>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>Step {wizStep} of 3</div>
              </div>
              <button className="btn btn-icon btn-ghost" onClick={() => setShowWiz(false)}><Icons.x size={14} /></button>
            </div>
            <div className="modal-body">
              {/* Step progress */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 22 }}>
                {[1,2,3].map(n => (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', flex: n < 3 ? 1 : 'none', gap: 4 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%',
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
                  <input className="input" placeholder="example.com" value={wizDomain} onChange={e => setWizDomain(e.target.value)} autoFocus style={{ marginBottom: 16 }} />

                  {/* Provisioning mode selector */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>DNS setup method</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {[
                        { id: 'manual',     icon: Icons.settings, title: 'Manual DNS',         desc: 'Copy records to your registrar' },
                        { id: 'cloudflare', icon: Icons.bolt,      title: 'Auto-provision',     desc: 'Connect Cloudflare to automate' },
                      ].map(m => (
                        <div key={m.id} onClick={() => setProvisionMode(m.id)}
                          className="card" style={{ padding: '12px 14px', cursor: 'pointer',
                            border: provisionMode === m.id ? '2px solid var(--accent)' : '1px solid var(--line)',
                            background: provisionMode === m.id ? 'var(--accent-soft)' : 'var(--bg-elev)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <m.icon size={13} style={{ color: provisionMode === m.id ? 'var(--accent-ink)' : 'var(--ink-3)' }} />
                            <strong style={{ fontSize: 12.5 }}>{m.title}</strong>
                            {m.id === 'cloudflare' && <span className="chip chip-accent" style={{ fontSize: 9 }}>NEW</span>}
                          </div>
                          <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{m.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="btn btn-primary press" disabled={!wizDomain} onClick={() => setWizStep(2)} style={{ width: '100%' }}>
                    Continue <Icons.arrowRight size={13} />
                  </button>
                </>
              )}

              {wizStep === 2 && provisionMode === 'manual' && (
                <>
                  <h4 style={{ fontSize: 15, marginBottom: 6 }}>Configure DNS</h4>
                  <p style={{ fontSize: 12.5, color: 'var(--ink-2)', marginBottom: 16 }}>Add these records in your registrar's DNS panel:</p>
                  <div className="card" style={{ background: 'var(--bg-sunk)', padding: 0, overflow: 'hidden', marginBottom: 14 }}>
                    <table className="tbl">
                      <thead><tr><th>Type</th><th>Name</th><th>Value</th><th>TTL</th></tr></thead>
                      <tbody>
                        <tr><td><span className="chip">A</span></td><td className="mono">@</td><td className="mono">76.76.21.21</td><td className="mono">3600</td></tr>
                        <tr><td><span className="chip">CNAME</span></td><td className="mono">www</td><td className="mono">cname.weblith.site</td><td className="mono">3600</td></tr>
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

              {wizStep === 2 && provisionMode === 'cloudflare' && (
                <>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, padding: '12px 14px', background: 'oklch(0.55 0.18 268 / 0.06)', borderRadius: 8, border: '1px solid oklch(0.55 0.18 268 / 0.2)' }}>
                    <Icons.bolt size={16} style={{ color: 'var(--accent)', marginTop: 1, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Auto-provisioning via Cloudflare</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>Weblith will automatically create DNS records, configure SSL, and set up redirects. No manual steps.</div>
                    </div>
                  </div>
                  <label className="field">
                    <span className="field-label">Cloudflare API token</span>
                    <input className="input mono" placeholder="Paste token from Cloudflare dashboard" value={cfToken} onChange={e => setCfToken(e.target.value)} />
                    <span style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>Needs Zone:DNS:Edit permission for {wizDomain}</span>
                  </label>
                  <label className="field">
                    <span className="field-label">Zone ID</span>
                    <input className="input mono" placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" value={cfZone} onChange={e => setCfZone(e.target.value)} />
                  </label>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <button className="btn btn-secondary press" style={{ flex: 1 }} onClick={() => setWizStep(1)}><Icons.arrowLeft size={13} /> Back</button>
                    <button className="btn btn-primary press" style={{ flex: 2 }} onClick={autoProvision} disabled={!cfToken || !cfZone || autoProvisioning}>
                      {autoProvisioning ? <><span className="spinner" /> Provisioning…</> : <><Icons.bolt size={13} /> Auto-provision</>}
                    </button>
                  </div>
                  {autoProvisioning && (
                    <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--bg-sunk)', borderRadius: 8, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.8 }}>
                      <div className="fade-in">→ Authenticating with Cloudflare...</div>
                      <div className="fade-in" style={{ animationDelay: '0.4s' }}>→ Creating A record...</div>
                      <div className="fade-in" style={{ animationDelay: '0.8s' }}>→ Creating CNAME record...</div>
                      <div className="fade-in" style={{ animationDelay: '1.2s' }}>→ Requesting SSL certificate...</div>
                    </div>
                  )}
                </>
              )}

              {wizStep === 3 && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ width: 56, height: 56, margin: '0 auto 16px', borderRadius: '50%', background: 'var(--ok-soft)', color: 'var(--ok)', display: 'grid', placeItems: 'center' }}>
                    <Icons.check size={26} />
                  </div>
                  <h4 style={{ fontSize: 17, marginBottom: 6 }}>
                    {provisionMode === 'cloudflare' ? 'Domain auto-provisioned!' : 'Domain verified!'}
                  </h4>
                  <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 4 }}>SSL certificate issued via Let's Encrypt.</p>
                  {provisionMode === 'cloudflare' && <p style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 4 }}>DNS records created automatically in Cloudflare.</p>}
                  <p className="mono" style={{ fontSize: 13, color: 'var(--accent-ink)', marginBottom: 20 }}>{wizDomain}</p>
                  <button className="btn btn-primary press" style={{ width: '100%' }} onClick={() => {
                    setDomains(d => [...d, { name: wizDomain, primary: false, status: 'live', ssl: 'auto', issued: 'today', expires: '90 days', auto: provisionMode === 'cloudflare' }])
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
