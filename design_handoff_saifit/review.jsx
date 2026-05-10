// Saifit sprint review board — feedback from 3 reviewer personas
// Each persona has avatar + sticky notes with severity, screen ref, comment

const REVIEWERS = [
  {
    key: 'ux',
    name: 'อรณิชา · Anna',
    role: 'Senior UX/UI · 8 yrs · ex-LINE Pay',
    avatar: { initials: 'อร', bg: 'oklch(72% 0.20 270)' },
    focus: 'Consistency · hierarchy · microcopy',
    notes: [
      { sev: 'critical', screen: 'Home + Progress', th: '"42" streak ปรากฏซ้ำที่ Home และ Progress · ทั้งสองหน้าใช้เลขเดียวกัน เป็น duplication ที่ทำให้ทั้งคู่อ่อนค่า', en: 'Show streak only on Home. Progress headline should be longest streak (60).' },
      { sev: 'improve', screen: 'Tab bar', th: 'Active tab ใช้สี violet ที่ไอคอนแต่ label ยังคงสีปกติ — มองผ่านแล้วไม่ชัดว่าอยู่หน้าไหน', en: 'Lift active label color to violet AND add 1px top border on the active item.' },
      { sev: 'improve', screen: 'Glass cards', th: 'Border (α 10%) กับ divider ภายใน (α 10%) ใกล้กันเกิน · ทำให้ card ดูแบน ไม่มี hierarchy', en: 'Drop internal dividers to α 6% — keep edges at α 10%.' },
      { sev: 'improve', screen: 'Library + Detail', th: 'ชื่อท่าใช้ EN (Squat, Bench Press) แต่ทุกอย่างรอบ ๆ เป็นไทย · ขาด canonical', en: 'Either fully localize (สควอท · เบนช์เพรส) or accept EN as the canonical exercise name everywhere.' },
      { sev: 'improve', screen: 'Body analysis', th: 'Photo labels เป็นไทย (10 ก.พ.) แต่ stat labels เป็น EN (BODY FAT) · เลือกระบบเดียว', en: 'Pick one date system for the entire screen — TH abbrev or numeric.' },
      { sev: 'nice', screen: 'Onboarding step 1', th: 'ผู้ใช้ส่วนใหญ่อยากได้ทั้ง "สร้างกล้าม" และ "แข็งแกร่ง" · ทำเป็น multi-select', en: 'Allow up to 2 selections; weight by primary.' },
      { sev: 'nice', screen: 'Heatmap', th: 'Cell ทุกอันไม่ตอบสนอง · เพิ่ม tap → tooltip บอกวันที่และ volume ของวันนั้น', en: 'Tap-to-reveal popover keeps it ambient but explorable.' },
    ],
  },
  {
    key: 'tech',
    name: 'วิทย์ · Wit',
    role: 'Staff Engineer · 12 yrs · ex-Sea Group',
    avatar: { initials: 'วท', bg: 'oklch(60% 0.20 240)' },
    focus: 'Performance · offline · data integrity',
    notes: [
      { sev: 'critical', screen: 'Animation system', th: '13 SMIL loops × autoplay พร้อมกันใน Library list = ฆ่าแบตเตอรี่ · ต้อง pause เมื่อ off-screen ด้วย IntersectionObserver', en: 'Show static thumb until tap, OR pause via IO when scrolled out. Test on iPhone 12 ≤30°C device.' },
      { sev: 'critical', screen: 'Glass cards everywhere', th: 'backdrop-filter: blur(24px) บนทุกการ์ด · GPU จะแย่บน Android กลาง ๆ', en: 'Cap to 3–4 visible blurs at once. Consider one blurred layer behind, cards opaque on top.' },
      { sev: 'improve', screen: 'Rest timer', th: 'PWA + screen lock + iOS = timer หยุด · ต้อง service worker + Wake Lock API + haptic on complete', en: 'Wake Lock has no iOS Safari support yet. Plan a fallback: notification at T-0.' },
      { sev: 'improve', screen: 'All Thai screens', th: 'K2D ไม่ครอบ glyph ทุกตัว · ต้อง fallback chain → Noto Sans Thai → system-ui', en: 'font-family: "K2D", "Noto Sans Thai", system-ui, sans-serif;' },
      { sev: 'improve', screen: 'Body analysis', th: 'Body fat scale ไม่มี error state · input >50% หรือ <0% ไม่กำหนดพฤติกรรม', en: 'Clamp + show inline warning. Define DB constraints (DECIMAL(4,1) CHECK 0–60).' },
      { sev: 'improve', screen: 'Progress · PR card', th: '"PR ล่าสุด" ไม่ได้นิยาม · e1RM? max weight? rep PR? · ทีม dev ต้องการ spec', en: 'Choose ONE: max weight at any reps, OR Epley e1RM. Then label clearly.' },
      { sev: 'nice', screen: 'Sync · all data screens', th: 'เพิ่ม "synced 14:32" timestamp ทุกหน้าที่แสดงข้อมูล · ผู้ใช้ออฟไลน์รู้ว่าเห็นข้อมูลเก่า', en: 'Tiny chip top-right: "synced 2 min ago" or "offline · queued".' },
    ],
  },
  {
    key: 'coach',
    name: 'โค้ชต้าร์ · Tar',
    role: 'NSCA-CSCS · 10 yrs · powerlifting + GPP',
    avatar: { initials: 'ตา', bg: 'oklch(70% 0.16 150)' },
    focus: 'Form · programming · safety',
    notes: [
      { sev: 'critical', screen: 'Squat animation', th: 'Animation แสดงเข่าตกเข้าด้านใน (knee valgus) · นี่คือ form ที่ผิดและจะสอนผู้ใช้ผิด', en: 'Knees should track over toes throughout. Re-key: hip width stance, knees out at parallel.' },
      { sev: 'critical', screen: 'Bench animation', th: 'ข้อศอกกางออก 90° · ทำให้ไหล่บาดเจ็บ · ต้อง 45–60° tucked', en: 'Cue elbows in. Re-draw lower position with elbows under wrists, not flared.' },
      { sev: 'critical', screen: 'Running plan', th: 'Week 4 มี 8km tempo @ 5:10/km สำหรับ sub-22 5K — overreach · ต้อง 5–6km หรือเลื่อนไป week 8', en: 'Volume jump too steep. Build to 8km tempo by week 7+ with proper base.' },
      { sev: 'improve', screen: 'Active workout · RPE', th: 'คนไทยส่วนใหญ่ไม่รู้จัก RPE 1–10 · ต้องมี tooltip หรือใช้ "ง่าย/กลาง/หนัก"', en: 'First-time tooltip. Or offer "easy/medium/hard" toggle that maps to RPE 6/7/8.' },
      { sev: 'improve', screen: 'Templates', th: 'PPL ทำตลอดไม่มี deload · ทุก 4–5 สัปดาห์ควรมีสัปดาห์ลดปริมาณ', en: 'Bake in deload week 5/9/13. Volume drop 40%, intensity hold.' },
      { sev: 'improve', screen: 'Streak', th: '"Streak 42 วัน" รวมวันพักหรือไม่? วันพักคือส่วนหนึ่งของการฝึก ไม่ควร reset', en: 'Streak should count "training-week adherence" not "consecutive days". Otherwise punishes good programming.' },
      { sev: 'nice', screen: 'Logger', th: 'หลังเซ็ตเสร็จ ถามแบบ emoji "ง่าย / กลาง / หนัก" · เก็บข้อมูล RIR แบบไม่ต้องสอน', en: 'Three-emoji picker → maps to RIR 3/2/0. Rich data, low friction.' },
    ],
  },
];

