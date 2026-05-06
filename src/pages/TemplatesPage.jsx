import { useState } from 'react'
import { TEMPLATES } from '../data/seeds'
import Icons from '../components/ui/Icons'

function TemplatePreview({ tmpl }) {
  const ink     = tmpl.dark ? 'oklch(0.99 0 0 / 0.9)'  : 'oklch(0.18 0.008 80 / 0.85)'
  const inkSoft = tmpl.dark ? 'oklch(0.99 0 0 / 0.35)' : 'oklch(0.18 0.008 80 / 0.35)'
  const inkLine = tmpl.dark ? 'oklch(0.99 0 0 / 0.18)' : 'oklch(0.18 0.008 80 / 0.18)'

  if (tmpl.id === 'blank')     return <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>empty canvas</div>
  if (tmpl.id === 'portfolio') return (
    <div style={{ position: 'absolute', inset: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ height: 8, width: 60, background: ink, borderRadius: 2 }} />
      <div style={{ flex: 1, marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {[...Array(4)].map((_, i) => <div key={i} style={{ background: inkLine, borderRadius: 4 }} />)}
      </div>
    </div>
  )
  if (tmpl.id === 'studio') return (
    <div style={{ position: 'absolute', inset: 0, padding: 18, color: ink }}>
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, marginTop: 8 }}>Studio*</div>
      <div style={{ height: 4, width: '70%', background: inkSoft, borderRadius: 2, marginTop: 10 }} />
      <div style={{ height: 4, width: '50%', background: inkSoft, borderRadius: 2, marginTop: 5 }} />
    </div>
  )
  if (tmpl.id === 'saas') return (
    <div style={{ position: 'absolute', inset: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ height: 6, width: 28, background: ink, borderRadius: 2 }} />
        <div style={{ height: 12, width: 36, background: ink, borderRadius: 3 }} />
      </div>
      <div style={{ height: 10, width: '80%', background: ink, borderRadius: 3, marginBottom: 5 }} />
      <div style={{ height: 10, width: '50%', background: ink, borderRadius: 3, marginBottom: 8 }} />
      <div style={{ height: 4, width: '90%', background: inkSoft, borderRadius: 2, marginBottom: 3 }} />
      <div style={{ height: 4, width: '70%', background: inkSoft, borderRadius: 2 }} />
    </div>
  )
  if (tmpl.id === 'blog') return (
    <div style={{ position: 'absolute', inset: 22, fontFamily: 'serif' }}>
      <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', color: ink, marginBottom: 6 }}>Field notes</div>
      {[...Array(5)].map((_, i) => <div key={i} style={{ height: 3, width: i === 2 || i === 4 ? '70%' : '100%', background: inkSoft, borderRadius: 1, marginBottom: 3 }} />)}
    </div>
  )
  if (tmpl.id === 'shop') return (
    <div style={{ position: 'absolute', inset: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      <div style={{ background: inkLine, borderRadius: 6 }} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5 }}>
        <div style={{ height: 6, width: '80%', background: ink, borderRadius: 2 }} />
        <div style={{ height: 4, width: '40%', background: inkSoft, borderRadius: 2 }} />
        <div style={{ height: 14, width: 40, background: ink, borderRadius: 3, marginTop: 8 }} />
      </div>
    </div>
  )
  if (tmpl.id === 'event') return (
    <div style={{ position: 'absolute', inset: 18 }}>
      <div style={{ height: 8, width: 80, background: ink, borderRadius: 2, marginBottom: 12 }} />
      {[0,1,2].map(i => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
          <div style={{ height: 4, width: 18, background: ink, borderRadius: 2, marginTop: 2 }} />
          <div style={{ height: 4, flex: 1, background: inkSoft, borderRadius: 2, marginTop: 2 }} />
        </div>
      ))}
    </div>
  )
  if (tmpl.id === 'docs') return (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '60px 1fr' }}>
      <div style={{ background: inkLine, padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[...Array(5)].map((_, i) => <div key={i} style={{ height: 3, background: ink, borderRadius: 2, opacity: 0.6 }} />)}
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ height: 8, width: '60%', background: ink, borderRadius: 2, marginBottom: 8 }} />
        <div style={{ height: 3, width: '90%', background: inkSoft, marginBottom: 3 }} />
        <div style={{ height: 3, width: '80%', background: inkSoft }} />
      </div>
    </div>
  )
  return null
}

export default function TemplatesPage({ onUse, embedded = false, selected, onSelect }) {
  const [cat, setCat] = useState('All')
  const cats = ['All', ...Array.from(new Set(TEMPLATES.map(t => t.category)))]
  const list = cat === 'All' ? TEMPLATES : TEMPLATES.filter(t => t.category === cat)

  return (
    <div className={embedded ? '' : 'page fade-in'}>
      {!embedded && (
        <div className="page-header">
          <div>
            <h1 className="display" style={{ fontSize: 26 }}>Templates</h1>
            <p className="subtitle">Start from a tested layout. Every template is fully editable.</p>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {cats.map(c => (
          <button key={c} className="btn btn-sm press" onClick={() => setCat(c)}
            style={{ background: cat === c ? 'var(--ink)' : 'var(--bg-elev)', color: cat === c ? 'var(--bg)' : 'var(--ink-2)', border: '1px solid var(--line)' }}>
            {c}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }} className="stagger">
        {list.map(t => (
          <div key={t.id} className="card card-hover press" onClick={() => onSelect ? onSelect(t.id) : onUse?.(t.id)}
            style={{ cursor: 'pointer', overflow: 'hidden', borderColor: selected === t.id ? 'var(--accent)' : undefined, boxShadow: selected === t.id ? '0 0 0 3px oklch(0.55 0.18 268 / 0.15)' : undefined }}>
            <div className="tmpl-thumb" style={{ background: t.swatch, borderRadius: 0, border: 'none', borderBottom: '1px solid var(--line)', color: t.dark ? 'var(--bg)' : 'var(--ink)' }}>
              <TemplatePreview tmpl={t} />
              {selected === t.id && (
                <div style={{ position: 'absolute', top: 10, right: 10, width: 22, height: 22, background: 'var(--accent)', color: 'white', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
                  <Icons.check size={13} />
                </div>
              )}
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</h3>
                <span className="chip" style={{ fontSize: 10.5 }}>{t.category}</span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.45, margin: 0 }}>{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
