import { useState, useRef, useEffect } from 'react'
import Icons from '../components/ui/Icons'
import { Sparkline } from '../components/ui/Sparkline'

function SiteMenu({ site, onOpen, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onClose])

  return (
    <div ref={ref} className="popover" style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, width: 180, zIndex: 30 }}>
      {[
        { icon: Icons.pen,      label: 'Edit site',       action: 'edit',      color: '' },
        { icon: Icons.copy,     label: 'Duplicate',       action: 'duplicate', color: '' },
        { icon: Icons.download, label: 'Export ZIP',      action: 'export',    color: '' },
        { icon: Icons.users,    label: 'Transfer',        action: 'transfer',  color: '' },
        null,
        { icon: Icons.trash,    label: 'Delete site',     action: 'delete',    color: 'var(--err)' },
      ].map((item, i) => item === null
        ? <div key={i} className="divider" style={{ margin: '4px 0' }} />
        : (
          <button key={i} className="cmdk-item" onClick={() => { onOpen(item.action); onClose() }}
            style={{ width: '100%', borderRadius: 6, color: item.color || 'var(--ink)' }}>
            <item.icon size={13} />
            <span style={{ fontSize: 12.5 }}>{item.label}</span>
          </button>
        )
      )}
    </div>
  )
}

function TransferModal({ site, onClose }) {
  const [email, setEmail] = useState('')
  const [confirm, setConfirm] = useState('')
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Transfer ownership</h3>
            <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>Transfer "{site?.name}" to another user</p>
          </div>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><Icons.x size={14} /></button>
        </div>
        <div className="modal-body">
          <div className="card" style={{ background: 'var(--warn-soft)', border: '1px solid var(--warn)', padding: '12px 14px', marginBottom: 16, display: 'flex', gap: 10 }}>
            <Icons.warn size={14} style={{ color: 'var(--warn)', flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12.5, color: 'var(--ink)', margin: 0, lineHeight: 1.55 }}>
              This will permanently transfer the site to the new owner. You will lose access immediately.
            </p>
          </div>
          <label className="field">
            <span className="field-label">New owner's email</span>
            <input className="input" type="email" placeholder="colleague@company.com" value={email} onChange={e => setEmail(e.target.value)} />
          </label>
          <label className="field">
            <span className="field-label">Type the site name to confirm: <strong>{site?.name}</strong></span>
            <input className="input" placeholder={site?.name} value={confirm} onChange={e => setConfirm(e.target.value)} />
          </label>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary press" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger press" disabled={confirm !== site?.name || !email}>Transfer site</button>
        </div>
      </div>
    </div>
  )
}

