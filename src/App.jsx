import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { SEED_SITES } from './data/seeds'

import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import SitesPage from './pages/SitesPage'
import EditorPage from './pages/EditorPage'
import TemplatesPage from './pages/TemplatesPage'
import AIPage from './pages/AIPage'
import AnalyticsPage from './pages/AnalyticsPage'
import DeployPage from './pages/DeployPage'
import DomainPage from './pages/DomainPage'
import MediaPage from './pages/MediaPage'
import VersionPage from './pages/VersionPage'
import SettingsPage from './pages/SettingsPage'
import CanvasPage from './pages/CanvasPage'

import Sidebar from './components/chrome/Sidebar'
import Topbar from './components/chrome/Topbar'
import Toaster from './components/chrome/Toaster'
import CreateSiteModal from './components/overlays/CreateSiteModal'
import AIPanel from './components/overlays/AIPanel'
import CommandPalette from './components/overlays/CommandPalette'
import NotificationsPanel from './components/overlays/NotificationsPanel'

import Icons from './components/ui/Icons'

const SITES_KEY = 'weblith_sites_v1'

function loadSites() {
  try {
    const raw = localStorage.getItem(SITES_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return SEED_SITES
}

function saveSites(sites) {
  try { localStorage.setItem(SITES_KEY, JSON.stringify(sites)) } catch {}
}

function LoadingScreen() {
  return (
    <div style={{ height: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div className="brand-mark" style={{ width: 44, height: 44, fontSize: 20, borderRadius: 12 }}>F</div>
        <span className="spinner" style={{ width: 18, height: 18 }} />
      </div>
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sites, setSites] = useState(loadSites)
  const [route, setRoute] = useState('dashboard')
  const [editingSiteId, setEditingSiteId] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [cmdkOpen, setCmdkOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdkOpen(o => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => { saveSites(sites) }, [sites])

  const addToast = (msg) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, msg }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2600)
  }

  const createSite = ({ name, slug, template }) => {
    const id = `s${Date.now()}`
    const newSite = {
      id, name, slug, template,
      status: 'draft', visitors: 0, edited: 'just now',
      domain: `${slug}.weblith.site`,
      favicon: name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase() || 'NS',
      color: 'oklch(0.92 0.04 80)',
      content: {
        title: name,
        tagline: 'A new site',
        sections: [
          { id: 'hero-1', type: 'hero', heading: `Welcome to ${name}`, sub: 'Start editing this site to make it your own.', cta: 'Get started' },
        ],
      },
    }
    setSites(s => [newSite, ...s])
    setCreateOpen(false)
    setEditingSiteId(id)
    setRoute('editor')
    addToast(`Created "${name}"`)
  }

  const updateSite = (next) => {
    setSites(list => list.map(s => s.id === next.id ? { ...next, edited: 'just now' } : s))
  }

  const publishSite = () => {
    if (!editingSiteId) return
    setSites(list => list.map(s => s.id === editingSiteId ? { ...s, status: 'published' } : s))
    addToast('Site published!')
  }

  const handleNavigate = (target) => {
    if (target.startsWith('open:')) {
      setEditingSiteId(target.slice(5))
      setRoute('editor')
    } else {
      setRoute(target)
    }
  }

  const user = session ? {
    name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'You',
    email: session.user.email,
    initials: (session.user.user_metadata?.name || session.user.email || 'U')
      .split(/[\s@]/).filter(Boolean).map(s => s[0]).join('').slice(0, 2).toUpperCase(),
  } : null

  const editingSite = sites.find(s => s.id === editingSiteId)

  const routeLabel = {
    dashboard: ['Workspace', 'Dashboard'],
    sites: ['Workspace', 'Sites'],
    analytics: ['Workspace', 'Analytics'],
    templates: ['Workspace', 'Templates'],
    ai: ['Workspace', 'AI generator'],
    media: ['Workspace', 'Media'],
    deploy: ['Site', 'Deploy'],
    domain: ['Site', 'Domain'],
    versions: ['Site', 'Version history'],
    canvas: ['Site', 'Canvas'],
    settings: ['Workspace', 'Settings'],
  }

  if (loading) return <LoadingScreen />
  if (!session) return <AuthPage />

  if (route === 'editor' && editingSite) {
    return (
      <>
        <div className="app-shell">
          <Sidebar route="sites" go={(r) => { setRoute(r); setEditingSiteId(null) }} sites={sites} user={user} />
          <main className="main" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <EditorPage
              site={editingSite}
              onUpdate={updateSite}
              onBack={() => { setEditingSiteId(null); setRoute('sites') }}
              onPublish={publishSite}
              onOpenAI={() => setAiOpen(true)}
              addToast={addToast}
            />
          </main>
        </div>
        <AIPanel
          open={aiOpen}
          onClose={() => setAiOpen(false)}
          onApply={(r) => {
            const next = JSON.parse(JSON.stringify(editingSite))
            const hero = next.content.sections.find(s => s.type === 'hero')
            if (hero) { hero.heading = r.heading; hero.sub = r.sub; if (r.cta) hero.cta = r.cta }
            updateSite(next)
          }}
          addToast={addToast}
        />
        <CommandPalette open={cmdkOpen} onClose={() => setCmdkOpen(false)} onNavigate={handleNavigate} onCreate={() => { setCmdkOpen(false); setCreateOpen(true) }} onOpenAI={() => { setCmdkOpen(false); setAiOpen(true) }} sites={sites} />
        <Toaster toasts={toasts} />
      </>
    )
  }

  return (
    <>
      <div className="app-shell">
        <Sidebar route={route} go={setRoute} sites={sites} user={user} />
        <main className="main">
          <Topbar
            crumbs={routeLabel[route] || ['Workspace']}
            search
            onOpenCmdK={() => setCmdkOpen(true)}
            onOpenNotifs={() => setNotifOpen(o => !o)}
            actions={
              <button className="btn btn-primary btn-sm press" onClick={() => setCreateOpen(true)}>
                <Icons.plus size={13} /> New site
              </button>
            }
          />
          <div className="main-scroll">
            {route === 'dashboard' && (
              <DashboardPage
                sites={sites} user={user}
                onOpen={(id) => { setEditingSiteId(id); setRoute('editor') }}
                onCreate={() => setCreateOpen(true)}
                onNavigate={setRoute}
                onOpenAI={() => setRoute('ai')}
              />
            )}
            {route === 'sites' && (
              <SitesPage
                sites={sites}
                onOpen={(id) => { setEditingSiteId(id); setRoute('editor') }}
                onCreate={() => setCreateOpen(true)}
              />
            )}
            {route === 'analytics' && <AnalyticsPage sites={sites} />}
            {route === 'templates' && <TemplatesPage onUse={() => setCreateOpen(true)} />}
            {route === 'ai' && <AIPage />}
            {route === 'media' && <MediaPage />}
            {route === 'deploy' && <DeployPage sites={sites} />}
            {route === 'domain' && <DomainPage sites={sites} />}
            {route === 'versions' && <VersionPage />}
            {route === 'canvas' && <CanvasPage />}
            {route === 'settings' && <SettingsPage user={user} />}
          </div>
        </main>
      </div>

      <CreateSiteModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={createSite} />
      <CommandPalette open={cmdkOpen} onClose={() => setCmdkOpen(false)} onNavigate={handleNavigate} onCreate={() => { setCmdkOpen(false); setCreateOpen(true) }} onOpenAI={() => { setCmdkOpen(false); setRoute('ai') }} sites={sites} />
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <Toaster toasts={toasts} />
    </>
  )
}
