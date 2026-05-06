import { useState } from 'react'
import Icons from '../components/ui/Icons'
import { Sparkline } from '../components/ui/Sparkline'

function LineChart({ data, height = 220, color = 'var(--accent)' }) {
  const w = 800, h = height
  const pad = { l: 36, r: 12, t: 12, b: 24 }
  const max = Math.max(...data.map(d => d.value))
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

export default function AnalyticsPage({ sites }) {
  const [range, setRange] = useState('30d')
  const [activeSite, setActiveSite] = useState(sites[0]?.id)
  const [metric, setMetric] = useState('visitors')
  const site = sites.find(s => s.id === activeSite) || sites[0]

  const days = range === '24h' ? 24 : range === '7d' ? 7 : range === '30d' ? 30 : 90
  const visitorsData = Array.from({ length: days }, (_, i) => {
    const v = 200 + Math.sin(i / 3) * 80 + Math.cos(i / 7) * 60 + i * 6 + Math.random() * 40
    return { label: range === '24h' ? `${i}:00` : `D${i+1}`, value: Math.max(0, Math.round(v)) }
  })

  const sources = [
    { label: 'Direct', value: 1842, pct: 38, color: 'oklch(0.55 0.18 268)' },
    { label: 'Search', value: 1356, pct: 28, color: 'oklch(0.62 0.13 155)' },
    { label: 'Social', value: 872, pct: 18, color: 'oklch(0.6 0.17 30)' },
    { label: 'Referral', value: 533, pct: 11, color: 'oklch(0.7 0.15 75)' },
    { label: 'Other', value: 242, pct: 5, color: 'var(--ink-3)' },
  ]
  const devices = [
    { label: 'Desktop', value: 62, color: 'oklch(0.55 0.18 268)' },
    { label: 'Mobile', value: 31, color: 'oklch(0.62 0.13 155)' },
    { label: 'Tablet', value: 7, color: 'oklch(0.7 0.15 75)' },
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { l: 'Visitors', v: '4,845', d: '+12.4%', up: true, t: visitorsData.slice(-12).map(d => d.value) },
          { l: 'Page views', v: '12,802', d: '+8.1%', up: true, t: [200,240,260,280,310,340,360,400,440,460] },
          { l: 'Avg. session', v: '2:48', d: '+0:14', up: true, t: [120,130,140,138,150,148,160,165,168,170] },
          { l: 'Bounce rate', v: '34.2%', d: '-3.1pt', up: true, t: [40,38,36,37,35,34,34,33,33,34] },
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
    </div>
  )
}
