import { useState } from 'react'
import Icons from '../components/ui/Icons'

const versions = [
  { id: 'v12', label: 'v12', msg: 'Updated hero copy and added testimonials', author: { n: 'Alex Chen', i: 'AC', c: 'oklch(0.6 0.17 30)' }, when: 'just now', branch: 'main', current: true, additions: 24, deletions: 8 },
  { id: 'v11', label: 'v11', msg: 'Added work grid layout', author: { n: 'Alex Chen', i: 'AC', c: 'oklch(0.6 0.17 30)' }, when: '2h ago', branch: 'main', additions: 142, deletions: 12 },
  { id: 'v10', label: 'v10', msg: 'Drafted about page with team carousel', author: { n: 'Maya Reyes', i: 'MR', c: 'oklch(0.55 0.18 268)' }, when: 'yesterday', branch: 'feat/about', additions: 88, deletions: 4 },
  { id: 'v9',  label: 'v9',  msg: 'Refactored hero to use new typography scale', author: { n: 'Alex Chen', i: 'AC', c: 'oklch(0.6 0.17 30)' }, when: '2 days ago', branch: 'main', additions: 32, deletions: 28 },
  { id: 'v8',  label: 'v8',  msg: 'Initial publish', author: { n: 'Alex Chen', i: 'AC', c: 'oklch(0.6 0.17 30)' }, when: '3 days ago', branch: 'main', additions: 412, deletions: 0 },
  { id: 'v7',  label: 'v7',  msg: 'Polished navigation hover states', author: { n: 'Sam Patel', i: 'SP', c: 'oklch(0.62 0.13 155)' }, when: '4 days ago', branch: 'main', additions: 18, deletions: 22 },
]

