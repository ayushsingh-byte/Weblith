import { useState, useEffect } from 'react'
import Icons from '../components/ui/Icons'
import { fetchActivity } from '../lib/db'
import { Sparkline, BarChart } from '../components/ui/Sparkline'
import CollabStack from '../components/overlays/CollabStack'

const VISITOR_DATA = [120,145,132,168,192,178,210,245,230,198,220,265,280,312,298,340,358,322,380,412,398,445,420,468,502,488,530,545,568,612]
const TRAFFIC_BY_DAY = [
  { label:'M', value:412 },{ label:'T', value:568 },{ label:'W', value:489 },
  { label:'T', value:622 },{ label:'F', value:545 },{ label:'S', value:312 },{ label:'S', value:268 },
]

function KPI({ label, value, sub, delta, deltaUp, trend, progress }) {
  return (
    <div className="card" style={{ padding: 16, position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div className="eyebrow" style={{ fontSize: 10.5 }}>{label}</div>
        {delta && (
          <span style={{ fontSize: 11, fontWeight: 500, color: deltaUp ? 'var(--ok)' : 'var(--ink-2)', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            {deltaUp && '↑'} {delta}
          </span>
        )}
      </div>
      <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 4 }}>{sub}</div>
      {trend && (
        <div style={{ marginTop: 12, marginLeft: -6, marginRight: -6, marginBottom: -4 }}>
          <Sparkline data={trend} width={220} height={28} color="var(--accent)" />
        </div>
      )}
      {progress != null && (
        <div className="progress" style={{ marginTop: 14 }}><div style={{ width: `${progress}%`, background: 'var(--accent)' }} /></div>
      )}
    </div>
  )
}

function SitePreviewMini({ site }) {
  return (
    <div style={{ position: 'absolute', inset: 0, padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ width: 18, height: 18, borderRadius: 4, background: 'var(--ink)', color: 'var(--bg)', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700 }}>{site.favicon}</div>
      <div style={{ height: 9, width: '60%', background: 'oklch(0.2 0.008 80 / 0.85)', borderRadius: 3, marginTop: 14 }} />
      <div style={{ height: 5, width: '80%', background: 'oklch(0.2 0.008 80 / 0.4)', borderRadius: 2 }} />
      <div style={{ height: 5, width: '70%', background: 'oklch(0.2 0.008 80 / 0.4)', borderRadius: 2 }} />
      <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
        <div style={{ height: 14, width: 38, background: 'oklch(0.2 0.008 80 / 0.85)', borderRadius: 3 }} />
        <div style={{ height: 14, width: 38, background: 'transparent', border: '1px solid oklch(0.2 0.008 80 / 0.3)', borderRadius: 3 }} />
      </div>
    </div>
  )
}

function SiteCard({ site, onOpen }) {
  const [hover, setHover] = useState(false)
  return (
    <div className="card card-hover press" style={{ overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
      onClick={onOpen} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={{ aspectRatio: '16/10', background: site.color, position: 'relative', borderBottom: '1px solid var(--line)', overflow: 'hidden' }}>
        <SitePreviewMini site={site} />
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <span className={`chip ${site.status === 'published' ? 'chip-ok' : ''}`}>
            <span className={`dot ${site.status === 'draft' ? 'dot-idle' : ''}`} />
            {site.status === 'published' ? 'Live' : 'Draft'}
          </span>
        </div>
        {hover && (
          <div className="fade-in" style={{ position: 'absolute', inset: 0, background: 'oklch(0.18 0.008 80 / 0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, backdropFilter: 'blur(2px)' }}>
            <button className="btn btn-sm" style={{ background: 'var(--bg)', color: 'var(--ink)' }} onClick={onOpen}><Icons.pen size={12} /> Edit</button>
            {site.status === 'published' && <button className="btn btn-sm" style={{ background: 'transparent', color: 'var(--bg)', border: '1px solid oklch(0.99 0 0 / 0.4)' }} onClick={e => e.stopPropagation()}><Icons.external size={12} /> Visit</button>}
          </div>
        )}
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600 }}>{site.name}</h3>
          <button className="btn btn-icon btn-ghost btn-sm" onClick={e => e.stopPropagation()}><Icons.more size={14} /></button>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 6 }} className="mono">
          <Icons.globe size={11} /> {site.domain}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)', fontSize: 11.5, color: 'var(--ink-2)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkline data={[3,5,4,7,6,8,9,11,10,13]} width={40} height={14} color="var(--accent)" />
            {site.visitors.toLocaleString()}
          </span>
          <span>· {site.edited}</span>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage({ sites, sitesLoading, onOpen, onCreate, user, onNavigate, onOpenAI }) {
  const [filter, setFilter]     = useState('all')
  const [activity, setActivity] = useState([])

  useEffect(() => {
    fetchActivity(8).then(setActivity).catch(console.error)
  }, [])

  const filtered = sites.filter(s => filter === 'all' || s.status === filter)
  const totalVisitors = sites.reduce((a, s) => a + s.visitors, 0)

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="live-dot" /> Workspace · live
          </div>
          <h1 className="display" style={{ marginTop: 8 }}>Welcome back, {user?.name?.split(' ')[0] || 'there'}.</h1>
          <p className="subtitle" style={{ marginTop: 6, fontSize: 14 }}>
            {sites.filter(s => s.status === 'draft').length} drafts · {sites.filter(s => s.status === 'published').length} live · {totalVisitors.toLocaleString()} visitors this month
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <CollabStack max={3} showLive />
          <div style={{ width: 1, height: 22, background: 'var(--line)' }} />
          <button className="btn btn-secondary press"><Icons.bolt size={14} /> Quick start</button>
          <button className="btn btn-primary press" onClick={onCreate}><Icons.plus size={14} /> New site</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }} className="stagger">
        <KPI label="Sites" value={sites.length} sub={`${sites.filter(s => s.status === 'published').length} live`} delta="+2" trend={[1,2,3,3,4,4,5,5,6,7]} />
        <KPI label="Visitors · 30d" value={totalVisitors.toLocaleString()} sub="vs prior 30d" delta="+12.4%" deltaUp trend={VISITOR_DATA.slice(-12)} />
        <KPI label="Conversion" value="3.8%" sub="signup → first edit" delta="+0.6pt" deltaUp trend={[2.1,2.4,2.8,3.0,3.2,3.4,3.5,3.7,3.8]} />
        <KPI label="AI credits" value="84 / 100" sub="resets May 12" progress={84} />
      </div>

      {/* Charts + AI promo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12, marginBottom: 24 }}>
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <h3 className="eyebrow">Traffic this week</h3>
              <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 8, lineHeight: 1 }}>3,216 <span style={{ fontSize: 13, color: 'var(--ok)', marginLeft: 6, fontWeight: 500 }}>↑ 12.4%</span></div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>Across all published sites</div>
            </div>
            <div className="seg">
              <button>24h</button><button className="active">7d</button><button>30d</button><button>All</button>
            </div>
          </div>
          <BarChart data={TRAFFIC_BY_DAY} height={150} />
        </div>

        <div className="card glow-card" style={{ padding: 22, background: 'var(--ink)', color: 'var(--bg)', border: 'none', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, oklch(0.55 0.18 268 / 0.4), transparent 70%)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'oklch(0.55 0.18 268 / 0.25)', color: 'oklch(0.85 0.14 268)', display: 'grid', placeItems: 'center' }}>
                <Icons.sparkles size={14} />
              </div>
              <span className="eyebrow" style={{ color: 'oklch(0.78 0.12 268)' }}>AI co-writer</span>
            </div>
            <h3 style={{ color: 'var(--bg)', fontSize: 18, lineHeight: 1.3, marginBottom: 8, letterSpacing: '-0.02em' }}>Draft a whole page from one sentence.</h3>
            <p style={{ fontSize: 13, color: 'oklch(0.78 0.01 80)', lineHeight: 1.55, marginBottom: 16 }}>Hero, features, pricing — generated, edited, ready to publish in minutes.</p>
            <button className="btn btn-sm press" onClick={onOpenAI} style={{ background: 'var(--bg)', color: 'var(--ink)' }}>Open generator <Icons.arrowRight size={12} /></button>
            <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
              {['Hero copy','About','Pricing','FAQ'].map(t => (
                <span key={t} style={{ fontSize: 10.5, padding: '3px 8px', borderRadius: 999, background: 'oklch(0.99 0 0 / 0.08)', color: 'oklch(0.85 0.01 80)', border: '1px solid oklch(0.99 0 0 / 0.1)' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sites + activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 className="title">Your sites</h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div className="seg">
                <button className={filter === 'all'       ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
                <button className={filter === 'published' ? 'active' : ''} onClick={() => setFilter('published')}>Live</button>
                <button className={filter === 'draft'     ? 'active' : ''} onClick={() => setFilter('draft')}>Drafts</button>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('sites')}>View all <Icons.arrowRight size={11} /></button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }} className="stagger">
            <div className="card card-hover press" onClick={onCreate} style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 220, borderStyle: 'dashed', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-soft)', color: 'var(--accent-ink)', display: 'grid', placeItems: 'center', animation: 'float 3s ease-in-out infinite' }}>
                <Icons.plus size={22} />
              </div>
              <div style={{ fontWeight: 500 }}>Create new site</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', maxWidth: 200 }}>Pick a template, name it, ship it.</div>
            </div>
            {filtered.slice(0, 5).map(s => <SiteCard key={s.id} site={s} onOpen={() => onOpen(s.id)} />)}
          </div>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 className="eyebrow">Top performing</h3>
              <Icons.bolt size={12} style={{ color: 'var(--ink-3)' }} />
            </div>
            {sites.filter(s => s.status === 'published').slice(0, 3).map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < 1 ? '1px solid var(--line)' : 'none', cursor: 'pointer' }} onClick={() => onOpen(s.id)}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: s.color, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>{s.favicon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{s.visitors.toLocaleString()} visitors</div>
                </div>
                <Sparkline data={[3,5,4,7,6,8,9,11,10,13]} width={48} height={20} color="var(--accent)" />
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 18 }}>
            <h3 className="eyebrow" style={{ marginBottom: 14 }}>Activity feed</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
              {activity.length === 0 && (
                <li style={{ fontSize: 12.5, color: 'var(--ink-3)', padding: '8px 0' }}>
                  No activity yet — create your first site!
                </li>
              )}
              {activity.map((a, i) => {
                const label = a.action.replace(/_/g, ' ')
                const isLast = i === activity.length - 1
                return (
                  <li key={a.id} style={{ fontSize: 12.5, lineHeight: 1.45, position: 'relative', paddingLeft: 18, paddingBottom: isLast ? 0 : 14 }}>
                    <span style={{ position: 'absolute', left: 3, top: 4, width: 7, height: 7, borderRadius: '50%', background: i === 0 ? 'var(--accent)' : 'var(--bg)', border: '2px solid ' + (i === 0 ? 'var(--accent)' : 'var(--line-strong)') }} />
                    {!isLast && <span style={{ position: 'absolute', left: 6, top: 12, width: 1, bottom: 0, background: 'var(--line)' }} />}
                    <div style={{ color: 'var(--ink)' }}><span style={{ color: 'var(--ink-2)' }}>{label}</span></div>
                    <div style={{ color: 'var(--ink-3)', fontSize: 11, marginTop: 2 }}>{a.on ? `${a.on} · ` : ''}{a.when}</div>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="card" style={{ padding: 16, background: 'var(--bg-sunk)', borderStyle: 'dashed' }}>
            <h3 className="eyebrow" style={{ marginBottom: 8 }}>Tip</h3>
            <p style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5, margin: 0 }}>
              Press <kbd>⌘</kbd><kbd>K</kbd> anywhere to open the command palette and jump to any action.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
