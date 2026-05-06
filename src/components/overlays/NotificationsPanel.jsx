import { useState } from 'react'
import Icons from '../ui/Icons'

const INITIAL = [
  { id: 1, unread: true,  icon: Icons.bolt,     title: 'Deploy succeeded',   text: 'Personal portfolio is now live at alex-chen.weblith.site', when: '2m ago' },
  { id: 2, unread: true,  icon: Icons.sparkles, title: 'AI draft ready',     text: 'Your generated hero copy is waiting in Halcyon launch.',  when: '1h ago' },
  { id: 3, unread: false, icon: Icons.eye,      title: 'Traffic milestone',  text: 'Personal portfolio passed 1,000 visitors this month.',   when: 'yesterday' },
  { id: 4, unread: false, icon: Icons.history,  title: 'Auto-saved version', text: 'v8 saved with 3 content changes.',                       when: 'yesterday' },
  { id: 5, unread: false, icon: Icons.globe2,   title: 'Domain verified',    text: 'alex-chen.weblith.site DNS is healthy.',                   when: '2 days ago' },
]

export default function NotificationsPanel({ open, onClose }) {
  const [items, setItems] = useState(INITIAL)
  if (!open) return null

  const markAll = () => setItems(it => it.map(x => ({ ...x, unread: false })))

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
          const I = n.icon
          return (
            <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}
              onClick={() => setItems(it => it.map(x => x.id === n.id ? { ...x, unread: false } : x))}>
              <div className="notif-icon"><I size={13} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{n.title}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 2, lineHeight: 1.4 }}>{n.text}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>{n.when}</div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
