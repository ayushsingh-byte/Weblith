/* global React, Icons */
const { useState, useEffect, useRef, useMemo } = React;

// ---------- Mock data ----------
const MOCK_USER = {
  name: "Alex Chen",
  email: "alex@studio.dev",
  initials: "AC",
  plan: "Pro",
};

const TEMPLATES = [
  { id: "blank", name: "Blank", category: "Starter", desc: "Empty canvas — bring your own structure.", swatch: "var(--bg-sunk)" },
  { id: "portfolio", name: "Folio", category: "Portfolio", desc: "Editorial portfolio with project grid.", swatch: "oklch(0.92 0.04 80)" },
  { id: "studio", name: "Studio", category: "Agency", desc: "Bold studio site with case studies.", swatch: "oklch(0.22 0.01 80)", dark: true },
  { id: "saas", name: "Apex", category: "SaaS", desc: "Product landing with pricing & FAQ.", swatch: "oklch(0.94 0.04 240)" },
  { id: "blog", name: "Journal", category: "Blog", desc: "Long-form reading layout.", swatch: "oklch(0.96 0.02 70)" },
  { id: "shop", name: "Counter", category: "Commerce", desc: "Single-product shop with checkout.", swatch: "oklch(0.93 0.05 30)" },
  { id: "event", name: "Convene", category: "Event", desc: "Conference site with schedule & speakers.", swatch: "oklch(0.91 0.06 145)" },
  { id: "docs", name: "Atlas", category: "Documentation", desc: "Sidebar-driven docs with search.", swatch: "oklch(0.94 0.02 220)" },
];

const SEED_SITES = [
  {
    id: "s1",
    name: "Personal portfolio",
    slug: "alex-chen",
    template: "portfolio",
    status: "published",
    visitors: 1284,
    edited: "2 hours ago",
    domain: "alex-chen.forge.site",
    favicon: "AC",
    color: "oklch(0.92 0.04 80)",
    content: {
      title: "Alex Chen",
      tagline: "Independent designer & developer working at the intersection of brand and product.",
      sections: [
        { id: "hero", type: "hero", heading: "Designing calm interfaces for ambitious teams.", sub: "Currently freelance — accepting projects for Q3 2026.", cta: "View work" },
        { id: "work", type: "grid", heading: "Selected work", items: [
          { title: "Halcyon — fintech rebrand", meta: "Brand identity · 2025" },
          { title: "Meridian — health platform", meta: "Product design · 2025" },
          { title: "Folio — design tooling", meta: "Web app · 2024" },
        ]},
        { id: "about", type: "text", heading: "About", body: "I help founders and product teams ship interfaces that feel inevitable. Previously: design lead at Vector, principal at North." },
      ],
    },
  },
  {
    id: "s2",
    name: "Halcyon launch",
    slug: "halcyon",
    template: "saas",
    status: "draft",
    visitors: 0,
    edited: "yesterday",
    domain: "halcyon.forge.site",
    favicon: "HL",
    color: "oklch(0.94 0.04 240)",
    content: {
      title: "Halcyon",
      tagline: "Treasury operations for modern teams.",
      sections: [
        { id: "hero", type: "hero", heading: "Treasury that thinks ahead.", sub: "Plan, move, and reconcile cash across every account — automatically.", cta: "Request access" },
      ],
    },
  },
  {
    id: "s3",
    name: "Field notes",
    slug: "field-notes",
    template: "blog",
    status: "published",
    visitors: 412,
    edited: "3 days ago",
    domain: "field-notes.forge.site",
    favicon: "FN",
    color: "oklch(0.96 0.02 70)",
    content: {
      title: "Field notes",
      tagline: "Writing on craft, design, and small software.",
      sections: [
        { id: "hero", type: "hero", heading: "Field notes", sub: "Slow writing on craft, design, and small software." },
      ],
    },
  },
];

const ACTIVITY = [
  { who: "You", what: "edited the hero section", on: "Personal portfolio", when: "2h ago" },
  { who: "You", what: "generated content with AI", on: "Halcyon launch", when: "yesterday" },
  { who: "You", what: "published", on: "Personal portfolio", when: "2 days ago" },
  { who: "You", what: "created site", on: "Field notes", when: "3 days ago" },
  { who: "System", what: "auto-saved a version", on: "Personal portfolio", when: "5 days ago" },
];

window.MOCK_USER = MOCK_USER;
window.TEMPLATES = TEMPLATES;
window.SEED_SITES = SEED_SITES;
window.ACTIVITY = ACTIVITY;
