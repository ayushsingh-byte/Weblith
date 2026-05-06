import { useState } from 'react'
import Icons from '../components/ui/Icons'

const PALETTE = [
  { cat: 'Layout', items: [
    { id: 'hero', name: 'Hero', desc: 'Headline + CTA', icon: 'H' },
    { id: 'split', name: 'Split section', desc: 'Image + text', icon: '◫' },
    { id: 'columns', name: 'Three columns', desc: 'Equal cards', icon: '⫶' },
    { id: 'cta', name: 'CTA banner', desc: 'Bold callout', icon: '◉' },
  ]},
  { cat: 'Content', items: [
    { id: 'heading', name: 'Heading', desc: 'H1–H6', icon: 'Aa' },
    { id: 'text', name: 'Paragraph', desc: 'Rich text', icon: '¶' },
    { id: 'image', name: 'Image', desc: 'Single image', icon: '◰' },
    { id: 'gallery', name: 'Gallery', desc: 'Image grid', icon: '⊞' },
    { id: 'quote', name: 'Quote', desc: 'Pull quote', icon: '"' },
  ]},
  { cat: 'Forms', items: [
    { id: 'newsletter', name: 'Newsletter', desc: 'Email capture', icon: '✉' },
    { id: 'contact', name: 'Contact form', desc: 'Multi-field', icon: '☎' },
    { id: 'button', name: 'Button', desc: 'Standalone CTA', icon: '⬢' },
  ]},
  { cat: 'Social', items: [
    { id: 'testimonial', name: 'Testimonials', desc: 'Customer quotes', icon: '★' },
    { id: 'logos', name: 'Logo cloud', desc: 'Brand strip', icon: '⬡' },
    { id: 'stats', name: 'Stats row', desc: 'Numbers + labels', icon: '#' },
  ]},
]

function BlockPreview({ block }) {
  const s = block.data
  if (block.type === 'hero') return (
    <div style={{ padding: '48px 40px', textAlign: 'left' }}>
      <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 14 }}>{s.eyebrow || 'EYEBROW'}</div>
      <h1 style={{ fontSize: 36, lineHeight: 1.1, fontWeight: 600, letterSpacing: '-0.03em', marginBottom: 16, maxWidth: 700 }}>{s.h1 || 'Headline goes here'}</h1>
      <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.55, maxWidth: 560, marginBottom: 28 }}>{s.sub || 'Supporting subtext goes here. Replace with your value proposition.'}</p>
      <button className="btn btn-primary">{s.cta || 'Get started'} <Icons.arrowRight size={13} /></button>
    </div>
  )
  if (block.type === 'split') return (
    <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
      <div style={{ aspectRatio: '4/3', background: 'var(--bg-sunk)', borderRadius: 10, border: '1px solid var(--line)', display: 'grid', placeItems: 'center', color: 'var(--ink-3)', fontSize: 12 }}>image</div>
      <div>
        <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 12 }}>{s.eyebrow || 'SECTION'}</div>
        <h2 style={{ fontSize: 26, lineHeight: 1.15, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 14 }}>{s.h2 || 'Section heading'}</h2>
        <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.65 }}>{s.body || 'Supporting body text goes here. Describe the feature, concept, or story.'}</p>
      </div>
    </div>
  )
  if (block.type === 'logos') return (
    <div style={{ padding: '28px 40px', display: 'flex', alignItems: 'center', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
      {['ACME', 'Vercel', 'Linear', 'Notion', 'Stripe', 'Figma'].map(n => (
        <div key={n} style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink-3)', opacity: 0.6 }}>{n}</div>
      ))}
    </div>
  )
  if (block.type === 'stats') return (
    <div style={{ padding: '32px 40px', display: 'flex', gap: 48, justifyContent: 'center' }}>
      {[['12k+', 'Users'], ['99.9%', 'Uptime'], ['< 3s', 'Avg load'], ['4.9★', 'Rating']].map(([v, l]) => (
        <div key={l} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.03em' }}>{v}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{l}</div>
        </div>
      ))}
    </div>
  )
  if (block.type === 'testimonial') return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {[{ q: '"Absolutely transformed how we think about our web presence."', a: 'Sarah M., CEO @ Acme' }, { q: '"Worth every penny. Our conversion rate jumped 40% in a month."', a: 'James T., Product @ Linear' }].map(t => (
          <div key={t.a} style={{ background: 'var(--bg-sunk)', borderRadius: 10, padding: 20, border: '1px solid var(--line)' }}>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink-2)', marginBottom: 14 }}>{t.q}</p>
            <div style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--ink-3)' }}>{t.a}</div>
          </div>
        ))}
      </div>
    </div>
  )
  if (block.type === 'cta') return (
    <div style={{ padding: '48px 40px', textAlign: 'center', background: 'var(--accent-soft)', borderRadius: 12, margin: '16px 24px' }}>
      <h2 style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.025em', marginBottom: 10 }}>{s.h2 || 'Ready to get started?'}</h2>
      <p style={{ fontSize: 15, color: 'var(--ink-2)', marginBottom: 24 }}>{s.sub || 'Join thousands of teams already building with Forge.'}</p>
      <button className="btn btn-primary">{s.cta || 'Start for free'} <Icons.arrowRight size={13} /></button>
    </div>
  )
  return (
    <div style={{ padding: '24px 40px', color: 'var(--ink-3)', fontSize: 13, fontStyle: 'italic' }}>
      {block.type} block · click to edit
    </div>
  )
}