function ExportModal({ site, onClose }) {
  const [format, setFormat] = useState('zip')
  const [exporting, setExporting] = useState(false)
  const doExport = () => {
    setExporting(true)
    setTimeout(() => { setExporting(false); onClose() }, 1600)
  }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Export site</h3>
            <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>Download "{site?.name}" as a static bundle</p>
          </div>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><Icons.x size={14} /></button>
        </div>
        <div className="modal-body">
          {[
            { id: 'zip',  label: 'Static HTML/CSS/JS (ZIP)', desc: 'Self-host on any server. No build step required.' },
            { id: 'json', label: 'Content JSON',              desc: 'Raw site data — useful for migrations or backups.' },
            { id: 'pdf',  label: 'PDF snapshot',              desc: 'High-fidelity PDF of every published page.' },
          ].map(f => (
            <div key={f.id} onClick={() => setFormat(f.id)}
              className="card" style={{ padding: '14px 16px', marginBottom: 8, cursor: 'pointer',
                border: format === f.id ? '2px solid var(--accent)' : '1px solid var(--line)',
                background: format === f.id ? 'var(--accent-soft)' : 'var(--bg-elev)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${format === f.id ? 'var(--accent)' : 'var(--line)'}`, background: format === f.id ? 'var(--accent)' : 'transparent', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  {format === f.id && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{f.label}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{f.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary press" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary press" onClick={doExport} disabled={exporting}>
            {exporting ? <><span className="spinner" /> Preparing…</> : <><Icons.download size={13} /> Export</>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SitesPage({ sites, sitesLoading, onOpen, onCreate }) {
  const [q, setQ]               = useState('')
  const [statusFilter, setFilter] = useState('all')
  const [openMenu, setOpenMenu] = useState(null)
  const [modal, setModal]       = useState(null)
  const [modalSite, setModalSite] = useState(null)

  const filtered = sites.filter(s => {
    const matchQ = !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.domain.toLowerCase().includes(q.toLowerCase())
    const matchS = statusFilter === 'all' || s.status === statusFilter
    return matchQ && matchS
  })

  const counts = {
    all:       sites.length,
    published: sites.filter(s => s.status === 'published').length,
    draft:     sites.filter(s => s.status === 'draft').length,
  }

  const openAction = (site, action) => {
    if (action === 'edit')      { onOpen(site.id); return }
    if (action === 'transfer')  { setModalSite(site); setModal('transfer'); return }
    if (action === 'export')    { setModalSite(site); setModal('export'); return }
    if (action === 'duplicate') { /* TODO: duplicate logic */ return }
    if (action === 'delete')    { /* TODO: delete logic */ return }
  }

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
          <button className="btn btn-secondary press"><Icons.download size={13} /> Export all</button>
          <button className="btn btn-primary press" onClick={onCreate}><Icons.plus size={14} /> New site</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
        {[['all','All'], ['published','Published'], ['draft','Draft']].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)}
            className="press"
            style={{ padding: '6px 12px', borderRadius: 7, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', border: 'none',
              background: statusFilter === id ? 'var(--bg-elev)' : 'transparent',
              color: statusFilter === id ? 'var(--ink)' : 'var(--ink-3)',
              boxShadow: statusFilter === id ? 'var(--shadow-sm)' : 'none',
              display: 'flex', alignItems: 'center', gap: 6 }}>
            {label}
            <span style={{ fontSize: 11, background: statusFilter === id ? 'var(--accent-soft)' : 'var(--bg-sunk)', color: statusFilter === id ? 'var(--accent-ink)' : 'var(--ink-3)', padding: '1px 6px', borderRadius: 999, fontFamily: 'var(--font-mono)' }}>{counts[id]}</span>
          </button>
        ))}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {sitesLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><span className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--ink-3)' }}>
            <Icons.grid size={32} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.25 }} />
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
              {sites.length === 0 ? 'No sites yet' : 'No sites match your filter'}
            </div>
            {sites.length === 0 && <button className="btn btn-primary btn-sm press" onClick={onCreate}><Icons.plus size={12} /> Create your first site</button>}
          </div>
        ) : (
          <table className="tbl">
            <thead>
              <tr><th>Name</th><th>Status</th><th>Domain</th><th>Visitors · 30d</th><th>Trend</th><th>Edited</th><th style={{ width: 40 }}></th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
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
                  <td style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                    <button className="btn btn-icon btn-ghost btn-sm press"
                      onClick={() => setOpenMenu(openMenu === s.id ? null : s.id)}>
                      <Icons.more size={13} />
                    </button>
                    {openMenu === s.id && (
                      <SiteMenu site={s} onOpen={(action) => openAction(s, action)} onClose={() => setOpenMenu(null)} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick stats bar */}
      {sites.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 14 }}>
          {[
            { l: 'Total sites',      v: sites.length },
            { l: 'Published',        v: counts.published },
            { l: 'Total visitors',   v: sites.reduce((a, s) => a + (s.visitors || 0), 0).toLocaleString() },
            { l: 'Avg. visitors',    v: sites.length ? Math.round(sites.reduce((a, s) => a + (s.visitors || 0), 0) / sites.length).toLocaleString() : '—' },
          ].map(k => (
            <div key={k.l} style={{ background: 'var(--bg-elev)', border: '1px solid var(--line)', borderRadius: 10, padding: '12px 16px' }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500, marginBottom: 4 }}>{k.l}</div>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{k.v}</div>
            </div>
          ))}
        </div>
      )}

      {modal === 'transfer' && <TransferModal site={modalSite} onClose={() => setModal(null)} />}
      {modal === 'export'   && <ExportModal   site={modalSite} onClose={() => setModal(null)} />}
    </div>
  )
}
