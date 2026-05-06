/* global React, Icons, COLLAB_PEOPLE */
const { useState } = React;

function SettingsPage() {
  const [tab, setTab] = useState('general');
  const [accent, setAccent] = useState('blue');
  const [plan, setPlan] = useState('pro');

  const tabs = [
    { id: 'general', label: 'General', icon: Icons.settings },
    { id: 'profile', label: 'Profile', icon: Icons.user },
    { id: 'team', label: 'Team', icon: Icons.users },
    { id: 'billing', label: 'Billing', icon: Icons.card },
    { id: 'integrations', label: 'Integrations', icon: Icons.plug },
    { id: 'notifications', label: 'Notifications', icon: Icons.bell },
    { id: 'security', label: 'Security', icon: Icons.shield },
    { id: 'api', label: 'API tokens', icon: Icons.key },
    { id: 'danger', label: 'Danger zone', icon: Icons.warn, danger: true },
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
          {tab === 'general' && (
            <>
              <Section title="Workspace" desc="Information about this workspace.">
                <label className="field"><span>Workspace name</span><input className="input" defaultValue="Studio Halcyon"/></label>
                <label className="field"><span>Slug</span><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="mono" style={{ color: 'var(--ink-3)', fontSize: 13 }}>weblith.site/</span><input className="input mono" defaultValue="halcyon"/></div></label>
                <label className="field"><span>Default timezone</span><select className="input" defaultValue="ny"><option value="ny">America/New_York (UTC-5)</option><option>Europe/London</option><option>Asia/Tokyo</option></select></label>
              </Section>
              <Section title="Appearance" desc="Customize how Weblith looks for you.">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                  <span style={{ fontSize: 13, flex: 1 }}>Accent color</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { id: 'blue', c: 'oklch(0.55 0.18 268)' },
                      { id: 'green', c: 'oklch(0.62 0.13 155)' },
                      { id: 'orange', c: 'oklch(0.65 0.18 30)' },
                      { id: 'purple', c: 'oklch(0.55 0.2 320)' },
                      { id: 'pink', c: 'oklch(0.7 0.17 0)' },
                    ].map(s => (
                      <div key={s.id} className={`color-swatch ${accent===s.id?'active':''}`} style={{ background: s.c }} onClick={()=>setAccent(s.id)} />
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
              <label className="field"><span>Bio</span><textarea className="input" rows="3" defaultValue="Brooklyn-based designer running a small studio. Currently obsessed with editorial typography on the web."/></label>
            </Section>
          )}

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
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
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

          {tab === 'billing' && (
            <>
              <Section title="Current plan">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
                  {[
                    { id: 'free', name: 'Free', price: '$0', sub: 'forever', features: ['1 site', 'weblith.site domain', 'Community support'] },
                    { id: 'pro', name: 'Pro', price: '$19', sub: 'per month', features: ['Unlimited sites', 'Custom domains', 'AI generator (50k tokens)', 'Email support'] },
                    { id: 'team', name: 'Team', price: '$49', sub: 'per month', features: ['Everything in Pro', '5 team seats', 'Real-time collaboration', 'Priority support'] },
                  ].map(p => (
                    <div key={p.id} className="card" style={{ padding: 18, border: plan === p.id ? '2px solid var(--accent)' : '1px solid var(--line)', background: plan === p.id ? 'var(--accent-soft)' : 'var(--bg-elev)', cursor: 'pointer' }} onClick={() => setPlan(p.id)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <strong style={{ fontSize: 15 }}>{p.name}</strong>
                        {plan === p.id && <span className="chip chip-accent">Current</span>}
                      </div>
                      <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>{p.price}<span style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 400 }}> {p.sub}</span></div>
                      <ul style={{ marginTop: 14, padding: 0, listStyle: 'none', fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.9 }}>
                        {p.features.map(f => <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}><Icons.check size={11} style={{ color: 'var(--ok)', marginTop: 4, flexShrink: 0 }}/> {f}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid var(--line)' }}>
                  <span style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>Next charge: <strong style={{ color: 'var(--ink)' }}>May 12, 2026 · $19.00</strong></span>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--err)' }}>Cancel subscription</button>
                </div>
              </Section>

              <Section title="Payment method">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 48, height: 32, borderRadius: 6, background: 'linear-gradient(135deg, oklch(0.4 0.15 260), oklch(0.55 0.18 268))', color: 'white', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em' }}>VISA</div>
                  <div style={{ flex: 1 }}>
                    <div className="mono" style={{ fontSize: 13 }}>•••• •••• •••• 4242</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Expires 04/2028</div>
                  </div>
                  <button className="btn btn-secondary btn-sm press">Update</button>
                </div>
              </Section>

              <Section title="Recent invoices">
                <table className="tbl" style={{ margin: '-8px -22px -22px' }}>
                  <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    {['Apr 12','Mar 12','Feb 12','Jan 12'].map((d, i) => (
                      <tr key={d}><td>{d}, 2026</td><td>Pro plan · monthly</td><td className="mono">$19.00</td><td><span className="chip chip-ok">Paid</span></td><td style={{ textAlign: 'right' }}><button className="btn btn-ghost btn-sm"><Icons.download size={11}/></button></td></tr>
                    ))}
                  </tbody>
                </table>
              </Section>
            </>
          )}

          {tab === 'integrations' && (
            <Section title="Connected services">
              {[
                { name: 'GitHub', desc: 'Sync content from a repo', logo: '🐙', connected: true },
                { name: 'Stripe', desc: 'Accept payments on your site', logo: '💳', connected: true },
                { name: 'Mailchimp', desc: 'Subscribe form submissions', logo: '📬', connected: false },
                { name: 'Notion', desc: 'Pull blog posts from a database', logo: '📓', connected: false },
                { name: 'Slack', desc: 'Notifications for deploys & forms', logo: '💬', connected: true },
                { name: 'Cloudflare', desc: 'Custom DNS management', logo: '☁️', connected: false },
              ].map((it, i, a) => (
                <div key={it.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < a.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 9, background: 'var(--bg-sunk)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 18 }}>{it.logo}</div>
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

          {tab === 'notifications' && (
            <Section title="Email notifications">
              {[
                { l: 'Deploy succeeded', s: 'When a production deploy goes live', on: false },
                { l: 'Deploy failed', s: 'Get notified if a build fails', on: true },
                { l: 'Form submissions', s: 'New contact form entries', on: true },
                { l: 'Comments & mentions', s: 'When someone @mentions you', on: true },
                { l: 'Weekly analytics digest', s: 'Visitor and traffic summary', on: true },
                { l: 'Product updates', s: 'New features and changelog', on: false },
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

          {tab === 'security' && (
            <>
              <Section title="Password">
                <label className="field"><span>Current password</span><input className="input" type="password" placeholder="••••••••"/></label>
                <label className="field"><span>New password</span><input className="input" type="password" placeholder="At least 12 characters"/></label>
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
                  { d: 'MacBook Pro · Chrome', loc: 'Brooklyn, NY · current', when: 'now', current: true },
                  { d: 'iPhone 15 · Safari', loc: 'Brooklyn, NY', when: '3h ago', current: false },
                  { d: 'iPad · Safari', loc: 'Brooklyn, NY', when: '2 days ago', current: false },
                ].map((s, i, a) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < a.length-1 ? '1px solid var(--line)' : 'none' }}>
                    <Icons.device size={16} style={{ color: 'var(--ink-3)' }}/>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{s.d}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{s.loc} · {s.when}</div>
                    </div>
                    {!s.current && <button className="btn btn-ghost btn-sm" style={{ color: 'var(--err)' }}>Revoke</button>}
                  </div>
                ))}
              </Section>
            </>
          )}

          {tab === 'api' && (
            <Section title="API tokens" desc="Use tokens to access the Weblith API. Treat them like passwords.">
              {[
                { name: 'CLI · weblith-cli', last: '2h ago', scope: 'full' },
                { name: 'CI deployments', last: '1d ago', scope: 'deploy' },
              ].map((t, i, a) => (
                <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < a.length-1 ? '1px solid var(--line)' : 'none' }}>
                  <Icons.key size={16} style={{ color: 'var(--ink-3)' }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{t.name}</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>fgt_••••••••••••{Math.random().toString(36).slice(2,6)} · last used {t.last}</div>
                  </div>
                  <span className="chip">{t.scope}</span>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--err)' }}>Revoke</button>
                </div>
              ))}
              <button className="btn btn-primary press" style={{ marginTop: 16 }}><Icons.plus size={13}/> Create new token</button>
            </Section>
          )}

          {tab === 'danger' && (
            <Section title="Danger zone" desc="Irreversible actions. Read carefully.">
              {[
                { l: 'Transfer ownership', s: 'Move this workspace to another user.', cta: 'Transfer' },
                { l: 'Export workspace data', s: 'Download a ZIP of all sites and content.', cta: 'Export' },
                { l: 'Delete workspace', s: 'Permanently delete this workspace and all sites.', cta: 'Delete', d: true },
              ].map((a, i, arr) => (
                <div key={a.l} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < arr.length-1 ? '1px solid var(--line)' : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{a.l}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{a.s}</div>
                  </div>
                  <button className={a.d ? 'btn btn-danger btn-sm press' : 'btn btn-secondary btn-sm press'}>{a.cta}</button>
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
