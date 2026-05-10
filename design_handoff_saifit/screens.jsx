// Saifit screens — all 5 mobile screens at 390×844, plus shared chrome
// Loaded into globals so design canvas + iPhone frame can compose them.

const W = 390, H = 844;

// ─── Phone shell ────────────────────────────────────────────────
// We use IOSDevice from ios-frame.jsx for the bezel. But the inner
// content is fully custom — dark bg with our own status bar styling.
// Rather than rely on the kit's status bar, we use a transparent one
// from the kit but draw our own subtle chrome inside the screen.

function PhoneFrame({ children, time = '9:41' }) {
  // Wrap a 390x844 screen in an iOS device frame. The kit defaults to
  // 402x874; passing 390x844 sizes the OUTER frame so the screen sits
  // a few px smaller. That's fine — the inner canvas auto-fills.
  return (
    <IOSDevice width={W} height={H} dark={true}>
      <div className="saifit-bg saifit-root" style={{
        position: 'relative', width: '100%', height: '100%',
        paddingTop: 60, // leave room for status bar / dynamic island
      }}>
        {children}
      </div>
    </IOSDevice>
  );
}

// ─── Reusable chrome ────────────────────────────────────────────
function TabBar({ active = 'home' }) {
  const tabs = [
    { k: 'home', label: 'หน้าแรก', I: Ic.Home },
    { k: 'workout', label: 'โปรแกรม', I: Ic.List },
    { k: 'progress', label: 'ความก้าวหน้า', I: Ic.Chart },
    { k: 'log', label: 'บันทึก', I: Ic.Book },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 18, left: 16, right: 16,
      pointerEvents: 'none',
    }}>
      <div className="tabbar">
        {tabs.map(({ k, label, I }) => (
          <div key={k} className={`tab ${active === k ? 'is-active' : ''}`}>
            <I size={22} active={active === k}/>
            <span>{label}</span>
            <span className="tab-dot"/>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenHeader({ kicker, title, right }) {
  return (
    <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        {kicker && <div className="t-label" style={{ marginBottom: 6 }}>{kicker}</div>}
        <h1 style={{
          margin: 0, fontFamily: 'K2D', fontWeight: 700,
          fontSize: 26, lineHeight: 1.15, color: 'var(--ink)',
          letterSpacing: '-0.01em',
        }}>{title}</h1>
      </div>
      {right}
    </div>
  );
}

function Avatar({ size = 38, initials = 'S' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, oklch(65% 0.22 280), oklch(60% 0.20 240))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 14,
      border: '1px solid rgba(255,255,255,0.18)',
      boxShadow: '0 6px 14px -4px rgba(120,90,255,0.5)',
    }}>{initials}</div>
  );
}

// ─── Screen 1 — Sign in ─────────────────────────────────────────
function SignInScreen({ focusedField = null, pressed = false }) {
  return (
    <PhoneFrame>
      {/* barbell watermark */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
      }}>
        <div style={{ color: 'white', opacity: 0.045, transform: 'rotate(-12deg)' }}>
          <Ic.BarbellLarge size={520}/>
        </div>
      </div>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 24px',
      }}>
        <div className="glass" style={{ padding: '36px 24px 28px' }}>
          {/* Brand */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, oklch(72% 0.20 270), oklch(60% 0.20 240))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 16px -6px rgba(120,90,255,0.7)',
              }}>
                <span style={{ color: 'white' }}><Ic.Barbell size={20}/></span>
              </div>
              <span style={{
                fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 26,
                letterSpacing: '-0.01em', color: 'var(--ink)',
              }}>GymPal</span>
            </div>
            <div style={{
              fontFamily: 'K2D', fontSize: 14, color: 'var(--ink-mute)',
              lineHeight: 1.5,
            }}>ติดตามการออกกำลังกายของคุณ</div>
          </div>

          {/* OAuth */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
            <button className="btn-line"><Ic.Line size={22}/>เข้าสู่ระบบด้วย LINE</button>
            <button className="btn-glass"><Ic.Google size={20}/>ดำเนินการต่อด้วย Google</button>
          </div>

          {/* Divider */}
          <div className="divider-text" style={{ margin: '10px 0 14px' }}>หรือ</div>

          {/* Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
            <div className={`glass-input ${focusedField === 'email' ? 'is-focused' : ''}`}>
              <span style={{ color: 'var(--ink-soft)' }}><Ic.At/></span>
              <input placeholder="อีเมล" defaultValue={focusedField === 'email' ? 'sara@' : ''}/>
              {focusedField === 'email' && <span style={{
                width: 1.5, height: 18, background: 'var(--violet-bright)',
                animation: 'caret 1s steps(2) infinite',
              }}/>}
            </div>
            <div className="glass-input">
              <span style={{ color: 'var(--ink-soft)' }}><Ic.Lock/></span>
              <input type="password" placeholder="รหัสผ่าน"/>
              <span style={{ color: 'var(--ink-soft)' }}><Ic.Eye/></span>
            </div>
          </div>

          {/* Submit */}
          <button className={`btn-primary ${pressed ? 'is-pressed' : ''}`} style={{ width: '100%' }}>
            เข้าสู่ระบบ <Ic.ArrowRight/>
          </button>

          {/* Footer */}
          <div style={{
            textAlign: 'center', marginTop: 18,
            fontFamily: 'K2D', fontSize: 13, color: 'var(--ink-soft)',
          }}>
            ยังไม่มีบัญชี? <span style={{ color: 'var(--ink)', fontWeight: 600 }}>สมัครสมาชิก</span>
          </div>
        </div>
      </div>

      <style>{`@keyframes caret { 50% { opacity: 0; } }`}</style>
    </PhoneFrame>
  );
}

