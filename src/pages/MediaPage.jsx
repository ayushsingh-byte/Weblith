import { useState, useRef } from 'react'
import Icons from '../components/ui/Icons'

const STOCK = [
  { color: 'oklch(0.65 0.18 30)', icon: '🌅' }, { color: 'oklch(0.55 0.16 220)', icon: '🌊' },
  { color: 'oklch(0.7 0.15 75)', icon: '☀️' }, { color: 'oklch(0.45 0.14 160)', icon: '🌲' },
  { color: 'oklch(0.6 0.18 320)', icon: '🌸' }, { color: 'oklch(0.5 0.17 268)', icon: '🌌' },
  { color: 'oklch(0.7 0.14 90)', icon: '🏜️' }, { color: 'oklch(0.55 0.17 0)', icon: '🌹' },
  { color: 'oklch(0.6 0.13 200)', icon: '🏔️' }, { color: 'oklch(0.5 0.18 25)', icon: '🍂' },
  { color: 'oklch(0.65 0.14 140)', icon: '🌿' }, { color: 'oklch(0.45 0.16 280)', icon: '🌃' },
]

const makeItems = () => STOCK.map((s, i) => ({
  id: i, name: `image-${String(i+1).padStart(2,'0')}.jpg`,
  size: `${(0.4 + (i * 0.2) % 2.6).toFixed(1)} MB`,
  dim: `${[1920,2400,1600,3200][i%4]}×${[1080,1600,1200,1800][i%4]}`,
  type: 'image', folder: ['hero','team','work','blog'][i%4],
  color: s.color, icon: s.icon, uploaded: ['just now','2h','yesterday','3d','1w'][i%5]
}))

