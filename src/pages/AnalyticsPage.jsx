import { useState } from 'react'
import Icons from '../components/ui/Icons'
import { Sparkline } from '../components/ui/Sparkline'

function LineChart({ data, height = 220, color = 'var(--accent)' }) {
  const w = 800, h = height
  const pad = { l: 36, r: 12, t: 12, b: 24 }
  const max = Math.max(...data.map(d => d.value), 1)
  const xs = (i) => pad.l + (i / (data.length - 1)) * (w - pad.l - pad.r)
  const ys = (v) => pad.t + (1 - v / max) * (h - pad.t - pad.b)
  const pts = data.map((d, i) => `${xs(i)},${ys(d.value)}`).join(' ')
  const area = `${pad.l},${h - pad.b} ${pts} ${xs(data.length - 1)},${h - pad.b}`
  const yTicks = 4
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id="lg-ana" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const y = pad.t + (i / yTicks) * (h - pad.t - pad.b)
        const v = max - (i / yTicks) * max
        return (
          <g key={i}>
            <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="var(--line)" strokeWidth="1" strokeDasharray={i === yTicks ? '' : '2 4'} />
            <text x={pad.l - 8} y={y + 3} textAnchor="end" className="chart-axis">{Math.round(v).toLocaleString()}</text>
          </g>
        )
      })}
      {data.map((d, i) => i % Math.ceil(data.length / 8) === 0 && (
        <text key={i} x={xs(i)} y={h - pad.b + 16} textAnchor="middle" className="chart-axis">{d.label}</text>
      ))}
      <polygon points={area} fill="url(#lg-ana)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => (
        <circle key={i} cx={xs(i)} cy={ys(d.value)} r="3" fill="var(--bg)" stroke={color} strokeWidth="2">
          <title>{d.label}: {d.value}</title>
        </circle>
      ))}
    </svg>
  )
}

function Donut({ segments, size = 180 }) {
  const total = segments.reduce((a, s) => a + s.value, 0)
  const r = size / 2 - 14
  const c = 2 * Math.PI * r
  let offset = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--line)" strokeWidth="14" />
      {segments.map((s, i) => {
        const len = (s.value / total) * c
        const el = (
          <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={s.color} strokeWidth="14"
            strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} strokeLinecap="butt"
            transform={`rotate(-90 ${size/2} ${size/2})`} />
        )
        offset += len
        return el
      })}
      <text x={size/2} y={size/2 - 4} textAnchor="middle" style={{ fontSize: 22, fontWeight: 600, fill: 'var(--ink)' }}>{total.toLocaleString()}</text>
      <text x={size/2} y={size/2 + 16} textAnchor="middle" style={{ fontSize: 11, fill: 'var(--ink-3)' }}>total</text>
    </svg>
  )
}

