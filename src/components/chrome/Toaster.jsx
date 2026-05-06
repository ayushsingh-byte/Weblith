import Icons from '../ui/Icons'

export default function Toaster({ toasts }) {
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <Icons.check size={14} style={{ color: 'var(--ok)' }} />
          {t.msg}
        </div>
      ))}
    </div>
  )
}
