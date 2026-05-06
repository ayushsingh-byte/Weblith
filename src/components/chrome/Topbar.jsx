import Icons from '../ui/Icons'

export default function Topbar({ crumbs = [], actions, search, onOpenCmdK, onOpenNotifs, notifCount = 2 }) {
  return (
    <header className="topbar">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {i > 0 && <span className="sep"><Icons.chevronRight size={12} /></span>}
            <span className={i === crumbs.length - 1 ? 'now' : ''}>{c}</span>
          </span>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      {search && (
        <button onClick={onOpenCmdK} style={{ position: 'relative', width: 320, textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }} className="press">
          <div className="input" style={{ height: 34, padding: '6px 10px 6px 32px', display: 'flex', alignItems: 'center', color: 'var(--ink-3)', fontSize: 13, cursor: 'pointer' }}>
            <Icons.search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }} />
            Search or jump to…
            <span style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}><kbd>⌘</kbd><kbd>K</kbd></span>
          </div>
        </button>
      )}
      <button className="btn btn-icon btn-ghost press" title="Notifications" onClick={onOpenNotifs} style={{ position: 'relative' }}>
        <Icons.bell size={16} />
        {notifCount > 0 && <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--bg)' }} />}
      </button>
      {actions}
    </header>
  )
}