function FunnelChart({ stages }) {
  const max = stages[0]?.value || 1
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {stages.map((s, i) => {
        const pct = (s.value / max) * 100
        const dropoff = i > 0 ? Math.round((1 - s.value / stages[i-1].value) * 100) : null
        return (
          <div key={i}>
            {dropoff !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', paddingLeft: `${(100 - pct) / 2}%` }}>
                <div style={{ height: 20, width: 2, background: 'var(--line)', marginLeft: 12 }} />
                <span style={{ fontSize: 11, color: 'var(--err)', fontFamily: 'var(--font-mono)' }}>↓ {dropoff}% drop-off</span>
              </div>
            )}
            <div style={{ position: 'relative', height: 52, display: 'flex', alignItems: 'center' }}>
              <div style={{
                position: 'absolute', left: `${(100 - pct) / 2}%`, right: `${(100 - pct) / 2}%`,
                height: '100%', background: i === 0 ? 'var(--accent)' : `oklch(0.55 0.18 268 / ${0.9 - i * 0.15})`,
                borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 16px', transition: 'all .4s var(--ease)'
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{s.label}</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{s.value.toLocaleString()}</div>
                  <div style={{ fontSize: 10.5, color: 'oklch(1 0 0 / 0.7)' }}>{Math.round(pct)}%</div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ABTestCard({ test }) {
  const totalA = test.a.conversions + test.a.visitors - test.a.conversions
  const totalB = test.b.conversions + test.b.visitors - test.b.conversions
  const rateA = (test.a.conversions / test.a.visitors * 100).toFixed(1)
  const rateB = (test.b.conversions / test.b.visitors * 100).toFixed(1)
  const winner = parseFloat(rateB) > parseFloat(rateA) ? 'B' : 'A'

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 12 }}>
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{test.name}</div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>Testing: <strong style={{ color: 'var(--ink-2)' }}>{test.metric}</strong> · {test.page}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{test.days}d running</span>
          <span className={`chip ${test.status === 'running' ? 'chip-ok' : test.status === 'winner' ? 'chip-accent' : ''}`}>
            {test.status === 'running' && <span className="live-dot" style={{ width: 5, height: 5 }} />}
            {test.status}
          </span>
          {test.status === 'running' && <button className="btn btn-ghost btn-sm" style={{ color: 'var(--err)' }}>Stop</button>}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        {[
          { id: 'A', data: test.a, isWinner: winner === 'A', rate: rateA },
          { id: 'B', data: test.b, isWinner: winner === 'B', rate: rateB },
        ].map(v => (
          <div key={v.id} style={{ padding: '16px 18px', borderRight: v.id === 'A' ? '1px solid var(--line)' : 'none', background: v.isWinner && test.status === 'winner' ? 'var(--ok-soft)' : 'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, background: v.id === 'A' ? 'var(--accent-soft)' : 'var(--bg-sunk)', color: v.id === 'A' ? 'var(--accent-ink)' : 'var(--ink-2)', padding: '2px 8px', borderRadius: 4, fontFamily: 'var(--font-mono)' }}>Variant {v.id}</span>
              {v.isWinner && test.status === 'winner' && <span className="chip chip-ok" style={{ fontSize: 10 }}>Winner</span>}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.data.label}</div>
            <div style={{ display: 'flex', gap: 20, fontSize: 12.5 }}>
              <div><div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{v.rate}%</div><div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Conv. rate</div></div>
              <div><div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{v.data.visitors.toLocaleString()}</div><div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Visitors</div></div>
            </div>
            <div className="progress" style={{ marginTop: 10 }}>
              <div style={{ width: `${v.rate}%`, background: v.id === 'A' ? 'var(--accent)' : 'oklch(0.62 0.13 155)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CreateTestModal({ onClose }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [metric, setMetric] = useState('cta_click')
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Create A/B test</h3>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>Step {step} of 3</div>
          </div>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><Icons.x size={14} /></button>
        </div>
        <div className="modal-body">
          {step === 1 && (
            <>
              <label className="field"><span className="field-label">Test name</span>
                <input className="input" placeholder="Hero headline variant" value={name} onChange={e => setName(e.target.value)} autoFocus />
              </label>
              <label className="field"><span className="field-label">Goal metric</span>
                <select className="input" value={metric} onChange={e => setMetric(e.target.value)}>
                  <option value="cta_click">CTA button clicks</option>
                  <option value="form_submit">Form submissions</option>
                  <option value="session_time">Session time</option>
                  <option value="bounce">Bounce rate</option>
                </select>
              </label>
              <label className="field"><span className="field-label">Traffic split</span>
                <div className="seg">
                  {['50/50','70/30','80/20'].map(s => <button key={s} className={s === '50/50' ? 'active' : ''}>{s}</button>)}
                </div>
              </label>
            </>
          )}
          {step === 2 && (
            <>
              <div className="card" style={{ padding: 16, marginBottom: 12, background: 'var(--accent-soft)', border: '1px solid oklch(0.55 0.18 268 / 0.25)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-ink)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Variant A (Control)</div>
                <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>Your current live content. No changes needed.</div>
              </div>
              <div className="card" style={{ padding: 16, background: 'var(--bg-sunk)', border: '1px solid var(--line)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Variant B (Challenger)</div>
                <label className="field"><span className="field-label">Section to test</span>
                  <select className="input"><option>Hero</option><option>Text section</option><option>CTA</option></select>
                </label>
                <label className="field"><span className="field-label">New headline</span>
                  <input className="input" placeholder="Enter challenger headline…" />
                </label>
              </div>
            </>
          )}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: 56, height: 56, margin: '0 auto 16px', borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent-ink)', display: 'grid', placeItems: 'center' }}>
                <Icons.check size={24} />
              </div>
              <h4 style={{ fontSize: 17, marginBottom: 6 }}>Test ready to launch</h4>
              <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 4 }}>Traffic will be split automatically. Results appear within 24h.</p>
              <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>Recommended minimum: 200 visitors per variant</p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          {step > 1 && <button className="btn btn-secondary press" onClick={() => setStep(s => s - 1)}>Back</button>}
          <button className="btn btn-ghost press" onClick={onClose}>Cancel</button>
          {step < 3
            ? <button className="btn btn-primary press" disabled={step === 1 && !name} onClick={() => setStep(s => s + 1)}>Continue <Icons.arrowRight size={12} /></button>
            : <button className="btn btn-primary press" onClick={onClose}><Icons.bolt size={13} /> Launch test</button>}
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage({ sites }) {
  const [range, setRange]         = useState('30d')
  const [activeSite, setActiveSite] = useState(sites[0]?.id ?? '')
  const [metric, setMetric]       = useState('visitors')
  const [mainTab, setMainTab]     = useState('overview')
  const [showCreateTest, setShowCreateTest] = useState(false)
  const [connectedProviders, setConnectedProviders] = useState({ plausible: false, ga4: false, fathom: false, mixpanel: false })

  const site = sites.find(s => s.id === activeSite) ?? sites[0]
  const totalVisitors = site?.visitors ?? 0
  const days = range === '24h' ? 24 : range === '7d' ? 7 : range === '30d' ? 30 : 90

  const rawCurve = Array.from({ length: days }, (_, i) =>
    Math.max(0, 1 + Math.sin(i / 3) * 0.4 + Math.cos(i / 7) * 0.3 + (i / days) * 0.6)
  )
  const curveSum = rawCurve.reduce((a, v) => a + v, 0) || 1
  const visitorsData = rawCurve.map((v, i) => ({
    label: range === '24h' ? `${i}:00` : `D${i + 1}`,
    value: Math.round((v / curveSum) * totalVisitors),
  }))

  const sources = [
    { label: 'Direct', value: 1842, pct: 38, color: 'oklch(0.55 0.18 268)' },
    { label: 'Search', value: 1356, pct: 28, color: 'oklch(0.62 0.13 155)' },
    { label: 'Social', value: 872,  pct: 18, color: 'oklch(0.6 0.17 30)' },
    { label: 'Referral',value: 533, pct: 11, color: 'oklch(0.7 0.15 75)' },
    { label: 'Other',  value: 242,  pct: 5,  color: 'var(--ink-3)' },
  ]
  const devices = [
    { label: 'Desktop', value: 62, color: 'oklch(0.55 0.18 268)' },
    { label: 'Mobile',  value: 31, color: 'oklch(0.62 0.13 155)' },
    { label: 'Tablet',  value: 7,  color: 'oklch(0.7 0.15 75)' },
  ]
  const pages = [
    { path: '/', views: 1842, time: '2:14', bounce: 32, trend: [3,5,4,7,6,8,9,11,10,13] },
    { path: '/work', views: 962, time: '3:48', bounce: 24, trend: [2,4,5,4,6,7,8,9,8,10] },
    { path: '/about', views: 412, time: '1:52', bounce: 41, trend: [1,2,2,3,3,4,4,5,4,5] },
    { path: '/work/halcyon', views: 388, time: '4:22', bounce: 18, trend: [1,1,2,3,4,5,6,7,8,9] },
    { path: '/contact', views: 198, time: '0:42', bounce: 58, trend: [1,1,1,2,2,2,2,2,3,2] },
  ]
  const countries = [
    { code: 'US', name: 'United States', visitors: 542, pct: 42 },
    { code: 'GB', name: 'United Kingdom', visitors: 232, pct: 18 },
    { code: 'DE', name: 'Germany', visitors: 154, pct: 12 },
    { code: 'JP', name: 'Japan', visitors: 116, pct: 9 },
    { code: 'CA', name: 'Canada', visitors: 90, pct: 7 },
    { code: '··', name: 'Other', visitors: 154, pct: 12 },
  ]
  const realtime = [
    { country: '🇺🇸', city: 'San Francisco', page: '/', when: 'now' },
    { country: '🇩🇪', city: 'Berlin', page: '/work', when: '12s' },
    { country: '🇯🇵', city: 'Tokyo', page: '/about', when: '38s' },
    { country: '🇬🇧', city: 'London', page: '/', when: '1m' },
    { country: '🇨🇦', city: 'Toronto', page: '/contact', when: '2m' },
  ]

  const funnelStages = [
    { label: 'Page view', value: 4845 },
    { label: 'CTA click', value: 2103 },
    { label: 'Form start', value: 892 },
    { label: 'Form submit', value: 438 },
    { label: 'Thank you', value: 431 },
  ]

  const abTests = [
    {
      name: 'Hero headline test',
      metric: 'CTA clicks', page: '/', days: 12, status: 'running',
      a: { label: '"Quietly ambitious work for brands"', visitors: 1204, conversions: 86 },
      b: { label: '"The studio behind brands you trust"', visitors: 1190, conversions: 112 },
    },
    {
      name: 'CTA button color',
      metric: 'CTA clicks', page: '/', days: 31, status: 'winner',
      a: { label: 'Dark button (current)', visitors: 2400, conversions: 168 },
      b: { label: 'Accent blue button', visitors: 2380, conversions: 234 },
    },
  ]

  const providers = [
    { id: 'plausible', name: 'Plausible', desc: 'Privacy-first analytics. GDPR compliant, no cookies.',    color: 'oklch(0.55 0.18 268)' },
    { id: 'ga4',       name: 'Google Analytics 4', desc: 'Full-featured. Requires cookie consent banner.',  color: 'oklch(0.6 0.17 30)'  },
    { id: 'fathom',    name: 'Fathom',    desc: 'Simple, privacy-focused, no banner required.',            color: 'oklch(0.55 0.2 320)' },
    { id: 'mixpanel',  name: 'Mixpanel',  desc: 'Event tracking and product analytics.',                   color: 'oklch(0.62 0.13 155)' },
  ]

  const tabs = [
    { id: 'overview', label: 'Overview',   icon: Icons.zap     },
    { id: 'funnel',   label: 'Funnel',     icon: Icons.layers   },
    { id: 'abtests',  label: 'A/B Tests',  icon: Icons.branch   },
    { id: 'connect',  label: 'Connect',    icon: Icons.plug     },
  ]

  return (
    <div className="page fade-in">
      <div className="page-hero">
        <div>
          <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="live-pill"><span className="live-dot" /> 18 live readers</span>
          </div>
          <h1 className="display" style={{ fontSize: 30, marginTop: 10 }}>Analytics</h1>
          <p className="subtitle" style={{ fontSize: 14 }}>Visitor flows, content performance, and where it's all coming from.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="input" value={activeSite} onChange={e => setActiveSite(e.target.value)} style={{ width: 200, height: 36 }}>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <div className="seg">
            {['24h','7d','30d','90d'].map(r => <button key={r} className={range === r ? 'active' : ''} onClick={() => setRange(r)}>{r}</button>)}
          </div>
          <button className="btn btn-secondary press"><Icons.download size={13} /> Export</button>
          <button className="btn btn-secondary btn-icon press" title="Refresh"><Icons.refresh size={13} /></button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 18, borderBottom: '1px solid var(--line)' }}>
        {tabs.map(t => {
          const I = t.icon
          return (
            <button key={t.id} onClick={() => setMainTab(t.id)}
              className="press"
              style={{ padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
                borderBottom: mainTab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
                color: mainTab === t.id ? 'var(--ink)' : 'var(--ink-3)', fontSize: 13, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 7, marginBottom: -1 }}>
              <I size={13} /> {t.label}
            </button>
          )
        })}
      </div>

      {/* ── OVERVIEW ── */}
      {mainTab === 'overview' && (
        <>
          {sites.length === 0 && (
            <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)', marginBottom: 16 }}>
              <Icons.zap size={28} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.25 }} />
              <div style={{ fontSize: 14, fontWeight: 500 }}>No sites yet</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Create a site to start seeing analytics.</div>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
            {[
              { l: 'Visitors',     v: totalVisitors.toLocaleString(),                                         d: '+12.4%', up: true,  t: visitorsData.slice(-12).map(d => d.value) },
              { l: 'Page views',   v: (totalVisitors * 2.6).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','), d: '+8.1%',  up: true,  t: [200,240,260,280,310,340,360,400,440,460] },
              { l: 'Avg. session', v: '2:48',                                                                  d: '+0:14',  up: true,  t: [120,130,140,138,150,148,160,165,168,170] },
              { l: 'Bounce rate',  v: '34.2%',                                                                 d: '-3.1pt', up: true,  t: [40,38,36,37,35,34,34,33,33,34] },
            ].map(k => (
              <div key={k.l} className="kpi-tile">
                <div className="kpi-label">{k.l}</div>
                <div className="kpi-value">{k.v}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  <span className={`kpi-delta ${k.up ? 'up' : 'down'}`}>{k.up ? '↑' : '↓'} {k.d}</span>
                  <Sparkline data={k.t} width={70} height={24} color="var(--accent)" />
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 22, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <h3 className="eyebrow">Trend</h3>
                <div style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 4 }}>{site?.name} · last {range}</div>
              </div>
              <div className="seg">
                {['visitors','views','time','bounce'].map(m => (
                  <button key={m} className={metric === m ? 'active' : ''} onClick={() => setMetric(m)} style={{ textTransform: 'capitalize' }}>{m}</button>
                ))}
              </div>
            </div>
            <div style={{ overflowX: 'hidden' }}><LineChart data={visitorsData} height={240} /></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div className="card" style={{ padding: 22 }}>
              <h3 className="eyebrow" style={{ marginBottom: 16 }}>Traffic sources</h3>
              <div style={{ display: 'flex', height: 14, borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
                {sources.map(s => <div key={s.label} style={{ width: `${s.pct}%`, background: s.color }} title={`${s.label}: ${s.pct}%`} />)}
              </div>
              {sources.map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--line)', fontSize: 13 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{s.label}</span>
                  <span style={{ color: 'var(--ink-2)', fontFamily: 'var(--font-mono)', fontSize: 11.5, width: 64, textAlign: 'right' }}>{s.value.toLocaleString()}</span>
                  <span style={{ color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', fontSize: 11.5, width: 38, textAlign: 'right' }}>{s.pct}%</span>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 22 }}>
              <h3 className="eyebrow" style={{ marginBottom: 16 }}>Devices</h3>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
                <Donut segments={devices} size={160} />
              </div>
              {devices.map(d => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, padding: '4px 0' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                  <span style={{ flex: 1 }}>{d.label}</span>
                  <span className="mono" style={{ color: 'var(--ink-3)' }}>{d.value}%</span>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 className="eyebrow">Live now</h3>
                <span className="live-pill"><span className="live-dot" /> 18</span>
              </div>
              <div style={{ padding: 8 }}>
                {realtime.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 7, fontSize: 12.5 }}>
                    <span style={{ fontSize: 16 }}>{r.country}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500 }}>{r.city}</div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{r.page}</div>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{r.when}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="section-bar">
                <h3 className="eyebrow">Top pages</h3>
                <button className="btn btn-ghost btn-sm">All pages <Icons.arrowRight size={11} /></button>
              </div>
              <table className="tbl">
                <thead><tr><th>Path</th><th>Views</th><th>Trend</th><th>Avg time</th><th>Bounce</th></tr></thead>
                <tbody>
                  {pages.map(p => (
                    <tr key={p.path}>
                      <td className="mono" style={{ color: 'var(--ink-2)' }}>{p.path}</td>
                      <td style={{ fontWeight: 500 }}>{p.views.toLocaleString()}</td>
                      <td><Sparkline data={p.trend} width={72} height={20} color="var(--accent)" /></td>
                      <td className="mono" style={{ color: 'var(--ink-2)' }}>{p.time}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress" style={{ width: 50 }}>
                            <div style={{ width: `${p.bounce}%`, background: p.bounce > 50 ? 'var(--err)' : 'var(--accent)' }} />
                          </div>
                          <span style={{ fontSize: 11.5, color: 'var(--ink-2)', fontFamily: 'var(--font-mono)' }}>{p.bounce}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card" style={{ padding: 22 }}>
              <h3 className="eyebrow" style={{ marginBottom: 16 }}>Top locations</h3>
              {countries.map(c => (
                <div key={c.code} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4, alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="mono" style={{ width: 24, fontSize: 10.5, color: 'var(--ink-3)' }}>{c.code}</span>
                      {c.name}
                    </span>
                    <span style={{ color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>{c.visitors} · {c.pct}%</span>
                  </div>
                  <div className="progress"><div style={{ width: `${c.pct * 2.4}%`, background: 'var(--accent)' }} /></div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── FUNNEL ── */}
      {mainTab === 'funnel' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>Conversion funnel</h3>
                  <p style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 4 }}>From page view to form submission</p>
                </div>
                <div className="seg">
                  {['All pages', '/', '/contact'].map(p => <button key={p}>{p}</button>)}
                </div>
              </div>
              <FunnelChart stages={funnelStages} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="kpi-tile">
                <div className="kpi-label">Overall conv. rate</div>
                <div className="kpi-value">8.9%</div>
                <div className="kpi-delta up" style={{ marginTop: 10 }}>↑ +1.4pt vs last period</div>
              </div>
              <div className="kpi-tile">
                <div className="kpi-label">Biggest drop-off</div>
                <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 8 }}>CTA → Form</div>
                <div style={{ fontSize: 11.5, color: 'var(--err)', marginTop: 4, fontWeight: 500 }}>57.6% abandon here</div>
              </div>
              <div className="card" style={{ padding: 16 }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>Stage breakdown</div>
                {funnelStages.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < funnelStages.length - 1 ? '1px solid var(--line)' : 'none', fontSize: 12.5 }}>
                    <span style={{ fontSize: 10, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', width: 20 }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ flex: 1 }}>{s.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{s.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── A/B TESTS ── */}
      {mainTab === 'abtests' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>A/B Tests</h2>
              <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>{abTests.filter(t => t.status === 'running').length} running · {abTests.filter(t => t.status === 'winner').length} completed</p>
            </div>
            <button className="btn btn-primary press" onClick={() => setShowCreateTest(true)}>
              <Icons.plus size={13} /> New test
            </button>
          </div>

          {abTests.map((t, i) => <ABTestCard key={i} test={t} />)}

          <div className="card" style={{ padding: 28, textAlign: 'center', border: '1.5px dashed var(--line)' }}>
            <div style={{ width: 44, height: 44, background: 'var(--bg-sunk)', borderRadius: 12, display: 'grid', placeItems: 'center', margin: '0 auto 12px', color: 'var(--ink-3)' }}>
              <Icons.branch size={20} />
            </div>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>Test any element on your site</div>
            <p style={{ fontSize: 12.5, color: 'var(--ink-3)', maxWidth: 360, margin: '0 auto 16px' }}>Headlines, CTAs, images, and layouts — find what converts best with real traffic data.</p>
            <button className="btn btn-secondary press" onClick={() => setShowCreateTest(true)}><Icons.plus size={12} /> Create A/B test</button>
          </div>
        </div>
      )}

      {/* ── CONNECT ── */}
      {mainTab === 'connect' && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Analytics integrations</h2>
            <p style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>Connect a third-party provider to power your analytics with real visitor data.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {providers.map(p => {
              const connected = connectedProviders[p.id]
              return (
                <div key={p.id} className="card card-hover" style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: `${p.color.replace(')', ' / 0.12)')}`, border: `1px solid ${p.color.replace(')', ' / 0.2)')}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <Icons.zap size={18} style={{ color: p.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <strong style={{ fontSize: 14 }}>{p.name}</strong>
                      {connected && <span className="chip chip-ok" style={{ fontSize: 10 }}><Icons.check size={9} /> Connected</span>}
                    </div>
                    <p style={{ fontSize: 12.5, color: 'var(--ink-3)', marginBottom: 12, lineHeight: 1.55 }}>{p.desc}</p>
                    {connected ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm press"><Icons.settings size={11} /> Configure</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--err)' }}
                          onClick={() => setConnectedProviders(c => ({ ...c, [p.id]: false }))}>Disconnect</button>
                      </div>
                    ) : (
                      <button className="btn btn-primary btn-sm press"
                        onClick={() => setConnectedProviders(c => ({ ...c, [p.id]: true }))}>
                        Connect {p.name}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="card" style={{ padding: 22 }}>
            <h3 className="eyebrow" style={{ marginBottom: 14 }}>Weblith native analytics</h3>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent-ink)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icons.bolt size={18} />
              </div>
              <div>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 10, lineHeight: 1.6 }}>
                  Weblith's built-in analytics are always on. No code, no cookies, no consent banner required. Data is aggregated and privacy-preserving.
                </p>
                <div style={{ display: 'flex', gap: 20 }}>
                  {[
                    { l: 'Data retention', v: '2 years' },
                    { l: 'Cookie-free',    v: 'Yes' },
                    { l: 'GDPR ready',     v: 'Yes' },
                    { l: 'Sampling',       v: 'None' },
                  ].map(m => (
                    <div key={m.l}>
                      <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>{m.l}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{m.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateTest && <CreateTestModal onClose={() => setShowCreateTest(false)} />}
    </div>
  )
}
