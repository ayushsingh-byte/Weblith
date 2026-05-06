/* global React, Icons */
const { useState, useEffect, useRef } = React;

// ---------- Command Palette (⌘K) ----------
function CommandPalette({ open, onClose, onNavigate, onCreate, onOpenAI, sites }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) { setQ(""); setIdx(0); setTimeout(() => inputRef.current?.focus(), 30); }
  }, [open]);

  const all = [
    { group: "Actions", items: [
      { id: 'new-site', label: 'Create new site', kbd: ['N'], icon: Icons.plus, run: onCreate },
      { id: 'ai', label: 'Open AI generator', kbd: ['G'], icon: Icons.sparkles, run: onOpenAI },
      { id: 'deploy', label: 'Deploy current site', kbd: ['⇧', 'D'], icon: Icons.bolt, run: () => onNavigate('deploy') },
    ]},
    { group: "Navigate", items: [
      { id: 'dash', label: 'Dashboard', icon: Icons.home, run: () => onNavigate('dashboard') },
      { id: 'sites', label: 'All sites', icon: Icons.grid, run: () => onNavigate('sites') },
      { id: 'analytics', label: 'Analytics', icon: Icons.bolt, run: () => onNavigate('analytics') },
      { id: 'tmpl', label: 'Templates', icon: Icons.layout, run: () => onNavigate('templates') },
      { id: 'media', label: 'Media library', icon: Icons.image, run: () => onNavigate('media') },
      { id: 'domain', label: 'Domain settings', icon: Icons.globe2, run: () => onNavigate('domain') },
      { id: 'set', label: 'Settings', icon: Icons.settings, run: () => onNavigate('settings') },
    ]},
    { group: "Sites", items: sites.slice(0, 5).map(s => ({ id: s.id, label: s.name, icon: Icons.layout, sub: s.domain, run: () => onNavigate('open:' + s.id) })) },
  ];

  const filtered = all.map(g => ({
    ...g,
    items: g.items.filter(it => !q || it.label.toLowerCase().includes(q.toLowerCase()) || (it.sub && it.sub.toLowerCase().includes(q.toLowerCase()))),
  })).filter(g => g.items.length > 0);

  const flat = filtered.flatMap(g => g.items);

  const onKey = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(i + 1, flat.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); flat[idx]?.run?.(); onClose(); }
  };

  if (!open) return null;
  let counter = -1;

  return (
    <div className="cmdk-overlay" onClick={onClose}>
      <div className="cmdk" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--line)' }}>
          <Icons.search size={14} style={{ marginLeft: 18, color: 'var(--ink-3)' }} />
          <input
            ref={inputRef}
            className="cmdk-input"
            style={{ borderBottom: 'none' }}
            placeholder="Type a command or search…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setIdx(0); }}
            onKeyDown={onKey}
          />
          <kbd style={{ marginRight: 16 }}>esc</kbd>
        </div>
        <div className="cmdk-list">
          {filtered.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>No results</div>}
          {filtered.map(g => (
            <div key={g.group}>
              <div className="cmdk-section">{g.group}</div>
              {g.items.map(it => {
                counter++;
                const I = it.icon;
                const isActive = counter === idx;
                return (
                  <div
                    key={it.id}
                    className={`cmdk-item ${isActive ? 'active' : ''}`}
                    onMouseEnter={() => setIdx(counter)}
                    onClick={() => { it.run?.(); onClose(); }}>
                    <div className="ico"><I size={14} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div>{it.label}</div>
                      {it.sub && <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{it.sub}</div>}
                    </div>
                    {it.kbd && <div className="cmdk-meta">{it.kbd.map((k, i) => <kbd key={i}>{k}</kbd>)}</div>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--line)', background: 'var(--bg-sunk)', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-3)' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span>
            <span><kbd>↵</kbd> open</span>
          </div>
          <span>Forge ⌘K</span>
        </div>
      </div>
    </div>
  );
}

// ---------- Notifications panel ----------
function NotificationsPanel({ open, onClose, anchor }) {
  const [items, setItems] = useState([
    { id: 1, unread: true, icon: Icons.bolt, title: "Deploy succeeded", text: "Personal portfolio is now live at alex-chen.forge.site", when: "2m ago" },
    { id: 2, unread: true, icon: Icons.sparkles, title: "AI draft ready", text: "Your generated hero copy is waiting in Halcyon launch.", when: "1h ago" },
    { id: 3, unread: false, icon: Icons.eye, title: "Traffic milestone", text: "Personal portfolio passed 1,000 visitors this month.", when: "yesterday" },
    { id: 4, unread: false, icon: Icons.history, title: "Auto-saved version", text: "v8 saved with 3 content changes.", when: "yesterday" },
    { id: 5, unread: false, icon: Icons.globe2, title: "Domain verified", text: "alex-chen.forge.site DNS is healthy.", when: "2 days ago" },
  ]);
  if (!open) return null;
  const markAll = () => setItems(it => it.map(x => ({ ...x, unread: false })));
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 30 }} />
      <div className="popover notif-panel" style={{ top: 56, right: 24, padding: 0 }}>
        <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <strong style={{ fontSize: 13.5 }}>Notifications</strong>
            <span className="chip chip-accent" style={{ fontSize: 10 }}>{items.filter(i => i.unread).length} new</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={markAll}>Mark all read</button>
        </div>
        {items.map(n => {
          const I = n.icon;
          return (
            <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`} onClick={() => setItems(it => it.map(x => x.id === n.id ? { ...x, unread: false } : x))}>
              <div className="notif-icon"><I size={13} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{n.title}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 2, lineHeight: 1.4 }}>{n.text}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>{n.when}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ---------- Avatar / collaborator stack ----------
function Avatar({ initials, color, size = 26, title }) {
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.4, background: color, color: 'white' }} title={title}>
      {initials}
    </div>
  );
}
const COLLAB_PEOPLE = [
  { id: 'a', initials: 'AC', color: 'oklch(0.55 0.18 268)', name: 'Alex Chen' },
  { id: 'b', initials: 'MR', color: 'oklch(0.6 0.17 30)', name: 'Maya Reyes' },
  { id: 'c', initials: 'JL', color: 'oklch(0.62 0.13 155)', name: 'Jin Liu' },
];

function CollabStack({ people = COLLAB_PEOPLE, max = 3, showLive = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="avatar-stack">
        {people.slice(0, max).map(p => <Avatar key={p.id} initials={p.initials} color={p.color} title={p.name} />)}
      </div>
      {showLive && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--ink-2)' }}>
          <span className="live-dot" />
          {people.length} editing
        </div>
      )}
    </div>
  );
}

// ---------- Sparkline ----------
function Sparkline({ data, width = 120, height = 32, color = 'var(--ink)' }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(max - min, 1);
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - ((d - min) / range) * (height - 4) - 2}`).join(' ');
  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={`0,${height} ${pts} ${width},${height}`} fill={color} opacity="0.08" />
    </svg>
  );
}

// ---------- Bar chart ----------
function BarChart({ data, height = 140 }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height, paddingTop: 12 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' }}>
          <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <div className="spark-bar" style={{ width: '70%', height: `${(d.value / max) * 100}%`, animationDelay: `${i * 30}ms` }} title={`${d.label}: ${d.value}`} />
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

window.CommandPalette = CommandPalette;
window.NotificationsPanel = NotificationsPanel;
window.Avatar = Avatar;
window.CollabStack = CollabStack;
window.COLLAB_PEOPLE = COLLAB_PEOPLE;
window.Sparkline = Sparkline;
window.BarChart = BarChart;