function SevBadge({ sev }) {
  const map = {
    critical:  { bg: 'oklch(62% 0.20 25 / 14%)',  border: 'oklch(62% 0.20 25)',   color: 'var(--danger)',         label: 'CRITICAL' },
    improve:   { bg: 'oklch(78% 0.15 80 / 12%)',  border: 'oklch(78% 0.15 80)',   color: 'oklch(78% 0.15 80)',    label: 'IMPROVE' },
    nice:      { bg: 'rgba(255,255,255,0.04)',    border: 'var(--glass-line)',    color: 'var(--ink-mute)',       label: 'NICE-TO-HAVE' },
  };
  const s = map[sev];
  return (
    <span style={{
      padding: '2px 7px', borderRadius: 4,
      background: s.bg, border: `1px solid ${s.border}`,
      fontFamily: 'system-ui', fontSize: 8.5, fontWeight: 700,
      letterSpacing: '0.12em', color: s.color,
    }}>{s.label}</span>
  );
}

function ScreenRef({ children }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 999,
      background: 'rgba(140,100,255,0.10)', border: '1px solid var(--violet-edge)',
      fontFamily: 'Chakra Petch', fontWeight: 600, fontSize: 10, color: 'var(--violet-bright)',
    }}>
      <svg width="9" height="9" viewBox="0 0 12 12"><path d="M2 6h7M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
      {children}
    </span>
  );
}

