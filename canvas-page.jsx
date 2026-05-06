/* global React, Icons */
const { useState } = React;

const PALETTE = [
  { cat: 'Layout', items: [
    { id: 'hero', name: 'Hero', desc: 'Headline + CTA', icon: 'H' },
    { id: 'split', name: 'Split section', desc: 'Image + text', icon: '◫' },
    { id: 'columns', name: 'Three columns', desc: 'Equal cards', icon: '⫶⫶' },
    { id: 'cta', name: 'CTA banner', desc: 'Bold callout', icon: '◉' },
  ]},
  { cat: 'Content', items: [
    { id: 'heading', name: 'Heading', desc: 'H1–H6', icon: 'Aa' },
    { id: 'text', name: 'Paragraph', desc: 'Rich text', icon: '¶' },
    { id: 'image', name: 'Image', desc: 'Single image', icon: '◰' },
    { id: 'gallery', name: 'Gallery', desc: 'Image grid', icon: '⊞' },
    { id: 'video', name: 'Video', desc: 'Embedded video', icon: '▶' },
    { id: 'quote', name: 'Quote', desc: 'Pull quote', icon: '"' },
  ]},
  { cat: 'Forms', items: [
    { id: 'newsletter', name: 'Newsletter', desc: 'Email capture', icon: '✉' },
    { id: 'contact', name: 'Contact form', desc: 'Multi-field', icon: '☎' },
    { id: 'button', name: 'Button', desc: 'Standalone CTA', icon: '⬢' },
  ]},
  { cat: 'Social', items: [
    { id: 'testimonial', name: 'Testimonials', desc: 'Customer quotes', icon: '★' },
    { id: 'logos', name: 'Logo cloud', desc: 'Brand strip', icon: '⬡' },
    { id: 'stats', name: 'Stats row', desc: 'Numbers + labels', icon: '#' },
  ]},
];

