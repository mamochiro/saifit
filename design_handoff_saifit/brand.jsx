// Saifit brand — logo mark, wordmark, app icon, favicon variants
//
// Concept: a stacked, angular "S" formed from two parallel angled bars,
// like two barbells balanced top-bottom. Reads as letter S, lifts heavy.
// All shapes flat geometry — no skeuomorphism — but with violet→blue glow.

// ─── The mark itself (just the glyph, no background) ────────
function SaifitGlyph({ size = 64, color = 'gradient', glow = true }) {
  // viewBox 100x100. Two thick angled bars forming a stylized S.
  const stroke = color === 'gradient' ? 'url(#saifitGrad)' : color;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="saifitGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(78% 0.20 280)"/>
          <stop offset="100%" stopColor="oklch(58% 0.20 235)"/>
        </linearGradient>
        <filter id="saifitGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g filter={glow ? 'url(#saifitGlow)' : undefined}>
        {/* Top bar — angled like a barbell viewed slightly tilted */}
        <path d="M 22 28 L 78 22"
              stroke={stroke} strokeWidth="11" strokeLinecap="round"/>
        {/* End caps as plates — small circles */}
        <circle cx="22" cy="28" r="6.5" fill={stroke}/>
        <circle cx="78" cy="22" r="6.5" fill={stroke}/>

        {/* Middle connector — diagonal */}
        <path d="M 70 32 L 30 68"
              stroke={stroke} strokeWidth="10" strokeLinecap="round"/>

        {/* Bottom bar — mirrored */}
        <path d="M 22 78 L 78 72"
              stroke={stroke} strokeWidth="11" strokeLinecap="round"/>
        <circle cx="22" cy="78" r="6.5" fill={stroke}/>
        <circle cx="78" cy="72" r="6.5" fill={stroke}/>
      </g>
    </svg>
  );
}

// ─── Wordmark ────────────────────────────────────────────────
function SaifitWordmark({ size = 36, color = 'var(--ink)', subtitle }) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1 }}>
      <span style={{
        fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: size,
        color, letterSpacing: '0.02em',
      }}>
        SAI<span style={{ color: 'oklch(78% 0.20 280)' }}>FIT</span>
      </span>
      {subtitle && (
        <span style={{
          fontFamily: 'system-ui', fontSize: size * 0.22, fontWeight: 600,
          color: 'var(--ink-soft)', letterSpacing: '0.30em',
          marginTop: size * 0.18, textTransform: 'uppercase',
        }}>{subtitle}</span>
      )}
    </div>
  );
}

// ─── Lockup (mark + wordmark) ───────────────────────────────
function SaifitLockup({ size = 'lg' }) {
  const big = size === 'lg';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: big ? 14 : 10 }}>
      <SaifitGlyph size={big ? 48 : 32}/>
      <SaifitWordmark size={big ? 28 : 20}/>
    </div>
  );
}

// ─── App icon (the iOS / PWA tile) ──────────────────────────
function SaifitAppIcon({ size = 180, rounded = true }) {
  const r = rounded ? size * 0.22 : 0;
  return (
    <div style={{
      width: size, height: size,
      borderRadius: r,
      position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse at 30% 20%, oklch(18% 0.04 270) 0%, oklch(8% 0.005 240) 70%)',
      boxShadow: `
        0 0 0 1px rgba(255,255,255,0.06),
        inset 0 1px 0 rgba(255,255,255,0.10),
        0 18px 50px -12px rgba(120,90,255,0.45),
        0 6px 18px rgba(0,0,0,0.5)
      `,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* corner glow */}
      <div style={{
        position: 'absolute', top: -size * 0.3, left: -size * 0.3,
        width: size * 0.9, height: size * 0.9, borderRadius: '50%',
        background: 'radial-gradient(circle, oklch(70% 0.22 275 / 30%) 0%, transparent 60%)',
      }}/>
      {/* faint grid */}
      <svg width={size} height={size} style={{ position: 'absolute', inset: 0, opacity: 0.10 }}>
        <defs>
          <pattern id={`grid-${size}`} width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M 14 0 L 0 0 0 14" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${size})`}/>
      </svg>
      {/* mark */}
      <div style={{ position: 'relative' }}>
        <SaifitGlyph size={size * 0.58} glow/>
      </div>
    </div>
  );
}