// ─── Screen 2 — Home ────────────────────────────────────────────
function HomeScreen() {
  const exercises = [
    { name: 'Squat',       sets: '4×5',  hint: 'BARBELL · 110 kg' },
    { name: 'Bench Press', sets: '3×8',  hint: 'BARBELL · 75 kg' },
    { name: 'OHP',         sets: '3×10', hint: 'BARBELL · 42.5 kg' },
    { name: 'Pull Up',     sets: '3×AMRAP', hint: 'BODYWEIGHT' },
  ];
  return (
    <PhoneFrame>
      {/* body silhouette ghost */}
      <div className="watermark" style={{
        right: -30, top: 70, color: 'white', opacity: 0.05,
      }}>
        <Ic.Body size={180}/>
      </div>

      <div style={{ padding: '4px 0 110px', position: 'relative' }}>
        <ScreenHeader
          kicker="SAIFIT · MON, 10 MAY"
          title={<>สวัสดี, <span style={{ color: 'var(--violet-bright)' }}>Sara</span></>}
          right={<Avatar initials="S"/>}
        />

        {/* Streak card */}
        <div style={{ padding: '20px 24px 0' }}>
          <div className="glass glass-glow" style={{ padding: '22px 22px 24px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="t-label">STREAK</span>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 10px', borderRadius: 999,
                background: 'rgba(255,140,80,0.10)', border: '1px solid rgba(255,140,80,0.25)',
                color: 'oklch(80% 0.14 50)', fontFamily: 'K2D', fontSize: 11, fontWeight: 600,
              }}>
                <span style={{ fontSize: 13 }}>↑</span> +3
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 14,
            }}>
              <span className="t-num" style={{ fontSize: 84, lineHeight: 0.9, color: 'var(--ink)' }}>42</span>
              <span style={{
                fontFamily: 'K2D', fontSize: 14, color: 'var(--ink-mute)', fontWeight: 500,
              }}>วันติดต่อกัน</span>
            </div>
            <div style={{
              marginTop: 14, display: 'flex', gap: 4,
            }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: i < 12 ? 'var(--violet)' : 'rgba(255,255,255,0.10)',
                  boxShadow: i < 12 ? '0 0 6px var(--violet)' : 'none',
                }}/>
              ))}
            </div>

            {/* flame ghost */}
            <div style={{
              position: 'absolute', right: -10, bottom: -16,
              color: 'white', opacity: 0.08,
            }}>
              <Ic.Flame size={150}/>
            </div>
          </div>
        </div>

        {/* Today's workout */}
        <div style={{ padding: '14px 24px 0' }}>
          <div className="glass" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span className="t-label">วันนี้</span>
              <span style={{
                fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 11,
                letterSpacing: '0.12em', color: 'var(--violet-bright)',
              }}>PPL · DAY 2</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {exercises.map((e, i) => (
                <div key={e.name} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  paddingBottom: i === exercises.length - 1 ? 0 : 14,
                  borderBottom: i === exercises.length - 1 ? 0 : '1px solid var(--glass-line)',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--glass-line)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--ink-mute)', flexShrink: 0,
                  }}>
                    <Ic.Dumbbell size={20} stroke={1.6}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'K2D', fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{e.name}</div>
                    <div style={{ fontFamily: 'system-ui', fontSize: 10, letterSpacing: '0.10em', color: 'var(--ink-soft)', marginTop: 2 }}>{e.hint}</div>
                  </div>
                  <span className="t-num" style={{ fontSize: 18, color: 'var(--ink)' }}>{e.sets}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '16px 24px 0' }}>
          <button className="btn-primary" style={{ width: '100%' }}>
            <Ic.Play size={16}/> เริ่มออกกำลังกาย
          </button>
        </div>
      </div>

      <TabBar active="home"/>
    </PhoneFrame>
  );
}

