/* global React, Icons, COLLAB_PEOPLE */
const { useState } = React;

function SettingsPage() {
  const [tab, setTab] = useState('general');
  const [accent, setAccent] = useState('blue');
  const [plan, setPlan] = useState('pro');
  const [domainSearch, setDomainSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [domainResults, setDomainResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const tabs = [
    { id: 'general',      label: 'General',         icon: Icons.settings },
    { id: 'profile',      label: 'Profile',          icon: Icons.user },
    { id: 'team',         label: 'Team',             icon: Icons.users },
    { id: 'subscription', label: 'Subscription',     icon: Icons.bolt },
    { id: 'payments',     label: 'Payment history',  icon: Icons.card },
    { id: 'domains',      label: 'Domains',          icon: Icons.globe2 },
    { id: 'integrations', label: 'Integrations',     icon: Icons.plug },
    { id: 'notifications',label: 'Notifications',    icon: Icons.bell },
    { id: 'security',     label: 'Security',         icon: Icons.shield },
    { id: 'api',          label: 'API tokens',       icon: Icons.key },
    { id: 'danger',       label: 'Danger zone',      icon: Icons.warn, danger: true },
  ];

  const Section = ({ title, desc, children }) => (
    <div style={{ marginBottom: 28 }}>
      <div style={{ marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</h3>
        {desc && <p style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 4 }}>{desc}</p>}
      </div>
      <div className="card" style={{ padding: 22 }}>{children}</div>
    </div>
  );

  const searchDomains = () => {
    if (!domainSearch.trim()) return;
    setSearching(true);
    setTimeout(() => {
      const base = domainSearch.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setDomainResults([
        { name: `${base}.com`,    price: 12.99,  avail: true,  popular: true },
        { name: `${base}.io`,     price: 39.99,  avail: true,  popular: true },
        { name: `${base}.co`,     price: 24.99,  avail: true,  popular: false },
        { name: `${base}.dev`,    price: 14.99,  avail: true,  popular: false },
        { name: `${base}.app`,    price: 18.99,  avail: true,  popular: false },
        { name: `${base}.net`,    price: 13.99,  avail: false, popular: false },
        { name: `${base}.org`,    price: 11.99,  avail: false, popular: false },
        { name: `${base}.studio`, price: 22.99,  avail: true,  popular: false },
      ]);
      setSearching(false);
    }, 900);
  };

  const addToCart = (d) => { if (!cart.find(c => c.name === d.name)) setCart(c => [...c, { ...d, years: 1 }]); };
  const removeFromCart = (name) => setCart(c => c.filter(x => x.name !== name));
  const cartTotal = cart.reduce((s, d) => s + d.price * d.years, 0);

  const USAGE = [
    { label: 'Sites', used: 3, limit: 'Unlimited', pct: 100, unit: '' },
    { label: 'AI tokens', used: 16000, limit: '50,000', pct: 32, unit: '' },
    { label: 'Bandwidth', used: 4.2, limit: '100', pct: 4.2, unit: 'GB' },
    { label: 'Media storage', used: 1.8, limit: '10', pct: 18, unit: 'GB' },
    { label: 'Team seats', used: 3, limit: '5', pct: 60, unit: '' },
    { label: 'Custom domains', used: 2, limit: '10', pct: 20, unit: '' },
  ];

  const INVOICES = [
    { id: 'INV-2026-004', date: 'Apr 12, 2026', desc: 'Pro plan · monthly', amount: 19.00, status: 'paid', method: 'Visa ···4242' },
    { id: 'INV-2026-003', date: 'Mar 12, 2026', desc: 'Pro plan · monthly', amount: 19.00, status: 'paid', method: 'Visa ···4242' },
    { id: 'INV-2026-002', date: 'Feb 12, 2026', desc: 'Pro plan · monthly', amount: 19.00, status: 'paid', method: 'Visa ···4242' },
    { id: 'INV-2026-001', date: 'Jan 12, 2026', desc: 'Pro plan · monthly + domain',  amount: 31.99, status: 'paid', method: 'Visa ···4242' },
    { id: 'INV-2025-012', date: 'Dec 12, 2025', desc: 'Pro plan · monthly',  amount: 19.00, status: 'paid', method: 'Visa ···4242' },
    { id: 'INV-2025-011', date: 'Nov 12, 2025', desc: 'Pro plan · monthly',  amount: 19.00, status: 'paid', method: 'Visa ···4242' },
    { id: 'INV-2025-010', date: 'Oct 14, 2025', desc: 'Upgrade Free → Pro', amount: 9.50,  status: 'paid', method: 'Visa ···4242' },
    { id: 'INV-2025-009', date: 'Sep 01, 2025', desc: 'Domain: studio-halcyon.com', amount: 12.99, status: 'refunded', method: 'Visa ···4242' },
  ];

  const OWNED_DOMAINS = [
    { name: 'studio-halcyon.com',     expires: 'Apr 12, 2027', auto: true,  status: 'active',  site: 'Halcyon launch' },
    { name: 'www.studio-halcyon.com', expires: 'Apr 12, 2027', auto: true,  status: 'active',  site: 'Halcyon launch' },
    { name: 'alex-chen.design',       expires: 'Jun 30, 2026', auto: false, status: 'expiring', site: 'Personal portfolio' },
  ];

  return (
    <div className="page fade-in">
      <div className="page-hero">
        <div>
          <h1 className="display" style={{ fontSize: 30 }}>Settings</h1>
          <p className="subtitle" style={{ fontSize: 14 }}>Manage your workspace, billing, and integrations.</p>
        </div>
      </div>

      <div className="settings-shell">
        <aside className="settings-tabs">
          <div className="vtabs">
            {tabs.map(t => {
              const I = t.icon;
              return (
                <div key={t.id} className={`vtab ${tab===t.id?'active':''}`} onClick={() => setTab(t.id)} style={t.danger && tab !== t.id ? { color: 'var(--err)' } : {}}>
                  <I size={14} /> {t.label}
                </div>
              );
            })}
          </div>
        </aside>

        <main>
          {/* ── GENERAL ── */}
          {tab === 'general' && (
            <>
              <Section title="Workspace" desc="Information about this workspace.">
                <label className="field"><span>Workspace name</span><input className="input" defaultValue="Studio Halcyon"/></label>
                <label className="field"><span>Slug</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 13 }}>weblith.site/</span>
                    <input className="input mono" defaultValue="halcyon"/>
                  </div>
                </label>
                <label className="field"><span>Default timezone</span>
                  <select className="input" defaultValue="ny">
                    <option value="ny">America/New_York (UTC-5)</option>
                    <option>Europe/London</option><option>Asia/Tokyo</option>
                  </select>
                </label>
                <button className="btn btn-primary press" style={{ marginTop: 4 }}>Save changes</button>
              </Section>
              <Section title="Appearance" desc="Customize how Weblith looks for you.">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                  <span style={{ fontSize: 13, flex: 1 }}>Accent color</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { id: 'blue',   c: 'oklch(0.55 0.18 268)' },
                      { id: 'green',  c: 'oklch(0.62 0.13 155)' },
                      { id: 'orange', c: 'oklch(0.65 0.18 30)' },
                      { id: 'purple', c: 'oklch(0.55 0.2 320)' },
                      { id: 'pink',   c: 'oklch(0.7 0.17 0)' },
                    ].map(s => (
                      <div key={s.id} className={`color-swatch ${accent===s.id?'active':''}`} style={{ background: s.c }}
                        onClick={() => { setAccent(s.id); document.documentElement.style.setProperty('--accent', s.c); }} />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, flex: 1 }}>Reduce motion</span>
                  <div className="switch" />
                </div>
              </Section>
            </>
          )}

          {/* ── PROFILE ── */}
          {tab === 'profile' && (
            <Section title="Your profile" desc="Visible to teammates and on your published sites.">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div className="avatar" style={{ width: 64, height: 64, fontSize: 22, background: 'oklch(0.6 0.17 30)' }}>AC</div>
                <div>
                  <button className="btn btn-secondary btn-sm press"><Icons.upload size={12}/> Upload</button>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--err)' }}>Remove</button>
                </div>
              </div>
              <label className="field"><span>Full name</span><input className="input" defaultValue="Alex Chen"/></label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label className="field"><span>Email</span><input className="input" type="email" defaultValue="alex@halcyon.studio"/></label>
                <label className="field"><span>Role</span><input className="input" defaultValue="Founder & Designer"/></label>
              </div>
              <label className="field"><span>Bio</span>
                <textarea className="input" rows="3" defaultValue="Brooklyn-based designer running a small studio. Currently obsessed with editorial typography on the web."/>
              </label>
              <button className="btn btn-primary press" style={{ marginTop: 4 }}>Save changes</button>
            </Section>
          )}

          {/* ── TEAM ── */}
          {tab === 'team' && (
            <>
              <Section title="Members" desc="3 of 5 seats used on the Pro plan.">
                {COLLAB_PEOPLE.map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--line)' : 'none' }}>
                    <div className="avatar" style={{ width: 36, height: 36, fontSize: 13, background: p.color }}>{p.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500 }}>{p.name} {i === 0 && <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>· you</span>}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{['alex@halcyon.studio','maya@halcyon.studio','sam@halcyon.studio'][i]}</div>
                    </div>
                    <select className="input" defaultValue={i===0?'owner':i===1?'editor':'viewer'} style={{ width: 110, height: 30, fontSize: 12 }}>
                      <option value="owner">Owner</option><option value="admin">Admin</option>
                      <option value="editor">Editor</option><option value="viewer">Viewer</option>
                    </select>
                    {i !== 0 && <button className="btn btn-icon btn-ghost btn-sm" style={{ color: 'var(--err)' }}><Icons.trash size={12}/></button>}
                  </div>
                ))}
                <button className="btn btn-primary press" style={{ marginTop: 16 }}><Icons.plus size={13}/> Invite member</button>
              </Section>
              <Section title="Pending invitations">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '4px 0' }}>
                  <Icons.mail size={16} style={{ color: 'var(--ink-3)' }} />
                  <div style={{ flex: 1 }}>
                    <div className="mono" style={{ fontSize: 12.5 }}>jordan@halcyon.studio</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Invited 2 days ago · Editor</div>
                  </div>
                  <button className="btn btn-ghost btn-sm">Resend</button>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--err)' }}>Revoke</button>
                </div>
              </Section>
            </>
          )}

          {/* ── SUBSCRIPTION ── */}
          {tab === 'subscription' && (
            <>
              <Section title="Current plan">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                  {[
                    { id: 'free',  name: 'Free',  price: '$0',  sub: 'forever',    badge: null,
                      features: ['3 sites', 'weblith.site subdomain', '5k AI tokens/mo', 'Community support'] },
                    { id: 'pro',   name: 'Pro',   price: '$19', sub: '/month',      badge: 'Most popular',
                      features: ['Unlimited sites', 'Custom domains', '50k AI tokens/mo', 'Email support', '10 team seats', 'Analytics'] },
                    { id: 'team',  name: 'Team',  price: '$49', sub: '/month',      badge: null,
                      features: ['Everything in Pro', 'Real-time collab', 'Priority support', 'Custom AI models', 'SLA 99.99%', 'SAML SSO'] },
                  ].map(p => (
                    <div key={p.id} className="card" onClick={() => setPlan(p.id)} style={{ padding: 18, cursor: 'pointer',
                      border: plan === p.id ? '2px solid var(--accent)' : '1px solid var(--line)',
                      background: plan === p.id ? 'var(--accent-soft)' : 'var(--bg-elev)', position: 'relative' }}>
                      {p.badge && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: 'white', fontSize: 10, fontWeight: 600, padding: '2px 10px', borderRadius: 999, whiteSpace: 'nowrap' }}>{p.badge}</div>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <strong style={{ fontSize: 15 }}>{p.name}</strong>
                        {plan === p.id && <span className="chip chip-accent">Current</span>}
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 12 }}>{p.price}<span style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 400 }}>{p.sub}</span></div>
                      <ul style={{ padding: 0, listStyle: 'none', fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.9 }}>
                        {p.features.map(f => <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}><Icons.check size={11} style={{ color: 'var(--ok)', marginTop: 4, flexShrink: 0 }}/> {f}</li>)}
                      </ul>
                      {plan !== p.id && <button className="btn btn-secondary btn-sm press" style={{ width: '100%', marginTop: 14 }}>{p.id === 'free' ? 'Downgrade' : 'Upgrade'}</button>}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid var(--line)' }}>
                  <div>
                    <span style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>Next charge: <strong style={{ color: 'var(--ink)' }}>May 12, 2026 · $19.00</strong></span>
                    <span style={{ fontSize: 11.5, color: 'var(--ink-3)', marginLeft: 12 }}>Billed monthly · cancel anytime</span>
                  </div>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--err)' }}>Cancel subscription</button>
                </div>
              </Section>

              <Section title="Usage this billing period" desc="Resets May 12, 2026">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {USAGE.map(u => (
                    <div key={u.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
                        <span style={{ fontWeight: 500 }}>{u.label}</span>
                        <span style={{ color: 'var(--ink-3)' }}>{typeof u.used === 'number' && u.unit ? `${u.used}${u.unit} / ${u.limit}${u.unit}` : `${u.used} / ${u.limit}`}</span>
                      </div>
                      <div className="progress">
                        <div style={{ width: `${Math.min(u.pct, 100)}%`, background: u.pct > 85 ? 'var(--warn)' : 'var(--accent)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Add-ons">
                {[
                  { name: 'Extra AI tokens', desc: '50k additional tokens', price: '$9/mo', active: false },
                  { name: 'Priority CDN',    desc: 'Global edge with 200ms SLA', price: '$12/mo', active: false },
                  { name: 'White-label',     desc: 'Remove Weblith branding', price: '$29/mo', active: false },
                ].map((a, i, arr) => (
                  <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500 }}>{a.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{a.desc}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', minWidth: 60, textAlign: 'right' }}>{a.price}</span>
                    <button className="btn btn-secondary btn-sm press">Add</button>
                  </div>
                ))}
              </Section>
            </>
          )}

          {/* ── PAYMENT HISTORY ── */}
          {tab === 'payments' && (
            <>
              <Section title="Payment methods">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 52, height: 34, borderRadius: 7, background: 'linear-gradient(135deg, oklch(0.4 0.15 260), oklch(0.55 0.18 268))', color: 'white', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em' }}>VISA</div>
                  <div style={{ flex: 1 }}>
                    <div className="mono" style={{ fontSize: 13 }}>•••• •••• •••• 4242</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Expires 04/2028 · Default</div>
                  </div>
                  <span className="chip chip-ok"><Icons.check size={11}/> Default</span>
                  <button className="btn btn-secondary btn-sm press">Update</button>
                </div>
                <button className="btn btn-secondary btn-sm press"><Icons.plus size={12}/> Add payment method</button>
              </Section>

              <Section title="Transaction history" desc={`${INVOICES.length} transactions`}>
                <div style={{ margin: '-8px -22px -22px', overflow: 'hidden' }}>
                  <table className="tbl">
                    <thead>
                      <tr><th>Invoice</th><th>Date</th><th>Description</th><th>Method</th><th>Amount</th><th>Status</th><th></th></tr>
                    </thead>
                    <tbody>
                      {INVOICES.map(inv => (
                        <tr key={inv.id}>
                          <td className="mono" style={{ color: 'var(--ink-3)', fontSize: 11 }}>{inv.id}</td>
                          <td style={{ color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>{inv.date}</td>
                          <td style={{ fontWeight: 500 }}>{inv.desc}</td>
                          <td className="mono" style={{ color: 'var(--ink-2)', fontSize: 11.5 }}>{inv.method}</td>
                          <td className="mono" style={{ fontWeight: 600 }}>${inv.amount.toFixed(2)}</td>
                          <td>
                            {inv.status === 'paid'     && <span className="chip chip-ok">Paid</span>}
                            {inv.status === 'refunded' && <span className="chip chip-warn">Refunded</span>}
                            {inv.status === 'failed'   && <span className="chip chip-err">Failed</span>}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button className="btn btn-icon btn-ghost btn-sm" title="Download PDF"><Icons.download size={12}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section title="Billing address">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <label className="field"><span>Full name</span><input className="input" defaultValue="Alex Chen"/></label>
                  <label className="field"><span>Company</span><input className="input" defaultValue="Studio Halcyon LLC"/></label>
                  <label className="field" style={{ gridColumn: '1 / -1' }}><span>Address</span><input className="input" defaultValue="123 Smith St, Brooklyn, NY 11201"/></label>
                  <label className="field"><span>Country</span><select className="input"><option>United States</option><option>Canada</option><option>United Kingdom</option></select></label>
                  <label className="field"><span>Tax ID (optional)</span><input className="input" placeholder="VAT / EIN"/></label>
                </div>
                <button className="btn btn-primary press" style={{ marginTop: 8 }}>Save address</button>
              </Section>
            </>
          )}

          {/* ── DOMAINS ── */}
          {tab === 'domains' && (
            <>
              <Section title="Your domains" desc={`${OWNED_DOMAINS.length} domains registered`}>
                {OWNED_DOMAINS.map((d, i) => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < OWNED_DOMAINS.length - 1 ? '1px solid var(--line)' : 'none' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: d.status === 'expiring' ? 'var(--warn-soft)' : 'var(--accent-soft)', color: d.status === 'expiring' ? 'var(--warn)' : 'var(--accent-ink)', display: 'grid', placeItems: 'center' }}>
                      <Icons.globe size={16}/>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <strong className="mono" style={{ fontSize: 13.5 }}>{d.name}</strong>
                        {d.status === 'expiring' && <span className="chip chip-warn">Expiring soon</span>}
                        {d.status === 'active'   && <span className="chip chip-ok">Active</span>}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>
                        Expires {d.expires} · {d.auto ? 'Auto-renew on' : <span style={{ color: 'var(--warn)' }}>Auto-renew off</span>} · Attached to <em>{d.site}</em>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {d.status === 'expiring' && <button className="btn btn-primary btn-sm press">Renew now</button>}
                      <button className="btn btn-secondary btn-sm press"><Icons.settings size={12}/> Manage</button>
                    </div>
                  </div>
                ))}
              </Section>

              <Section title="Find & register a new domain">
                <div style={{ display: 'flex', gap: 8, marginBottom: domainResults ? 20 : 0 }}>
                  <input className="input" placeholder="Enter a domain name (e.g. mystudio)" value={domainSearch}
                    onChange={e => setDomainSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && searchDomains()}
                    style={{ flex: 1 }} />
                  <button className="btn btn-primary press" onClick={searchDomains} disabled={searching || !domainSearch.trim()} style={{ flexShrink: 0 }}>
                    {searching ? <><span className="spinner"/> Searching…</> : <><Icons.search size={13}/> Search</>}
                  </button>
                </div>

                {domainResults && (
                  <div>
                    <div className="eyebrow" style={{ marginBottom: 10 }}>Search results for "{domainSearch}"</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {domainResults.map(d => (
                        <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10,
                          background: cart.find(c => c.name === d.name) ? 'var(--accent-soft)' : 'var(--bg-sunk)',
                          border: `1px solid ${cart.find(c => c.name === d.name) ? 'oklch(0.55 0.18 268 / 0.3)' : 'var(--line)'}`,
                          opacity: d.avail ? 1 : 0.5 }}>
                          <div style={{ flex: 1 }}>
                            <span className="mono" style={{ fontWeight: 600, fontSize: 13.5 }}>{d.name}</span>
                            {d.popular && <span className="chip chip-accent" style={{ marginLeft: 8, fontSize: 10 }}>Popular</span>}
                          </div>
                          {d.avail ? (
                            <>
                              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>${d.price}<span style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 400 }}>/yr</span></span>
                              {cart.find(c => c.name === d.name)
                                ? <button className="btn btn-sm press" style={{ background: 'var(--err-soft)', color: 'var(--err)', border: 'none' }} onClick={() => removeFromCart(d.name)}><Icons.x size={11}/> Remove</button>
                                : <button className="btn btn-primary btn-sm press" onClick={() => addToCart(d)}><Icons.plus size={11}/> Add</button>}
                            </>
                          ) : (
                            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Unavailable</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Section>

              {cart.length > 0 && (
                <Section title={`Cart · ${cart.length} domain${cart.length > 1 ? 's' : ''}`}>
                  {cart.map((d, i) => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < cart.length - 1 ? '1px solid var(--line)' : 'none' }}>
                      <Icons.globe size={15} style={{ color: 'var(--accent)' }}/>
                      <strong className="mono" style={{ flex: 1, fontSize: 13 }}>{d.name}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Duration:</span>
                        <select className="input" value={d.years} style={{ width: 90, height: 30, fontSize: 12 }}
                          onChange={e => setCart(c => c.map(x => x.name === d.name ? { ...x, years: +e.target.value } : x))}>
                          <option value={1}>1 year</option><option value={2}>2 years</option><option value={3}>3 years</option>
                        </select>
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 13, minWidth: 56, textAlign: 'right' }}>${(d.price * d.years).toFixed(2)}</span>
                      <button className="btn btn-icon btn-ghost btn-sm" style={{ color: 'var(--err)' }} onClick={() => removeFromCart(d.name)}><Icons.trash size={12}/></button>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginTop: 4 }}>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>Total: ${cartTotal.toFixed(2)}</span>
                      <span style={{ fontSize: 11.5, color: 'var(--ink-3)', marginLeft: 8 }}>charged today</span>
                    </div>
                    <button className="btn btn-primary press"><Icons.card size={13}/> Checkout · ${cartTotal.toFixed(2)}</button>
                  </div>
                </Section>
              )}
            </>
          )}

          {/* ── INTEGRATIONS ── */}
          {tab === 'integrations' && (
            <Section title="Connected services">
              {[
                { name: 'GitHub',     desc: 'Sync content from a repo',         logo: <Icons.github size={18}/>,  connected: true  },
                { name: 'Stripe',     desc: 'Accept payments on your site',      logo: <Icons.card size={18}/>,    connected: true  },
                { name: 'Mailchimp',  desc: 'Subscribe form submissions',        logo: <Icons.mail size={18}/>,    connected: false },
                { name: 'Notion',     desc: 'Pull blog posts from a database',   logo: <Icons.text size={18}/>,    connected: false },
                { name: 'Slack',      desc: 'Notifications for deploys & forms', logo: <Icons.message size={18}/>, connected: true  },
                { name: 'Cloudflare', desc: 'Custom DNS management',             logo: <Icons.globe size={18}/>,   connected: false },
                { name: 'Zapier',     desc: 'Connect 5,000+ apps',               logo: <Icons.plug size={18}/>,    connected: false },
                { name: 'Analytics',  desc: 'Google Analytics 4 / Plausible',    logo: <Icons.zap size={18}/>,     connected: false },
              ].map((it, i, a) => (
                <div key={it.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < a.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 9, background: 'var(--bg-sunk)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', color: 'var(--ink-2)' }}>{it.logo}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{it.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{it.desc}</div>
                  </div>
                  {it.connected
                    ? <><span className="chip chip-ok"><Icons.check size={11}/> Connected</span><button className="btn btn-ghost btn-sm">Disconnect</button></>
                    : <button className="btn btn-secondary btn-sm press">Connect</button>}
                </div>
              ))}
            </Section>
          )}

          {/* ── NOTIFICATIONS ── */}
          {tab === 'notifications' && (
            <Section title="Email notifications">
              {[
                { l: 'Deploy succeeded',       s: 'When a production deploy goes live', on: false },
                { l: 'Deploy failed',          s: 'Get notified if a build fails',      on: true  },
                { l: 'Form submissions',       s: 'New contact form entries',            on: true  },
                { l: 'Comments & mentions',    s: 'When someone @mentions you',         on: true  },
                { l: 'Domain expiry alert',    s: '30 days before domain expires',      on: true  },
                { l: 'Weekly analytics digest',s: 'Visitor and traffic summary',        on: true  },
                { l: 'Security alerts',        s: 'Logins from new devices',            on: true  },
                { l: 'Product updates',        s: 'New features and changelog',         on: false },
              ].map((n, i, a) => (
                <div key={n.l} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < a.length-1 ? '1px solid var(--line)' : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{n.l}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{n.s}</div>
                  </div>
                  <div className={`switch ${n.on?'on':''}`} />
                </div>
              ))}
            </Section>
          )}

          {/* ── SECURITY ── */}
          {tab === 'security' && (
            <>
              <Section title="Password">
                <label className="field"><span>Current password</span><input className="input" type="password" placeholder="••••••••"/></label>
                <label className="field"><span>New password</span><input className="input" type="password" placeholder="At least 12 characters"/></label>
                <label className="field"><span>Confirm new password</span><input className="input" type="password" placeholder="Repeat new password"/></label>
                <button className="btn btn-primary press">Update password</button>
              </Section>
              <Section title="Two-factor authentication">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <Icons.shield size={28} style={{ color: 'var(--ok)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>Authenticator app</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Currently active · backup codes generated</div>
                  </div>
                  <button className="btn btn-secondary btn-sm press">Manage</button>
                </div>
              </Section>
              <Section title="Active sessions">
                {[
                  { d: 'MacBook Pro · Chrome 124', loc: 'Brooklyn, NY · current', when: 'now',      current: true  },
                  { d: 'iPhone 15 · Safari',        loc: 'Brooklyn, NY',          when: '3h ago',   current: false },
                  { d: 'iPad · Safari',             loc: 'Brooklyn, NY',          when: '2d ago',   current: false },
                  { d: 'Windows PC · Edge',         loc: 'New York, NY',          when: '5d ago',   current: false },
                ].map((s, i, a) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < a.length-1 ? '1px solid var(--line)' : 'none' }}>
                    <Icons.desktop size={16} style={{ color: 'var(--ink-3)' }}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{s.d}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{s.loc} · {s.when}</div>
                    </div>
                    {s.current ? <span className="chip chip-ok">This device</span> : <button className="btn btn-ghost btn-sm" style={{ color: 'var(--err)' }}>Revoke</button>}
                  </div>
                ))}
                <button className="btn btn-ghost btn-sm press" style={{ color: 'var(--err)', marginTop: 12 }}><Icons.logout size={12}/> Sign out all other sessions</button>
              </Section>
            </>
          )}

          {/* ── API TOKENS ── */}
          {tab === 'api' && (
            <Section title="API tokens" desc="Use tokens to access the Weblith API. Treat them like passwords.">
              {[
                { name: 'CLI · weblith-cli', last: '2h ago',  scope: 'full'   },
                { name: 'CI deployments',    last: '1d ago',  scope: 'deploy' },
                { name: 'Zapier webhook',    last: '5d ago',  scope: 'read'   },
              ].map((t, i, a) => (
                <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < a.length-1 ? '1px solid var(--line)' : 'none' }}>
                  <Icons.key size={16} style={{ color: 'var(--ink-3)' }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{t.name}</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>wbt_•••••••••••• · last used {t.last}</div>
                  </div>
                  <span className="chip">{t.scope}</span>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--err)' }}>Revoke</button>
                </div>
              ))}
              <button className="btn btn-primary press" style={{ marginTop: 16 }}><Icons.plus size={13}/> Create new token</button>
            </Section>
          )}

          {/* ── DANGER ── */}
          {tab === 'danger' && (
            <Section title="Danger zone" desc="Irreversible actions. Read carefully before proceeding.">
              {[
                { l: 'Transfer ownership',    s: 'Move this workspace to another user.', cta: 'Transfer', d: false },
                { l: 'Export workspace data', s: 'Download a ZIP of all sites and content.', cta: 'Export', d: false },
                { l: 'Pause subscription',    s: 'Temporarily disable billing and publishing.', cta: 'Pause', d: false },
                { l: 'Delete workspace',      s: 'Permanently delete this workspace and all sites. This cannot be undone.', cta: 'Delete workspace', d: true },
              ].map((a, i, arr) => (
                <div key={a.l} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < arr.length-1 ? '1px solid var(--line)' : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: a.d ? 'var(--err)' : 'var(--ink)' }}>{a.l}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{a.s}</div>
                  </div>
                  <button className={`btn btn-sm press`} style={a.d ? { background: 'var(--err)', color: 'white', border: 'none' } : {}} >{a.cta}</button>
                </div>
              ))}
            </Section>
          )}
        </main>
      </div>
    </div>
  );
}

window.SettingsPage = SettingsPage;