export default function MediaPage() {
  const [folder, setFolder] = useState('all')
  const [selected, setSelected] = useState(null)
  const [view, setView] = useState('grid')
  const [dragging, setDragging] = useState(false)
  const [items, setItems] = useState(makeItems)
  const inputRef = useRef(null)

  const folders = [
    { id: 'all', name: 'All media', count: items.length, icon: Icons.folder },
    { id: 'hero', name: 'Hero images', count: items.filter(i => i.folder === 'hero').length, icon: Icons.image },
    { id: 'team', name: 'Team photos', count: items.filter(i => i.folder === 'team').length, icon: Icons.users },
    { id: 'work', name: 'Work samples', count: items.filter(i => i.folder === 'work').length, icon: Icons.layers },
    { id: 'blog', name: 'Blog assets', count: items.filter(i => i.folder === 'blog').length, icon: Icons.text },
  ]
  const filtered = folder === 'all' ? items : items.filter(i => i.folder === folder)
  const sel = items.find(i => i.id === selected)

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false)
    const newItems = [0, 1].map(i => ({
      id: Date.now() + i, name: `upload-${i+1}.jpg`,
      size: `${(0.5 + i * 0.8).toFixed(1)} MB`, dim: '1920×1080',
      type: 'image', folder: folder === 'all' ? 'hero' : folder,
      color: STOCK[i % STOCK.length].color, icon: '📷', uploaded: 'just now'
    }))
    setItems(it => [...newItems, ...it])
  }

  return (
    <div className="page fade-in" style={{ padding: 0, maxWidth: 'none' }}>
      <div style={{ padding: '32px 32px 0' }}>
        <div className="page-hero">
          <div>
            <h1 className="display" style={{ fontSize: 30 }}>Media library</h1>
            <p className="subtitle" style={{ fontSize: 14 }}>Upload, organize, and reuse images across your sites.</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <Icons.search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }} />
              <input className="input" placeholder="Search files…" style={{ paddingLeft: 30, height: 36, width: 220 }} />
            </div>
            <div className="seg">
              <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}><Icons.grid size={12} /></button>
              <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}><Icons.layout size={12} /></button>
            </div>
            <button className="btn btn-primary press" onClick={() => inputRef.current?.click()}><Icons.upload size={13} /> Upload</button>
            <input ref={inputRef} type="file" multiple style={{ display: 'none' }} onChange={onDrop} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `220px 1fr${sel ? ' 320px' : ''}`, gap: 0, padding: '0 32px 32px', minHeight: 400 }}>
        <aside style={{ paddingRight: 20, borderRight: '1px solid var(--line)' }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Folders</div>
          {folders.map(f => {
            const I = f.icon
            return (
              <div key={f.id} className={`folder-item ${folder === f.id ? 'active' : ''}`} onClick={() => setFolder(f.id)}>
                <I size={14} />
                <span>{f.name}</span>
                <span className="count">{f.count}</span>
              </div>
            )
          })}
          <div style={{ height: 1, background: 'var(--line)', margin: '12px 8px' }} />
          <div className="eyebrow" style={{ marginBottom: 8 }}>Tags</div>
          {[
            { name: 'hero', count: 4, color: 'oklch(0.55 0.18 268)' },
            { name: 'product', count: 8, color: 'oklch(0.62 0.13 155)' },
            { name: 'team', count: 3, color: 'oklch(0.7 0.15 75)' },
            { name: 'illustration', count: 2, color: 'oklch(0.6 0.17 30)' },
          ].map(t => (
            <div key={t.name} className="folder-item">
              <Icons.tag size={12} style={{ color: t.color }} />
              <span>{t.name}</span>
              <span className="count">{t.count}</span>
            </div>
          ))}
          <button className="btn btn-secondary btn-sm press" style={{ width: '100%', marginTop: 14 }}><Icons.folder size={12} /> New folder</button>
        </aside>

        <main style={{ padding: '0 20px' }}>
          <div
            className={`dropzone ${dragging ? 'dragging' : ''}`}
            style={{ marginBottom: 16, padding: '20px 24px', cursor: 'pointer' }}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent-ink)', display: 'grid', placeItems: 'center' }}>
                <Icons.upload size={16} />
              </div>
              <div>
                <div style={{ fontWeight: 500, fontSize: 13.5 }}>Drop files here, or <span style={{ color: 'var(--accent-ink)' }}>browse</span></div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>PNG · JPG · WebP · SVG · MP4 · up to 50MB each</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{filtered.length} items</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-ghost btn-sm"><Icons.filter size={12} /> Filter</button>
              <button className="btn btn-ghost btn-sm">Sort: Newest <Icons.chevronDown size={11} /></button>
            </div>
          </div>

          {view === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }} className="stagger">
              {filtered.map(it => (
                <div key={it.id} onClick={() => setSelected(it.id)}
                  style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${selected === it.id ? 'var(--accent)' : 'var(--line)'}`, cursor: 'pointer', background: 'var(--bg-elev)' }}>
                  <div style={{ aspectRatio: '4/3', background: it.color, position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 36 }}>{it.icon}</div>
                    <span className="chip" style={{ position: 'absolute', top: 6, right: 6, fontSize: 9.5, padding: '1px 6px', background: 'oklch(0 0 0 / 0.5)', color: 'white', border: 'none' }}>JPG</span>
                  </div>
                  <div style={{ padding: '8px 10px' }}>
                    <div style={{ fontSize: 11.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 1 }}>{it.size}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ overflow: 'hidden' }}>
              <table className="tbl">
                <thead><tr><th>Name</th><th>Folder</th><th>Dimensions</th><th>Size</th><th>Uploaded</th><th></th></tr></thead>
                <tbody>
                  {filtered.map(it => (
                    <tr key={it.id} onClick={() => setSelected(it.id)} style={{ cursor: 'pointer' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 6, background: it.color, display: 'grid', placeItems: 'center', fontSize: 14 }}>{it.icon}</div>
                          <span style={{ fontWeight: 500 }}>{it.name}</span>
                        </div>
                      </td>
                      <td><span className="chip">{it.folder}</span></td>
                      <td className="mono" style={{ color: 'var(--ink-2)' }}>{it.dim}</td>
                      <td className="mono" style={{ color: 'var(--ink-2)' }}>{it.size}</td>
                      <td style={{ color: 'var(--ink-2)' }}>{it.uploaded}</td>
                      <td><button className="btn btn-icon btn-ghost btn-sm" onClick={e => e.stopPropagation()}><Icons.more size={13} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        {sel && (
          <aside style={{ paddingLeft: 20, borderLeft: '1px solid var(--line)' }} className="fade-in">
            <div style={{ aspectRatio: '4/3', borderRadius: 10, background: sel.color, marginBottom: 14, position: 'relative', overflow: 'hidden', border: '1px solid var(--line)' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 56 }}>{sel.icon}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <strong style={{ fontSize: 14, fontWeight: 600 }}>{sel.name}</strong>
              <button className="btn btn-icon btn-ghost btn-sm" onClick={() => setSelected(null)}><Icons.x size={13} /></button>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }} className="mono">{sel.dim} · {sel.size}</div>

            <div style={{ marginTop: 18 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Details</div>
              {[{ l: 'Folder', v: sel.folder }, { l: 'Type', v: 'JPEG · 8-bit' }, { l: 'Uploaded', v: sel.uploaded }, { l: 'Used in', v: '3 places' }].map(d => (
                <div key={d.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12.5, borderBottom: '1px solid var(--line)' }}>
                  <span style={{ color: 'var(--ink-3)' }}>{d.l}</span>
                  <span style={{ fontWeight: 500 }}>{d.v}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 18 }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Public URL</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input className="input mono" value={`weblith.cdn/m/${sel.id}.jpg`} readOnly style={{ height: 32, fontSize: 11 }} />
                <button className="btn btn-secondary btn-sm press"><Icons.copy size={12} /></button>
              </div>
            </div>

            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button className="btn btn-secondary press"><Icons.download size={13} /> Download</button>
              <button className="btn btn-secondary press"><Icons.copy size={13} /> Duplicate</button>
              <button className="btn btn-ghost press" style={{ color: 'var(--err)' }}
                onClick={() => { setItems(it => it.filter(x => x.id !== sel.id)); setSelected(null) }}>
                <Icons.trash size={13} /> Delete
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
