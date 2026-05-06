import { useState, useEffect, useRef } from 'react'
import Icons from '../components/ui/Icons'
import SitePreview from '../components/site-preview/SitePreview'

const ACCENT_COLORS = [
  { id: 'blue',   val: 'oklch(0.55 0.18 268)' },
  { id: 'orange', val: 'oklch(0.6 0.17 30)' },
  { id: 'green',  val: 'oklch(0.62 0.13 155)' },
  { id: 'black',  val: 'oklch(0.18 0.008 80)' },
  { id: 'gold',   val: 'oklch(0.7 0.15 75)' },
  { id: 'purple', val: 'oklch(0.55 0.2 320)' },
]

const COLLAB_CURSORS = [
  { initials: 'MR', color: 'oklch(0.6 0.17 30)',  name: 'Maya R.',  status: 'Editing hero' },
  { initials: 'SL', color: 'oklch(0.55 0.2 320)', name: 'Sam L.',   status: 'Viewing' },
]

const FONT_PAIRS = [
  { id: 'inter',   label: 'Inter Tight + JetBrains Mono',  heading: 'Inter Tight', body: 'Inter Tight' },
  { id: 'sohne',   label: 'Söhne + Söhne Mono',            heading: 'Söhne',       body: 'Söhne'       },
  { id: 'tiempos', label: 'Tiempos + Söhne',               heading: 'Tiempos',     body: 'Söhne'       },
  { id: 'plus',    label: 'Plus Jakarta Sans',              heading: 'Plus Jakarta', body: 'Plus Jakarta' },
]

function RichTextToolbar({ onFormat }) {
  const tools = [
    { label: 'B', title: 'Bold',         cmd: 'bold',          style: { fontWeight: 700 } },
    { label: 'I', title: 'Italic',       cmd: 'italic',        style: { fontStyle: 'italic' } },
    { label: 'U', title: 'Underline',    cmd: 'underline',     style: { textDecoration: 'underline' } },
    { label: 'S', title: 'Strikethrough',cmd: 'strikethrough', style: { textDecoration: 'line-through' } },
  ]
  return (
    <div style={{ display: 'flex', gap: 2, padding: '6px 8px', background: 'var(--bg-sunk)', border: '1px solid var(--line)', borderBottom: 'none', borderRadius: '6px 6px 0 0' }}>
      {tools.map((t, i) => (
        <button key={i} className="btn btn-icon btn-ghost btn-sm" title={t.title} style={{ width: 26, height: 26, ...t.style, fontSize: 12 }}
          onMouseDown={e => { e.preventDefault(); onFormat && onFormat(t.cmd) }}>{t.label}</button>
      ))}
      <div style={{ width: 1, background: 'var(--line)', margin: '0 4px' }} />
      <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, height: 26, padding: '0 8px' }} title="Insert link">
        <Icons.external size={11} /> Link
      </button>
      <button className="btn btn-ghost btn-sm" style={{ fontSize: 11, height: 26, padding: '0 8px' }} title="Unordered list">
        ≡ List
      </button>
    </div>
  )
}

function ShortcutHint({ keys }) {
  return (
    <span style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {keys.map((k, i) => <kbd key={i}>{k}</kbd>)}
    </span>
  )
}

