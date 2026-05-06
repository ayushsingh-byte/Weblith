
const { useState, useEffect } = React;

function App() {
  const [authed, setAuthed] = useState(() => {
    try { return localStorage.getItem('weblith-authed') === '1'; } catch { return false; }
  });
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('weblith-user');
      return saved ? JSON.parse(saved) : MOCK_USER;
    } catch { return MOCK_USER; }
  });
  const [sites, setSites] = useState(SEED_SITES);
  const [route, setRoute] = useState('dashboard');
  const [editingSiteId, setEditingSiteId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // ⌘K listener
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdkOpen(o => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const addToast = (msg) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2600);
  };

  const handleAuth = ({ email, name }) => {
    const u = { ...MOCK_USER, name: name || MOCK_USER.name, email, initials: (name || MOCK_USER.name).split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase() };
    setUser(u);
    setAuthed(true);
    setRoute('dashboard');
    try { localStorage.setItem('weblith-authed', '1'); localStorage.setItem('weblith-user', JSON.stringify(u)); } catch {}
  };

  const handleSignOut = () => {
    setAuthed(false);
    try { localStorage.removeItem('weblith-authed'); localStorage.removeItem('weblith-user'); } catch {}
  };

  const createSite = ({ name, slug, template }) => {
    const tpl = TEMPLATES.find(t => t.id === template);
    const id = `s${Date.now()}`;
    const newSite = {
      id, name, slug, template,
      status: 'draft', visitors: 0, edited: 'just now',
      domain: `${slug}.weblith.site`,
      favicon: name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase() || 'NS',
      color: tpl?.swatch || 'oklch(0.92 0.04 80)',
      content: {
        title: name,
        tagline: tpl?.desc || "A new site",
        sections: [
          { id: 'hero', type: 'hero', heading: `Welcome to ${name}`, sub: tpl?.desc || "Start editing this site to make it your own.", cta: "Get started" },
        ],
      },
    };
    setSites(s => [newSite, ...s]);
    setCreateOpen(false);
    setEditingSiteId(id);
    setRoute('editor');
    addToast(`Created "${name}"`);
  };

  const updateSite = (next) => {
    setSites(list => list.map(s => s.id === next.id ? { ...next, edited: 'just now' } : s));
  };

  const publishSite = () => {
    if (!editingSiteId) return;
    setSites(list => list.map(s => s.id === editingSiteId ? { ...s, status: 'published' } : s));
    addToast("Site published 🎉");
  };

  const handleNavigate = (target) => {
    if (target.startsWith('open:')) {
      const id = target.slice(5);
      setEditingSiteId(id);
      setRoute('editor');
    } else {
      setRoute(target);
    }
  };

  const editingSite = sites.find(s => s.id === editingSiteId);

  const routeLabel = {
    dashboard: ['Workspace', 'Dashboard'],
    sites: ['Workspace', 'Sites'],
    analytics: ['Workspace', 'Analytics'],
    templates: ['Workspace', 'Templates'],
    ai: ['Workspace', 'AI generator'],
    media: ['Workspace', 'Media'],
    deploy: ['Site', 'Deploy'],
    domain: ['Site', 'Domain'],
    versions: [editingSite?.name || 'Site', 'Version history'],
    settings: ['Workspace', 'Settings'],
  };

  if (!authed) {
    return <AuthScreen mode={authMode} onSwitch={() => setAuthMode(m => m === 'login' ? 'register' : 'login')} onAuth={handleAuth} />;
  }

  if (route === 'editor' && editingSite) {
    return (
      <>
        <div className="app-shell">
          <Sidebar route={'sites'} go={(r) => { setRoute(r); setEditingSiteId(null); }} sites={sites} onSignOut={handleSignOut} />
          <main className="main">
            <Editor
              site={editingSite}
              onUpdate={updateSite}
              onBack={() => { setEditingSiteId(null); setRoute('sites'); }}
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
            const next = JSON.parse(JSON.stringify(editingSite));
            const hero = next.content.sections.find(s => s.type === 'hero');
            if (hero) { hero.heading = r.heading; hero.sub = r.sub; hero.cta = r.cta || hero.cta; }
            updateSite(next);
          }}
          addToast={addToast}
        />
        <CommandPalette open={cmdkOpen} onClose={() => setCmdkOpen(false)} onNavigate={handleNavigate} onCreate={() => { setCmdkOpen(false); setCreateOpen(true); }} onOpenAI={() => { setCmdkOpen(false); setAiOpen(true); }} sites={sites} />
        <Toaster toasts={toasts} />
      </>
    );
  }

  return (
    <>
      <div className="app-shell">
        <Sidebar route={route} go={setRoute} sites={sites} onSignOut={handleSignOut} />
        <main className="main">
          <Topbar
            crumbs={routeLabel[route] || ['Workspace']}
            search={true}
            onOpenCmdK={() => setCmdkOpen(true)}
            onOpenNotifs={() => setNotifOpen(o => !o)}
            actions={
              <button className="btn btn-primary btn-sm press" onClick={() => setCreateOpen(true)}>
                <Icons.plus size={13} /> New site
              </button>
            }
          />
          <div className="main-scroll">
          {route === 'dashboard' && <Dashboard sites={sites} user={user} onOpen={(id) => { setEditingSiteId(id); setRoute('editor'); }} onCreate={() => setCreateOpen(true)} onNavigate={setRoute} onOpenAI={() => setRoute('ai')} />}
          {route === 'sites' && <SitesPage sites={sites} onOpen={(id) => { setEditingSiteId(id); setRoute('editor'); }} onCreate={() => setCreateOpen(true)} />}
          {route === 'analytics' && <AnalyticsPage sites={sites} />}
          {route === 'templates' && <TemplatesPage onUse={() => setCreateOpen(true)} />}
          {route === 'ai' && <AIPage onUseInEditor={() => { setEditingSiteId(sites[0]?.id); setRoute('editor'); }} />}
          {route === 'media' && <MediaPage />}
          {route === 'deploy' && <DeployPage sites={sites} />}
          {route === 'domain' && <DomainPage sites={sites} />}
          {route === 'versions' && <VersionPage site={sites[0]} />}
          {route === 'canvas' && <CanvasPage />}
          {route === 'settings' && <SettingsPage user={user} />}
          </div>
        </main>
      </div>

      <CreateSiteModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={createSite} />
      <CommandPalette open={cmdkOpen} onClose={() => setCmdkOpen(false)} onNavigate={handleNavigate} onCreate={() => { setCmdkOpen(false); setCreateOpen(true); }} onOpenAI={() => { setCmdkOpen(false); setRoute('ai'); }} sites={sites} />
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <Toaster toasts={toasts} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