// ─── Screen 3 — Templates ───────────────────────────────────────
function TemplatesScreen({ activeFilter = 'all' }) {
  const filters = [
    { k: 'all',     label: 'ทั้งหมด' },
    { k: 'muscle',  label: 'สร้างกล้าม' },
    { k: 'fat',     label: 'ลดไขมัน' },
    { k: 'strong',  label: 'แข็งแกร่ง' },
  ];
  const templates = [
    { name: 'PPL',          days: '6 วัน/สัปดาห์', goal: 'สร้างกล้ามเนื้อ',  level: 'ระดับกลาง', I: Ic.Barbell, week: 'Push · Pull · Legs' },
    { name: 'Upper / Lower', days: '4 วัน/สัปดาห์', goal: 'แข็งแกร่ง',         level: 'มือใหม่', I: Ic.Bolt, week: 'Strength focus' },
    { name: 'Full Body',    days: '3 วัน/สัปดาห์', goal: 'กระฉับกระเฉง',       level: 'มือใหม่', I: Ic.Wave, week: 'Compound lifts' },
    { name: '5/3/1',        days: '4 วัน/สัปดาห์', goal: 'พลังสูงสุด',         level: 'ขั้นสูง', I: Ic.Dumbbell, week: 'Wendler programming' },
  ];
  return (
    <PhoneFrame>
      <div style={{ padding: '4px 0 110px' }}>
        <ScreenHeader
          kicker="LIBRARY"
          title="โปรแกรมออกกำลังกาย"
        />
        <div style={{
          fontFamily: 'K2D', fontSize: 13, color: 'var(--ink-soft)',
          padding: '6px 24px 0', lineHeight: 1.5,
        }}>เลือกโปรแกรมที่เหมาะกับเป้าหมายของคุณ</div>

        {/* Filters */}
        <div style={{
          display: 'flex', gap: 8, padding: '20px 24px 0',
          overflowX: 'auto', flexWrap: 'nowrap',
        }}>
          {filters.map(f => (
            <span key={f.k} className={`pill ${activeFilter === f.k ? 'is-active' : ''}`}>{f.label}</span>
          ))}
        </div>

        {/* Cards */}
        <div style={{ padding: '14px 24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {templates.map(t => (
            <div key={t.name} className="glass" style={{ padding: '20px 22px', position: 'relative' }}>
              {/* bg icon */}
              <div style={{
                position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)',
                color: 'white', opacity: 0.10,
              }}>
                <t.I size={120} stroke={1.2}/>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{
                    fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 22,
                    color: 'var(--ink)', letterSpacing: '-0.01em',
                  }}>{t.name}</span>
                  <span style={{
                    fontFamily: 'system-ui', fontSize: 10, letterSpacing: '0.12em',
                    color: 'var(--ink-soft)', textTransform: 'uppercase',
                  }}>{t.days}</span>
                </div>
                <div style={{
                  fontFamily: 'K2D', fontSize: 14, color: 'var(--ink-mute)',
                  marginTop: 4, marginBottom: 14,
                }}>{t.goal} · <span style={{ color: 'var(--ink-soft)' }}>{t.week}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="tag-violet">{t.level}</span>
                  <span style={{ color: 'var(--ink-mute)' }}><Ic.ArrowRight/></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="workout"/>
    </PhoneFrame>
  );
}