export default function CanvasPage() {
  const [blocks, setBlocks] = useState([
    { id: 'b1', type: 'hero', data: { eyebrow: 'STUDIO HALCYON', h1: 'Quietly ambitious work for brands that mean it.', sub: 'A small design studio in Brooklyn making identities, sites, and product UI.', cta: 'See recent work' } },
    { id: 'b2', type: 'logos', data: {} },
    { id: 'b3', type: 'split', data: { eyebrow: 'APPROACH', h2: 'We make fewer things, slowly.', body: 'Every project starts with a long conversation. We move at the pace of clarity.' } },
    { id: 'b4', type: 'stats', data: {} },
    { id: 'b5', type: 'testimonial', data: {} },
    { id: 'b6', type: 'cta', data: { h2: 'Have something to make?', sub: 'We take on a handful of projects each season.', cta: 'Start a conversation' } },
  ])
  const [selected, setSelected] = useState('b1')
  const [device, setDevice] = useState('desktop')
  const [drag, setDrag] = useState(null)
  const [overIdx, setOverIdx] = useState(null)
  const [search, setSearch] = useState('')

  const sel = blocks.find(b => b.id === selected)

  const onDropAt = (idx) => {
    if (!drag) return
    if (drag.kind === 'new') {
      const newBlock = { id: 'b' + Date.now(), type: drag.item.id, data: {} }
      const next = [...blocks]
      next.splice(idx, 0, newBlock)
      setBlocks(next)
      setSelected(newBlock.id)
    } else if (drag.kind === 'move') {
      const next = [...blocks]
      const [moved] = next.splice(drag.idx, 1)
      const insertAt = drag.idx < idx ? idx - 1 : idx
      next.splice(insertAt, 0, moved)
      setBlocks(next)
    }
    setDrag(null); setOverIdx(null)
  }

  const removeBlock = (id) => setBlocks(b => b.filter(x => x.id !== id))
  const duplicateBlock = (id) => {
    const idx = blocks.findIndex(b => b.id === id)
    const copy = { ...blocks[idx], id: 'b' + Date.now() }
    const next = [...blocks]; next.splice(idx + 1, 0, copy); setBlocks(next)
  }
  const updateData = (key, value) => {
    setBlocks(b => b.map(x => x.id === selected ? { ...x, data: { ...x.data, [key]: value } } : x))
  }

  const filtered = PALETTE.map(c => ({
    ...c, items: c.items.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()))
  })).filter(c => c.items.length)

  const widths = { desktop: '100%', tablet: 768, mobile: 375 }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Block palette */}
      <aside style={{ width: 220, borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', background: 'var(--bg-elev)', flexShrink: 0 }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Add blocks</div>
          <div style={{ position: 'relative' }}>
            <Icons.search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }} />
            <input className="input" placeholder="Search blocks…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 28, height: 30, fontSize: 12 }} />
          </div>
        </div>
        <div style={{ padding: 12, overflowY: 'auto', flex: 1 }}>
          {filtered.map(c => (
            <div key={c.cat} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, paddingLeft: 4 }}>{c.cat}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {c.items.map(it => (
                  <div key={it.id} draggable onDragStart={() => setDrag({ kind: 'new', item: it })} onDragEnd={() => { setDrag(null); setOverIdx(null) }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 7, background: 'var(--bg)', border: '1px solid var(--line)', cursor: 'grab' }}>
                    <div style={{ width: 28, height: 22, borderRadius: 4, background: 'var(--bg-sunk)', display: 'grid', placeItems: 'center', fontSize: 11, color: 'var(--ink-2)', flexShrink: 0 }}>{it.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 500 }}>{it.name}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{it.desc}</div>
                    </div>
                    <Icons.grip size={11} style={{ color: 'var(--ink-3)', flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Canvas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-elev)', flexShrink: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 500 }}>Studio Halcyon · Home</div>
          <span className="chip" style={{ fontSize: 10.5 }}><span className="live-dot" /> autosaved</span>
          <div className="seg" style={{ marginLeft: 'auto' }}>
            <button className={device === 'desktop' ? 'active' : ''} onClick={() => setDevice('desktop')} title="Desktop"><Icons.desktop size={12} /></button>
            <button className={device === 'tablet' ? 'active' : ''} onClick={() => setDevice('tablet')} title="Tablet"><Icons.tablet size={12} /></button>
            <button className={device === 'mobile' ? 'active' : ''} onClick={() => setDevice('mobile')} title="Mobile"><Icons.mobile size={12} /></button>
          </div>
          <button className="btn btn-secondary btn-sm press"><Icons.eye size={12} /> Preview</button>
          <button className="btn btn-primary btn-sm press"><Icons.bolt size={12} /> Publish</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-sunk)', display: 'flex', justifyContent: 'center', padding: '24px 16px' }}>
          <div style={{ width: '100%', maxWidth: widths[device], transition: 'max-width .25s var(--ease)', background: 'var(--bg)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--line)', minHeight: 400 }}>
            {blocks.length === 0 && (
              <div style={{ padding: 80, textAlign: 'center', color: 'var(--ink-3)' }}>
                <Icons.plus size={28} />
                <div style={{ marginTop: 12, fontSize: 13 }}>Drag a block from the left to get started</div>
              </div>
            )}
            <div style={{ height: overIdx === 0 ? 4 : 0, background: 'var(--accent)', transition: 'height .15s', margin: '0 16px' }}
              onDragOver={e => { e.preventDefault(); setOverIdx(0) }}
              onDrop={() => onDropAt(0)} />
            {blocks.map((b, i) => (
              <div key={b.id}>
                <div onClick={() => setSelected(b.id)} style={{ position: 'relative', outline: selected === b.id ? '2px solid var(--accent)' : 'none', outlineOffset: -2, cursor: 'pointer' }}
                  draggable onDragStart={() => setDrag({ kind: 'move', idx: i })} onDragEnd={() => { setDrag(null); setOverIdx(null) }}>
                  <BlockPreview block={b} />
                  {selected === b.id && (
                    <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                      <button className="btn btn-secondary btn-sm press" onClick={() => duplicateBlock(b.id)}><Icons.copy size={11} /></button>
                      <button className="btn btn-sm press" style={{ background: 'var(--err)', color: 'white', border: 'none' }} onClick={() => removeBlock(b.id)}><Icons.trash size={11} /></button>
                    </div>
                  )}
                </div>
                <div style={{ height: overIdx === i + 1 ? 4 : 0, background: 'var(--accent)', transition: 'height .15s', margin: '0 16px' }}
                  onDragOver={e => { e.preventDefault(); setOverIdx(i + 1) }}
                  onDrop={() => onDropAt(i + 1)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Properties panel */}
      {sel && (
        <aside style={{ width: 280, borderLeft: '1px solid var(--line)', display: 'flex', flexDirection: 'column', background: 'var(--bg-elev)', flexShrink: 0, overflowY: 'auto' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
            <div className="eyebrow" style={{ marginBottom: 2 }}>Properties</div>
            <div style={{ fontSize: 12.5, fontWeight: 500, textTransform: 'capitalize', color: 'var(--ink-2)' }}>{sel.type} block</div>
          </div>
          <div style={{ padding: 16, flex: 1 }}>
            {['eyebrow', 'h1', 'h2', 'sub', 'body', 'cta'].filter(k => k in sel.data || (sel.type === 'hero' && ['eyebrow','h1','sub','cta'].includes(k)) || (sel.type === 'split' && ['eyebrow','h2','body'].includes(k)) || (sel.type === 'cta' && ['h2','sub','cta'].includes(k))).map(k => (
              <div key={k} style={{ marginBottom: 12 }}>
                <label className="field-label" style={{ textTransform: 'capitalize' }}>{k === 'h1' ? 'Heading (H1)' : k === 'h2' ? 'Heading (H2)' : k === 'sub' ? 'Subtitle' : k === 'cta' ? 'Button label' : k}</label>
                {(k === 'sub' || k === 'body') ? (
                  <textarea className="textarea" rows={3} value={sel.data[k] || ''} onChange={e => updateData(k, e.target.value)} style={{ fontSize: 12.5 }} />
                ) : (
                  <input className="input" value={sel.data[k] || ''} onChange={e => updateData(k, e.target.value)} style={{ fontSize: 12.5 }} />
                )}
              </div>
            ))}
            {['logos','stats','testimonial'].includes(sel.type) && (
              <p style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.6 }}>This block uses preset data. Full editing coming soon.</p>
            )}
          </div>
        </aside>
      )}
    </div>
  )
}