function ReviewNote({ note, idx }) {
  // gentle rotation — alternating + a touch of randomness via idx
  const tilt = ((idx * 17) % 100 - 50) * 0.012;  // ~ -0.6 to 0.6 deg
  return (
    <div style={{
      padding: 14, borderRadius: 12,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid var(--glass-line)',
      borderLeft: `3px solid ${
        note.sev === 'critical' ? 'var(--danger)'
          : note.sev === 'improve' ? 'oklch(78% 0.15 80)'
          : 'rgba(255,255,255,0.30)'
      }`,
      transform: `rotate(${tilt}deg)`,
      boxShadow: '0 8px 18px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.02)',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
        <SevBadge sev={note.sev}/>
        <ScreenRef>{note.screen}</ScreenRef>
      </div>
      <p style={{ margin: 0, fontFamily: 'K2D', fontSize: 13, lineHeight: 1.55, color: 'var(--ink)' }}>{note.th}</p>
      <p style={{ margin: 0, fontFamily: 'system-ui', fontSize: 11.5, lineHeight: 1.55, color: 'var(--ink-soft)', fontStyle: 'italic' }}>{note.en}</p>
    </div>
  );
}

function ReviewerColumn({ reviewer }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="glass" style={{ padding: 18, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: reviewer.avatar.bg,
          color: 'oklch(8% 0.005 240)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'K2D', fontWeight: 700, fontSize: 14,
          flexShrink: 0,
          boxShadow: `0 0 0 2px ${reviewer.avatar.bg}33, 0 4px 12px rgba(0,0,0,0.4)`,
        }}>{reviewer.avatar.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'K2D', fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{reviewer.name}</div>
          <div style={{ fontFamily: 'Chakra Petch', fontSize: 11, color: 'var(--ink-mute)', marginTop: 2 }}>{reviewer.role}</div>
          <div style={{ marginTop: 8, fontFamily: 'system-ui', fontSize: 9.5, fontWeight: 600, letterSpacing: '0.16em', color: 'var(--ink-soft)' }}>FOCUS · {reviewer.focus.toUpperCase()}</div>
        </div>
      </div>
      {/* Severity counts */}
      <div style={{ display: 'flex', gap: 6 }}>
        {['critical', 'improve', 'nice'].map(sev => {
          const n = reviewer.notes.filter(x => x.sev === sev).length;
          return n ? <SevBadge key={sev} sev={sev}/> : null;
        }).filter(Boolean).map((b, i) => <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{b}<span style={{ fontFamily: 'Chakra Petch', fontSize: 11, color: 'var(--ink)', fontWeight: 700 }}>×{reviewer.notes.filter(x => x.sev === ['critical','improve','nice'][i]).length}</span></span>)}
      </div>
      {reviewer.notes.map((n, i) => <ReviewNote key={i} idx={i} note={n}/>)}
    </div>
  );
}

function SprintReviewBoard() {
  const totalCrit = REVIEWERS.reduce((s, r) => s + r.notes.filter(n => n.sev === 'critical').length, 0);
  const totalImp = REVIEWERS.reduce((s, r) => s + r.notes.filter(n => n.sev === 'improve').length, 0);
  const totalNice = REVIEWERS.reduce((s, r) => s + r.notes.filter(n => n.sev === 'nice').length, 0);

  return (
    <div className="saifit-bg saifit-root" style={{ padding: 48, width: 1280, borderRadius: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 26 }}>
        <div>
          <div className="t-label" style={{ marginBottom: 8 }}>SPRINT 04 · DESIGN REVIEW · 10 MAY 2026</div>
          <h2 style={{ margin: 0, fontFamily: 'K2D', fontWeight: 700, fontSize: 34, color: 'var(--ink)', letterSpacing: '-0.02em' }}>What three reviewers want before we ship.</h2>
          <p style={{ marginTop: 8, fontFamily: 'K2D', fontSize: 14, color: 'var(--ink-mute)', maxWidth: 720, lineHeight: 1.55 }}>21 notes across 14 screens · weighted by reviewer expertise. Address critical (red) before sprint 5 starts. Improve (amber) over sprint 5–6. Nice-to-have parked.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <SummaryStat value={totalCrit} label="CRITICAL"  color="var(--danger)"/>
          <SummaryStat value={totalImp}  label="IMPROVE"   color="oklch(78% 0.15 80)"/>
          <SummaryStat value={totalNice} label="NICE"      color="var(--ink-mute)"/>
        </div>
      </div>

      {/* 3 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'flex-start' }}>
        {REVIEWERS.map(r => <ReviewerColumn key={r.key} reviewer={r}/>)}
      </div>

      {/* Action plan */}
      <div style={{ marginTop: 32, padding: 22, borderRadius: 18, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-line)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div className="t-label" style={{ marginBottom: 4 }}>ACTION PLAN · NEXT 2 SPRINTS</div>
            <h3 style={{ margin: 0, fontFamily: 'K2D', fontWeight: 700, fontSize: 18, color: 'var(--ink)' }}>What blocks dev · what's parallel · what's parked</h3>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <ActionCol title="🛑 BLOCKS DEV" tone="danger" items={[
            'Re-key Squat animation · knees out',
            'Re-key Bench animation · elbows tucked',
            'Pause SMIL off-screen (IntersectionObserver)',
            'Cap concurrent backdrop-blur layers',
            'Define PR formula (e1RM vs max-weight)',
          ]}/>
          <ActionCol title="⚡ PARALLEL · SPRINT 5–6" tone="warning" items={[
            'Rest-timer fallback for iOS Safari',
            'Font fallback chain · K2D → Noto Sans Thai',
            'Add deload week to all templates',
            'Tab bar · violet active label',
            'Localize exercise names OR commit to EN',
            'Sync timestamp chip on data screens',
            'Streak = training-week adherence',
            'Running plan week 4 reduce volume',
          ]}/>
          <ActionCol title="🅿️ PARKED · POST-LAUNCH" tone="muted" items={[
            'Multi-select onboarding goals',
            'Heatmap cell tap → tooltip',
            '"Easy/medium/hard" RPE alternative',
            'Photo timeline cloud sync',
          ]}/>
        </div>
      </div>
    </div>
  );
}

function SummaryStat({ value, label, color }) {
  return (
    <div style={{
      padding: '12px 16px', borderRadius: 12,
      background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-line)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 72,
    }}>
      <span className="t-num" style={{ fontSize: 28, color }}>{value}</span>
      <span style={{ fontFamily: 'system-ui', fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--ink-soft)', marginTop: 2 }}>{label}</span>
    </div>
  );
}
function ActionCol({ title, items, tone }) {
  const toneColor = { danger: 'var(--danger)', warning: 'oklch(78% 0.15 80)', muted: 'var(--ink-mute)' }[tone];
  return (
    <div style={{ padding: 16, borderRadius: 14, background: 'rgba(0,0,0,0.20)', border: '1px solid var(--glass-line)' }}>
      <div style={{ fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 13, letterSpacing: '0.06em', color: toneColor, marginBottom: 10 }}>{title}</div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {items.map((it, i) => (
          <li key={i} style={{ fontFamily: 'K2D', fontSize: 13, color: 'var(--ink)', lineHeight: 1.45, display: 'flex', gap: 8 }}>
            <span style={{ color: toneColor, flexShrink: 0 }}>·</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

window.SprintReviewBoard = SprintReviewBoard;
