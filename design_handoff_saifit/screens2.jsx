// Saifit screens part 2 — Library, Detail, Settings, i18n, Running, Food

const I18N = {
  th: { settings: 'ตั้งค่า', profile: 'โปรไฟล์', display: 'การแสดงผล', language: 'ภาษา', notifications: 'การแจ้งเตือน', displayName: 'ชื่อที่แสดง', units: 'หน่วย', kg: 'กก.', lb: 'ปอนด์', enableReminders: 'เปิดการแจ้งเตือน', reminderTime: 'เวลาแจ้งเตือน', signOut: 'ออกจากระบบ', connected: 'เชื่อมต่อแล้ว', library: 'ท่าออกกำลังกาย', searchPose: 'ค้นหาท่า...', all: 'ทั้งหมด', chest: 'หน้าอก', back: 'หลัง', legs: 'ขา', shoulders: 'ไหล่', arms: 'แขน', core: 'คอร์', beginner: 'มือใหม่', intermediate: 'ระดับกลาง', advanced: 'ขั้นสูง', musclesUsed: 'กล้ามเนื้อที่ใช้', howTo: 'วิธีทำ', yourHistory: 'ประวัติของคุณ', lastTime: 'ครั้งล่าสุด', pr: 'PR' },
  en: { settings: 'Settings', profile: 'Profile', display: 'Display', language: 'Language', notifications: 'Notifications', displayName: 'Display name', units: 'Units', kg: 'kg', lb: 'lb', enableReminders: 'Enable reminders', reminderTime: 'Reminder time', signOut: 'Sign out', connected: 'Connected', library: 'Exercise library', searchPose: 'Search exercises...', all: 'All', chest: 'Chest', back: 'Back', legs: 'Legs', shoulders: 'Shoulders', arms: 'Arms', core: 'Core', beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced', musclesUsed: 'Muscles used', howTo: 'How to perform', yourHistory: 'Your history', lastTime: 'Last session', pr: 'PR' },
};

function SectionLabel({ children, bilingual }) {
  return <div style={{ padding: '0 6px 8px', fontFamily: 'system-ui', fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>{children}{bilingual && <span style={{ marginLeft: 8, color: 'var(--ink-faint)' }}>/ {bilingual}</span>}</div>;
}

function Toggle({ on }) {
  return (
    <div style={{ width: 44, height: 26, borderRadius: 999, position: 'relative', background: on ? 'var(--violet)' : 'rgba(255,255,255,0.08)', border: `1px solid ${on ? 'var(--violet-edge)' : 'var(--glass-line)'}`, boxShadow: on ? '0 0 14px var(--violet-glow)' : 'none' }}>
      <div style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }}/>
    </div>
  );
}

function Segmented({ options, value }) {
  return (
    <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 3, padding: 3, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-line)' }}>
      {options.map(o => {
        const active = o.k === value;
        return <div key={o.k} style={{ padding: '6px 14px', borderRadius: 7, fontFamily: 'K2D', fontSize: 13, fontWeight: active ? 600 : 500, color: active ? 'var(--ink)' : 'var(--ink-soft)', background: active ? 'rgba(255,255,255,0.10)' : 'transparent', border: active ? '1px solid rgba(255,255,255,0.16)' : '1px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }}>{o.label}</div>;
      })}
    </div>
  );
}

function FlagTH({ size = 16 }) {
  return <svg width={size} height={size * 0.66} viewBox="0 0 30 20" style={{ borderRadius: 2 }}><rect width="30" height="20" fill="#A51931"/><rect width="30" height="14" y="3" fill="#fff"/><rect width="30" height="8" y="6" fill="#2D2A4A"/></svg>;
}
function FlagEN({ size = 16 }) {
  return <svg width={size} height={size * 0.66} viewBox="0 0 30 20" style={{ borderRadius: 2 }}><rect width="30" height="20" fill="#012169"/><path d="M0 0 L30 20 M30 0 L0 20" stroke="#fff" strokeWidth="3"/><path d="M0 0 L30 20 M30 0 L0 20" stroke="#C8102E" strokeWidth="1.5"/><path d="M15 0 V20 M0 10 H30" stroke="#fff" strokeWidth="5"/><path d="M15 0 V20 M0 10 H30" stroke="#C8102E" strokeWidth="3"/></svg>;
}

function LangToggle({ state = 'th', size = 'lg' }) {
  const big = size === 'lg';
  const w = big ? 220 : 180, h = big ? 54 : 44;
  const slideX = state === 'th' ? 4 : state === 'en' ? w / 2 : w / 4 + 2;
  return (
    <div style={{ position: 'relative', width: w, height: h, borderRadius: h / 2, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-line)' }}>
      <div style={{ position: 'absolute', top: 4, left: slideX, width: w / 2 - 4, height: h - 10, borderRadius: (h - 10) / 2, background: 'linear-gradient(135deg, oklch(72% 0.20 270), oklch(60% 0.20 240))', boxShadow: '0 0 0 1px var(--violet-edge), 0 8px 22px -8px rgba(120,90,255,0.6)', transition: 'left .25s cubic-bezier(.4,1.4,.5,1)' }}/>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', justifyItems: 'center', zIndex: 1 }}>
        <span style={{ fontFamily: 'K2D', fontWeight: 600, fontSize: big ? 14 : 13, color: state === 'th' ? '#fff' : 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 6 }}><FlagTH size={big ? 18 : 14}/>ภาษาไทย</span>
        <span style={{ fontFamily: 'K2D', fontWeight: 600, fontSize: big ? 14 : 13, color: state === 'en' ? '#fff' : 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 6 }}><FlagEN size={big ? 18 : 14}/>English</span>
      </div>
    </div>
  );
}

function SearchInput({ placeholder }) {
  return (
    <div className="glass-input">
      <span style={{ color: 'var(--ink-soft)' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="m20 20-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </span>
      <input placeholder={placeholder}/>
    </div>
  );
}

const EXERCISES = [
  { k: 'squat', en: 'Squat', th: 'สควอท', muscles: 'ขา · กลูเตส', musclesEn: 'Legs · Glutes', level: 'beginner', P: Pose.Squat, hi: ['quads','glutes','lowerback'] },
  { k: 'bench', en: 'Bench Press', th: 'เบนช์เพรส', muscles: 'หน้าอก · ไหล่', musclesEn: 'Chest · Shoulders', level: 'intermediate', P: Pose.BenchPress, hi: ['chest','triceps','shoulders'] },
  { k: 'dl', en: 'Deadlift', th: 'เดดลิฟต์', muscles: 'หลัง · กลูเตส', musclesEn: 'Back · Glutes', level: 'advanced', P: Pose.Deadlift, hi: ['hamstrings','glutes','lowerback'] },
  { k: 'ohp', en: 'Overhead Press', th: 'โอเวอร์เฮดเพรส', muscles: 'ไหล่ · แขน', musclesEn: 'Shoulders · Arms', level: 'intermediate', P: Pose.OverheadPress, hi: ['shoulders','triceps'] },
  { k: 'pu', en: 'Pull-up', th: 'พูลอัพ', muscles: 'หลัง · แขน', musclesEn: 'Back · Biceps', level: 'advanced', P: Pose.PullUp, hi: ['lats','biceps'] },
  { k: 'rdl', en: 'Romanian DL', th: 'โรมาเนียนฯ', muscles: 'หลังต้นขา', musclesEn: 'Hamstrings', level: 'intermediate', P: Pose.RDL, hi: ['hamstrings','glutes'] },
  { k: 'row', en: 'Dumbbell Row', th: 'ดัมเบลโรว์', muscles: 'หลัง · แขน', musclesEn: 'Back · Biceps', level: 'beginner', P: Pose.Row, hi: ['lats','rhomboids','biceps'] },
  { k: 'plank', en: 'Plank', th: 'แพลงก์', muscles: 'คอร์', musclesEn: 'Core', level: 'beginner', P: Pose.Plank, hi: ['abs','shoulders'] },
];

function LibraryScreen({ lang = 'th', activeFilter = 'all' }) {
  const t = I18N[lang];
  const filters = [{ k: 'all', label: t.all }, { k: 'chest', label: t.chest }, { k: 'back', label: t.back }, { k: 'legs', label: t.legs }, { k: 'shoulders', label: t.shoulders }, { k: 'arms', label: t.arms }, { k: 'core', label: t.core }];
  const items = EXERCISES.slice(0, 4);
  return (
    <PhoneFrame>
      <div style={{ padding: '4px 0 110px' }}>
        <ScreenHeader kicker="LIBRARY · 8 EXERCISES" title={t.library}/>
        <div style={{ padding: '14px 24px 0' }}><SearchInput placeholder={t.searchPose}/></div>
        <div style={{ padding: '14px 24px 0', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {filters.map(f => <span key={f.k} className={`pill ${f.k === activeFilter ? 'is-active' : ''}`}>{f.label}</span>)}
        </div>
        <div style={{ padding: '14px 24px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(e => (
            <div key={e.k} className="glass" style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 64, height: 64, borderRadius: 12, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><e.P size={42}/></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 17, color: 'var(--ink)' }}>{e.en}</span>
                    <span style={{ fontFamily: 'K2D', fontSize: 13, color: 'var(--ink-mute)' }}>{e.th}</span>
                  </div>
                  <div style={{ fontFamily: 'K2D', fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>{lang === 'th' ? e.muscles : e.musclesEn}</div>
                  <div style={{ marginTop: 8 }}>
                    <span className="tag-violet" style={{
                      background: e.level === 'beginner' ? 'rgba(255,255,255,0.05)' : 'rgba(140,100,255,0.14)',
                      borderColor: e.level === 'beginner' ? 'var(--glass-line)' : 'var(--violet-edge)',
                      color: e.level === 'beginner' ? 'var(--ink-mute)' : 'var(--violet-bright)',
                    }}>{t[e.level]}</span>
                  </div>
                </div>
                <span style={{ color: 'var(--ink-soft)' }}><Ic.ArrowRight/></span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <TabBar active="workout"/>
    </PhoneFrame>
  );
}

function ExerciseDetailScreen({ lang = 'th' }) {
  const t = I18N[lang];
  const ex = EXERCISES[0];
  const stepsTh = ['ยืนกางขากว้างเท่าไหล่ ปลายเท้าชี้ออกเล็กน้อย', 'งอเข่าและสะโพกลงช้าๆ เหมือนนั่งเก้าอี้', 'ลงให้ต้นขาขนานพื้น เข่าตามแนวปลายเท้า', 'ดันส้นเท้ากลับขึ้นสู่ตำแหน่งเริ่มต้น'];
  const stepsEn = ['Stand with feet shoulder-width, toes slightly out', 'Bend knees and hips slowly, like sitting in a chair', 'Lower until thighs parallel, knees track over toes', 'Drive through heels back to the starting position'];
  const steps = lang === 'th' ? stepsTh : stepsEn;
  return (
    <PhoneFrame>
      <div style={{ padding: '4px 0 24px' }}>
        <div style={{ padding: '8px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--glass)', border: '1px solid var(--glass-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6 9 12l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 17 }}>Squat</div>
            <div style={{ fontFamily: 'K2D', fontSize: 12, color: 'var(--ink-soft)' }}>สควอท</div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--glass)', border: '1px solid var(--glass-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-mute)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16l7-4 7 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          </div>
        </div>
        <div style={{ padding: '18px 20px 0' }}>
          <div className="glass" style={{ padding: 28, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
              <defs><radialGradient id="poseRadial" cx="50%" cy="40%"><stop offset="0%" stopColor="oklch(72% 0.20 270 / 18%)"/><stop offset="100%" stopColor="transparent"/></radialGradient></defs>
              <rect width="100%" height="100%" fill="url(#poseRadial)"/>
            </svg>
            <div style={{ position: 'relative' }}><ex.P size={180} sw={1.5} highlight={ex.hi}/></div>
            <div style={{ position: 'absolute', top: 14, left: 14, fontFamily: 'system-ui', fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.15em' }}>FRONT VIEW</div>
            <div style={{ position: 'absolute', bottom: 14, right: 14, fontFamily: 'Chakra Petch', fontSize: 11, color: 'var(--violet-bright)' }}>● {lang === 'th' ? 'กล้ามเนื้อหลัก' : 'PRIMARY'}</div>
          </div>
        </div>
        <div style={{ padding: '12px 20px 0' }}>
          <div className="glass" style={{ padding: 18 }}>
            <div className="t-label" style={{ marginBottom: 14 }}>{t.musclesUsed}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { th: 'ขา (หลัก)', en: 'Quads (primary)', primary: true },
                { th: 'กลูเตส', en: 'Glutes', primary: false },
                { th: 'หลังส่วนล่าง', en: 'Lower back', primary: false },
              ].map(m => (
                <div key={m.en} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.primary ? 'var(--violet)' : 'rgba(255,255,255,0.18)', boxShadow: m.primary ? '0 0 8px var(--violet)' : 'none' }}/>
                  <span style={{ fontFamily: 'K2D', fontSize: 14, color: m.primary ? 'var(--ink)' : 'var(--ink-mute)', fontWeight: m.primary ? 600 : 400 }}>{lang === 'th' ? m.th : m.en}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding: '12px 20px 0' }}>
          <div className="glass" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="t-label">{t.howTo}</div>
              <Segmented options={[{ k: 'th', label: 'ไทย' }, { k: 'en', label: 'EN' }]} value={lang}/>
            </div>
            <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {steps.map((s, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 6, background: 'rgba(140,100,255,0.12)', border: '1px solid var(--violet-edge)', color: 'var(--violet-bright)', fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                  <span style={{ fontFamily: 'K2D', fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div style={{ padding: '12px 20px 0' }}>
          <div className="glass" style={{ padding: 18 }}>
            <div className="t-label" style={{ marginBottom: 12 }}>{t.yourHistory}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <div style={{ fontFamily: 'system-ui', fontSize: 10, letterSpacing: '0.10em', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>{t.lastTime}</div>
                <div className="t-num" style={{ fontSize: 22, color: 'var(--ink)', marginTop: 4 }}>100<span style={{ fontSize: 14, color: 'var(--ink-mute)' }}>×5×3</span></div>
              </div>
              <div>
                <div style={{ fontFamily: 'system-ui', fontSize: 10, letterSpacing: '0.10em', color: 'var(--violet-bright)', textTransform: 'uppercase' }}>{t.pr}</div>
                <div className="t-num" style={{ fontSize: 22, color: 'var(--ink)', marginTop: 4 }}>120 <span style={{ fontSize: 14, color: 'var(--ink-mute)' }}>{t.kg}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function SettingsRow({ label, right, border, dim }) {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: border ? '1px solid var(--glass-line)' : 0, opacity: dim ? 0.55 : 1 }}><span style={{ fontFamily: 'K2D', fontSize: 15, color: 'var(--ink)' }}>{label}</span>{right}</div>;
}

function SettingsScreen({ lang = 'th', remindersOn = true, units = 'kg' }) {
  const t = I18N[lang];
  return (
    <PhoneFrame>
      <div style={{ padding: '4px 0 110px' }}>
        <ScreenHeader kicker="ACCOUNT" title={t.settings}/>
        <div style={{ padding: '16px 24px 0' }}>
          <div className="glass" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Avatar size={52} initials="S"/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'K2D', fontWeight: 700, fontSize: 17, color: 'var(--ink)' }}>Sara Wongchai</div>
                <div style={{ fontFamily: 'system-ui', fontSize: 12, color: 'var(--ink-soft)', marginTop: 1 }}>dev@saifit.local</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  <span style={{ display: 'inline-flex', padding: '2px 6px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-line)' }}><FlagTH size={12}/></span>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00B900', boxShadow: '0 0 8px #00B900' }}/>
                  <span style={{ fontFamily: 'K2D', fontSize: 12, color: 'var(--ink-mute)' }}>LINE · {t.connected}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '20px 24px 0' }}>
          <SectionLabel>{t.profile}</SectionLabel>
          <div className="glass" style={{ padding: 16 }}>
            <div style={{ fontFamily: 'system-ui', fontSize: 11, letterSpacing: '0.10em', color: 'var(--ink-soft)', textTransform: 'uppercase', marginBottom: 8 }}>{t.displayName}</div>
            <div className="glass-input" style={{ height: 44 }}><input defaultValue="Sara Wongchai"/></div>
          </div>
        </div>
        <div style={{ padding: '16px 24px 0' }}>
          <SectionLabel>{t.display}</SectionLabel>
          <div className="glass"><SettingsRow label={t.units} right={<Segmented value={units} options={[{k:'kg',label:t.kg},{k:'lb',label:t.lb}]}/>}/></div>
        </div>
        <div style={{ padding: '16px 24px 0' }}>
          <SectionLabel bilingual="LANGUAGE">{t.language}</SectionLabel>
          <div className="glass" style={{ padding: 16, display: 'flex', justifyContent: 'center' }}><LangToggle state={lang} size="lg"/></div>
        </div>
        <div style={{ padding: '16px 24px 0' }}>
          <SectionLabel>{t.notifications}</SectionLabel>
          <div className="glass">
            <SettingsRow label={t.enableReminders} right={<Toggle on={remindersOn}/>} border/>
            <SettingsRow label={t.reminderTime} right={<span style={{ fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 16, color: remindersOn ? 'var(--ink)' : 'var(--ink-soft)' }}>18:00</span>} dim={!remindersOn}/>
          </div>
        </div>
        <div style={{ padding: '20px 24px 0' }}>
          <div className="glass" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'K2D', fontSize: 15, fontWeight: 600, color: 'var(--danger)' }}>{t.signOut}</span>
            <span style={{ color: 'var(--danger)' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M16 17l5-5-5-5M21 12H9M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20, fontFamily: 'system-ui', fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>SAIFIT v1.0.0 · BUILD 248</div>
      </div>
    </PhoneFrame>
  );
}

// ─── i18n compare board ────────────────────────────────────
function I18nCompareBoard() {
  return (
    <div className="saifit-bg saifit-root" style={{ padding: 56, borderRadius: 32, width: 'fit-content' }}>
      <div style={{ marginBottom: 28, maxWidth: 720 }}>
        <div className="t-label" style={{ marginBottom: 10 }}>I18N · BEFORE / AFTER</div>
        <h2 style={{ margin: 0, fontFamily: 'K2D', fontWeight: 700, fontSize: 30, color: 'var(--ink)', letterSpacing: '-0.02em' }}>ภาษาไทย <span style={{ color: 'var(--ink-soft)', fontFamily: 'system-ui', fontWeight: 500 }}>↔</span> English</h2>
        <div style={{ marginTop: 10, fontFamily: 'K2D', fontSize: 14, color: 'var(--ink-mute)', maxWidth: 540, lineHeight: 1.6 }}>Tapping the toggle slides the violet pill across, then re-renders every label, button, and input. Numerals stay tabular Chakra Petch in either locale.</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', gap: 36, alignItems: 'flex-start' }}>
        <CompareCol label="ภาษาไทย · DEFAULT" lang="th"/>
        <div style={{ alignSelf: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingTop: 80 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 999, background: 'rgba(140,100,255,0.10)', border: '1px solid var(--violet-edge)', color: 'var(--violet-bright)', fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em' }}>TAP <Ic.ArrowRight size={16}/></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 20, borderRadius: 20, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-line)' }}>
            <span className="t-label">TOGGLE STATES</span>
            <LangToggle state="th"/>
            <LangToggle state="mid"/>
            <LangToggle state="en"/>
          </div>
        </div>
        <CompareCol label="ENGLISH · TRANSLATED" lang="en"/>
      </div>
    </div>
  );
}
function CompareCol({ label, lang }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{ transform: 'scale(0.78)', transformOrigin: 'top center', height: 700 }}><SettingsScreen lang={lang}/></div>
      <div style={{ fontFamily: 'system-ui', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)', fontWeight: 600 }}>{label}</div>
    </div>
  );
}

// ─── Pose sheet ────────────────────────────────────────────
function PoseSheet() {
  return (
    <div className="saifit-bg saifit-root" style={{ padding: 40, width: 880, borderRadius: 24 }}>
      <div style={{ marginBottom: 22 }}>
        <div className="t-label" style={{ marginBottom: 8 }}>06 · POSE LIBRARY</div>
        <h3 style={{ margin: 0, fontFamily: 'K2D', fontWeight: 700, fontSize: 24, color: 'var(--ink)' }}>8 exercises · thumbnail + highlighted muscles</h3>
        <div style={{ marginTop: 8, fontFamily: 'K2D', fontSize: 13, color: 'var(--ink-mute)', maxWidth: 520, lineHeight: 1.6 }}>White stroke 1.25 (thumb) / 1.5 (detail). Active muscles fill <span style={{ color: 'var(--violet-bright)' }}>oklch(72% 0.20 270 / 60%)</span>; rest stay white at 15%.</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {EXERCISES.map(e => (
          <div key={e.k} style={{ borderRadius: 16, padding: 18, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-line)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
              <div style={{ aspectRatio: '1 / 1.2', borderRadius: 10, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><e.P size={56}/></div>
              <div style={{ aspectRatio: '1 / 1.2', borderRadius: 10, background: 'rgba(140,100,255,0.04)', border: '1px solid var(--violet-edge)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><e.P size={56} sw={1.5} highlight={e.hi}/></div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>{e.en}</div>
              <div style={{ fontFamily: 'K2D', fontSize: 11, color: 'var(--ink-soft)' }}>{e.th}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Running Plan screen ───────────────────────────────────
function RunningScreen() {
  const week = [
    { d: 'จ', en: 'MON', kind: 'easy',   km: 5, pace: '6:30', label: 'Easy run' },
    { d: 'อ', en: 'TUE', kind: 'rest',   km: 0, pace: '—',    label: 'Rest' },
    { d: 'พ', en: 'WED', kind: 'tempo',  km: 8, pace: '5:10', label: 'Tempo' },
    { d: 'พฤ', en: 'THU', kind: 'easy',  km: 6, pace: '6:30', label: 'Easy run' },
    { d: 'ศ', en: 'FRI', kind: 'rest',   km: 0, pace: '—',    label: 'Cross train' },
    { d: 'ส', en: 'SAT', kind: 'interval',km: 7, pace: '4:40', label: '6×800m' },
    { d: 'อา', en: 'SUN', kind: 'long',  km: 16, pace: '6:00', label: 'Long run' },
  ];
  const kindColor = { easy: 'rgba(255,255,255,0.10)', tempo: 'oklch(72% 0.20 270 / 60%)', interval: 'oklch(78% 0.20 285)', long: 'oklch(60% 0.20 240)', rest: 'rgba(255,255,255,0.04)' };
  return (
    <PhoneFrame>
      <div style={{ padding: '4px 0 110px' }}>
        <ScreenHeader kicker="WEEK 4 / 12 · 5K SUB-22" title="แผนวิ่ง"/>
        {/* Hero next session */}
        <div style={{ padding: '14px 24px 0' }}>
          <div className="glass glass-glow" style={{ padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="t-label">วันนี้ · TEMPO</div>
              <span className="tag-violet">8 KM</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 14 }}>
              <span className="t-num" style={{ fontSize: 56, lineHeight: 0.9 }}>5:10</span>
              <span style={{ fontFamily: 'K2D', fontSize: 13, color: 'var(--ink-mute)' }}>min/km · เป้าหมาย</span>
            </div>
            <div style={{ marginTop: 10, fontFamily: 'K2D', fontSize: 13, color: 'var(--ink-mute)', lineHeight: 1.6 }}>วอร์มอัพ 1km · เทมโป 6km · คูลดาวน์ 1km</div>
            {/* terrain wave */}
            <svg viewBox="0 0 200 30" style={{ position: 'absolute', right: -20, bottom: 12, width: 180, opacity: 0.5 }}>
              <path d="M0 25 Q20 5, 40 18 T80 12 T120 20 T160 8 T200 18" stroke="var(--violet-bright)" strokeWidth="1.4" fill="none"/>
            </svg>
            <button className="btn-primary" style={{ width: '100%', marginTop: 16 }}><Ic.Play size={16}/> เริ่มวิ่ง</button>
          </div>
        </div>
        {/* Weekly grid */}
        <div style={{ padding: '14px 24px 0' }}>
          <div className="glass" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span className="t-label">สัปดาห์นี้</span>
              <span style={{ fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 12, color: 'var(--violet-bright)', letterSpacing: '0.08em' }}>42 KM PLANNED</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {week.map((w, i) => {
                const isToday = i === 2;
                return (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '32px 1fr auto auto', alignItems: 'center', gap: 12,
                    padding: '8px 10px', borderRadius: 10,
                    background: isToday ? 'rgba(140,100,255,0.08)' : 'transparent',
                    border: `1px solid ${isToday ? 'var(--violet-edge)' : 'transparent'}`,
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'K2D', fontWeight: 700, fontSize: 13, color: isToday ? 'var(--violet-bright)' : 'var(--ink)' }}>{w.d}</div>
                      <div style={{ fontFamily: 'system-ui', fontSize: 8, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>{w.en}</div>
                    </div>
                    {/* bar */}
                    <div style={{ height: 22, position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        height: 8, borderRadius: 4,
                        width: `${Math.max(8, w.km / 16 * 100)}%`,
                        background: kindColor[w.kind],
                        boxShadow: w.kind === 'tempo' || w.kind === 'long' ? '0 0 10px rgba(120,90,255,0.5)' : 'none',
                      }}/>
                    </div>
                    <span style={{ fontFamily: 'K2D', fontSize: 11, color: 'var(--ink-soft)', minWidth: 70, textAlign: 'right' }}>{w.label}</span>
                    <span className="t-num" style={{ fontSize: 14, color: w.km ? 'var(--ink)' : 'var(--ink-faint)', minWidth: 36, textAlign: 'right' }}>{w.km || '—'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Stats row */}
        <div style={{ padding: '12px 24px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <StatTile label="VO₂ MAX" value="48.2" unit="ml/kg"/>
          <StatTile label="WEEKLY" value="32" unit="km"/>
          <StatTile label="PR · 5K" value="22:14" unit=""/>
        </div>
      </div>
      <TabBar active="workout"/>
    </PhoneFrame>
  );
}
function StatTile({ label, value, unit }) {
  return (
    <div className="glass" style={{ padding: '14px 12px', textAlign: 'left' }}>
      <div style={{ fontFamily: 'system-ui', fontSize: 9, letterSpacing: '0.14em', color: 'var(--ink-soft)' }}>{label}</div>
      <div className="t-num" style={{ fontSize: 22, color: 'var(--ink)', marginTop: 4, lineHeight: 1 }}>{value}</div>
      {unit && <div style={{ fontFamily: 'K2D', fontSize: 10, color: 'var(--ink-soft)', marginTop: 2 }}>{unit}</div>}
    </div>
  );
}

// ─── Food Plan screen ──────────────────────────────────────
function FoodScreen() {
  const meals = [
    { time: '07:30', name: 'มื้อเช้า · BREAKFAST', items: ['ข้าวโอ๊ต + กล้วย + เวย์', 'ไข่ดาว 2 ฟอง'], kcal: 540, p: 38, c: 62, f: 14, done: true },
    { time: '12:30', name: 'มื้อกลางวัน · LUNCH', items: ['ข้าวกล้อง + อกไก่ย่าง', 'ผักรวม + น้ำสลัดงา'], kcal: 720, p: 52, c: 78, f: 18, done: true },
    { time: '16:00', name: 'ของว่าง · SNACK', items: ['โยเกิร์ตกรีก + เบอร์รี่'], kcal: 220, p: 18, c: 22, f: 6, done: false },
    { time: '19:00', name: 'มื้อเย็น · DINNER', items: ['ปลาแซลมอน + มันหวาน', 'บร็อคโคลี่นึ่ง'], kcal: 620, p: 44, c: 48, f: 22, done: false },
  ];
  const eaten = 1260, target = 2100;
  const pct = eaten / target;
  return (
    <PhoneFrame>
      <div style={{ padding: '4px 0 110px' }}>
        <ScreenHeader kicker="MON · 10 MAY · CUTTING" title="แผนอาหาร"/>
        {/* Calorie ring + macros */}
        <div style={{ padding: '14px 24px 0' }}>
          <div className="glass glass-glow" style={{ padding: '22px 22px', display: 'flex', alignItems: 'center', gap: 18 }}>
            <CalorieRing eaten={eaten} target={target}/>
            <div style={{ flex: 1 }}>
              <div className="t-label" style={{ marginBottom: 6 }}>วันนี้</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span className="t-num" style={{ fontSize: 30, color: 'var(--ink)' }}>{eaten}</span>
                <span style={{ fontFamily: 'K2D', fontSize: 13, color: 'var(--ink-mute)' }}>/ {target} kcal</span>
              </div>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <MacroBar label="P · โปรตีน" value={90} target={150} color="oklch(72% 0.20 270)"/>
                <MacroBar label="C · คาร์บ" value={140} target={220} color="oklch(78% 0.16 200)"/>
                <MacroBar label="F · ไขมัน" value={32} target={70}  color="oklch(74% 0.14 80)"/>
              </div>
            </div>
          </div>
        </div>
        {/* Meals */}
        <div style={{ padding: '14px 24px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {meals.map(m => (
            <div key={m.time} className="glass" style={{ padding: 16, opacity: m.done ? 0.65 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="t-num" style={{ fontSize: 16, color: 'var(--ink)' }}>{m.time}</span>
                    {m.done && <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--violet)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 8px var(--violet)' }}><Ic.Check size={12}/></span>}
                  </div>
                  <div style={{ fontFamily: 'K2D', fontSize: 11, color: 'var(--ink-soft)', letterSpacing: '0.04em', marginTop: 1 }}>{m.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="t-num" style={{ fontSize: 18, color: 'var(--ink)' }}>{m.kcal}</div>
                  <div style={{ fontFamily: 'system-ui', fontSize: 9, color: 'var(--ink-soft)', letterSpacing: '0.10em' }}>KCAL</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                {m.items.map(it => (
                  <div key={it} style={{ fontFamily: 'K2D', fontSize: 13, color: 'var(--ink-mute)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--ink-soft)' }}/>{it}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, fontFamily: 'Chakra Petch', fontSize: 11, color: 'var(--ink-soft)', letterSpacing: '0.04em' }}>
                <span>P <span style={{ color: 'var(--ink)' }}>{m.p}g</span></span>
                <span>C <span style={{ color: 'var(--ink)' }}>{m.c}g</span></span>
                <span>F <span style={{ color: 'var(--ink)' }}>{m.f}g</span></span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '14px 24px 0' }}>
          <button className="btn-glass" style={{ width: '100%' }}>+ เพิ่มอาหาร / SCAN BARCODE</button>
        </div>
      </div>
      <TabBar active="log"/>
    </PhoneFrame>
  );
}
function CalorieRing({ eaten, target }) {
  const pct = Math.min(eaten / target, 1);
  const r = 42, c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none"/>
        <circle cx="55" cy="55" r={r} stroke="url(#calGrad)" strokeWidth="6" fill="none"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          strokeLinecap="round" transform="rotate(-90 55 55)"
          style={{ filter: 'drop-shadow(0 0 6px var(--violet))' }}/>
        <defs>
          <linearGradient id="calGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(72% 0.20 270)"/>
            <stop offset="100%" stopColor="oklch(60% 0.20 240)"/>
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="t-num" style={{ fontSize: 22, lineHeight: 1, color: 'var(--ink)' }}>{Math.round(pct * 100)}<span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>%</span></div>
        <div style={{ fontFamily: 'system-ui', fontSize: 9, color: 'var(--ink-soft)', letterSpacing: '0.14em', marginTop: 2 }}>EATEN</div>
      </div>
    </div>
  );
}
function MacroBar({ label, value, target, color }) {
  const pct = Math.min(value / target, 1);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'K2D', fontSize: 10, color: 'var(--ink-soft)', marginBottom: 3 }}>
        <span>{label}</span>
        <span><span className="t-num" style={{ color: 'var(--ink)', fontSize: 11 }}>{value}</span> / {target}g</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct * 100}%`, background: color, boxShadow: `0 0 6px ${color}` }}/>
      </div>
    </div>
  );
}

Object.assign(window, { LibraryScreen, ExerciseDetailScreen, SettingsScreen, I18nCompareBoard, PoseSheet, RunningScreen, FoodScreen, LangToggle, EXERCISES, I18N });
