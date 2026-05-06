import { useState } from 'react'
import Icons from '../ui/Icons'
import TemplatesPage from '../../pages/TemplatesPage'

export default function CreateSiteModal({ open, onClose, onCreate }) {
  const [step, setStep]       = useState(1)
  const [name, setName]       = useState('')
  const [slug, setSlug]       = useState('')
  const [tmpl, setTmpl]       = useState('portfolio')
  const [creating, setCreating] = useState(false)
  const [error, setError]     = useState('')

  const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const onName  = (v) => { setName(v); setSlug(slugify(v)) }

  const reset = () => { setStep(1); setName(''); setSlug(''); setTmpl('portfolio'); setError('') }
  const close = () => { reset(); onClose() }

  const submit = async () => {
    if (!name.trim()) return
    setCreating(true)
    setError('')
    try {
      await onCreate({
        name: name.trim(),
        slug: slug || slugify(name.trim()) || 'untitled',
        template: tmpl,
      })
      reset()
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setCreating(false)
    }
  }

  const onKeyDown = (e) => { if (e.key === 'Enter' && name && !creating) submit() }

  if (!open) return null
  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 720 }}>
        <div className="modal-header" style={{ paddingBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="eyebrow">Step {step} of 2</div>
              <h3 style={{ fontSize: 18, marginTop: 4 }}>
                {step === 1 ? 'Choose a starting point' : 'Name your site'}
              </h3>
            </div>
            <button className="btn btn-icon btn-ghost btn-sm" onClick={close} disabled={creating}>
              <Icons.x size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
            <div style={{ flex: 1, height: 3, background: 'var(--ink)', borderRadius: 2 }} />
            <div style={{ flex: 1, height: 3, background: step >= 2 ? 'var(--ink)' : 'var(--line)', borderRadius: 2, transition: 'all .3s' }} />
          </div>
        </div>

        <div className="modal-body" style={{ maxHeight: 480, overflowY: 'auto' }}>
          {step === 1 && (
            <div className="fade-in">
              <TemplatesPage embedded selected={tmpl} onSelect={setTmpl} />
            </div>
          )}
          {step === 2 && (
            <div className="fade-in" style={{ paddingTop: 8 }}>
              <label className="field-label">Site name</label>
              <input
                className="input" value={name}
                onChange={e => onName(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="My new site" autoFocus
              />
              <div style={{ height: 14 }} />
              <label className="field-label">URL</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="mono" style={{ padding: '10px 12px', background: 'var(--bg-sunk)', border: '1px solid var(--line)', borderRight: 'none', borderRadius: '10px 0 0 10px', color: 'var(--ink-3)', fontSize: 12, whiteSpace: 'nowrap' }}>
                  weblith.site /
                </span>
                <input
                  className="input" value={slug}
                  onChange={e => setSlug(slugify(e.target.value))}
                  onKeyDown={onKeyDown}
                  placeholder="my-site"
                  style={{ borderRadius: '0 10px 10px 0' }}
                />
              </div>
              <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-sunk)', borderRadius: 10, fontSize: 12.5, color: 'var(--ink-2)', display: 'flex', gap: 10 }}>
                <Icons.bolt size={14} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  You can change the URL anytime from Site Settings. We'll publish to{' '}
                  <span className="mono" style={{ background: 'var(--bg-elev)', padding: '0 4px', borderRadius: 3 }}>
                    {slug || 'site'}.weblith.site
                  </span>
                </div>
              </div>
              {error && (
                <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--err-soft)', color: 'var(--err)', borderRadius: 8, fontSize: 12.5 }}>
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          {step === 2 && (
            <button className="btn btn-secondary" onClick={() => setStep(1)} disabled={creating}>
              <Icons.arrowLeft size={12} /> Back
            </button>
          )}
          <span style={{ flex: 1 }} />
          {step === 1
            ? <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!tmpl}>
                Continue <Icons.arrowRight size={12} />
              </button>
            : <button className="btn btn-primary" onClick={submit} disabled={!name.trim() || creating}>
                {creating
                  ? <><span className="spinner" style={{ width: 13, height: 13 }} /> Creating…</>
                  : <>Create site <Icons.arrowRight size={12} /></>}
              </button>
          }
        </div>
      </div>
    </div>
  )
}