function CanvasPage() {
  const [blocks, setBlocks] = useState([
    { id: 'b1', type: 'hero', data: { eyebrow: 'STUDIO HALCYON', h1: 'Quietly ambitious work for brands that mean it.', sub: 'A small design studio in Brooklyn making identities, sites, and product UI.', cta: 'See recent work' }},
    { id: 'b2', type: 'logos', data: {} },
    { id: 'b3', type: 'split', data: { eyebrow: 'APPROACH', h2: 'We make fewer things, slowly.', body: 'Every project starts with a long conversation. We move at the pace of clarity.' }},
    { id: 'b4', type: 'stats', data: {} },
    { id: 'b5', type: 'testimonial', data: {} },
    { id: 'b6', type: 'cta', data: { h2: 'Have something to make?', sub: 'We take on a handful of projects each season.', cta: 'Start a conversation' } },
  ]);
  const [selected, setSelected] = useState('b1');
  const [device, setDevice] = useState('desktop');
  const [drag, setDrag] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const [search, setSearch] = useState('');

  const sel = blocks.find(b => b.id === selected);

  const onDragStartPalette = (item) => setDrag({ kind: 'new', item });
  const onDragStartBlock = (idx) => setDrag({ kind: 'move', idx });

  const onDropAt = (idx) => {
    if (!drag) return;
    if (drag.kind === 'new') {
      const newBlock = { id: 'b' + Date.now(), type: drag.item.id, data: {} };
      const next = [...blocks];
      next.splice(idx, 0, newBlock);
      setBlocks(next);
      setSelected(newBlock.id);
    } else if (drag.kind === 'move') {
      const next = [...blocks];
      const [moved] = next.splice(drag.idx, 1);
      const insertAt = drag.idx < idx ? idx - 1 : idx;
      next.splice(insertAt, 0, moved);
      setBlocks(next);
    }
    setDrag(null);
    setOverIdx(null);
  };

  const removeBlock = (id) => setBlocks(b => b.filter(x => x.id !== id));
  const duplicateBlock = (id) => {
    const idx = blocks.findIndex(b => b.id === id);
    const copy = { ...blocks[idx], id: 'b' + Date.now() };
    const next = [...blocks];
    next.splice(idx + 1, 0, copy);
    setBlocks(next);
  };

  const updateData = (key, value) => {
    setBlocks(b => b.map(x => x.id === selected ? { ...x, data: { ...x.data, [key]: value }} : x));
  };

  const filtered = PALETTE.map(c => ({
    ...c,
    items: c.items.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()))
  })).filter(c => c.items.length);

  const widths = { desktop: '100%', tablet: 768, mobile: 375 };

  return (
    <div className="builder-shell fade-in">
      {/* Palette */}
      <aside className="builder-palette">
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Add blocks</div>
          <div style={{ position: 'relative' }}>
            <Icons.search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }} />
            <input className="input" placeholder="Search blocks…" value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft: 28, height: 30, fontSize: 12 }} />
          </div>
        </div>
        <div style={{ padding: 12, overflowY: 'auto', flex: 1 }}>
          {filtered.map(c => (
            <div key={c.cat} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, paddingLeft: 4 }}>{c.cat}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {c.items.map(it => (
                  <div key={it.id} className="block-card" draggable onDragStart={() => onDragStartPalette(it)} onDragEnd={() => setDrag(null)}>
                    <div className="block-thumb" style={{ display: 'grid', placeItems: 'center', fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--ink-2)' }}>{it.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="block-name">{it.name}</div>
                      <div className="block-desc">{it.desc}</div>
                    </div>
                    <Icons.grip size={11} style={{ color: 'var(--ink-3)' }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Canvas */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {/* Toolbar */}
        <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-elev)' }}>
          <div style={{ fontSize: 12.5, fontWeight: 500 }}>Studio Halcyon · Home</div>
          <span className="chip" style={{ fontSize: 10.5 }}><span className="live-dot" /> autosaved</span>
          <div className="seg" style={{ marginLeft: 'auto' }}>
            <button className={device==='desktop'?'active':''} onClick={()=>setDevice('desktop')} title="Desktop"><Icons.monitor size={12}/></button>
            <button className={device==='tablet'?'active':''} onClick={()=>setDevice('tablet')} title="Tablet"><Icons.tablet size={12}/></button>
            <button className={device==='mobile'?'active':''} onClick={()=>setDevice('mobile')} title="Mobile"><Icons.phone size={12}/></button>
          </div>
          <button className="btn btn-secondary btn-sm press"><Icons.eye size={12}/> Preview</button>
          <button className="btn btn-accent btn-sm press"><Icons.bolt size={12}/> Publish</button>
        </div>

        <div className="builder-canvas">
          <div className="builder-frame" style={{ maxWidth: widths[device], transition: 'max-width .25s var(--ease)' }}>
            {blocks.length === 0 && (
              <div style={{ padding: 80, textAlign: 'center', color: 'var(--ink-3)' }}>
                <Icons.plus size={28} />
                <div style={{ marginTop: 12, fontSize: 13 }}>Drag a block from the left to get started</div>
              </div>
            )}
            <div className="builder-drop-target" onDragOver={(e) => { e.preventDefault(); setOverIdx(0); }} onDrop={() => onDropAt(0)} />
            {blocks.map((b, i) => (
              <React.Fragment key={b.id}>
                <BuilderBlock block={b} selected={selected === b.id} onClick={() => setSelected(b.id)}
                  onDelete={() => removeBlock(b.id)} onDuplicate={() => duplicateBlock(b.id)}
                  onDragStart={() => onDragStartBlock(i)} />
                <div className={`builder-drop-target ${overIdx === i+1 ? 'over' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setOverIdx(i+1); }}
                  onDragLeave={() => setOverIdx(null)}
                  onDrop={() => onDropAt(i+1)} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Inspector */}
      <aside className="builder-inspector">
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="eyebrow">Inspector</div>
          {sel && <span className="chip">{sel.type}</span>}
        </div>
        {!sel ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-3)', fontSize: 12.5 }}>Select a block to edit</div>
        ) : (
          <div style={{ padding: 16, overflowY: 'auto', flex: 1 }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Content</div>
            {sel.type === 'hero' && (
              <>
                <label className="field"><span>Eyebrow</span><input className="input" value={sel.data.eyebrow || ''} onChange={e=>updateData('eyebrow', e.target.value)} /></label>
                <label className="field"><span>Headline</span><textarea className="input" rows="3" value={sel.data.h1 || ''} onChange={e=>updateData('h1', e.target.value)} /></label>
                <label className="field"><span>Subhead</span><textarea className="input" rows="3" value={sel.data.sub || ''} onChange={e=>updateData('sub', e.target.value)} /></label>
                <label className="field"><span>CTA label</span><input className="input" value={sel.data.cta || ''} onChange={e=>updateData('cta', e.target.value)} /></label>
              </>
            )}
            {sel.type === 'split' && (
              <>
                <label className="field"><span>Eyebrow</span><input className="input" value={sel.data.eyebrow || ''} onChange={e=>updateData('eyebrow', e.target.value)} /></label>
                <label className="field"><span>Heading</span><input className="input" value={sel.data.h2 || ''} onChange={e=>updateData('h2', e.target.value)} /></label>
                <label className="field"><span>Body</span><textarea className="input" rows="4" value={sel.data.body || ''} onChange={e=>updateData('body', e.target.value)} /></label>
              </>
            )}
            {sel.type === 'cta' && (
              <>
                <label className="field"><span>Heading</span><input className="input" value={sel.data.h2 || ''} onChange={e=>updateData('h2', e.target.value)} /></label>
                <label className="field"><span>Subhead</span><input className="input" value={sel.data.sub || ''} onChange={e=>updateData('sub', e.target.value)} /></label>
                <label className="field"><span>CTA label</span><input className="input" value={sel.data.cta || ''} onChange={e=>updateData('cta', e.target.value)} /></label>
              </>
            )}
            {!['hero','split','cta'].includes(sel.type) && (
              <p style={{ fontSize: 12, color: 'var(--ink-3)' }}>This block uses defaults from the design system. Edit visuals and spacing below.</p>
            )}

            <div className="eyebrow" style={{ marginTop: 22, marginBottom: 10 }}>Spacing</div>
            <label className="field"><span>Padding top</span><div className="seg"><button className="active">sm</button><button>md</button><button>lg</button><button>xl</button></div></label>
            <label className="field"><span>Padding bottom</span><div className="seg"><button>sm</button><button className="active">md</button><button>lg</button><button>xl</button></div></label>

            <div className="eyebrow" style={{ marginTop: 22, marginBottom: 10 }}>Background</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { c: 'transparent', b: '1px dashed var(--line-strong)' },
                { c: 'var(--bg)' },
                { c: 'var(--bg-sunk)' },
                { c: 'var(--ink)' },
                { c: 'oklch(0.95 0.05 90)' },
                { c: 'oklch(0.85 0.13 30)' },
              ].map((s, i) => (
                <div key={i} className="color-swatch" style={{ background: s.c, border: s.b }} />
              ))}
            </div>

            <div className="eyebrow" style={{ marginTop: 22, marginBottom: 10 }}>Visibility</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 12.5 }}>Hide on mobile</span>
              <div className="switch" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12.5 }}>Animate on scroll</span>
              <div className="switch on" />
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function BuilderBlock({ block, selected, onClick, onDelete, onDuplicate, onDragStart }) {
  return (
    <div className={`builder-block ${selected?'selected':''}`} onClick={onClick}>
      <div className="builder-block-handle" draggable onDragStart={onDragStart}><Icons.grip size={11}/></div>
      <div className="builder-block-tools" onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-icon btn-ghost btn-sm" onClick={onDuplicate} title="Duplicate"><Icons.copy size={12}/></button>
        <button className="btn btn-icon btn-ghost btn-sm" onClick={onDelete} title="Delete" style={{ color: 'var(--err)' }}><Icons.trash size={12}/></button>
        <button className="btn btn-icon btn-ghost btn-sm"><Icons.more size={12}/></button>
      </div>
      <BlockRender block={block} />
    </div>
  );
}

function BlockRender({ block }) {
  const d = block.data;
  switch (block.type) {
    case 'hero':
      return (
        <div style={{ padding: '64px 56px' }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>{d.eyebrow || 'EYEBROW'}</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 44, lineHeight: 1.05, letterSpacing: '-0.025em', maxWidth: 720, marginBottom: 16 }}>{d.h1 || 'Your headline goes here.'}</h1>
          <p style={{ fontSize: 15, color: 'var(--ink-2)', maxWidth: 540, lineHeight: 1.55, marginBottom: 22 }}>{d.sub || 'A short subhead to give context to the headline above.'}</p>
          <button className="btn btn-primary">{d.cta || 'Click me'} <Icons.arrowRight size={12}/></button>
        </div>
      );
    case 'split':
      return (
        <div style={{ padding: '56px 56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>{d.eyebrow || 'EYEBROW'}</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 12 }}>{d.h2 || 'A bold sub-statement.'}</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>{d.body || 'Supporting body copy.'}</p>
          </div>
          <div style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg, oklch(0.7 0.15 30), oklch(0.55 0.18 0))', borderRadius: 10 }} />
        </div>
      );
    case 'columns':
      return (
        <div style={{ padding: '56px 56px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ padding: 24, background: 'var(--bg-sunk)', borderRadius: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent)', marginBottom: 14 }} />
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>Column {i}</h3>
              <p style={{ fontSize: 13, color: 'var(--ink-2)' }}>Description of feature {i}.</p>
            </div>
          ))}
        </div>
      );
    case 'cta':
      return (
        <div style={{ padding: '64px 56px', textAlign: 'center', background: 'var(--ink)', color: 'var(--bg)', margin: '0' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, letterSpacing: '-0.02em', marginBottom: 12 }}>{d.h2 || 'Big call to action'}</h2>
          <p style={{ fontSize: 14, opacity: 0.7, maxWidth: 520, margin: '0 auto 22px' }}>{d.sub || 'Supporting subhead.'}</p>
          <button className="btn" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>{d.cta || 'Get started'} <Icons.arrowRight size={12}/></button>
        </div>
      );
    case 'testimonial':
      return (
        <div style={{ padding: '56px 56px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {[
            { q: 'They turned a vague brief into a product I am proud to ship.', n: 'Joan Rivera', r: 'Founder, Lumen' },
            { q: 'Best partnership we\'ve had in years. Calm, sharp, fast.', n: 'Theo Park', r: 'Head of Brand, Onset' },
            { q: 'Studio Halcyon obsesses over the things that matter.', n: 'Eli Brooks', r: 'CEO, Kettle' },
          ].map((t, i) => (
            <div key={i} style={{ padding: 22, border: '1px solid var(--line)', borderRadius: 10 }}>
              <div style={{ fontSize: 28, lineHeight: 0.5, color: 'var(--ink-3)' }}>"</div>
              <p style={{ fontSize: 13, lineHeight: 1.6, marginTop: 10, marginBottom: 16 }}>{t.q}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="avatar" style={{ width: 28, height: 28, fontSize: 11, background: ['oklch(0.6 0.17 30)','oklch(0.55 0.18 268)','oklch(0.62 0.13 155)'][i] }}>{t.n.split(' ').map(x=>x[0]).join('')}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{t.n}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{t.r}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    case 'logos':
      return (
        <div style={{ padding: '36px 56px', display: 'flex', gap: 36, alignItems: 'center', justifyContent: 'space-around', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
          {['LUMEN', 'ONSET', 'KETTLE', 'PRELUDE', 'NORTH', 'TIDAL'].map(b => (
            <span key={b} style={{ fontFamily: 'var(--font-serif)', fontSize: 18, letterSpacing: '0.08em', color: 'var(--ink-3)', fontWeight: 500 }}>{b}</span>
          ))}
        </div>
      );
    case 'stats':
      return (
        <div style={{ padding: '56px 56px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, textAlign: 'center' }}>
          {[
            { n: '12', l: 'Years in practice' },
            { n: '84', l: 'Projects shipped' },
            { n: '3', l: 'Designers, no more' },
            { n: '∞', l: 'Coffee consumed' },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 56, lineHeight: 1, letterSpacing: '-0.04em' }}>{s.n}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.l}</div>
            </div>
          ))}
        </div>
      );
    case 'heading':
      return <div style={{ padding: '40px 56px' }}><h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, letterSpacing: '-0.02em' }}>{d.text || 'A bold heading.'}</h2></div>;
    case 'text':
      return <div style={{ padding: '24px 56px', maxWidth: 720 }}><p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-2)' }}>{d.body || 'A paragraph of body copy. Edit me in the inspector.'}</p></div>;
    case 'image':
      return <div style={{ padding: '24px 56px' }}><div style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, oklch(0.7 0.13 200), oklch(0.55 0.16 220))', borderRadius: 10 }} /></div>;
    case 'gallery':
      return <div style={{ padding: '24px 56px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>{[1,2,3,4,5,6].map(i => <div key={i} style={{ aspectRatio: 1, background: `oklch(0.${5+i} 0.15 ${i*60})`, borderRadius: 8 }}/>)}</div>;
    case 'video':
      return <div style={{ padding: '24px 56px' }}><div style={{ aspectRatio: '16/9', background: 'var(--ink)', borderRadius: 10, display: 'grid', placeItems: 'center', color: 'var(--bg)' }}><Icons.play size={36}/></div></div>;
    case 'quote':
      return <div style={{ padding: '56px 56px', textAlign: 'center', maxWidth: 720, margin: '0 auto' }}><p style={{ fontFamily: 'var(--font-serif)', fontSize: 28, lineHeight: 1.3, letterSpacing: '-0.01em', fontStyle: 'italic' }}>"Design is not what it looks like. Design is how it works."</p><div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 14 }}>— Steve Jobs</div></div>;
    case 'newsletter':
      return <div style={{ padding: '48px 56px', textAlign: 'center', background: 'var(--bg-sunk)' }}><h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, marginBottom: 6 }}>Quarterly dispatch</h3><p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 18 }}>Notes from the studio. No more than four per year.</p><div style={{ display: 'flex', gap: 8, maxWidth: 360, margin: '0 auto' }}><input className="input" placeholder="you@example.com" style={{ flex: 1 }}/><button className="btn btn-primary">Subscribe</button></div></div>;
    case 'contact':
      return <div style={{ padding: '48px 56px', maxWidth: 560, margin: '0 auto' }}><h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, marginBottom: 18 }}>Get in touch</h3><div style={{ display: 'grid', gap: 12 }}><input className="input" placeholder="Your name"/><input className="input" placeholder="Email"/><textarea className="input" rows="4" placeholder="What's on your mind?"/><button className="btn btn-primary">Send message</button></div></div>;
    case 'button':
      return <div style={{ padding: '32px 56px', textAlign: 'center' }}><button className="btn btn-primary">Click me <Icons.arrowRight size={12}/></button></div>;
    default:
      return <div style={{ padding: '40px 56px', color: 'var(--ink-3)', textAlign: 'center', fontSize: 13 }}>{block.type}</div>;
  }
}

window.CanvasPage = CanvasPage;