// ─── Screen 4 — Progress ────────────────────────────────────────
function ProgressScreen() {
  // Heatmap: 13 columns × 7 rows ≈ 91 cells (~13 weeks)
  // Let's do 26 cols × 7 = 182 (half year) — fits better
  const cells = Array.from({ length: 26 * 7 }).map((_, i) => {
    // pseudo random pattern
    const seed = Math.sin(i * 13.37) * 10000;
    const v = Math.abs(seed - Math.floor(seed));
    if (v < 0.45) return 0;
    if (v < 0.65) return 1;
    if (v < 0.82) return 2;
    if (v < 0.94) return 3;
    return 4;
  });
  const cellColor = (lvl) => {
    if (lvl === 0) return { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.04)' };
    const a = [0.18, 0.36, 0.62, 0.95][lvl - 1];
    return {
      bg: `oklch(72% 0.20 270 / ${a})`,
      border: `oklch(72% 0.20 270 / ${Math.min(a + 0.15, 1)})`,
      shadow: lvl >= 3 ? `0 0 8px oklch(72% 0.20 270 / ${a * 0.6})` : 'none',
    };
  };

  return (
    <PhoneFrame>
      <div style={{ padding: '4px 0 110px' }}>
        <ScreenHeader kicker="STATS" title="ความก้าวหน้า"/>

        {/* Segmented */}
        <div style={{ padding: '18px 24px 0' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 4, padding: 4, borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--glass-line)',
          }}>
            <div style={{
              height: 40, borderRadius: 9,
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.16)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'K2D', fontWeight: 600, fontSize: 13, color: 'var(--ink)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)',
            }}>สถิติ</div>
            <div style={{
              height: 40, borderRadius: 9,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'K2D', fontWeight: 500, fontSize: 13, color: 'var(--ink-soft)',
            }}>แนวโน้ม</div>
          </div>
        </div>

        {/* Streak hero */}
        <div style={{ padding: '14px 24px 0' }}>
          <div className="glass glass-glow" style={{ padding: '24px 22px 28px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="t-label">CURRENT STREAK</span>
              <span style={{ fontFamily: 'system-ui', fontSize: 10, color: 'var(--ink-soft)', letterSpacing: '0.10em' }}>SINCE 30 MAR</span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 10,
            }}>
              <span className="t-num" style={{ fontSize: 96, lineHeight: 0.85, color: 'var(--ink)' }}>42</span>
              <span style={{ fontFamily: 'K2D', fontSize: 14, color: 'var(--ink-mute)', paddingBottom: 16 }}>วันติดต่อกัน</span>
            </div>
            <div style={{
              marginTop: 14, fontFamily: 'K2D', fontSize: 13, color: 'var(--ink-soft)',
            }}>นานที่สุด: <span className="t-num" style={{ color: 'var(--ink-mute)', fontSize: 14 }}>60</span> วัน</div>

            <div style={{ position: 'absolute', right: -14, bottom: -14, color: 'white', opacity: 0.08 }}>
              <Ic.Flame size={170}/>
            </div>
          </div>
        </div>

        {/* PR card */}
        <div style={{ padding: '12px 24px 0' }}>
          <div className="glass" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span className="t-label">PR ล่าสุด</span>
              <span className="pill-sm pill" style={{ height: 22, padding: '0 8px' }}>+5 KG</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontFamily: 'K2D', fontSize: 14, color: 'var(--ink-mute)' }}>Squat</div>
                <div className="t-num" style={{ fontSize: 36, color: 'var(--ink)', lineHeight: 1 }}>142.5 <span style={{ fontSize: 16, color: 'var(--ink-mute)' }}>kg</span></div>
              </div>
              {/* sparkline */}
              <svg width="100" height="40" viewBox="0 0 100 40" fill="none">
                <path d="M0 32 L15 28 L30 30 L45 22 L60 24 L75 16 L90 12 L100 8"
                  stroke="var(--violet)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M0 32 L15 28 L30 30 L45 22 L60 24 L75 16 L90 12 L100 8 L100 40 L0 40 Z"
                  fill="url(#sparkFill)" opacity="0.5"/>
                <defs>
                  <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(72% 0.20 270)" stopOpacity="0.5"/>
                    <stop offset="100%" stopColor="oklch(72% 0.20 270)" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <circle cx="100" cy="8" r="3" fill="var(--violet)"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div style={{ padding: '12px 24px 0' }}>
          <div className="glass" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span className="t-label">การออกกำลังกาย</span>
              <span style={{ fontFamily: 'system-ui', fontSize: 10, color: 'var(--ink-soft)', letterSpacing: '0.10em' }}>26 WEEKS</span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(26, 1fr)',
              gridAutoFlow: 'column',
              gridTemplateRows: 'repeat(7, 1fr)',
              gap: 3,
            }}>
              {cells.map((lvl, i) => {
                const c = cellColor(lvl);
                return (
                  <div key={i} style={{
                    aspectRatio: '1',
                    borderRadius: 2.5,
                    background: c.bg,
                    border: `1px solid ${c.border}`,
                    boxShadow: c.shadow,
                  }}/>
                );
              })}
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginTop: 12, fontFamily: 'system-ui', fontSize: 10, color: 'var(--ink-soft)',
              letterSpacing: '0.08em',
            }}>
              <span>NOV</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span>น้อย</span>
                {[0,1,2,3,4].map(l => {
                  const c = cellColor(l);
                  return <div key={l} style={{
                    width: 10, height: 10, borderRadius: 2.5,
                    background: c.bg, border: `1px solid ${c.border}`,
                  }}/>;
                })}
                <span>มาก</span>
              </div>
              <span>MAY</span>
            </div>
          </div>
        </div>
      </div>

      <TabBar active="progress"/>
    </PhoneFrame>
  );
}

