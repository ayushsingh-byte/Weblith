import { useState } from 'react'
import Icons from '../ui/Icons'
import TemplatesPage from '../../pages/TemplatesPage'

const ACCENT_COLORS = [
  { id: 'blue',   val: 'oklch(0.55 0.18 268)', label: 'Blue'   },
  { id: 'orange', val: 'oklch(0.6 0.17 30)',   label: 'Orange' },
  { id: 'green',  val: 'oklch(0.62 0.13 155)', label: 'Green'  },
  { id: 'purple', val: 'oklch(0.55 0.2 320)',  label: 'Purple' },
  { id: 'gold',   val: 'oklch(0.7 0.15 75)',   label: 'Gold'   },
  { id: 'black',  val: 'oklch(0.18 0.008 80)', label: 'Ink'    },
]

const FONT_PAIRS = [
  { id: 'inter',   label: 'Inter Tight',      sample: 'Aa' },
  { id: 'plus',    label: 'Plus Jakarta',      sample: 'Aa' },
  { id: 'sohne',   label: 'Söhne',             sample: 'Aa' },
  { id: 'tiempos', label: 'Tiempos',           sample: 'Aa' },
]

export default function CreateSiteModal({ open, onClose, onCreate }) {
  const [step, setStep]         = useState(1)
  const [name, setName]         = useState('')
  const [slug, setSlug]         = useState('')
  const [tmpl, setTmpl]         = useState('portfolio')
  const [creating, setCreating] = useState(false)
  const [error, setError]       = useState('')
  const [accent, setAccent]     = useState('blue')
  const [font, setFont]         = useState('inter')
  const [radius, setRadius]     = useState('md')
  const [darkMode, setDarkMode] = useState(false)

  const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const onName  = (v) => { setName(v); setSlug(slugify(v)) }

  const reset = () => { setStep(1); setName(''); setSlug(''); setTmpl('portfolio'); setError(''); setAccent('blue'); setFont('inter'); setRadius('md') }
  const close = () => { reset(); onClose() }

  const submit = async () => {
    if (!name.trim()) return
    setCreating(true)
    setError('')
    try {
      await onCreate({
        name: name.trim(),
        slug: slug || slugify(name.trim()) || 'untitled',
        template: tmpl,
      })
      reset()
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setCreating(false)
    }
  }

  const onKeyDown = (e) => { if (e.key === 'Enter' && name && !creating && step === 3) submit() }

  const selectedAccent = ACCENT_COLORS.find(c => c.id === accent)

  if (!open) return null
  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: step === 1 ? 720 : 560 }}>
        <div className="modal-header" style={{ paddingBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="eyebrow">Step {step} of 3</div>
              <h3 style={{ fontSize: 18, marginTop: 4 }}>
                {step === 1 ? 'Choose a starting point'
                  : step === 2 ? 'Customize your style'
                  : 'Name your site'}
              </h3>
            </div>
            <button className="btn btn-icon btn-ghost btn-sm" onClick={close} disabled={creating}>
              <Icons.x size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
            {[1,2,3].map(n => (
              <div key={n} style={{ flex: 1, height: 3, borderRadius: 2, transition: 'all .3s var(--ease)',
                background: n <= step ? 'var(--ink)' : 'var(--line)' }} />
            ))}
          </div>
        </div>

        <div className="modal-body" style={{ maxHeight: step === 1 ? 480 : 'none', overflowY: 'auto' }}>
          {step === 1 && (
            <div className="fade-in">
              <TemplatesPage embedded selected={tmpl} onSelect={setTmpl} />
            </div>
          )}

          {step === 2 && (
            <div className="fade-in" style={{ paddingTop: 8 }}>
              {/* Live preview mini */}
              <div style={{ height: 120, borderRadius: 12, marginBottom: 20, overflow: 'hidden', border: '1px solid var(--line)', position: 'relative', background: darkMode ? 'oklch(0.12 0.01 270)' : 'oklch(0.99 0 0)' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 5, borderRadius: 999, background: selectedAccent?.val, opacity: 0.8 }} />
                  <div style={{ width: 180, height: 10, borderRadius: 999, background: darkMode ? 'white' : 'oklch(0.2 0 0)', opacity: 0.85 }} />
                  <div style={{ width: 120, height: 7, borderRadius: 999, background: darkMode ? 'oklch(0.7 0 0)' : 'oklch(0.6 0 0)', opacity: 0.5 }} />
                  <div style={{ width: 72, height: 28, borderRadius: 6, background: selectedAccent?.val, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 48, height: 6, borderRadius: 999, background: 'white', opacity: 0.9 }} />
                  </div>
                </div>
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <span style={{ fontSize: 10, background: 'oklch(0 0 0 / 0.4)', color: 'white', padding: '2px 7px', borderRadius: 999, backdropFilter: 'blur(4px)' }}>Preview</span>
                </div>
              </div>

              {/* Accent color */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Accent color</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {ACCENT_COLORS.map(c => (
                    <div key={c.id} title={c.label} onClick={() => setAccent(c.id)}
                      className={`color-swatch ${accent === c.id ? 'active' : ''}`}
                      style={{ background: c.val, width: 28, height: 28 }} />
                  ))}
                </div>
              </div>

              {/* Font */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Typography</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {FONT_PAIRS.map(f => (
                    <div key={f.id} onClick={() => setFont(f.id)}
                      style={{ padding: '10px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
                        border: font === f.id ? '2px solid var(--accent)' : '1px solid var(--line)',
                        background: font === f.id ? 'var(--accent-soft)' : 'var(--bg-sunk)' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em', color: font === f.id ? 'var(--accent-ink)' : 'var(--ink)', marginBottom: 2 }}>{f.sample}</div>
                      <div style={{ fontSize: 10.5, color: font === f.id ? 'var(--accent-ink)' : 'var(--ink-3)', fontWeight: 500 }}>{f.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radius */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Corner style</div>
                <div className="seg">
                  {[['none','Sharp'],['sm','Soft'],['md','Rounded'],['lg','Pill']].map(([id, label]) => (
                    <button key={id} className={radius === id ? 'active' : ''} onClick={() => setRadius(id)} style={{ fontSize: 12 }}>{label}</button>
                  ))}
                </div>
              </div>

              {/* Dark mode */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--bg-sunk)', borderRadius: 8, border: '1px solid var(--line)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>Start in dark mode</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>Your site will default to a dark color scheme</div>
                </div>
                <div className={`switch ${darkMode ? 'on' : ''}`} onClick={() => setDarkMode(d => !d)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="fade-in" style={{ paddingTop: 8 }}>
              <label className="field-label">Site name</label>
              <input
                className="input" value={name}
                onChange={e => onName(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="My new site" autoFocus
              />
              <div style={{ height: 14 }} />
              <label className="field-label">URL</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="mono" style={{ padding: '10px 12px', background: 'var(--bg-sunk)', border: '1px solid var(--line)', borderRight: 'none', borderRadius: '10px 0 0 10px', color: 'var(--ink-3)', fontSize: 12, whiteSpace: 'nowrap' }}>
                  weblith.site /
                </span>
                <input
                  className="input" value={slug}
                  onChange={e => setSlug(slugify(e.target.value))}
                  onKeyDown={onKeyDown}
                  placeholder="my-site"
                  style={{ borderRadius: '0 10px 10px 0' }}
                />
              </div>

              {/* Summary card */}
              <div style={{ marginTop: 16, padding: '14px 16px', background: 'var(--bg-sunk)', borderRadius: 10, border: '1px solid var(--line)' }}>
                <div className="eyebrow" style={{ marginBottom: 10 }}>Your site summary</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-2)', display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Icons.layout size={12} style={{ color: 'var(--ink-3)' }} />
                    <span style={{ textTransform: 'capitalize' }}>{tmpl} template</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-2)', display: 'flex', gap: 6, alignItems: 'center' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: selectedAccent?.val }} />
                    <span>{selectedAccent?.label} accent</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-2)', display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Icons.text size={12} style={{ color: 'var(--ink-3)' }} />
                    <span>{FONT_PAIRS.find(f => f.id === font)?.label}</span>
                  </div>
                  {darkMode && (
                    <div style={{ fontSize: 12.5, color: 'var(--ink-2)', display: 'flex', gap: 6, alignItems: 'center' }}>
                      <Icons.moon size={12} style={{ color: 'var(--ink-3)' }} />
                      <span>Dark mode</span>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--err-soft)', color: 'var(--err)', borderRadius: 8, fontSize: 12.5 }}>
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          {step > 1 && (
            <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)} disabled={creating}>
              <Icons.arrowLeft size={12} /> Back
            </button>
          )}
          <span style={{ flex: 1 }} />
          {step < 3
            ? <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={step === 1 && !tmpl}>
                Continue <Icons.arrowRight size={12} />
              </button>
            : <button className="btn btn-primary" onClick={submit} disabled={!name.trim() || creating}>
                {creating
                  ? <><span className="spinner" style={{ width: 13, height: 13 }} /> Creating…</>
                  : <>Create site <Icons.arrowRight size={12} /></>}
              </button>}
        </div>
      </div>
    </div>
  )
}
