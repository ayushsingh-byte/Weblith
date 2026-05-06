import { useState } from 'react'
import Icons from '../components/ui/Icons'
import { Sparkline } from '../components/ui/Sparkline'

export default function SitesPage({ sites, onOpen, onCreate }) {
  const [q, setQ] = useState('')
  const list = sites.filter(s => !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.domain.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <h1 className="display" style={{ fontSize: 28 }}>Sites</h1>
          <p className="subtitle">Manage every site in your workspace.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <Icons.search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }} />
            <input className="input" value={q} onChange={e => setQ(e.target.value)} placeholder="Filter sites…" style={{ paddingLeft: 30, height: 36, width: 240 }} />
          </div>
          <button className="btn btn-primary press" onClick={onCreate}><Icons.plus size={14} /> New site</button>
        </div>
      </div>
      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr><th>Name</th><th>Status</th><th>Domain</th><th>Visitors · 30d</th><th>Trend</th><th>Edited</th><th></th></tr>
          </thead>
          <tbody>
            {list.map(s => (
              <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => onOpen(s.id)}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 7, background: s.color, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>{s.favicon}</div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{s.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-3)', textTransform: 'capitalize' }}>{s.template} template</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`chip ${s.status === 'published' ? 'chip-ok' : ''}`}>
                    <span className={`dot ${s.status === 'draft' ? 'dot-idle' : ''}`} />
                    {s.status}
                  </span>
                </td>
                <td className="mono" style={{ color: 'var(--ink-2)' }}>{s.domain}</td>
                <td style={{ fontWeight: 500 }}>{s.visitors.toLocaleString()}</td>
                <td>
                  <Sparkline
                    data={s.status === 'published' ? [3,5,4,7,6,8,9,11,10,13] : [0,0,0,0,0,0,0,0]}
                    width={80} height={22}
                    color={s.status === 'published' ? 'var(--accent)' : 'var(--ink-3)'}
                  />
                </td>
                <td style={{ color: 'var(--ink-2)' }}>{s.edited}</td>
                <td style={{ textAlign: 'right' }}><Icons.chevronRight size={14} style={{ color: 'var(--ink-3)' }} /></td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--ink-3)', padding: '32px 0' }}>No sites found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
