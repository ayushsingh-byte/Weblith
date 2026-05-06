import { useState, useEffect } from 'react'
import Icons from '../ui/Icons'

export default function ThemeToggle({ compact = false }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('forge-theme') || 'light' } catch { return 'light' }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('forge-theme', theme) } catch {}
  }, [theme])

  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  if (compact) {
    return (
      <button className="btn btn-icon btn-ghost press" onClick={toggle} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
        {theme === 'light' ? <Icons.moon size={15} /> : <Icons.sun size={15} />}
      </button>
    )
  }
  return (
    <div className="theme-toggle" onClick={toggle} title="Switch theme">
      <div className={`theme-toggle-knob ${theme}`}>
        {theme === 'light' ? <Icons.sun size={11} /> : <Icons.moon size={11} />}
      </div>
      <span className={theme === 'light' ? 'active' : ''}>Light</span>
      <span className={theme === 'dark' ? 'active' : ''}>Dark</span>
    </div>
  )
}
