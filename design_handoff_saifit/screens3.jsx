// Saifit screens part 3 — Active workout (logging + resting) + Summary

// ─── Helpers ────────────────────────────────────────────────
function NumStepper({ label, value, unit, big }) {
  return (
    <div style={{
      flex: 1,
      padding: big ? '14px 18px' : '12px 16px',
      borderRadius: 16,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid var(--glass-line)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 10,
    }}>
      {/* − button */}
      <button style={stepBtn}>
        <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>
      <div style={{ textAlign: 'center', flex: 1 }}>
        <div style={{ fontFamily: 'system-ui', fontSize: 9, letterSpacing: '0.16em', color: 'var(--ink-soft)', fontWeight: 600 }}>{label}</div>
        <div className="t-num" style={{ fontSize: big ? 38 : 28, color: 'var(--ink)', lineHeight: 1, marginTop: 2 }}>
          {value}<span style={{ fontSize: big ? 16 : 12, color: 'var(--ink-mute)', marginLeft: 4 }}>{unit}</span>
        </div>
      </div>
      <button style={stepBtn}>
        <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
}
const stepBtn = {
  width: 36, height: 36, borderRadius: 10,
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid var(--glass-line)',
  color: 'var(--ink)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0,
};

// ─── Active workout: LOGGING state ──────────────────────────
function ActiveWorkoutScreen({ state = 'logging', restTotal = 180, restRemain = 78 }) {
  const isResting = state === 'resting';
  const sets = [
    { n: 1, weight: 60, reps: 8, status: 'warmup', rpe: 6 },
    { n: 2, weight: 100, reps: 5, status: 'done', rpe: 7 },
    { n: 3, weight: 110, reps: 5, status: 'done', rpe: 8 },
    { n: 4, weight: 110, reps: 5, status: 'current' },
    { n: 5, weight: 110, reps: 5, status: 'pending' },
  ];

  return (
    <PhoneFrame>
      <div style={{ padding: '4px 0 24px', position: 'relative' }}>
        {/* Top bar — workout progress */}
        <div style={{ padding: '8px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button style={topBtn} title="back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'system-ui', fontSize: 9, letterSpacing: '0.18em', color: 'var(--ink-soft)', fontWeight: 600 }}>PUSH · DAY 2 · ท่าที่ 1 / 5</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--violet)', boxShadow: '0 0 6px var(--violet)' }}/>
              <span className="t-num" style={{ fontSize: 14, color: 'var(--ink)' }}>24:31</span>
            </div>
          </div>
          <button style={topBtn} title="more">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="18" cy="12" r="1.5" fill="currentColor"/></svg>
          </button>
        </div>

        {/* Progress bar across exercises */}
        <div style={{ padding: '12px 20px 0' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[100, 100, 60, 0, 0].map((p, i) => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: 'rgba(255,255,255,0.06)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', width: `${p}%`,
                  background: p > 0 ? 'var(--violet)' : 'transparent',
                  boxShadow: p > 0 ? '0 0 6px var(--violet)' : 'none',
                }}/>
              </div>
            ))}
          </div>
        </div>

        {/* Exercise hero */}
        <div style={{ padding: '14px 20px 0' }}>
          <div className="glass" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flexShrink: 0, width: 84, height: 100, borderRadius: 12, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pose.Squat size={64} sw={1.4} highlight={['quads','glutes']}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 22, color: 'var(--ink)' }}>Squat</span>
                <span style={{ fontFamily: 'K2D', fontSize: 14, color: 'var(--ink-mute)' }}>สควอท</span>
              </div>
              <div style={{ fontFamily: 'K2D', fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>เซ็ตที่ 4 จาก 5 · เป้าหมาย 110 × 5</div>
              <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                <span className="tag-violet">PR: 120 kg</span>
                <span style={{
                  fontFamily: 'system-ui', fontSize: 10, padding: '3px 8px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-line)',
                  color: 'var(--ink-soft)', letterSpacing: '0.04em',
                }}>LAST: 105 × 5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Set list */}
        <div style={{ padding: '14px 20px 0' }}>
          <div className="glass" style={{ padding: '12px 14px' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '32px 1fr 80px 60px 50px',
              gap: 8, padding: '0 6px 8px',
              fontFamily: 'system-ui', fontSize: 9, fontWeight: 600,
              letterSpacing: '0.14em', color: 'var(--ink-faint)',
              borderBottom: '1px solid var(--glass-line)',
            }}>
              <span>SET</span><span></span><span style={{ textAlign: 'right' }}>KG</span><span style={{ textAlign: 'center' }}>REPS</span><span style={{ textAlign: 'center' }}>RPE</span>
            </div>
            {sets.map(s => {
              const cur = s.status === 'current';
              const done = s.status === 'done' || s.status === 'warmup';
              return (
                <div key={s.n} style={{
                  display: 'grid', gridTemplateColumns: '32px 1fr 80px 60px 50px',
                  gap: 8, padding: '12px 6px',
                  alignItems: 'center',
                  borderRadius: cur ? 10 : 0,
                  background: cur ? 'rgba(140,100,255,0.10)' : 'transparent',
                  border: cur ? '1px solid var(--violet-edge)' : '1px solid transparent',
                  margin: cur ? '4px -8px' : 0,
                  paddingLeft: cur ? 14 : 6, paddingRight: cur ? 14 : 6,
                }}>
                  <span style={{
                    fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 14,
                    color: cur ? 'var(--violet-bright)' : done ? 'var(--ink)' : 'var(--ink-soft)',
                  }}>{s.n}</span>
                  {/* status dot/icon */}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {done ? (
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: s.status === 'warmup' ? 'rgba(255,255,255,0.10)' : 'var(--violet)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: s.status === 'done' ? '0 0 8px var(--violet)' : 'none' }}>
                        <Ic.Check size={11}/>
                      </span>
                    ) : cur ? (
                      <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--violet-bright)', boxShadow: '0 0 8px var(--violet)', position: 'relative' }}>
                        <span style={{ position: 'absolute', inset: 4, borderRadius: '50%', background: 'var(--violet-bright)', animation: 'pulse 1.4s ease-in-out infinite' }}/>
                      </span>
                    ) : (
                      <span style={{ width: 18, height: 18, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.18)' }}/>
                    )}
                    {s.status === 'warmup' && <span style={{ fontFamily: 'system-ui', fontSize: 9, letterSpacing: '0.10em', color: 'var(--ink-soft)' }}>WARM</span>}
                  </span>
                  <span className="t-num" style={{ textAlign: 'right', fontSize: cur ? 18 : 15, color: cur || done ? 'var(--ink)' : 'var(--ink-soft)', fontWeight: cur ? 700 : 500 }}>{s.weight}</span>
                  <span className="t-num" style={{ textAlign: 'center', fontSize: cur ? 18 : 15, color: cur || done ? 'var(--ink)' : 'var(--ink-soft)', fontWeight: cur ? 700 : 500 }}>{s.reps}</span>
                  <span style={{ textAlign: 'center', fontFamily: 'Chakra Petch', fontWeight: 600, fontSize: 12, color: s.rpe ? 'var(--ink-mute)' : 'var(--ink-faint)' }}>{s.rpe || '—'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Steppers */}
        {!isResting && (
          <div style={{ padding: '14px 20px 0', display: 'flex', gap: 10 }}>
            <NumStepper label="WEIGHT · KG" value={110} unit="" big/>
            <NumStepper label="REPS" value={5} unit="" big/>
          </div>
        )}

        {/* Action buttons */}
        {!isResting && (
          <div style={{ padding: '14px 20px 0', display: 'flex', gap: 10 }}>
            <button className="btn-glass" style={{ flex: 1 }}>ข้าม</button>
            <button className="btn-primary" style={{ flex: 2 }}>
              <Ic.Check size={16}/> เซ็ตเสร็จ · 110×5
            </button>
          </div>
        )}

        {/* End workout */}
        {!isResting && (
          <div style={{ padding: '14px 20px 0', textAlign: 'center' }}>
            <button style={{
              background: 'transparent', border: 0,
              fontFamily: 'system-ui', fontSize: 11, letterSpacing: '0.18em', fontWeight: 600,
              color: 'var(--danger)', textTransform: 'uppercase', cursor: 'pointer',
              padding: 10,
            }}>จบการออกกำลังกาย · END WORKOUT</button>
          </div>
        )}

        {/* REST OVERLAY */}
        {isResting && <RestOverlay total={restTotal} remain={restRemain}/>}
      </div>
    </PhoneFrame>
  );
}

const topBtn = {
  width: 38, height: 38, borderRadius: 10,
  background: 'var(--glass)', border: '1px solid var(--glass-line)',
  color: 'var(--ink)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  backdropFilter: 'blur(20px)',
};

// ─── Rest timer overlay ─────────────────────────────────────
function RestOverlay({ total = 180, remain = 78 }) {
  const pct = remain / total;
  const r = 110, c = 2 * Math.PI * r;
  const mm = Math.floor(remain / 60);
  const ss = String(remain % 60).padStart(2, '0');
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, rgba(8,8,16,0.55) 0%, rgba(8,8,16,0.92) 60%)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24, zIndex: 5,
    }}>
      <div className="t-label" style={{ marginBottom: 6 }}>REST · พักก่อนเซ็ตถัดไป</div>
      <div style={{ position: 'relative', width: r * 2 + 20, height: r * 2 + 20 }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${r * 2 + 20} ${r * 2 + 20}`}>
          <defs>
            <linearGradient id="restG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(78% 0.20 280)"/>
              <stop offset="100%" stopColor="oklch(58% 0.20 235)"/>
            </linearGradient>
          </defs>
          <circle cx={r + 10} cy={r + 10} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none"/>
          <circle cx={r + 10} cy={r + 10} r={r} stroke="url(#restG)" strokeWidth="6" fill="none"
            strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
            strokeLinecap="round" transform={`rotate(-90 ${r + 10} ${r + 10})`}
            style={{ filter: 'drop-shadow(0 0 12px var(--violet))' }}/>
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span className="t-num" style={{ fontSize: 76, color: 'var(--ink)', lineHeight: 1, letterSpacing: '0.02em' }}>{mm}:{ss}</span>
          <span style={{ fontFamily: 'system-ui', fontSize: 10, letterSpacing: '0.18em', color: 'var(--ink-soft)', marginTop: 8, fontWeight: 600 }}>{Math.floor(total / 60)}:{String(total % 60).padStart(2, '0')} TARGET</span>
        </div>
      </div>

      <div style={{ marginTop: 32, textAlign: 'center', maxWidth: 280 }}>
        <div style={{ fontFamily: 'system-ui', fontSize: 9, letterSpacing: '0.18em', color: 'var(--ink-soft)', fontWeight: 600, marginBottom: 6 }}>NEXT · เซ็ตที่ 5</div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
          <span className="t-num" style={{ fontSize: 28, color: 'var(--ink)' }}>110</span>
          <span style={{ fontFamily: 'K2D', fontSize: 14, color: 'var(--ink-mute)' }}>kg ×</span>
          <span className="t-num" style={{ fontSize: 28, color: 'var(--ink)' }}>5</span>
          <span style={{ fontFamily: 'K2D', fontSize: 14, color: 'var(--ink-mute)' }}>reps</span>
        </div>
      </div>

      {/* timer adjustments */}
      <div style={{ marginTop: 28, display: 'flex', gap: 10 }}>
        <button className="btn-glass" style={{ padding: '12px 18px' }}>−15s</button>
        <button className="btn-glass" style={{ padding: '12px 18px' }}>+15s</button>
        <button className="btn-glass" style={{ padding: '12px 18px' }}>+30s</button>
      </div>

      <button className="btn-primary" style={{ marginTop: 18, width: 240 }}>
        ข้ามการพัก · SKIP REST
      </button>
    </div>
  );
}

// ─── Workout summary ────────────────────────────────────────
function WorkoutSummaryScreen() {
  const stats = [
    { k: 'TIME', val: '1:08', sub: 'ชั่วโมง', },
    { k: 'VOLUME', val: '8,420', sub: 'kg', },
    { k: 'SETS', val: '18', sub: 'sets', },
    { k: 'KCAL', val: '412', sub: 'kcal', },
  ];
  return (
    <PhoneFrame>
      <div style={{ padding: '4px 0 24px', position: 'relative' }}>
        {/* hero confetti rays */}
        <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 320, overflow: 'hidden', pointerEvents: 'none' }}>
          <svg width="100%" height="100%" viewBox="0 0 390 320" style={{ opacity: 0.4 }}>
            <defs>
              <radialGradient id="rays" cx="50%" cy="0%">
                <stop offset="0%" stopColor="oklch(72% 0.20 270 / 35%)"/>
                <stop offset="100%" stopColor="transparent"/>
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#rays)"/>
            {Array.from({ length: 9 }).map((_, i) => {
              const angle = -90 + (i - 4) * 12;
              const rad = angle * Math.PI / 180;
              const x = 195 + Math.cos(rad) * 380;
              const y = 30 + Math.sin(rad) * 380;
              return <line key={i} x1="195" y1="30" x2={x} y2={y} stroke="oklch(72% 0.20 270 / 25%)" strokeWidth="1"/>;
            })}
          </svg>
        </div>

        {/* close */}
        <div style={{ padding: '8px 20px 0', display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
          <button style={topBtn}><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button>
        </div>

        {/* hero */}
        <div style={{ padding: '12px 24px 0', textAlign: 'center', position: 'relative' }}>
          <div className="t-label" style={{ color: 'var(--violet-bright)', marginBottom: 8, letterSpacing: '0.20em' }}>WORKOUT COMPLETE · เสร็จแล้ว</div>
          <div style={{ fontFamily: 'K2D', fontWeight: 700, fontSize: 32, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            ทำได้ดีมาก,<br/>Sara
          </div>
          <div style={{ fontFamily: 'K2D', fontSize: 14, color: 'var(--ink-mute)', marginTop: 8 }}>PUSH · DAY 2 · 10 พ.ค. 2026</div>
        </div>

        {/* stats grid */}
        <div style={{ padding: '20px 20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, position: 'relative' }}>
          {stats.map(s => (
            <div key={s.k} className="glass" style={{ padding: 16 }}>
              <div style={{ fontFamily: 'system-ui', fontSize: 9, letterSpacing: '0.18em', color: 'var(--ink-soft)', fontWeight: 600 }}>{s.k}</div>
              <div className="t-num" style={{ fontSize: 32, color: 'var(--ink)', marginTop: 4, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontFamily: 'K2D', fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* PR card */}
        <div style={{ padding: '14px 20px 0', position: 'relative' }}>
          <div className="glass glass-glow" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ width: 32, height: 32, borderRadius: 10, background: 'oklch(72% 0.20 270 / 18%)', border: '1px solid var(--violet-edge)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--violet-bright)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 7.2H22l-6.2 4.5L18.2 21 12 16.5 5.8 21l2.4-7.3L2 9.2h7.6L12 2z" fill="currentColor"/></svg>
              </span>
              <div style={{ flex: 1 }}>
                <div className="t-label" style={{ color: 'var(--violet-bright)' }}>NEW PERSONAL RECORD</div>
                <div style={{ fontFamily: 'K2D', fontWeight: 700, fontSize: 16, color: 'var(--ink)', marginTop: 1 }}>Squat · 120 kg</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'K2D', fontSize: 12, color: 'var(--ink-mute)' }}>ก่อนหน้านี้: 115 kg · 28 เม.ย.</span>
              <span className="t-num" style={{ fontSize: 14, color: 'var(--violet-bright)' }}>+5 kg</span>
            </div>
          </div>
        </div>

        {/* streak */}
        <div style={{ padding: '10px 20px 0', position: 'relative' }}>
          <div className="glass" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🔥</div>
            <div style={{ flex: 1 }}>
              <div className="t-label">STREAK</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                <span className="t-num" style={{ fontSize: 26, color: 'var(--ink)' }}>43</span>
                <span style={{ fontFamily: 'K2D', fontSize: 12, color: 'var(--ink-mute)' }}>วัน · +1 จากเมื่อวาน</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div style={{ padding: '18px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn-primary" style={{ width: '100%' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            แชร์ใน LINE
          </button>
          <button className="btn-glass" style={{ width: '100%' }}>กลับหน้าหลัก</button>
        </div>
      </div>
    </PhoneFrame>
  );
}

// ─── Inject pulse keyframes ─────────────────────────────────
if (!document.getElementById('saifit-pulse-kf')) {
  const s = document.createElement('style');
  s.id = 'saifit-pulse-kf';
  s.textContent = `@keyframes pulse { 0%,100% { opacity: 1; transform: scale(1) } 50% { opacity: 0.5; transform: scale(0.85) } }`;
  document.head.appendChild(s);
}

Object.assign(window, { ActiveWorkoutScreen, WorkoutSummaryScreen, RestOverlay });
