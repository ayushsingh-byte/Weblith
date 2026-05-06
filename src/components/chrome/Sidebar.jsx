import Icons from '../ui/Icons'
import ThemeToggle from './ThemeToggle'
import { supabase } from '../../lib/supabase'

export default function Sidebar({ route, go, sites, user }) {
  const Item = ({ id, icon: I, label, count, badge }) => (
    <div className={`nav-item ${route === id ? 'active' : ''}`} onClick={() => go(id)}>
      <I className="nav-icon" size={15} />
      <span>{label}</span>
      {count != null && <span className="nav-counter">{count}</span>}
      {badge && <span className="chip chip-accent" style={{ marginLeft: 'auto', padding: '1px 6px', fontSize: 10 }}>{badge}</span>}
    </div>
  )

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="brand-mark">W</div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, flex: 1 }}>
            <span style={{ fontWeight: 600, letterSpacing: '-0.02em', fontSize: 15 }}>Weblith</span>
            <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>Pro workspace</span>
          </div>
          <button className="btn btn-icon btn-ghost btn-sm press" title="Workspace switcher" style={{ padding: 4 }}>
            <Icons.chevronDown size={12} />
          </button>
        </div>
      </div>

      <div className="sidebar-nav">
        <Item id="dashboard" icon={Icons.home}     label="Dashboard" />
        <Item id="sites"     icon={Icons.grid}     label="Sites" count={sites.length} />
        <Item id="canvas"    icon={Icons.layout}   label="Canvas" badge="New" />
        <Item id="analytics" icon={Icons.zap}      label="Analytics" />
        <Item id="templates" icon={Icons.layers}   label="Templates" />
        <Item id="ai"        icon={Icons.sparkles} label="AI Studio" />
        <Item id="media"     icon={Icons.image}    label="Media" />

        <div className="nav-section">Site</div>
        <Item id="deploy"   icon={Icons.bolt}     label="Deploy" />
        <Item id="domain"   icon={Icons.globe2}   label="Domains" />
        <Item id="versions" icon={Icons.history}  label="History" />
        <Item id="settings" icon={Icons.settings} label="Settings" />
      </div>

      <div className="sidebar-bottom">
        <div style={{ padding: 12, background: 'var(--bg-elev)', borderRadius: 12, border: '1px solid var(--line)', marginBottom: 4, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-soft), transparent 70%)', opacity: 0.6 }} />
          <div className="eyebrow" style={{ fontSize: 10, marginBottom: 6, color: 'var(--accent-ink)', position: 'relative' }}>Free → Pro</div>
          <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.45, marginBottom: 10, position: 'relative' }}>
            Custom domains, unlimited sites, and 100 AI credits / month.
          </div>
          <button className="btn btn-primary btn-sm press" style={{ width: '100%', position: 'relative' }}>Upgrade plan</button>
        </div>

        <div style={{ padding: '4px 0', borderTop: '1px solid var(--line)' }}>
          <ThemeToggle />
        </div>

        <div className="nav-item" style={{ background: 'transparent', cursor: 'default' }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--accent-soft)', color: 'var(--accent-ink)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
            {user?.initials || 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, fontSize: 12, flex: 1, minWidth: 0 }}>
            <span style={{ color: 'var(--ink)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'User'}</span>
            <span style={{ color: 'var(--ink-3)', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || ''}</span>
          </div>
          <button className="btn btn-icon btn-ghost btn-sm" title="Sign out" onClick={handleSignOut}>
            <Icons.logout size={13} />
          </button>
        </div>
      </div>
    </aside>
  )
}
