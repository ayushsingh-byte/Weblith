import { useState, useEffect, useRef } from 'react'
import Icons from '../ui/Icons'

export default function CommandPalette({ open, onClose, onNavigate, onCreate, onOpenAI, sites }) {
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) { setQ(''); setIdx(0); setTimeout(() => inputRef.current?.focus(), 30) }
  }, [open])

  const all = [
    { group: 'Actions', items: [
      { id: 'new-site', label: 'Create new site',    kbd: ['N'],        icon: Icons.plus,     run: onCreate },
      { id: 'ai',       label: 'Open AI generator',  kbd: ['G'],        icon: Icons.sparkles, run: onOpenAI },
      { id: 'deploy',   label: 'Deploy current site',kbd: ['⇧', 'D'],  icon: Icons.bolt,     run: () => onNavigate('deploy') },
    ]},
    { group: 'Navigate', items: [
      { id: 'dash',    label: 'Dashboard',      icon: Icons.home,    run: () => onNavigate('dashboard') },
      { id: 'sites',   label: 'All sites',      icon: Icons.grid,    run: () => onNavigate('sites') },
      { id: 'analytics',label: 'Analytics',     icon: Icons.bolt,    run: () => onNavigate('analytics') },
      { id: 'tmpl',    label: 'Templates',      icon: Icons.layers,  run: () => onNavigate('templates') },
      { id: 'media',   label: 'Media library',  icon: Icons.image,   run: () => onNavigate('media') },
      { id: 'domain',  label: 'Domain settings',icon: Icons.globe2,  run: () => onNavigate('domain') },
      { id: 'set',     label: 'Settings',       icon: Icons.settings,run: () => onNavigate('settings') },
    ]},
    { group: 'Sites', items: sites.slice(0, 5).map(s => ({
        id: s.id, label: s.name, icon: Icons.layout, sub: s.domain,
        run: () => onNavigate('open:' + s.id),
      }))
    },
  ]

  const filtered = all
    .map(g => ({ ...g, items: g.items.filter(it => !q || it.label.toLowerCase().includes(q.toLowerCase()) || (it.sub && it.sub.toLowerCase().includes(q.toLowerCase()))) }))
    .filter(g => g.items.length > 0)

  const flat = filtered.flatMap(g => g.items)

  const onKey = (e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(i + 1, flat.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter')     { e.preventDefault(); flat[idx]?.run?.(); onClose() }
  }

  if (!open) return null
  let counter = -1

  return (
    <div className="cmdk-overlay" onClick={onClose}>
      <div className="cmdk" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--line)' }}>
          <Icons.search size={14} style={{ marginLeft: 18, color: 'var(--ink-3)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="Type a command or search…"
            value={q}
            onChange={e => { setQ(e.target.value); setIdx(0) }}
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
                counter++
                const I = it.icon
                const isActive = counter === idx
                return (
                  <div key={it.id} className={`cmdk-item ${isActive ? 'active' : ''}`}
                    onMouseEnter={() => setIdx(counter)}
                    onClick={() => { it.run?.(); onClose() }}>
                    <div className="ico"><I size={14} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div>{it.label}</div>
                      {it.sub && <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{it.sub}</div>}
                    </div>
                    {it.kbd && <div className="cmdk-meta">{it.kbd.map((k, i) => <kbd key={i}>{k}</kbd>)}</div>}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--line)', background: 'var(--bg-sunk)', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-3)' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
            <span><kbd>↵</kbd> open</span>
          </div>
          <span>Weblith ⌘K</span>
        </div>
      </div>
    </div>
  )
}
