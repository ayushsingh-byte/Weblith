import { useState, useEffect } from 'react'
import Icons from '../components/ui/Icons'
import { fetchVersions, restoreVersion, saveVersion } from '../lib/db'

export default function VersionPage({ site, userId }) {
  const [versions, setVersions]   = useState([])
  const [selected, setSelected]   = useState(null)
  const [loading, setLoading]     = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [tab, setTab]             = useState('content')

  useEffect(() => {
    if (!site?.id) return
    setLoading(true)
    fetchVersions(site.id)
      .then(data => {
        setVersions(data)
        if (data.length > 0) setSelected(data[0].id)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [site?.id])

  const sel = versions.find(v => v.id === selected)

  const handleRestore = async () => {
    if (!sel || !userId) return
    setRestoring(true)
    try {
      await restoreVersion(sel.id, userId)
      window.location.reload()
    } catch (err) {
      console.error(err)
    } finally {
      setRestoring(false)
    }
  }

  const handleSaveNow = async () => {
    if (!site || !userId) return
    try {
      await saveVersion(site, userId, 'Manual snapshot')
      const data = await fetchVersions(site.id)
      setVersions(data)
      if (data.length > 0) setSelected(data[0].id)
    } catch (err) {
      console.error(err)
    }
  }

  function formatDate(iso) {
    if (!iso) return ''
    return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="page fade-in" style={{ padding: 0, maxWidth: 'none' }}>
      <div style={{ padding: '32px 32px 0' }}>
        <div className="page-hero">
          <div>
            <h1 className="display" style={{ fontSize: 30 }}>Version history</h1>
            <p className="subtitle" style={{ fontSize: 14 }}>
              {site?.name ? `${site.name} · ` : ''}Every save snapshotted. Restore from any point.
            </p>
          </div>
          <button className="btn btn-secondary press" onClick={handleSaveNow} disabled={!site}>
            <Icons.history size={13} /> Save snapshot now
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 0, padding: '0 32px 32px' }}>
        {/* ── Timeline sidebar ── */}
        <aside style={{ paddingRight: 24, borderRight: '1px solid var(--line)' }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            Timeline · {versions.length} snapshot{versions.length !== 1 ? 's' : ''}
          </div>

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
              <span className="spinner" />
            </div>
          )}

          {!loading && versions.length === 0 && (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>
              <Icons.history size={28} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
              No versions yet. Snapshots are saved automatically when you publish.
              <br /><br />
              <button className="btn btn-secondary btn-sm press" onClick={handleSaveNow} disabled={!site}>
                Save first snapshot
              </button>
            </div>
          )}

          {versions.map((v, i) => {
            const isSel = v.id === selected
            return (
              <div key={v.id} style={{ position: 'relative', paddingLeft: 28, paddingBottom: 14 }}>
                <div style={{ position: 'absolute', left: 8, top: 0, bottom: i === versions.length - 1 ? 8 : 0, width: 2, background: 'var(--line)' }} />
                <div style={{
                  position: 'absolute', left: 2, top: 12, width: 14, height: 14, borderRadius: '50%',
                  background: isSel ? 'var(--accent)' : 'var(--bg-elev)',
                  border: `2px solid ${isSel ? 'var(--accent)' : 'var(--line)'}`,
                }} />
                <div onClick={() => setSelected(v.id)} className="press" style={{
                  padding: 12,
                  background: isSel ? 'var(--accent-soft)' : 'var(--bg-elev)',
                  border: `1px solid ${isSel ? 'var(--accent)' : 'var(--line)'}`,
                  borderRadius: 9, cursor: 'pointer', transition: 'all .15s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    {i === 0 && <span className="chip chip-ok" style={{ fontSize: 10 }}>latest</span>}
                    <span style={{ fontSize: 11, color: 'var(--ink-3)', marginLeft: 'auto' }}>{formatDate(v.created_at)}</span>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink)' }}>
                    {v.note || 'Auto-saved'}
                  </div>
                </div>
              </div>
            )
          })}
        </aside>

        {/* ── Detail panel ── */}
        <main style={{ padding: '0 0 0 28px' }}>
          {!sel ? (
            <div style={{ display: 'grid', placeItems: 'center', height: 300, color: 'var(--ink-3)', fontSize: 13 }}>
              Select a version to inspect
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div>
                  <h2 style={{ fontSize: 20, letterSpacing: '-0.02em' }}>{sel.note || 'Auto-saved'}</h2>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 4 }}>
                    {formatDate(sel.created_at)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {versions.indexOf(sel) !== 0 && (
                    <button className="btn btn-primary btn-sm press" onClick={handleRestore} disabled={restoring}>
                      {restoring
                        ? <><span className="spinner" style={{ width: 12, height: 12 }} /> Restoring…</>
                        : <><Icons.history size={12} /> Restore this version</>}
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 4, marginBottom: 14, borderBottom: '1px solid var(--line)' }}>
                {[
                  { id: 'content', label: 'Content',      icon: Icons.text   },
                  { id: 'visual',  label: 'Visual diff',  icon: Icons.eye    },
                ].map(t => {
                  const I = t.icon
                  return (
                    <button key={t.id} onClick={() => setTab(t.id)} className="press" style={{
                      padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer',
                      borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
                      color: tab === t.id ? 'var(--ink)' : 'var(--ink-3)', fontSize: 13, fontWeight: 500,
                      display: 'flex', alignItems: 'center', gap: 7, marginBottom: -1
                    }}><I size={13} /> {t.label}</button>
                  )
                })}
              </div>

              {tab === 'content' && (
                <div className="card" style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--line)', background: 'var(--bg-sunk)' }}>
                    <span className="mono" style={{ fontSize: 12, color: 'var(--ink-2)' }}>
                      Snapshot · {formatDate(sel.created_at)}
                    </span>
                  </div>
                  <div style={{ padding: 24 }}>
                    {sel.snapshot?.sections?.length > 0 ? (
                      sel.snapshot.sections.map((s, i) => (
                        <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: i < sel.snapshot.sections.length - 1 ? '1px solid var(--line)' : 'none' }}>
                          <div className="eyebrow" style={{ marginBottom: 8 }}>Section: {s.type}</div>
                          {s.heading && <p style={{ fontWeight: 600, marginBottom: 4 }}>{s.heading}</p>}
                          {s.sub     && <p style={{ color: 'var(--ink-2)', fontSize: 13 }}>{s.sub}</p>}
                          {s.cta     && <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>CTA: {s.cta}</p>}
                        </div>
                      ))
                    ) : (
                      <p style={{ color: 'var(--ink-3)', fontSize: 13 }}>No section content in this snapshot.</p>
                    )}
                  </div>
                </div>
              )}

              {tab === 'visual' && (
                <div className="card" style={{ padding: 32, background: 'var(--bg-sunk)' }}>
                  <div style={{ background: 'var(--bg)', padding: 32, borderRadius: 12, boxShadow: 'var(--shadow-md)', maxWidth: 600 }}>
                    <div className="eyebrow" style={{ marginBottom: 10 }}>
                      {sel.snapshot?.name?.toUpperCase() || site?.name?.toUpperCase()}
                    </div>
                    {sel.snapshot?.sections?.filter(s => s.type === 'hero').map((s, i) => (
                      <div key={i}>
                        <h3 style={{ fontSize: 22, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 8 }}>{s.heading}</h3>
                        {s.sub && <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 14 }}>{s.sub}</p>}
                        {s.cta && <button className="btn btn-primary btn-sm">{s.cta} <Icons.arrowRight size={11} /></button>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
