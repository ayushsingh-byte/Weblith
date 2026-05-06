import { useState, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabase'
import { fetchSites, createSite, updateSite, publishSite, saveVersion } from './lib/db'
import { TEMPLATES } from './data/seeds'

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

function LoadingScreen() {
  return (
    <div style={{ height: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div className="brand-mark" style={{ width: 44, height: 44, fontSize: 20, borderRadius: 12 }}>W</div>
        <span className="spinner" style={{ width: 18, height: 18 }} />
      </div>
    </div>
  )
}

export default function App() {
  const [session, setSession]         = useState(null)
  const [loading, setLoading]         = useState(true)
  const [sitesLoading, setSitesLoading] = useState(false)
  const [sites, setSites]             = useState([])
  const [route, setRoute]             = useState('dashboard')
  const [editingSiteId, setEditingSiteId] = useState(null)
  const [createOpen, setCreateOpen]   = useState(false)
  const [aiOpen, setAiOpen]           = useState(false)
  const [cmdkOpen, setCmdkOpen]       = useState(false)
  const [notifOpen, setNotifOpen]     = useState(false)
  const [toasts, setToasts]           = useState([])

  // ── Auth ──────────────────────────────────────────────────────────────────
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

  // ── Load sites from Supabase when session is ready ────────────────────────
  const loadSites = useCallback(async () => {
    if (!session) return
    setSitesLoading(true)
    try {
      const data = await fetchSites()
      setSites(data)
    } catch (err) {
      addToast(`Failed to load sites: ${err.message}`)
    } finally {
      setSitesLoading(false)
    }
  }, [session])

  useEffect(() => { loadSites() }, [loadSites])

  // ── ⌘K shortcut ──────────────────────────────────────────────────────────
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

  // ── Toasts ────────────────────────────────────────────────────────────────
  const addToast = (msg) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, msg }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2600)
  }

  // ── Site CRUD ─────────────────────────────────────────────────────────────
  const handleCreateSite = async ({ name, slug, template }) => {
    const tpl = TEMPLATES.find(t => t.id === template)
    const newSite = {
      name, slug, template,
      status: 'draft',
      visitors: 0,
      domain: `${slug}.weblith.site`,
      favicon: name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase() || 'NS',
      color: tpl?.swatch || 'oklch(0.92 0.04 80)',
      content: {
        title: name,
        tagline: tpl?.desc || 'A new site',
        sections: [
          { id: 'hero-1', type: 'hero', heading: `Welcome to ${name}`, sub: tpl?.desc || 'Start editing this site.', cta: 'Get started' },
        ],
      },
    }
    // Throws on error — CreateSiteModal catches it and shows inline error
    const saved = await createSite(newSite, session.user.id)
    setSites(s => [saved, ...s])
    setEditingSiteId(saved.id)
    setRoute('editor')
    addToast(`Created "${name}"`)
  }

  const handleUpdateSite = async (next) => {
    // Optimistic local update first
    setSites(list => list.map(s => s.id === next.id ? { ...next, edited: 'just now' } : s))
    try {
      const saved = await updateSite(next, session.user.id)
      setSites(list => list.map(s => s.id === saved.id ? saved : s))
    } catch (err) {
      addToast(`Save failed: ${err.message}`)
      loadSites() // revert on error
    }
  }

  const handlePublishSite = async () => {
    if (!editingSiteId) return
    // Auto-save a version before publishing
    const site = sites.find(s => s.id === editingSiteId)
    if (site) {
      try {
        await saveVersion(site, session.user.id, 'Before publish')
      } catch {} // non-fatal
    }
    try {
      const saved = await publishSite(editingSiteId, session.user.id)
      setSites(list => list.map(s => s.id === saved.id ? saved : s))
      addToast('Site published!')
    } catch (err) {
      addToast(`Publish failed: ${err.message}`)
    }
  }

  const handleNavigate = (target) => {
    if (target.startsWith('open:')) {
      setEditingSiteId(target.slice(5))
      setRoute('editor')
    } else {
      setRoute(target)
    }
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const user = session ? {
    id:       session.user.id,
    name:     session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'You',
    email:    session.user.email,
    initials: (session.user.user_metadata?.name || session.user.email || 'U')
      .split(/[\s@]/).filter(Boolean).map(s => s[0]).join('').slice(0, 2).toUpperCase(),
  } : null

  const editingSite = sites.find(s => s.id === editingSiteId)

  const routeLabel = {
    dashboard: ['Workspace', 'Dashboard'],
    sites:     ['Workspace', 'Sites'],
    analytics: ['Workspace', 'Analytics'],
    templates: ['Workspace', 'Templates'],
    ai:        ['Workspace', 'AI generator'],
    media:     ['Workspace', 'Media'],
    deploy:    ['Site', 'Deploy'],
    domain:    ['Site', 'Domain'],
    versions:  ['Site', 'Version history'],
    canvas:    ['Site', 'Canvas'],
    settings:  ['Workspace', 'Settings'],
  }

  if (loading) return <LoadingScreen />
  if (!session) return <AuthPage />

  // ── Editor route ─────────────────────────────────────────────────────────
  if (route === 'editor' && editingSite) {
    return (
      <>
        <div className="app-shell">
          <Sidebar route="sites" go={(r) => { setRoute(r); setEditingSiteId(null) }} sites={sites} user={user} />
          <main className="main" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <EditorPage
              site={editingSite}
              onUpdate={handleUpdateSite}
              onBack={() => { setEditingSiteId(null); setRoute('sites') }}
              onPublish={handlePublishSite}
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
            handleUpdateSite(next)
          }}
          addToast={addToast}
        />
        <CommandPalette open={cmdkOpen} onClose={() => setCmdkOpen(false)} onNavigate={handleNavigate} onCreate={() => { setCmdkOpen(false); setCreateOpen(true) }} onOpenAI={() => { setCmdkOpen(false); setAiOpen(true) }} sites={sites} />
        <Toaster toasts={toasts} />
      </>
    )
  }

  // ── Main shell ───────────────────────────────────────────────────────────
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
                sites={sites} user={user} sitesLoading={sitesLoading}
                onOpen={(id) => { setEditingSiteId(id); setRoute('editor') }}
                onCreate={() => setCreateOpen(true)}
                onNavigate={setRoute}
                onOpenAI={() => setRoute('ai')}
              />
            )}
            {route === 'sites' && (
              <SitesPage
                sites={sites} sitesLoading={sitesLoading}
                onOpen={(id) => { setEditingSiteId(id); setRoute('editor') }}
                onCreate={() => setCreateOpen(true)}
              />
            )}
            {route === 'analytics' && <AnalyticsPage sites={sites} userId={user?.id} />}
            {route === 'templates' && <TemplatesPage onUse={() => setCreateOpen(true)} />}
            {route === 'ai'        && <AIPage />}
            {route === 'media'     && <MediaPage userId={user?.id} />}
            {route === 'deploy'    && <DeployPage sites={sites} />}
            {route === 'domain'    && <DomainPage sites={sites} />}
            {route === 'versions'  && <VersionPage site={editingSite ?? sites[0]} userId={user?.id} />}
            {route === 'canvas'    && <CanvasPage />}
            {route === 'settings'  && <SettingsPage user={user} />}
          </div>
        </main>
      </div>

      <CreateSiteModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreateSite} />
      <CommandPalette open={cmdkOpen} onClose={() => setCmdkOpen(false)} onNavigate={handleNavigate} onCreate={() => { setCmdkOpen(false); setCreateOpen(true) }} onOpenAI={() => { setCmdkOpen(false); setRoute('ai') }} sites={sites} />
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <Toaster toasts={toasts} />
    </>
  )
}