export default function EditorPage({ site, onUpdate, onBack, onPublish, onOpenAI, addToast }) {
  const [active,      setActive]      = useState(site.content.sections[0]?.id || null)
  const [viewport,    setViewport]    = useState('desktop')
  const [tab,         setTab]         = useState('content')
  const [saving,      setSaving]      = useState(false)
  const [accent,      setAccent]      = useState('blue')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [darkPreview, setDarkPreview] = useState(false)
  const [showCollab,  setShowCollab]  = useState(false)
  const [font,        setFont]        = useState('inter')
  const [favicon,     setFavicon]     = useState(null)
  const [spacing,     setSpacing]     = useState('normal')
  const [radius,      setRadius]      = useState('md')
  const faviconRef = useRef(null)
  const dirtyRef   = useRef(false)

  useEffect(() => {
    if (!dirtyRef.current) return
    setSaving(true)
    const t = setTimeout(() => { setSaving(false); dirtyRef.current = false }, 800)
    return () => clearTimeout(t)
  }, [site])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 's') { e.preventDefault(); addToast('Saved!') }
        if (e.key === 'z') { e.preventDefault(); addToast('Undo') }
        if (e.key === 'p') { e.preventDefault(); setPreviewOpen(true) }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [addToast])

  const updateField = (path, value) => {
    dirtyRef.current = true
    const next = JSON.parse(JSON.stringify(site))
    let obj = next.content
    const parts = path.split('.')
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i]
      if (p.includes('[')) {
        const [k, idx] = p.split(/[\[\]]/).filter(Boolean)
        obj = obj[k][parseInt(idx)]
      } else { obj = obj[p] }
    }
    obj[parts[parts.length - 1]] = value
    onUpdate(next)
  }

  const updateSection = (id, key, value) => {
    dirtyRef.current = true
    const next = JSON.parse(JSON.stringify(site))
    const sec = next.content.sections.find(s => s.id === id)
    if (sec) sec[key] = value
    onUpdate(next)
  }

  const addSection = (type) => {
    dirtyRef.current = true
    const next = JSON.parse(JSON.stringify(site))
    const id = `sec-${Date.now()}`
    const presets = {
      hero: { id, type: 'hero', heading: 'New heading', sub: 'Supporting subline goes here.', cta: 'Get started' },
      text: { id, type: 'text', heading: 'Section title', body: 'Write your section content here.' },
      grid: { id, type: 'grid', heading: 'Featured', items: [{ title: 'Item one', meta: 'Detail · 2026' }, { title: 'Item two', meta: 'Detail · 2026' }] },
      form: { id, type: 'form', heading: 'Get in touch', fields: [{ label: 'Name', type: 'text', required: true }, { label: 'Email', type: 'email', required: true }, { label: 'Message', type: 'textarea', required: false }], cta: 'Send message' },
    }
    next.content.sections.push(presets[type] || presets.text)
    onUpdate(next)
    setActive(id)
  }

  const removeSection = (id) => {
    dirtyRef.current = true
    const next = JSON.parse(JSON.stringify(site))
    next.content.sections = next.content.sections.filter(s => s.id !== id)
    onUpdate(next)
    addToast('Section removed')
  }

  const moveSection = (id, dir) => {
    dirtyRef.current = true
    const next = JSON.parse(JSON.stringify(site))
    const idx = next.content.sections.findIndex(s => s.id === id)
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= next.content.sections.length) return
    const arr = next.content.sections
    ;[arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]]
    onUpdate(next)
  }

  const applyAccent = (colorId) => {
    setAccent(colorId)
    const c = ACCENT_COLORS.find(a => a.id === colorId)
    if (c) document.documentElement.style.setProperty('--accent', c.val)
  }

  const activeSection = site.content.sections.find(s => s.id === active)
  const vpWidth = viewport === 'mobile' ? 390 : viewport === 'tablet' ? 768 : '100%'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%' }}>
      {/* Editor topbar */}
      <header className="topbar" style={{ paddingLeft: 16, flexShrink: 0 }}>
        <button className="btn btn-ghost btn-sm press" onClick={onBack}><Icons.arrowLeft size={14} /> Sites</button>
        <div style={{ width: 1, height: 20, background: 'var(--line)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 20, height: 20, borderRadius: 5, background: site.color, display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700 }}>{site.favicon}</div>
          <span style={{ fontWeight: 500 }}>{site.name}</span>
          <span className={`chip ${site.status === 'published' ? 'chip-ok' : ''}`} style={{ fontSize: 10.5 }}>{site.status}</span>
        </div>

        {/* Viewport switcher */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div className="seg">
            <button className={viewport === 'desktop' ? 'active' : ''} onClick={() => setViewport('desktop')} title="Desktop"><Icons.desktop size={13} /></button>
            <button className={viewport === 'tablet'  ? 'active' : ''} onClick={() => setViewport('tablet')}  title="Tablet"><Icons.tablet  size={13} /></button>
            <button className={viewport === 'mobile'  ? 'active' : ''} onClick={() => setViewport('mobile')}  title="Mobile"><Icons.mobile  size={13} /></button>
          </div>
        </div>

        {/* Collab avatars */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => setShowCollab(o => !o)}>
            <div className="avatar-stack">
              {COLLAB_CURSORS.map((c, i) => (
                <div key={i} className="avatar" style={{ width: 26, height: 26, fontSize: 9.5, background: c.color, position: 'relative' }}>
                  {c.initials}
                  <span style={{ position: 'absolute', bottom: -1, right: -1, width: 7, height: 7, background: 'var(--ok)', borderRadius: '50%', border: '1.5px solid var(--bg)' }} />
                </div>
              ))}
            </div>
            <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{COLLAB_CURSORS.length} online</span>
          </div>
          {showCollab && (
            <div className="popover" style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, width: 220, zIndex: 30 }}>
              <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--line)', fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Online now</div>
              {COLLAB_CURSORS.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderBottom: i < COLLAB_CURSORS.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <div className="avatar" style={{ width: 28, height: 28, fontSize: 10, background: c.color }}>{c.initials}</div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 500 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{c.status}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', width: 7, height: 7, background: 'var(--ok)', borderRadius: '50%' }} />
                </div>
              ))}
              <div style={{ padding: '8px 10px' }}>
                <button className="btn btn-secondary btn-sm press" style={{ width: '100%' }}><Icons.users size={12} /> Invite collaborator</button>
              </div>
            </div>
          )}
        </div>

        {/* Save indicator */}
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
          {saving ? <><span className="spinner" style={{ width: 10, height: 10 }} /> Saving…</> : <><Icons.check size={12} style={{ color: 'var(--ok)' }} /> Saved</>}
        </div>

        {/* Dark preview toggle */}
        <button className="btn btn-secondary btn-sm press" onClick={() => setDarkPreview(d => !d)} title="Toggle dark preview">
          {darkPreview ? <Icons.sun size={13} /> : <Icons.moon size={13} />}
        </button>

        <button className="btn btn-secondary btn-sm press" onClick={onOpenAI}><Icons.sparkles size={13} /> AI</button>
        <button className="btn btn-secondary btn-sm press" onClick={() => setPreviewOpen(true)} title="Preview (⌘P)">
          <Icons.eye size={13} /> Preview
        </button>
        <button className="btn btn-primary btn-sm press" onClick={onPublish} title={`${site.status === 'published' ? 'Update' : 'Publish'} (⌘↵)`}>
          {site.status === 'published' ? 'Update' : 'Publish'} <Icons.arrowRight size={12} />
        </button>
      </header>

      <div className="editor-shell">
        {/* Left panel */}
        <div className="editor-panel">
          <div className="tabs">
            {['content', 'pages', 'design'].map(t => (
              <div key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</div>
            ))}
          </div>

          {tab === 'content' && (
            <>
              <div className="editor-section">
                <h4>Site identity</h4>
                <label className="field-label">Site title</label>
                <input className="input" value={site.content.title} onChange={e => updateField('title', e.target.value)} />
                <div style={{ height: 10 }} />
                <label className="field-label">Tagline</label>
                <textarea className="textarea" value={site.content.tagline} onChange={e => updateField('tagline', e.target.value)} rows={2} />
              </div>

              <div className="editor-section" style={{ flex: 1 }}>
                <h4>
                  Sections
                  <button className="btn btn-ghost btn-sm press" onClick={() => addSection('hero')} title="Add section"><Icons.plus size={13} /></button>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {site.content.sections.map((s, i) => (
                    <div key={s.id} onClick={() => setActive(s.id)}
                      style={{ padding: '10px 12px', borderRadius: 8, cursor: 'pointer', background: active === s.id ? 'var(--accent-soft)' : 'var(--bg-sunk)', border: `1px solid ${active === s.id ? 'oklch(0.55 0.18 268 / 0.4)' : 'var(--line)'}`, transition: 'all .15s var(--ease-snap)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {/* Drag handle indicator */}
                      <span style={{ cursor: 'grab', color: 'var(--ink-3)', opacity: 0.5, fontSize: 14, lineHeight: 1 }}>⠿</span>
                      <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', minWidth: 18 }}>{String(i + 1).padStart(2, '0')}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 500, textTransform: 'capitalize' }}>{s.type}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.heading || s.title || '—'}</div>
                      </div>
                      {/* Reorder arrows */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }} onClick={e => e.stopPropagation()}>
                        <button className="btn btn-icon btn-ghost" style={{ width: 18, height: 14, padding: 0 }} disabled={i === 0}
                          onClick={() => moveSection(s.id, -1)}>
                          <Icons.chevronDown size={10} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                        <button className="btn btn-icon btn-ghost" style={{ width: 18, height: 14, padding: 0 }} disabled={i === site.content.sections.length - 1}
                          onClick={() => moveSection(s.id, 1)}>
                          <Icons.chevronDown size={10} />
                        </button>
                      </div>
                      <button className="btn btn-icon btn-ghost btn-sm" onClick={e => { e.stopPropagation(); removeSection(s.id) }}><Icons.trash size={12} /></button>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  <button className="btn btn-secondary btn-sm press" onClick={() => addSection('hero')}>+ Hero</button>
                  <button className="btn btn-secondary btn-sm press" onClick={() => addSection('text')}>+ Text</button>
                  <button className="btn btn-secondary btn-sm press" onClick={() => addSection('grid')}>+ Grid</button>
                  <button className="btn btn-secondary btn-sm press" onClick={() => addSection('form')}>+ Form</button>
                </div>
              </div>

              {activeSection && (
                <div className="editor-section" style={{ background: 'var(--bg)', borderTop: '2px solid var(--line)' }}>
                  <h4>Editing — <span style={{ color: 'var(--ink)', textTransform: 'capitalize' }}>{activeSection.type}</span></h4>

                  {(activeSection.type === 'hero' || activeSection.type === 'text' || activeSection.type === 'grid' || activeSection.type === 'form') && (
                    <>
                      <label className="field-label">Heading</label>
                      <input className="input" value={activeSection.heading || ''} onChange={e => updateSection(activeSection.id, 'heading', e.target.value)} />
                    </>
                  )}

                  {activeSection.type === 'hero' && (
                    <>
                      <div style={{ height: 10 }} />
                      <label className="field-label">Subtitle</label>
                      <textarea className="textarea" value={activeSection.sub || ''} onChange={e => updateSection(activeSection.id, 'sub', e.target.value)} rows={3} />
                      <div style={{ height: 10 }} />
                      <label className="field-label">Button label</label>
                      <input className="input" value={activeSection.cta || ''} onChange={e => updateSection(activeSection.id, 'cta', e.target.value)} />
                    </>
                  )}

                  {activeSection.type === 'text' && (
                    <>
                      <div style={{ height: 10 }} />
                      <label className="field-label">Body</label>
                      <RichTextToolbar />
                      <textarea className="textarea" value={activeSection.body || ''} onChange={e => updateSection(activeSection.id, 'body', e.target.value)} rows={5}
                        style={{ borderRadius: '0 0 6px 6px' }} />
                    </>
                  )}

                  {activeSection.type === 'form' && (
                    <>
                      <div style={{ height: 10 }} />
                      <label className="field-label">Fields</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                        {(activeSection.fields || []).map((f, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--bg-sunk)', borderRadius: 6, border: '1px solid var(--line)' }}>
                            <span style={{ fontSize: 11, flex: 1, fontWeight: 500 }}>{f.label}</span>
                            <span className="chip" style={{ fontSize: 10 }}>{f.type}</span>
                            {f.required && <span className="chip chip-accent" style={{ fontSize: 10 }}>required</span>}
                          </div>
                        ))}
                      </div>
                      <button className="btn btn-secondary btn-sm press" style={{ width: '100%' }}>
                        <Icons.plus size={11} /> Add field
                      </button>
                      <div style={{ height: 10 }} />
                      <label className="field-label">Submit button label</label>
                      <input className="input" value={activeSection.cta || ''} onChange={e => updateSection(activeSection.id, 'cta', e.target.value)} />
                      <div style={{ height: 10 }} />
                      <label className="field-label">Send submissions to</label>
                      <input className="input" type="email" placeholder="you@email.com" />
                    </>
                  )}
                </div>
              )}
            </>
          )}

          {tab === 'pages' && (
            <div className="editor-section">
              <h4>Pages</h4>
              {['Home', 'About', 'Work', 'Contact'].map((p, i) => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: i === 0 ? 'var(--accent-soft)' : 'var(--bg-sunk)', marginBottom: 4, border: '1px solid var(--line)', cursor: 'pointer' }}>
                  <Icons.layout size={13} />
                  <span style={{ fontSize: 12.5, flex: 1 }}>{p}</span>
                  <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>/{p.toLowerCase()}</span>
                  <button className="btn btn-icon btn-ghost btn-sm"><Icons.more size={11} /></button>
                </div>
              ))}
              <button className="btn btn-secondary btn-sm press" style={{ marginTop: 8, width: '100%' }} onClick={() => addToast('Page added')}>
                <Icons.plus size={12} /> Add page
              </button>
            </div>
          )}

          {tab === 'design' && (
            <div style={{ overflowY: 'auto', flex: 1 }}>
              <div className="editor-section">
                <h4>Favicon</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: favicon ? 'transparent' : site.color, border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 700, overflow: 'hidden', flexShrink: 0 }}>
                    {favicon ? <img src={favicon} alt="favicon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : site.favicon}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button className="btn btn-secondary btn-sm press" onClick={() => faviconRef.current?.click()}>
                      <Icons.upload size={11} /> Upload image
                    </button>
                    {favicon && <button className="btn btn-ghost btn-sm" style={{ color: 'var(--err)', fontSize: 12 }} onClick={() => setFavicon(null)}>Remove</button>}
                    <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>PNG or SVG · 32×32px</div>
                  </div>
                </div>
                <input ref={faviconRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = (ev) => setFavicon(ev.target.result); r.readAsDataURL(f) } }} />
              </div>

              <div className="editor-section">
                <h4>Accent color</h4>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {ACCENT_COLORS.map(c => (
                    <div key={c.id} className={`color-swatch ${accent === c.id ? 'active' : ''}`}
                      style={{ background: c.val }}
                      onClick={() => applyAccent(c.id)}
                      title={c.id} />
                  ))}
                </div>

                <label className="field-label">Typography</label>
                <select className="input" value={font} onChange={e => setFont(e.target.value)} style={{ marginBottom: 12 }}>
                  {FONT_PAIRS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                </select>

                <label className="field-label">Spacing scale</label>
                <div className="seg" style={{ marginBottom: 12 }}>
                  {['compact','normal','loose'].map(s => (
                    <button key={s} className={spacing === s ? 'active' : ''} onClick={() => setSpacing(s)} style={{ textTransform: 'capitalize', fontSize: 11.5 }}>{s}</button>
                  ))}
                </div>

                <label className="field-label">Border radius</label>
                <div className="seg" style={{ marginBottom: 12 }}>
                  {[['none','None'],['sm','Small'],['md','Default'],['lg','Large'],['full','Full']].map(([id, label]) => (
                    <button key={id} className={radius === id ? 'active' : ''} onClick={() => setRadius(id)} style={{ fontSize: 11.5 }}>{label}</button>
                  ))}
                </div>

                <label className="field-label" style={{ marginBottom: 8 }}>Dark mode preview</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12.5, flex: 1, color: 'var(--ink-2)' }}>Preview site in dark mode</span>
                  <div className={`switch ${darkPreview ? 'on' : ''}`} onClick={() => setDarkPreview(d => !d)} />
                </div>
              </div>

              <div className="editor-section">
                <h4>Keyboard shortcuts</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'Save',          keys: ['⌘', 'S'] },
                    { label: 'Undo',          keys: ['⌘', 'Z'] },
                    { label: 'Preview',       keys: ['⌘', 'P'] },
                    { label: 'Command palette', keys: ['⌘', 'K'] },
                    { label: 'AI generator', keys: ['⌘', 'J'] },
                  ].map(({ label, keys }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: 'var(--ink-2)' }}>{label}</span>
                      <ShortcutHint keys={keys} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="editor-canvas" style={{ background: darkPreview ? 'oklch(0.12 0.01 270)' : 'var(--bg-sunk)' }}>
          {darkPreview && (
            <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
              <span className="chip" style={{ background: 'oklch(0.7 0.2 268 / 0.15)', color: 'oklch(0.8 0.1 268)', border: '1px solid oklch(0.7 0.2 268 / 0.3)', backdropFilter: 'blur(8px)' }}>
                <Icons.moon size={10} /> Dark mode preview
              </span>
            </div>
          )}
          <div className="preview-frame fade-in-scale" style={{ maxWidth: vpWidth, transition: 'max-width .3s var(--ease)' }}>
            <SitePreview site={site} viewport={viewport} />
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {previewOpen && (
        <div className="modal-overlay" onClick={() => setPreviewOpen(false)}>
          <div style={{ width: '90vw', maxWidth: 1200, height: '85vh', background: darkPreview ? '#0f1117' : 'white', borderRadius: 16, overflow: 'auto', position: 'relative', boxShadow: 'var(--shadow-lg)' }} onClick={e => e.stopPropagation()}>
            <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setDarkPreview(d => !d)}>
                {darkPreview ? <><Icons.sun size={12} /> Light</> : <><Icons.moon size={12} /> Dark</>}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setPreviewOpen(false)}>
                <Icons.x size={14} /> Close
              </button>
            </div>
            <SitePreview site={site} />
          </div>
        </div>
      )}
    </div>
  )
}
