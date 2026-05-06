import { useState, useRef, useEffect } from 'react'
import Icons from '../ui/Icons'

export default function AIPanel({ open, onClose, onApply, addToast }) {
  const [input, setInput] = useState('')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const taRef = useRef(null)

  useEffect(() => {
    if (open) setTimeout(() => taRef.current?.focus(), 60)
  }, [open])

  const generate = () => {
    if (!input.trim()) return
    setGenerating(true)
    setResult(null)
    setTimeout(() => {
      setResult({
        heading: 'Quietly ambitious work for brands that mean it.',
        sub: 'A small studio in Brooklyn making identities, sites, and product UI for the next decade.',
        cta: 'See recent work',
      })
      setGenerating(false)
    }, 1400)
  }

  const apply = () => {
    if (!result) return
    onApply(result)
    addToast('AI copy applied to hero')
    onClose()
  }

  if (!open) return null

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'oklch(0 0 0 / 0.2)', backdropFilter: 'blur(2px)' }} />
      <div className="fade-in" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 400, background: 'var(--bg-elev)', borderLeft: '1px solid var(--line)', zIndex: 41, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent-soft)', color: 'var(--accent-ink)', display: 'grid', placeItems: 'center' }}>
            <Icons.sparkles size={14} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>AI co-writer</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Generate copy for your hero section</div>
          </div>
          <button className="btn btn-icon btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={onClose}>
            <Icons.x size={14} />
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          <label className="field-label">Describe your site or brand</label>
          <textarea
            ref={taRef}
            className="textarea"
            rows={4}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. A Brooklyn-based design studio that specialises in brand identities for tech startups…"
            style={{ marginBottom: 12 }}
          />
          <button className="btn btn-primary press" style={{ width: '100%', justifyContent: 'center' }} onClick={generate} disabled={generating || !input.trim()}>
            {generating ? <><span className="spinner" /> Generating…</> : <><Icons.sparkles size={13} /> Generate copy</>}
          </button>

          {result && (
            <div className="card fade-in" style={{ padding: 16, marginTop: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Preview</div>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 8 }}>{result.heading}</div>
              <div style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.55, marginBottom: 12 }}>{result.sub}</div>
              <div style={{ height: 32, width: 100, background: 'var(--ink)', borderRadius: 6, display: 'grid', placeItems: 'center', color: 'var(--bg)', fontSize: 12, fontWeight: 500 }}>{result.cta}</div>
            </div>
          )}
        </div>

        {result && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--line)', background: 'var(--bg-sunk)', display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setResult(null)} style={{ flex: 1, justifyContent: 'center' }}>Regenerate</button>
            <button className="btn btn-primary btn-sm press" onClick={apply} style={{ flex: 2, justifyContent: 'center' }}>
              <Icons.check size={13} /> Apply to hero
            </button>
          </div>
        )}
      </div>
    </>
  )
}
