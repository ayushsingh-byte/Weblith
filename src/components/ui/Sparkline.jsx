export function Sparkline({ data, width = 120, height = 32, color = 'var(--ink)' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = Math.max(max - min, 1)
  const pts = data.map((d, i) =>
    `${(i / (data.length - 1)) * width},${height - ((d - min) / range) * (height - 4) - 2}`
  ).join(' ')
  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={`0,${height} ${pts} ${width},${height}`} fill={color} opacity="0.08" />
    </svg>
  )
}

export function BarChart({ data, height = 140 }) {
  const max = Math.max(...data.map(d => d.value))
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height, paddingTop: 12 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' }}>
          <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <div className="spark-bar" style={{ width: '70%', height: `${(d.value / max) * 100}%`, animationDelay: `${i * 30}ms` }} title={`${d.label}: ${d.value}`} />
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>{d.label}</div>
        </div>
      ))}
    </div>
  )
}

export function LineChart({ data, height = 220, color = 'var(--accent)' }) {
  const w = 800, h = height, pad = { l: 36, r: 12, t: 12, b: 24 }
  const max = Math.max(...data.map(d => d.value)), min = 0
  const xs = (i) => pad.l + (i / (data.length - 1)) * (w - pad.l - pad.r)
  const ys = (v) => pad.t + (1 - (v - min) / (max - min)) * (h - pad.t - pad.b)
  const pts = data.map((d, i) => `${xs(i)},${ys(d.value)}`).join(' ')
  const area = `${pad.l},${h - pad.b} ${pts} ${xs(data.length - 1)},${h - pad.b}`
  const yTicks = 4
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id="lg-a" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const y = pad.t + (i / yTicks) * (h - pad.t - pad.b)
        const v = max - (i / yTicks) * (max - min)
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
      <polygon points={area} fill="url(#lg-a)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => (
        <circle key={i} cx={xs(i)} cy={ys(d.value)} r="3" fill="var(--bg)" stroke={color} strokeWidth="2">
          <title>{d.label}: {d.value}</title>
        </circle>
      ))}
    </svg>
  )
}

export function Donut({ segments, size = 180 }) {
  const total = segments.reduce((a, s) => a + s.value, 0)
  const r = size / 2 - 14, c = 2 * Math.PI * r
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
