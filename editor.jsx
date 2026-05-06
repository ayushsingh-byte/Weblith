/* global React, Icons, SitePreview */
const { useState, useEffect, useRef } = React;

function Editor({ site, onUpdate, onBack, onPublish, onOpenAI, addToast }) {
  const [active, setActive] = useState(site.content.sections[0]?.id || null);
  const [viewport, setViewport] = useState('desktop');
  const [tab, setTab] = useState('content');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(Date.now());
  const dirtyRef = useRef(false);

  // Auto-save indicator
  useEffect(() => {
    if (!dirtyRef.current) return;
    setSaving(true);
    const t = setTimeout(() => { setSaving(false); setSavedAt(Date.now()); dirtyRef.current = false; }, 800);
    return () => clearTimeout(t);
  }, [site]);

  const updateField = (path, value) => {
    dirtyRef.current = true;
    const next = JSON.parse(JSON.stringify(site));
    let obj = next.content;
    const parts = path.split('.');
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (p.includes('[')) {
        const [k, idx] = p.split(/[\[\]]/).filter(Boolean);
        obj = obj[k][parseInt(idx)];
      } else { obj = obj[p]; }
    }
    obj[parts[parts.length - 1]] = value;
    onUpdate(next);
  };

  const updateSection = (id, key, value) => {
    dirtyRef.current = true;
    const next = JSON.parse(JSON.stringify(site));
    const sec = next.content.sections.find(s => s.id === id);
    if (sec) sec[key] = value;
    onUpdate(next);
  };

  const addSection = (type) => {
    dirtyRef.current = true;
    const next = JSON.parse(JSON.stringify(site));
    const id = `sec-${Date.now()}`;
    const presets = {
      hero: { id, type: 'hero', heading: "New heading", sub: "Supporting subline goes here.", cta: "Get started" },
      text: { id, type: 'text', heading: "Section title", body: "Write your section content here." },
      grid: { id, type: 'grid', heading: "Featured", items: [{ title: "Item one", meta: "Detail · 2026" }, { title: "Item two", meta: "Detail · 2026" }] },
    };
    next.content.sections.push(presets[type]);
    onUpdate(next);
    setActive(id);
  };

  const removeSection = (id) => {
    dirtyRef.current = true;
    const next = JSON.parse(JSON.stringify(site));
    next.content.sections = next.content.sections.filter(s => s.id !== id);
    onUpdate(next);
    addToast("Section removed");
  };

  const activeSection = site.content.sections.find(s => s.id === active);

  const vpWidth = viewport === 'mobile' ? 390 : viewport === 'tablet' ? 768 : '100%';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Editor topbar */}
      <header className="topbar" style={{ paddingLeft: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}><Icons.arrowLeft size={14} /> Sites</button>
        <div style={{ width: 1, height: 20, background: 'var(--line)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 20, height: 20, borderRadius: 5, background: site.color, display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700 }}>{site.favicon}</div>
          <span style={{ fontWeight: 500 }}>{site.name}</span>
          <span className={`chip ${site.status === 'published' ? 'chip-ok' : ''}`} style={{ fontSize: 10.5 }}>{site.status}</span>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div className="seg">
            <button className={viewport === 'desktop' ? 'active' : ''} onClick={() => setViewport('desktop')} title="Desktop"><Icons.desktop size={13} /></button>
            <button className={viewport === 'tablet' ? 'active' : ''} onClick={() => setViewport('tablet')} title="Tablet"><Icons.tablet size={13} /></button>
            <button className={viewport === 'mobile' ? 'active' : ''} onClick={() => setViewport('mobile')} title="Mobile"><Icons.mobile size={13} /></button>
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
          {saving ? <><span className="spinner" style={{ width: 10, height: 10 }} /> Saving…</> : <><Icons.check size={12} style={{ color: 'var(--ok)' }} /> Saved</>}
        </div>
        <button className="btn btn-secondary btn-sm" onClick={onOpenAI}><Icons.sparkles size={13} /> AI</button>
        <button className="btn btn-secondary btn-sm"><Icons.eye size={13} /> Preview</button>
        <button className="btn btn-primary btn-sm" onClick={onPublish}>{site.status === 'published' ? 'Update' : 'Publish'} <Icons.arrowRight size={12} /></button>
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
                <input className="input" value={site.content.title} onChange={(e) => updateField('title', e.target.value)} />
                <div style={{ height: 10 }} />
                <label className="field-label">Tagline</label>
                <textarea className="textarea" value={site.content.tagline} onChange={(e) => updateField('tagline', e.target.value)} rows={2} />
              </div>

              <div className="editor-section" style={{ flex: 1 }}>
                <h4>
                  Sections
                  <button className="btn btn-ghost btn-sm" onClick={() => addSection('hero')} title="Add section"><Icons.plus size={13} /></button>
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {site.content.sections.map((s, i) => (
                    <div key={s.id}
                      onClick={() => setActive(s.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: active === s.id ? 'var(--accent-soft)' : 'var(--bg-sunk)',
                        border: `1px solid ${active === s.id ? 'oklch(0.55 0.18 268 / 0.4)' : 'var(--line)'}`,
                        transition: 'all .15s var(--ease-snap)',
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}>
                      <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', minWidth: 18 }}>{String(i + 1).padStart(2, '0')}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 500, textTransform: 'capitalize' }}>{s.type}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.heading || s.title || '—'}</div>
                      </div>
                      <button className="btn btn-icon btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); removeSection(s.id); }}><Icons.trash size={12} /></button>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => addSection('hero')}>+ Hero</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => addSection('text')}>+ Text</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => addSection('grid')}>+ Grid</button>
                </div>
              </div>

              {activeSection && (
                <div className="editor-section" style={{ background: 'var(--bg)', borderTop: '2px solid var(--line)' }}>
                  <h4>Editing — <span style={{ color: 'var(--ink)', textTransform: 'capitalize' }}>{activeSection.type}</span></h4>
                  {(activeSection.type === 'hero' || activeSection.type === 'text' || activeSection.type === 'grid') && (
                    <>
                      <label className="field-label">Heading</label>
                      <input className="input" value={activeSection.heading || ''} onChange={(e) => updateSection(activeSection.id, 'heading', e.target.value)} />
                    </>
                  )}
                  {activeSection.type === 'hero' && (
                    <>
                      <div style={{ height: 10 }} />
                      <label className="field-label">Subtitle</label>
                      <textarea className="textarea" value={activeSection.sub || ''} onChange={(e) => updateSection(activeSection.id, 'sub', e.target.value)} rows={3} />
                      <div style={{ height: 10 }} />
                      <label className="field-label">Button label</label>
                      <input className="input" value={activeSection.cta || ''} onChange={(e) => updateSection(activeSection.id, 'cta', e.target.value)} />
                    </>
                  )}
                  {activeSection.type === 'text' && (
                    <>
                      <div style={{ height: 10 }} />
                      <label className="field-label">Body</label>
                      <textarea className="textarea" value={activeSection.body || ''} onChange={(e) => updateSection(activeSection.id, 'body', e.target.value)} rows={5} />
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
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: i === 0 ? 'var(--accent-soft)' : 'var(--bg-sunk)', marginBottom: 4, border: '1px solid var(--line)' }}>
                  <Icons.layout size={13} />
                  <span style={{ fontSize: 12.5, flex: 1 }}>{p}</span>
                  <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>/{p.toLowerCase()}</span>
                </div>
              ))}
              <button className="btn btn-secondary btn-sm" style={{ marginTop: 8, width: '100%' }}><Icons.plus size={12} /> Add page</button>
            </div>
          )}

          {tab === 'design' && (
            <div className="editor-section">
              <h4>Theme</h4>
              <label className="field-label">Accent color</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['oklch(0.55 0.18 268)', 'oklch(0.6 0.17 30)', 'oklch(0.62 0.13 155)', 'oklch(0.18 0.008 80)', 'oklch(0.7 0.15 75)'].map(c => (
                  <div key={c} style={{ width: 28, height: 28, borderRadius: 8, background: c, cursor: 'pointer', border: '2px solid var(--bg-elev)', boxShadow: '0 0 0 1px var(--line)' }} />
                ))}
              </div>
              <div style={{ height: 16 }} />
              <label className="field-label">Typography</label>
              <select className="input">
                <option>Inter Tight + JetBrains Mono</option>
                <option>Söhne + Söhne Mono</option>
                <option>Tiempos + Söhne</option>
              </select>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="editor-canvas" key={viewport}>
          <div className="preview-frame fade-in-scale" style={{ maxWidth: vpWidth, transition: 'max-width .3s var(--ease)' }}>
            <SitePreview site={site} viewport={viewport} />
          </div>
        </div>
      </div>
    </div>
  );
}

window.Editor = Editor;