// ─── Favicon — ultra-simplified for 16px / 32px ─────────────
function SaifitFavicon({ size = 64 }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size * 0.18,
      background: 'oklch(8% 0.005 240)',
      boxShadow: '0 0 0 1px rgba(255,255,255,0.10)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 100 100">
        <defs>
          <linearGradient id={`favG-${size}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(78% 0.20 280)"/>
            <stop offset="100%" stopColor="oklch(58% 0.20 235)"/>
          </linearGradient>
        </defs>
        {/* Even more simplified — just the S shape, no plates */}
        <path d="M 22 28 L 78 22 L 30 68 L 78 72"
              stroke={`url(#favG-${size})`} strokeWidth="14"
              strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    </div>
  );
}

// ─── Brand sheet ────────────────────────────────────────────
function BrandSheet() {
  return (
    <div className="saifit-bg saifit-root" style={{
      padding: 48, width: 1100, borderRadius: 28,
    }}>
      <div style={{ marginBottom: 32 }}>
        <div className="t-label" style={{ marginBottom: 10 }}>BRAND · IDENTITY</div>
        <h2 style={{ margin: 0, fontFamily: 'K2D', fontWeight: 700, fontSize: 32, color: 'var(--ink)', letterSpacing: '-0.02em' }}>Saifit logo system</h2>
        <div style={{ marginTop: 10, fontFamily: 'K2D', fontSize: 14, color: 'var(--ink-mute)', maxWidth: 600, lineHeight: 1.6 }}>
          Two stacked angled bars form a stylized S — reads as both the letter and balanced barbells. Single gradient: oklch(78% 0.20 280) → oklch(58% 0.20 235). Glyph works at 16px favicon scale by dropping the plate caps.
        </div>
      </div>

      {/* Hero — primary lockup on dark plate */}
      <div style={{
        padding: '60px 40px',
        borderRadius: 24,
        background: 'radial-gradient(ellipse at 30% 30%, oklch(14% 0.04 270) 0%, oklch(7% 0.005 240) 80%)',
        border: '1px solid var(--glass-line)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -120, left: -100,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, oklch(70% 0.22 275 / 22%), transparent 70%)',
        }}/>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 24 }}>
          <SaifitGlyph size={120}/>
          <SaifitWordmark size={64} subtitle="ฟิตเนสส่วนตัว"/>
        </div>
      </div>

      {/* App icons row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <BrandTile label="iOS APP ICON · 180">
          <SaifitAppIcon size={140}/>
        </BrandTile>
        <BrandTile label="ANDROID · ADAPTIVE">
          <div style={{ borderRadius: '50%', overflow: 'hidden' }}>
            <SaifitAppIcon size={140} rounded={false}/>
          </div>
        </BrandTile>
        <BrandTile label="PWA TILE">
          <SaifitAppIcon size={140}/>
        </BrandTile>
        <BrandTile label="MONOCHROME">
          <div style={{
            width: 140, height: 140, borderRadius: 32,
            background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <SaifitGlyph size={84} color="oklch(8% 0.005 240)" glow={false}/>
          </div>
        </BrandTile>
      </div>

      {/* Favicon sizes */}
      <div style={{
        padding: 24, borderRadius: 18,
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid var(--glass-line)',
        marginBottom: 24,
      }}>
        <div className="t-label" style={{ marginBottom: 16 }}>FAVICON · BROWSER TAB</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32 }}>
          {[16, 32, 48, 64, 96].map(s => (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <SaifitFavicon size={s}/>
              <span style={{ fontFamily: 'Chakra Petch', fontSize: 11, color: 'var(--ink-soft)' }}>{s}px</span>
            </div>
          ))}
          <div style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 14px', borderRadius: 10,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--glass-line)',
            fontFamily: 'system-ui', fontSize: 12, color: 'var(--ink-mute)',
          }}>
            <SaifitFavicon size={16}/>
            saifit.app
            <span style={{ color: 'var(--ink-faint)', marginLeft: 8 }}>← in browser tab</span>
          </div>
        </div>
      </div>

      {/* Wordmark variants */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <BrandTile label="WORDMARK · DARK BG">
          <SaifitWordmark size={42}/>
        </BrandTile>
        <BrandTile label="WORDMARK · LIGHT BG" lightBg>
          <SaifitWordmark size={42} color="oklch(8% 0.005 240)"/>
        </BrandTile>
      </div>

      {/* Clearspace + don'ts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{
          padding: 24, borderRadius: 18,
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid var(--glass-line)',
        }}>
          <div className="t-label" style={{ marginBottom: 14 }}>CLEARSPACE · 1×</div>
          <div style={{ position: 'relative', display: 'inline-block', padding: 32 }}>
            {/* dotted clearspace box */}
            <div style={{
              position: 'absolute', inset: 0,
              border: '1px dashed var(--violet-edge)',
              borderRadius: 8,
            }}/>
            <SaifitGlyph size={64}/>
          </div>
          <div style={{ marginTop: 8, fontFamily: 'K2D', fontSize: 12, color: 'var(--ink-soft)' }}>
            Min clearspace = 50% of glyph height on every side.
          </div>
        </div>
        <div style={{
          padding: 24, borderRadius: 18,
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid var(--glass-line)',
        }}>
          <div className="t-label" style={{ marginBottom: 14 }}>COLORWAYS</div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 70, height: 70, borderRadius: 14, background: 'oklch(8% 0.005 240)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-line)' }}><SaifitGlyph size={44}/></div>
            <div style={{ width: 70, height: 70, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SaifitGlyph size={44} color="oklch(40% 0.20 270)" glow={false}/></div>
            <div style={{ width: 70, height: 70, borderRadius: 14, background: 'oklch(72% 0.20 270)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SaifitGlyph size={44} color="#fff" glow={false}/></div>
            <div style={{ width: 70, height: 70, borderRadius: 14, background: '#fff', border: '1px solid var(--glass-line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SaifitGlyph size={44} color="#000" glow={false}/></div>
          </div>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, fontFamily: 'system-ui', fontSize: 9, color: 'var(--ink-soft)', letterSpacing: '0.14em', textAlign: 'center' }}>
            <span>PRIMARY</span><span>VIOLET ON LIGHT</span><span>WHITE KO</span><span>MONO</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandTile({ label, children, lightBg }) {
  return (
    <div style={{
      padding: 20, borderRadius: 18,
      background: lightBg ? '#fff' : 'rgba(255,255,255,0.025)',
      border: '1px solid var(--glass-line)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 160 }}>
        {children}
      </div>
      <div style={{ fontFamily: 'system-ui', fontSize: 10, letterSpacing: '0.18em', color: lightBg ? 'oklch(40% 0 0)' : 'var(--ink-soft)', fontWeight: 600 }}>{label}</div>
    </div>
  );
}

Object.assign(window, { SaifitGlyph, SaifitWordmark, SaifitLockup, SaifitAppIcon, SaifitFavicon, BrandSheet });