export default function VersionPage() {
  const [selected, setSelected] = useState('v12')
  const [compare, setCompare] = useState(null)
  const [branch, setBranch] = useState('main')
  const [tab, setTab] = useState('content')

  const sel = versions.find(v => v.id === selected)

  return (
    <div className="page fade-in" style={{ padding: 0, maxWidth: 'none' }}>
      <div style={{ padding: '32px 32px 0' }}>
        <div className="page-hero">
          <div>
            <h1 className="display" style={{ fontSize: 30 }}>Version history</h1>
            <p className="subtitle" style={{ fontSize: 14 }}>Every save snapshotted. Compare, restore, and branch from any point.</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className="input" value={branch} onChange={e => setBranch(e.target.value)} style={{ width: 180, height: 36 }}>
              <option value="main">main · 12 versions</option>
              <option value="feat/about">feat/about · 3 versions</option>
            </select>
            <button className="btn btn-secondary press"><Icons.branch size={13} /> New branch</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 0, padding: '0 32px 32px' }}>
        <aside style={{ paddingRight: 24, borderRight: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div className="eyebrow">Timeline</div>
            {compare && (
              <button className="btn btn-ghost btn-sm" onClick={() => setCompare(null)}><Icons.x size={11} /> Exit compare</button>
            )}
          </div>
          {versions.map((v, i) => {
            const isSel = v.id === selected
            const isCmp = v.id === compare
            return (
              <div key={v.id} style={{ position: 'relative', paddingLeft: 28, paddingBottom: 18 }}>
                <div style={{ position: 'absolute', left: 8, top: 0, bottom: i === versions.length - 1 ? 8 : 0, width: 2, background: 'var(--line)' }} />
                <div style={{
                  position: 'absolute', left: 2, top: 12, width: 14, height: 14, borderRadius: '50%',
                  background: isSel ? 'var(--accent)' : isCmp ? 'oklch(0.7 0.15 75)' : 'var(--bg-elev)',
                  border: `2px solid ${isSel ? 'var(--accent)' : isCmp ? 'oklch(0.7 0.15 75)' : 'var(--line)'}`,
                }} />
                <div onClick={() => setSelected(v.id)} className="press" style={{
                  padding: 12,
                  background: isSel ? 'var(--accent-soft)' : isCmp ? 'oklch(0.7 0.15 75 / 0.1)' : 'var(--bg-elev)',
                  border: `1px solid ${isSel ? 'var(--accent)' : isCmp ? 'oklch(0.7 0.15 75)' : 'var(--line)'}`,
                  borderRadius: 9, cursor: 'pointer', transition: 'all .15s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="mono" style={{ fontSize: 11, color: isSel ? 'var(--accent-ink)' : 'var(--ink-3)', fontWeight: 600 }}>{v.label}</span>
                      {v.current && <span className="chip chip-ok" style={{ fontSize: 10 }}>current</span>}
                      <span className="chip" style={{ fontSize: 10 }}>{v.branch}</span>
                    </div>
                    <span style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{v.when}</span>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 6, color: 'var(--ink)' }}>{v.msg}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: 'var(--ink-3)' }}>
                    <div className="avatar" style={{ width: 18, height: 18, fontSize: 8.5, background: v.author.c }}>{v.author.i}</div>
                    <span>{v.author.n}</span>
                    <span style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                      <span style={{ color: 'var(--ok)' }} className="mono">+{v.additions}</span>
                      <span style={{ color: 'var(--err)' }} className="mono">−{v.deletions}</span>
                    </span>
                  </div>
                  {isSel && !compare && (
                    <button className="btn btn-secondary btn-sm press" style={{ marginTop: 10, width: '100%' }}
                      onClick={e => { e.stopPropagation(); setCompare(versions[versions.indexOf(v) + 1]?.id) }}>
                      Compare with previous
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </aside>

        <main style={{ padding: '0 0 0 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <h2 style={{ fontSize: 22, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="mono" style={{ fontSize: 13, padding: '4px 10px', background: 'var(--accent-soft)', color: 'var(--accent-ink)', borderRadius: 6 }}>{sel.label}</span>
                {sel.msg}
              </h2>
              <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="avatar" style={{ width: 18, height: 18, fontSize: 8.5, background: sel.author.c }}>{sel.author.i}</div>
                  {sel.author.n}
                </span>
                <span>{sel.when}</span>
                <span>{sel.branch}</span>
                <span className="mono"><span style={{ color: 'var(--ok)' }}>+{sel.additions}</span> <span style={{ color: 'var(--err)' }}>−{sel.deletions}</span></span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm press"><Icons.eye size={12} /> Preview live</button>
              <button className="btn btn-secondary btn-sm press"><Icons.branch size={12} /> Branch from here</button>
              {!sel.current && <button className="btn btn-primary btn-sm press"><Icons.history size={12} /> Restore this version</button>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 4, marginBottom: 14, borderBottom: '1px solid var(--line)' }}>
            {[{ id: 'content', label: 'Content diff', icon: Icons.text }, { id: 'visual', label: 'Visual diff', icon: Icons.eye }, { id: 'files', label: 'Files changed', icon: Icons.layers }].map(t => {
              const I = t.icon
              return (
                <button key={t.id} onClick={() => setTab(t.id)} className="press" style={{
                  padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer',
                  borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
                  color: tab === t.id ? 'var(--ink)' : 'var(--ink-3)', fontSize: 13, fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: 7, marginBottom: -1
                }}><I size={13} /> {t.label}</button>
              )
            })}
          </div>

          {tab === 'content' && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--line)', background: 'var(--bg-sunk)' }}>
                <span className="mono" style={{ fontSize: 12, color: 'var(--ink-2)' }}>pages/index.html · Hero section</span>
              </div>
              <div style={{ padding: 24, fontSize: 14, lineHeight: 1.7 }}>
                <div style={{ marginBottom: 16 }}>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>Headline</div>
                  <p>
                    <span className="diff-del">Quietly making sites for brands</span>{' '}
                    <span className="diff-add">Quietly ambitious work for brands that mean it.</span>
                  </p>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>Subhead</div>
                  <p>A small <span className="diff-add">design</span> studio in Brooklyn making{' '}
                    <span className="diff-del">websites</span>{' '}
                    <span className="diff-add">identities, sites, and product UI for the next decade.</span>
                  </p>
                </div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>Call to action</div>
                  <p><span className="diff-del">View portfolio</span>{' '}<span className="diff-add">See recent work</span></p>
                </div>
              </div>
            </div>
          )}

          {tab === 'visual' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[{ l: 'Before · v11', bg: 'var(--err-soft)', i: 0 }, { l: 'After · v12', bg: 'var(--ok-soft)', i: 1 }].map(s => (
                <div key={s.l} className="card" style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)', background: s.bg }}>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{s.l}</span>
                  </div>
                  <div style={{ padding: 24, background: 'var(--bg-sunk)' }}>
                    <div style={{ background: 'var(--bg)', padding: 24, borderRadius: 8, boxShadow: 'var(--shadow-md)' }}>
                      <div className="eyebrow" style={{ marginBottom: 10 }}>STUDIO HALCYON</div>
                      <h3 style={{ fontSize: 18, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                        {s.i === 0 ? 'Quietly making sites for brands' : 'Quietly ambitious work for brands that mean it.'}
                      </h3>
                      <p style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 8 }}>
                        {s.i === 0 ? 'A small studio in Brooklyn making websites.' : 'A small design studio in Brooklyn making identities, sites, and product UI.'}
                      </p>
                      <button className="btn btn-primary btn-sm" style={{ marginTop: 14 }}>
                        {s.i === 0 ? 'View portfolio' : 'See recent work'} <Icons.arrowRight size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'files' && (
            <div className="card" style={{ overflow: 'hidden' }}>
              {[
                { f: 'pages/index.html', a: 12, d: 4, t: 'modified' },
                { f: 'components/Hero.jsx', a: 8, d: 2, t: 'modified' },
                { f: 'components/Testimonials.jsx', a: 142, d: 0, t: 'added' },
                { f: 'styles/typography.css', a: 6, d: 6, t: 'modified' },
              ].map(f => (
                <div key={f.f} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
                  <span className="chip" style={{ minWidth: 70, justifyContent: 'center', background: f.t === 'added' ? 'var(--ok-soft)' : 'var(--bg-sunk)', color: f.t === 'added' ? 'var(--ok)' : 'var(--ink-2)' }}>{f.t}</span>
                  <span className="mono" style={{ fontSize: 12.5, flex: 1 }}>{f.f}</span>
                  <span className="mono" style={{ fontSize: 11.5 }}><span style={{ color: 'var(--ok)' }}>+{f.a}</span> <span style={{ color: 'var(--err)' }}>−{f.d}</span></span>
                  <button className="btn btn-icon btn-ghost btn-sm"><Icons.eye size={12} /></button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
