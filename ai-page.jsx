/* global React, Icons */
const { useState, useRef, useEffect } = React;

const PROMPT_LIB = [
  { cat: 'Pages', items: ['Modern landing page for a SaaS product', 'Studio portfolio with bold typography', 'Restaurant homepage with menu', 'Personal blog with reading time'] },
  { cat: 'Sections', items: ['Hero with email capture', 'Pricing table (3 tiers)', 'Testimonial wall', 'FAQ accordion'] },
  { cat: 'Copy', items: ['Punchy hero headline', 'Feature description (1 sentence)', 'About us — first person', 'CTA button copy variants'] },
  { cat: 'Visuals', items: ['Abstract gradient hero', 'Editorial product shot', 'Brand color palette from mood', 'Photo-realistic mockup'] },
];

function AIPage() {
  const [thread, setThread] = useState([
    { role: 'assistant', t: '11:42', body: 'I can draft pages, sections, copy, and images. What are we building?' },
  ]);
  const [input, setInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [tab, setTab] = useState('compose');
  const [tone, setTone] = useState('confident');
  const [history, setHistory] = useState([
    { id: 1, q: 'Hero for studio portfolio', when: '2m ago', tokens: 312 },
    { id: 2, q: 'Pricing copy — friendlier tone', when: '14m ago', tokens: 198 },
    { id: 3, q: '4 testimonial blurbs', when: '1h ago', tokens: 264 },
    { id: 4, q: 'About page outline', when: 'yesterday', tokens: 802 },
  ]);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 9e9, behavior: 'smooth' }); }, [thread, generating]);

  const send = (text) => {
    const q = (text || input).trim();
    if (!q) return;
    setInput('');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setThread(t => [...t, { role: 'user', t: time, body: q }]);
    setGenerating(true);
    setTimeout(() => {
      setThread(t => [...t, {
        role: 'assistant', t: time, gen: true,
        title: 'Hero section — draft',
        meta: ['html', 'tone: ' + tone, '312 tokens', '1.4s'],
        preview: {
          eyebrow: 'STUDIO HALCYON',
          h1: 'Quietly ambitious work for brands that mean it.',
          sub: 'A small design studio in Brooklyn making identities, sites, and product UI for the next decade.',
          cta: 'See recent work',
        },
        body: "Here's a hero section using a confident editorial tone. It pairs a quiet eyebrow with a long, opinionated headline and a calm CTA — let me know if you want it bolder or shorter."
      }]);
      setGenerating(false);
      setHistory(h => [{ id: Date.now(), q: q.slice(0, 48), when: 'just now', tokens: 312 }, ...h]);
    }, 1300);
  };

  return (
    <div className="page fade-in" style={{ padding: 0, maxWidth: 'none', height: 'calc(100vh - 56px)', display: 'grid', gridTemplateColumns: '260px 1fr 320px', overflow: 'hidden' }}>
      {/* Left: history + library */}
      <aside style={{ borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: 16, borderBottom: '1px solid var(--line)' }}>
          <button className="btn btn-primary press" style={{ width: '100%' }} onClick={() => setThread([{ role: 'assistant', t: '', body: 'Fresh canvas. What are we making?' }])}>
            <Icons.plus size={13}/> New chat
          </button>
        </div>
        <div style={{ padding: 12, flex: 1, overflowY: 'auto' }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Recent</div>
          {history.map(h => (
            <div key={h.id} className="folder-item">
              <Icons.message size={13} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.q}</div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-3)' }} className="mono">{h.when} · {h.tokens}t</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--line)', fontSize: 11, color: 'var(--ink-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span>Monthly tokens</span><span className="mono">12.4k / 50k</span></div>
          <div className="progress"><div style={{ width: '24.8%', background: 'var(--accent)' }} /></div>
        </div>
      </aside>

      {/* Center: chat */}
      <main className="ai-chat">
        <div style={{ padding: '12px 32px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Weblith AI</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Drafts pages, sections, copy & visuals from natural language</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div className="seg">
              {['compose','rewrite','image'].map(m => <button key={m} className={tab===m?'active':''} onClick={()=>setTab(m)} style={{ textTransform: 'capitalize' }}>{m}</button>)}
            </div>
          </div>
        </div>

        <div className="ai-messages" ref={scrollRef}>
          {thread.map((m, i) => (
            <div key={i} className={`ai-msg ${m.role}`}>
              <div className="ai-msg-avatar">{m.role === 'user' ? 'A' : <Icons.sparkle size={13}/>}</div>
              <div className="ai-msg-body">
                <div className="ai-msg-meta">{m.role === 'user' ? 'You' : 'Weblith AI'} · {m.t}</div>
                {m.gen ? (
                  <div className="ai-bubble gen">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <strong style={{ fontSize: 13.5 }}>{m.title}</strong>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-icon btn-ghost btn-sm" title="Copy"><Icons.copy size={12}/></button>
                        <button className="btn btn-icon btn-ghost btn-sm" title="Regenerate"><Icons.refresh size={12}/></button>
                      </div>
                    </div>
                    {/* Mini preview */}
                    <div style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 8, padding: 24, marginBottom: 12 }}>
                      <div className="eyebrow" style={{ marginBottom: 10 }}>{m.preview.eyebrow}</div>
                      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 10 }}>{m.preview.h1}</h2>
                      <p style={{ fontSize: 13, color: 'var(--ink-2)', maxWidth: 480, lineHeight: 1.55, marginBottom: 14 }}>{m.preview.sub}</p>
                      <button className="btn btn-primary btn-sm">{m.preview.cta} <Icons.arrowRight size={11}/></button>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.55, margin: 0 }}>{m.body}</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)', flexWrap: 'wrap' }}>
                      <button className="btn btn-accent btn-sm press"><Icons.check size={12}/> Insert into page</button>
                      <button className="btn btn-secondary btn-sm press"><Icons.refresh size={12}/> Try again</button>
                      <button className="btn btn-ghost btn-sm">Make bolder</button>
                      <button className="btn btn-ghost btn-sm">Shorter</button>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, fontSize: 10.5, color: 'var(--ink-3)', alignItems: 'center' }} className="mono">
                        {m.meta.map((x, j) => <span key={j}>{x}</span>)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="ai-msg-content">{m.body}</div>
                )}
              </div>
            </div>
          ))}
          {generating && (
            <div className="ai-msg assistant">
              <div className="ai-msg-avatar"><Icons.sparkle size={13}/></div>
              <div className="ai-msg-body">
                <div className="ai-msg-meta">Weblith AI · thinking</div>
                <div className="ai-bubble" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="spinner" />
                  <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>Drafting your hero section…</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="ai-composer">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            <span className="chip"><Icons.attach size={11}/> Attach context</span>
            <span className="chip">Tone: <select value={tone} onChange={e=>setTone(e.target.value)} style={{ background: 'transparent', border: 'none', font: 'inherit', color: 'inherit', cursor: 'pointer' }}>
              <option>confident</option><option>warm</option><option>playful</option><option>technical</option>
            </select></span>
            <span className="chip">Page: Home</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              className="input"
              placeholder="Describe what you want — a section, a page, copy variants…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send(); }}
              rows={2}
              style={{ resize: 'none', minHeight: 48, padding: 12, lineHeight: 1.5 }}
            />
            <button className="btn btn-accent press" onClick={() => send()} disabled={!input.trim() || generating} style={{ height: 48, paddingInline: 16 }}>
              <Icons.sparkle size={14}/> Generate
            </button>
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
            <span>⌘ + Enter to send</span>
            <span className="mono">{input.length} / 2000</span>
          </div>
        </div>
      </main>

      {/* Right: prompt library */}
      <aside style={{ borderLeft: '1px solid var(--line)', overflowY: 'auto', padding: 18 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Prompt library</div>
        {PROMPT_LIB.map(c => (
          <div key={c.cat} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{c.cat}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {c.items.map(p => (
                <button key={p} onClick={()=>send(p)} className="press" style={{
                  textAlign: 'left', padding: '10px 12px', background: 'var(--bg-elev)', border: '1px solid var(--line)',
                  borderRadius: 8, cursor: 'pointer', fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.4,
                  transition: 'all .15s'
                }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent-ink)'; e.currentTarget.style.background = 'var(--accent-soft)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--ink-2)'; e.currentTarget.style.background = 'var(--bg-elev)'; }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}

window.AIPage = AIPage;