// ─── Screen 5 — Onboarding ──────────────────────────────────────
function OnboardingScreen({ selected = 'muscle' }) {
  const goals = [
    { k: 'muscle',  title: 'สร้างกล้าม',  sub: 'Hypertrophy',     I: Ic.Barbell },
    { k: 'fat',     title: 'ลดไขมัน',      sub: 'Fat loss',         I: Ic.Flame },
    { k: 'strong',  title: 'แข็งแกร่ง',    sub: 'Powerlifting',     I: Ic.Bolt },
    { k: 'fit',     title: 'กระฉับกระเฉง', sub: 'General fitness',  I: Ic.Wave },
  ];
  return (
    <PhoneFrame>
      <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Progress dots */}
        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i === 0 ? 'var(--violet)' : 'rgba(255,255,255,0.10)',
              boxShadow: i === 0 ? '0 0 8px var(--violet)' : 'none',
            }}/>
          ))}
          <span style={{
            fontFamily: 'Chakra Petch', fontWeight: 600, fontSize: 11,
            color: 'var(--ink-soft)', letterSpacing: '0.08em', marginLeft: 4,
          }}>1 / 4</span>
        </div>

        <div style={{ padding: '32px 24px 0' }}>
          <div className="t-label" style={{ marginBottom: 8 }}>STEP 1 · GOAL</div>
          <h1 style={{
            margin: 0, fontFamily: 'K2D', fontWeight: 700, fontSize: 28,
            color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.01em',
          }}>เป้าหมายของคุณ<br/>คืออะไร?</h1>
          <p style={{
            marginTop: 10, fontFamily: 'K2D', fontSize: 14, lineHeight: 1.6,
            color: 'var(--ink-mute)', maxWidth: 280,
          }}>เราจะแนะนำโปรแกรมที่เหมาะกับเป้าหมายของคุณ</p>
        </div>

        <div style={{ padding: '28px 24px 0' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
          }}>
            {goals.map(g => {
              const isSel = selected === g.k;
              return (
                <div key={g.k} className="glass"
                  style={{
                    padding: '22px 18px 20px',
                    aspectRatio: '1 / 1.1',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    ...(isSel ? {
                      background: 'rgba(140,100,255,0.08)',
                      borderColor: 'var(--violet-edge)',
                      boxShadow: '0 0 0 1px var(--violet-glow), 0 14px 40px -14px rgba(120,90,255,0.45)',
                    } : {}),
                  }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: isSel ? 'rgba(140,100,255,0.18)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isSel ? 'var(--violet-edge)' : 'var(--glass-line)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isSel ? 'var(--violet-bright)' : 'var(--ink-mute)',
                  }}>
                    <g.I size={26} stroke={1.6}/>
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'K2D', fontWeight: 700, fontSize: 16,
                      color: 'var(--ink)',
                    }}>{g.title}</div>
                    <div style={{
                      fontFamily: 'system-ui', fontSize: 10, letterSpacing: '0.12em',
                      color: isSel ? 'var(--violet-bright)' : 'var(--ink-soft)',
                      marginTop: 4, textTransform: 'uppercase', fontWeight: 500,
                    }}>{g.sub}</div>
                  </div>
                  {isSel && (
                    <div style={{
                      position: 'absolute', top: 14, right: 14,
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'var(--violet)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', boxShadow: '0 0 12px var(--violet)',
                    }}><Ic.Check size={14}/></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ flex: 1 }}/>

        <div style={{ padding: '0 24px 110px' }}>
          <button className="btn-primary" style={{ width: '100%' }}>
            ถัดไป <Ic.ArrowRight/>
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

Object.assign(window, {
  PhoneFrame, TabBar, ScreenHeader, Avatar,
  SignInScreen, HomeScreen, TemplatesScreen, ProgressScreen, OnboardingScreen,
});
