/* global React */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ---------- Icons (24x24 stroke, 1.6) ----------
const Ico = ({ d, size = 16, fill = "none", stroke = "currentColor", sw = 1.6, children, className = "", style }) => (
  <svg className={className} style={style} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d ? <path d={d} /> : children}
  </svg>
);

const Icons = {
  home: (p) => <Ico {...p}><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/></Ico>,
  grid: (p) => <Ico {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></Ico>,
  layout: (p) => <Ico {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></Ico>,
  sparkles: (p) => <Ico {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></Ico>,
  image: (p) => <Ico {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></Ico>,
  history: (p) => <Ico {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></Ico>,
  settings: (p) => <Ico {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/></Ico>,
  plus: (p) => <Ico {...p}><path d="M12 5v14M5 12h14"/></Ico>,
  search: (p) => <Ico {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Ico>,
  arrowRight: (p) => <Ico {...p}><path d="M5 12h14M13 5l7 7-7 7"/></Ico>,
  chevronRight: (p) => <Ico {...p}><path d="m9 6 6 6-6 6"/></Ico>,
  chevronDown: (p) => <Ico {...p}><path d="m6 9 6 6 6-6"/></Ico>,
  external: (p) => <Ico {...p}><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></Ico>,
  eye: (p) => <Ico {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></Ico>,
  globe: (p) => <Ico {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></Ico>,
  trash: (p) => <Ico {...p}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></Ico>,
  copy: (p) => <Ico {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></Ico>,
  bell: (p) => <Ico {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></Ico>,
  logout: (p) => <Ico {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></Ico>,
  check: (p) => <Ico {...p}><path d="m5 12 5 5L20 7"/></Ico>,
  x: (p) => <Ico {...p}><path d="M18 6 6 18M6 6l12 12"/></Ico>,
  text: (p) => <Ico {...p}><path d="M4 7V5h16v2M9 19h6M12 5v14"/></Ico>,
  square: (p) => <Ico {...p}><rect x="3" y="3" width="18" height="18" rx="2"/></Ico>,
  layers: (p) => <Ico {...p}><path d="m12 2 10 6-10 6L2 8z"/><path d="m2 14 10 6 10-6"/></Ico>,
  sliders: (p) => <Ico {...p}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></Ico>,
  desktop: (p) => <Ico {...p}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></Ico>,
  tablet: (p) => <Ico {...p}><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M11 18h2"/></Ico>,
  mobile: (p) => <Ico {...p}><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></Ico>,
  arrowLeft: (p) => <Ico {...p}><path d="M19 12H5M12 19l-7-7 7-7"/></Ico>,
  upload: (p) => <Ico {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></Ico>,
  download: (p) => <Ico {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></Ico>,
  more: (p) => <Ico {...p}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></Ico>,
  star: (p) => <Ico {...p}><path d="m12 2 3 7 7 .8-5.2 4.8L18 22l-6-3.6L6 22l1.2-7.4L2 9.8 9 9z"/></Ico>,
  bolt: (p) => <Ico {...p}><path d="M13 2 3 14h8l-1 8 10-12h-8z"/></Ico>,
  globe2: (p) => <Ico {...p}><circle cx="12" cy="12" r="9"/><path d="M12 3c-3 4-3 14 0 18M12 3c3 4 3 14 0 18M3 12h18"/></Ico>,
  lock: (p) => <Ico {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></Ico>,
  send: (p) => <Ico {...p}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></Ico>,
  refresh: (p) => <Ico {...p}><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></Ico>,
  sun: (p) => <Ico {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></Ico>,
  moon: (p) => <Ico {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></Ico>,
  filter: (p) => <Ico {...p}><path d="M3 4h18l-7 9v7l-4-2v-5z"/></Ico>,
  folder: (p) => <Ico {...p}><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></Ico>,
  tag: (p) => <Ico {...p}><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1"/></Ico>,
  users: (p) => <Ico {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Ico>,
  github: (p) => <Ico {...p}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></Ico>,
  slack: (p) => <Ico {...p}><rect x="13" y="2" width="3" height="8" rx="1.5"/><rect x="2" y="13" width="8" height="3" rx="1.5"/><rect x="14" y="14" width="8" height="3" rx="1.5"/><rect x="8" y="14" width="3" height="8" rx="1.5"/></Ico>,
  zap: (p) => <Ico {...p}><path d="M13 2 3 14h8l-1 8 10-12h-8z"/></Ico>,
  grip: (p) => <Ico {...p}><circle cx="9" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="18" r="1"/></Ico>,
  type: (p) => <Ico {...p}><path d="M4 7V5h16v2M9 19h6M12 5v14"/></Ico>,
  link: (p) => <Ico {...p}><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></Ico>,
  code: (p) => <Ico {...p}><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></Ico>,
  play: (p) => <Ico {...p}><path d="m6 4 14 8-14 8z"/></Ico>,
  pause: (p) => <Ico {...p}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></Ico>,
  shield: (p) => <Ico {...p}><path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5z"/></Ico>,
  user: (p) => <Ico {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></Ico>,
  card: (p) => <Ico {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></Ico>,
  key: (p) => <Ico {...p}><circle cx="7" cy="14" r="4"/><path d="m10 11 10-10 3 3-3 3-3-3-3 3-3-3"/></Ico>,
  branch: (p) => <Ico {...p}><circle cx="6" cy="3" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M6 5v8a4 4 0 0 0 4 4h4M18 8v2a3 3 0 0 1-3 3"/></Ico>,
  dot: (p) => <Ico {...p}><circle cx="12" cy="12" r="3" fill="currentColor"/></Ico>,
  pen: (p) => <Ico {...p}><path d="M16 3l5 5L8 21H3v-5z"/></Ico>,
  spark: (p) => <Ico {...p}><path d="M12 2v6M12 16v6M2 12h6M16 12h6"/></Ico>,
  sparkle: (p) => <Ico {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></Ico>,
  warn: (p) => <Ico {...p}><path d="M12 3 2 21h20z"/><path d="M12 9v5M12 18v.5"/></Ico>,
  monitor: (p) => <Ico {...p}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></Ico>,
  phone: (p) => <Ico {...p}><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></Ico>,
  diff: (p) => <Ico {...p}><path d="M12 2v20M5 8l7-6 7 6M5 16l7 6 7-6"/></Ico>,
  message: (p) => <Ico {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Ico>,
  attach: (p) => <Ico {...p}><path d="m21 11-9 9a5 5 0 1 1-7-7l9-9a3.5 3.5 0 1 1 5 5L9.5 18a2 2 0 1 1-3-3l8-8"/></Ico>,
  plug: (p) => <Ico {...p}><path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4"/></Ico>,
  mail: (p) => <Ico {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></Ico>,
  device: (p) => <Ico {...p}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></Ico>,
};

window.Icons = Icons;
window.useState = useState;
window.useEffect = useEffect;
window.useRef = useRef;
window.useMemo = useMemo;
window.useCallback = useCallback;
