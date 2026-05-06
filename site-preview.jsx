/* global React, Icons */
const { useState, useMemo } = React;

// Live preview of a site, given content
function SitePreview({ site, viewport = 'desktop' }) {
  const c = site.content;
  return (
    <div style={{ width: '100%', minHeight: '100%', background: 'white', color: 'oklch(0.18 0.008 80)', fontFamily: 'var(--font-sans)' }}>
      {/* Site header */}
      <header style={{ padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid oklch(0.91 0.006 80)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: site.color, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>{site.favicon}</div>
          <strong style={{ fontWeight: 600, letterSpacing: '-0.02em' }}>{c.title}</strong>
        </div>
        <nav style={{ display: 'flex', gap: 24, fontSize: 13, color: 'oklch(0.42 0.008 80)' }}>
          <span>Work</span><span>About</span><span>Journal</span><span>Contact</span>
        </nav>
      </header>

      {c.sections.map((s, i) => <PreviewSection key={s.id} section={s} idx={i} site={site} />)}

      <footer style={{ padding: '32px 48px', borderTop: '1px solid oklch(0.91 0.006 80)', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'oklch(0.62 0.008 80)' }}>
        <span>© 2026 {c.title}</span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>built with weblith</span>
      </footer>
    </div>
  );
}

function PreviewSection({ section, idx, site }) {
  if (section.type === 'hero') return (
    <section style={{ padding: '96px 48px 72px', maxWidth: 980, margin: '0 auto' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(0.62 0.008 80)', marginBottom: 18 }}>— 01 / Hero</div>
      <h1 style={{ fontSize: 56, lineHeight: 1.05, letterSpacing: '-0.035em', fontWeight: 600, marginBottom: 18, textWrap: 'balance' }}>{section.heading || 'Untitled heading'}</h1>
      <p style={{ fontSize: 19, color: 'oklch(0.42 0.008 80)', lineHeight: 1.5, maxWidth: 620, textWrap: 'pretty' }}>{section.sub}</p>
      {section.cta && (
        <div style={{ marginTop: 32, display: 'flex', gap: 8 }}>
          <button style={{ padding: '12px 18px', borderRadius: 8, background: 'oklch(0.18 0.008 80)', color: 'white', border: 'none', fontWeight: 500, fontSize: 14 }}>{section.cta} →</button>
          <button style={{ padding: '12px 18px', borderRadius: 8, background: 'transparent', color: 'oklch(0.18 0.008 80)', border: '1px solid oklch(0.84 0.008 80)', fontWeight: 500, fontSize: 14 }}>Learn more</button>
        </div>
      )}
    </section>
  );

  if (section.type === 'grid') return (
    <section style={{ padding: '48px 48px 72px', maxWidth: 980, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em' }}>{section.heading}</h2>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'oklch(0.62 0.008 80)' }}>0{idx + 1}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {(section.items || []).map((it, i) => (
          <div key={i} style={{ borderRadius: 12, overflow: 'hidden', background: 'oklch(0.965 0.005 80)' }}>
            <div style={{ aspectRatio: '4/3', background: `repeating-linear-gradient(135deg, oklch(0.93 0.006 80), oklch(0.93 0.006 80) 8px, oklch(0.95 0.006 80) 8px, oklch(0.95 0.006 80) 16px)`, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'oklch(0.62 0.008 80)' }}>
              project image
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>{it.title}</div>
              <div style={{ fontSize: 12, color: 'oklch(0.62 0.008 80)', fontFamily: 'var(--font-mono)' }}>{it.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  if (section.type === 'text') return (
    <section style={{ padding: '48px 48px 72px', maxWidth: 760, margin: '0 auto' }}>
      <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em', marginBottom: 16 }}>{section.heading}</h2>
      <p style={{ fontSize: 17, lineHeight: 1.65, color: 'oklch(0.32 0.008 80)', textWrap: 'pretty' }}>{section.body}</p>
    </section>
  );

  return null;
}

window.SitePreview = SitePreview;
