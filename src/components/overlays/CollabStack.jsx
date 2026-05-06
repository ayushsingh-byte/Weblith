import { COLLAB_PEOPLE } from '../../data/seeds'

export function Avatar({ initials, color, size = 26, title }) {
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.4, background: color, color: 'white' }} title={title}>
      {initials}
    </div>
  )
}

export default function CollabStack({ people = COLLAB_PEOPLE, max = 3, showLive = false }) {
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
  )
}
