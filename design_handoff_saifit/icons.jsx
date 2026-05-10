// Saifit icons — all SVG, no emoji
// Stroke icons by default; pass `filled` for solid variants.

const Ic = {
  // ─── Brand / auth ─────────────────────────────
  Line: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="white"/>
      <path d="M12 4.6c-4.6 0-8.3 3-8.3 6.7 0 3.3 2.9 6.1 6.9 6.7.3.05.6.2.7.4.1.2.1.5 0 .8l-.2.7c-.1.3.1.6.5.5 1.7-.7 6-3.5 7.6-6 .5-.7.8-1.5.9-2.3.4-3.7-3.3-7.5-8.1-7.5z" fill="#00B900"/>
      <path d="M9.4 9.5v4.4M11 9.5l2.4 4.4V9.5M15 9.5h2.4m-2.4 0v4.4m0-2.2h1.7M7.4 9.5v4.4h1.8" stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Google: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path fill="#fff" d="M22 12.2c0-.7-.07-1.4-.2-2H12v3.8h5.6c-.24 1.3-.97 2.4-2.06 3.1v2.6h3.33C20.8 18 22 15.4 22 12.2z" opacity=".95"/>
      <path fill="#fff" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.33-2.58c-.92.6-2.1 1-3.37 1-2.6 0-4.8-1.75-5.59-4.1H3v2.7C4.7 19.9 8.1 22 12 22z" opacity=".75"/>
      <path fill="#fff" d="M6.4 13.92A6 6 0 0 1 6.1 12c0-.66.1-1.3.3-1.92V7.4H3a10 10 0 0 0 0 9.2l3.4-2.68z" opacity=".55"/>
      <path fill="#fff" d="M12 6c1.5 0 2.8.5 3.8 1.5L18.7 4.6C16.97 3 14.7 2 12 2 8.1 2 4.7 4.1 3 7.4l3.4 2.68C7.2 7.75 9.4 6 12 6z" opacity=".95"/>
    </svg>
  ),
  // ─── Decorative ───────────────────────────────
  BarbellLarge: ({ size = 480 }) => (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        {/* bar */}
        <line x1="20" y1="100" x2="180" y2="100"/>
        {/* inner collars */}
        <line x1="58" y1="86" x2="58" y2="114"/>
        <line x1="142" y1="86" x2="142" y2="114"/>
        {/* plates left */}
        <rect x="36" y="74" width="14" height="52" rx="2"/>
        <rect x="22" y="78" width="10" height="44" rx="2"/>
        {/* plates right */}
        <rect x="150" y="74" width="14" height="52" rx="2"/>
        <rect x="168" y="78" width="10" height="44" rx="2"/>
      </g>
    </svg>
  ),
  Body: ({ size = 220 }) => (
    <svg width={size} height={size * 1.6} viewBox="0 0 100 160" fill="none">
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* head */}
        <circle cx="50" cy="14" r="10"/>
        {/* neck */}
        <line x1="50" y1="24" x2="50" y2="32"/>
        {/* shoulders / torso */}
        <path d="M22 38 Q50 30 78 38 L72 80 Q50 86 28 80 Z"/>
        {/* arms */}
        <path d="M22 38 L14 78 L20 110"/>
        <path d="M78 38 L86 78 L80 110"/>
        {/* legs */}
        <path d="M38 80 L34 130 L36 156"/>
        <path d="M62 80 L66 130 L64 156"/>
        {/* center line */}
        <line x1="50" y1="38" x2="50" y2="80" opacity="0.35"/>
      </g>
    </svg>
  ),
  Flame: ({ size = 200 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M50 88c-14 0-24-10-24-22 0-10 6-15 10-22 4-7 4-14 4-22 0 0 12 8 18 22 4 9 4 14 8 18 4 4 8 8 8 16 0 12-10 22-24 22z" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M50 78c-7 0-12-5-12-11 0-6 4-8 6-12 2-4 2-8 4-12 0 0 6 6 8 12 2 6 2 8 4 12 2 2 2 5 2 6 0 5-5 5-12 5z" stroke="currentColor" strokeWidth="1.2" opacity="0.6"/>
    </svg>
  ),
  Bolt: ({ size = 80, stroke = 1.4 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M13 2 L4 14 h6 l-1 8 9-12 h-6 z" stroke="currentColor" strokeWidth={stroke} strokeLinejoin="round"/>
    </svg>
  ),
  Wave: ({ size = 80, stroke = 1.4 }) => (
    <svg width={size} height={size * 0.7} viewBox="0 0 24 16" fill="none">
      <path d="M2 8 Q5 2, 8 8 T14 8 T20 8 T26 8" stroke="currentColor" strokeWidth={stroke} fill="none"/>
      <path d="M2 12 Q5 6, 8 12 T14 12 T20 12 T26 12" stroke="currentColor" strokeWidth={stroke} fill="none" opacity="0.5"/>
    </svg>
  ),
  Barbell: ({ size = 80, stroke = 1.4 }) => (
    <svg width={size} height={size * 0.7} viewBox="0 0 24 16" fill="none">
      <g stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" fill="none">
        <line x1="2" y1="8" x2="22" y2="8"/>
        <rect x="5" y="3" width="3" height="10" rx="0.6"/>
        <rect x="16" y="3" width="3" height="10" rx="0.6"/>
        <line x1="3" y1="5" x2="3" y2="11"/>
        <line x1="21" y1="5" x2="21" y2="11"/>
      </g>
    </svg>
  ),
  Dumbbell: ({ size = 80, stroke = 1.4 }) => (
    <svg width={size} height={size * 0.55} viewBox="0 0 24 14" fill="none">
      <g stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" fill="none">
        <line x1="8" y1="7" x2="16" y2="7"/>
        <rect x="3" y="3" width="4" height="8" rx="1"/>
        <rect x="17" y="3" width="4" height="8" rx="1"/>
      </g>
    </svg>
  ),
  // ─── Tabs ─────────────────────────────────────
  Home: ({ size = 22, active }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
        fill={active ? "currentColor" : "none"} fillOpacity="0.18"/>
    </svg>
  ),
  List: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="3.5" rx="1" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="4" y="11" width="16" height="3.5" rx="1" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="4" y="17" width="10" height="3.5" rx="1" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  Chart: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 19V5M4 19h16M7 16v-5M11 16V8M15 16v-3M19 16V6"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  Book: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H5zM19 4h-2a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h3z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  // ─── Misc ─────────────────────────────────────
  ArrowRight: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14m-5-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Eye: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  At: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M16 8v5a3 3 0 0 0 6 0v-1A10 10 0 1 0 18 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Lock: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  Play: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 4v16l13-8z" fill="currentColor"/>
    </svg>
  ),
  Check: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="m5 12 5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

window.Ic = Ic;
