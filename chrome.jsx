/* global React, Icons, MOCK_USER */
const { useState, useEffect, useRef } = React;

// ---------- Theme toggle ----------
function ThemeToggle({ compact = false }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('weblith-theme') || 'light'; } catch (e) { return 'light'; }
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('weblith-theme', theme); } catch (e) {}
  }, [theme]);
  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  if (compact) {
    return (
      <button className="btn btn-icon btn-ghost press" onClick={toggle} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
        {theme === 'light' ? <Icons.moon size={15} /> : <Icons.sun size={15} />}
      </button>
    );
  }
  return (
    <div className="theme-toggle" onClick={toggle} title="Switch theme">
      <div className={`theme-toggle-knob ${theme}`}>
        {theme === 'light' ? <Icons.sun size={11} /> : <Icons.moon size={11} />}
      </div>
      <span className={theme === 'light' ? 'active' : ''}>Light</span>
      <span className={theme === 'dark' ? 'active' : ''}>Dark</span>
    </div>
  );
}

// ---------- Sidebar ----------
function Sidebar({ route, go, sites }) {
  const Item = ({ id, icon: I, label, count, badge }) => (
    <div className={`nav-item ${route === id ? 'active' : ''}`} onClick={() => go(id)}>
      <I className="nav-icon" />
      <span>{label}</span>
      {count != null && <span className="nav-counter">{count}</span>}
      {badge && <span className="chip chip-accent" style={{ marginLeft: 'auto', padding: '1px 6px', fontSize: 10 }}>{badge}</span>}
    </div>
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">W</div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, flex: 1 }}>
          <span style={{ fontWeight: 600, letterSpacing: '-0.02em', fontSize: 15 }}>Weblith</span>
          <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{MOCK_USER.plan} workspace</span>
        </div>
        <button className="btn btn-icon btn-ghost btn-sm press" title="Workspace switcher" style={{ padding: 4 }}>
          <Icons.chevronDown size={12} />
        </button>
      </div>

      <Item id="dashboard" icon={Icons.home} label="Dashboard" />
      <Item id="sites" icon={Icons.grid} label="Sites" count={sites.length} />
      <Item id="canvas" icon={Icons.layout} label="Canvas" badge="New" />
      <Item id="analytics" icon={Icons.zap} label="Analytics" />
      <Item id="templates" icon={Icons.layers} label="Templates" />
      <Item id="ai" icon={Icons.sparkles} label="AI Studio" />
      <Item id="media" icon={Icons.image} label="Media" />

      <div className="nav-section">Site</div>
      <Item id="deploy" icon={Icons.bolt} label="Deploy" />
      <Item id="domain" icon={Icons.globe2} label="Domains" />
      <Item id="versions" icon={Icons.history} label="History" />
      <Item id="settings" icon={Icons.settings} label="Settings" />

      <div style={{ flex: 1 }} />

      <div style={{ padding: 12, background: 'var(--bg-elev)', borderRadius: 12, border: '1px solid var(--line)', margin: '0 0 8px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-soft), transparent 70%)', opacity: 0.6 }} />
        <div className="eyebrow" style={{ fontSize: 10, marginBottom: 6, color: 'var(--accent-ink)', position: 'relative' }}>Free → Pro</div>
        <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.45, marginBottom: 10, position: 'relative' }}>
          Custom domains, unlimited sites, and 100 AI credits / month.
        </div>
        <button className="btn btn-primary btn-sm press" style={{ width: '100%', position: 'relative' }}>Upgrade plan</button>
      </div>

      <div style={{ padding: '6px 0', borderTop: '1px solid var(--line)' }}>
        <ThemeToggle />
      </div>

      <div className="nav-item" style={{ background: 'transparent', cursor: 'pointer' }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--accent-soft)', color: 'var(--accent-ink)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600 }}>
          {MOCK_USER.initials}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, fontSize: 12, flex: 1, minWidth: 0 }}>
          <span style={{ color: 'var(--ink)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{MOCK_USER.name}</span>
          <span style={{ color: 'var(--ink-3)', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{MOCK_USER.email}</span>
        </div>
        <Icons.chevronRight size={12} style={{ color: 'var(--ink-3)' }} />
      </div>
    </aside>
  );
}

// ---------- Topbar ----------
function Topbar({ crumbs = [], actions, search, onOpenCmdK, onOpenNotifs, notifCount = 2 }) {
  return (
    <header className="topbar">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep"><Icons.chevronRight size={12} /></span>}
            <span className={i === crumbs.length - 1 ? 'now' : ''}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      {search && (
        <button onClick={onOpenCmdK} style={{ position: 'relative', width: 320, textAlign: 'left', cursor: 'pointer' }} className="press">
          <div className="input" style={{ paddingLeft: 32, height: 34, padding: '6px 10px 6px 32px', display: 'flex', alignItems: 'center', color: 'var(--ink-3)', fontSize: 13 }}>
            <Icons.search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }} />
            Search or jump to…
            <span style={{ marginLeft: 'auto' }}><kbd>⌘</kbd> <kbd>K</kbd></span>
          </div>
        </button>
      )}
      <button className="btn btn-icon btn-ghost press" title="Notifications" onClick={onOpenNotifs} style={{ position: 'relative' }}>
        <Icons.bell size={16} />
        {notifCount > 0 && <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--bg)' }} />}
      </button>
      {actions}
    </header>
  );
}

// ---------- Toast ----------
function Toaster({ toasts }) {
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <Icons.check size={14} style={{ color: 'var(--ok)' }} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

window.Sidebar = Sidebar;
window.Topbar = Topbar;
window.Toaster = Toaster;
window.ThemeToggle = ThemeToggle;
