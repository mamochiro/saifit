// Saifit error pages + empty states
// Same dark glass aesthetic. Each illustration is line-art SVG matching the pose system.
// Voice: factual, blame-light, action-clear. Thai primary + small EN fallback.

// ─── Shared error layout ───────────────────────────────────
function ErrorScaffold({
  illustration, kicker, title, body,
  primary, primaryHandler, secondary,
  variant = 'default',  // default | warning | danger
  extra,
  showTab = true, activeTab = 'home',
}) {
  const accentByVariant = {
    default: 'var(--violet)',
    warning: 'oklch(78% 0.15 80)',
    danger:  'var(--danger)',
  };
  const accent = accentByVariant[variant];
  return (
    <PhoneFrame>
      <div style={{ padding: '24px 24px 110px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 14 }}>
          {/* halo behind illustration */}
          <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: `radial-gradient(circle, ${accent} 0%, transparent 60%)`,
              opacity: variant === 'default' ? 0.22 : 0.18,
              filter: 'blur(20px)',
            }}/>
            <div style={{ position: 'relative' }}>{illustration}</div>
          </div>

          <div style={{ marginTop: 8 }}>
            {kicker && <div style={{
              fontFamily: 'system-ui', fontSize: 10, fontWeight: 600,
              letterSpacing: '0.22em', color: accent, marginBottom: 8,
            }}>{kicker}</div>}
            <h2 style={{
              margin: 0, fontFamily: 'K2D', fontWeight: 700,
              fontSize: 24, color: 'var(--ink)', letterSpacing: '-0.01em',
              lineHeight: 1.25,
            }}>{title}</h2>
            <p style={{
              margin: '10px auto 0', maxWidth: 290,
              fontFamily: 'K2D', fontSize: 14, lineHeight: 1.6,
              color: 'var(--ink-mute)',
            }}>{body}</p>
          </div>

          {extra}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: showTab ? 24 : 0 }}>
          {primary && (
            <button className="btn-primary" style={{
              width: '100%', height: 56, borderRadius: 14, border: 0,
              background: variant === 'danger'
                ? 'linear-gradient(135deg, oklch(62% 0.20 25), oklch(58% 0.18 15))'
                : 'linear-gradient(135deg, oklch(65% 0.22 280), oklch(60% 0.20 240))',
              color: '#fff', fontFamily: 'K2D', fontWeight: 700, fontSize: 16,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08) inset',
              cursor: 'pointer',
            }}>{primary}</button>
          )}
          {secondary && (
            <button style={{
              width: '100%', height: 48, borderRadius: 12,
              background: 'transparent', border: '1px solid var(--glass-line)',
              color: 'var(--ink)', fontFamily: 'K2D', fontWeight: 600, fontSize: 14,
              cursor: 'pointer',
            }}>{secondary}</button>
          )}
        </div>
      </div>
      {showTab && <TabBar active={activeTab}/>}
    </PhoneFrame>
  );
}

// ─── Illustrations ─────────────────────────────────────────
const illoStroke = 'rgba(255,255,255,0.85)';
const illoFaint = 'rgba(255,255,255,0.25)';

function IlloOffline() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      {/* WiFi waves disabled */}
      <path d="M40 92 Q80 56 120 92" stroke={illoFaint} strokeWidth="2" strokeLinecap="round" strokeDasharray="3 4"/>
      <path d="M52 100 Q80 76 108 100" stroke={illoFaint} strokeWidth="2" strokeLinecap="round" strokeDasharray="3 4"/>
      <path d="M64 108 Q80 96 96 108" stroke={illoFaint} strokeWidth="2" strokeLinecap="round" strokeDasharray="3 4"/>
      <circle cx="80" cy="118" r="4" fill={illoFaint}/>
      {/* slash */}
      <line x1="38" y1="38" x2="122" y2="122" stroke="oklch(78% 0.15 80)" strokeWidth="3" strokeLinecap="round"/>
      <line x1="38" y1="38" x2="122" y2="122" stroke="rgba(0,0,0,0.4)" strokeWidth="6" strokeLinecap="round" opacity="0.0"/>
      {/* dumbbell — offline icon as fitness metaphor */}
      <g transform="translate(54 54) scale(0.7)" stroke={illoStroke} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6">
        <rect x="6"  y="20" width="10" height="20" rx="2"/>
        <rect x="60" y="20" width="10" height="20" rx="2"/>
        <line x1="16" y1="30" x2="60" y2="30"/>
      </g>
    </svg>
  );
}

function Illo404() {
  return (
    <svg width="180" height="160" viewBox="0 0 180 160" fill="none">
      {/* big 404 */}
      <text x="90" y="100" textAnchor="middle" fontFamily="Chakra Petch" fontWeight="700" fontSize="78"
            fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2">404</text>
      <text x="90" y="100" textAnchor="middle" fontFamily="Chakra Petch" fontWeight="700" fontSize="78"
            fill="oklch(72% 0.20 270 / 30%)">404</text>
      {/* small ghost figure walking past */}
      <g transform="translate(132 100)" stroke={illoStroke} strokeWidth="1.4" fill="none" strokeLinecap="round">
        <circle cx="10" cy="0" r="5"/>
        <path d="M10 5 L10 26"/>
        <path d="M10 12 L2 18"/>
        <path d="M10 12 L18 18"/>
        <path d="M10 26 L4 40"/>
        <path d="M10 26 L16 40"/>
      </g>
    </svg>
  );
}

function Illo500() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      {/* server stack */}
      {[40, 64, 88].map((y, i) => (
        <g key={i}>
          <rect x="36" y={y} width="88" height="18" rx="3"
            fill="rgba(255,255,255,0.04)" stroke={illoStroke} strokeWidth="1.4" opacity={1 - i * 0.12}/>
          <circle cx="46" cy={y + 9} r="2" fill={i === 1 ? 'var(--danger)' : 'oklch(70% 0.16 150)'}/>
          <circle cx="54" cy={y + 9} r="2" fill="rgba(255,255,255,0.30)"/>
          <line x1="100" y1={y + 5} x2="118" y2={y + 5} stroke={illoFaint} strokeWidth="1"/>
          <line x1="100" y1={y + 9} x2="118" y2={y + 9} stroke={illoFaint} strokeWidth="1"/>
          <line x1="100" y1={y + 13} x2="115" y2={y + 13} stroke={illoFaint} strokeWidth="1"/>
        </g>
      ))}
      {/* crack/glitch lightning */}
      <path d="M84 38 L72 60 L82 60 L66 88 L78 70 L70 70 L84 38 Z"
            fill="var(--danger)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6"
            style={{ filter: 'drop-shadow(0 0 8px var(--danger))' }}/>
    </svg>
  );
}

function IlloEmptyDumbbell() {
  return (
    <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
      {/* empty barbell on ground with dust line */}
      <line x1="20" y1="100" x2="160" y2="100" stroke={illoFaint} strokeWidth="1" strokeDasharray="2 4"/>
      <g stroke={illoStroke} strokeWidth="1.6" fill="none" strokeLinecap="round">
        <line x1="40" y1="80" x2="140" y2="80"/>
        <rect x="20" y="64" width="22" height="32" rx="3"/>
        <rect x="138" y="64" width="22" height="32" rx="3"/>
        <rect x="14" y="60" width="6" height="40" rx="2"/>
        <rect x="160" y="60" width="6" height="40" rx="2"/>
      </g>
      {/* sparkle */}
      <g transform="translate(90 36)">
        <path d="M0 -10 L2 -2 L10 0 L2 2 L0 10 L-2 2 L-10 0 L-2 -2 Z" fill="oklch(72% 0.20 270 / 60%)"/>
      </g>
    </svg>
  );
}

function IlloEmptyChart() {
  return (
    <svg width="180" height="140" viewBox="0 0 180 140" fill="none">
      {/* empty axes + dotted line */}
      <line x1="30" y1="20" x2="30" y2="110" stroke={illoFaint} strokeWidth="1.4"/>
      <line x1="30" y1="110" x2="160" y2="110" stroke={illoFaint} strokeWidth="1.4"/>
      <path d="M40 96 Q70 90 90 80 T140 50" stroke="oklch(72% 0.20 270 / 30%)" strokeWidth="1.6" strokeDasharray="3 3" fill="none"/>
      {/* trophy ghost */}
      <g transform="translate(90 60)" stroke={illoStroke} strokeWidth="1.4" fill="none" strokeLinecap="round">
        <path d="M-14 -16 L14 -16 L12 4 Q0 14 -12 4 Z"/>
        <path d="M-14 -10 Q-22 -10 -22 0 Q-22 6 -14 6"/>
        <path d="M14 -10 Q22 -10 22 0 Q22 6 14 6"/>
        <line x1="-6" y1="6" x2="6" y2="6"/>
        <line x1="0" y1="6" x2="0" y2="14"/>
        <rect x="-8" y="14" width="16" height="4" rx="1"/>
      </g>
    </svg>
  );
}

function IlloPermission() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      <circle cx="80" cy="80" r="56" fill="none" stroke={illoFaint} strokeWidth="1.4" strokeDasharray="2 4"/>
      {/* bell */}
      <g transform="translate(80 76)" stroke={illoStroke} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-22 14 Q-22 -14 0 -16 Q22 -14 22 14 L26 18 L-26 18 Z"/>
        <path d="M0 -16 L0 -22"/>
        <path d="M-6 22 Q-6 30 0 30 Q6 30 6 22"/>
      </g>
      {/* slashed circle */}
      <circle cx="116" cy="44" r="14" fill="oklch(8% 0.005 240)" stroke="oklch(78% 0.15 80)" strokeWidth="2"/>
      <line x1="106" y1="34" x2="126" y2="54" stroke="oklch(78% 0.15 80)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function IlloSyncConflict() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      {/* two clouds with sync arrows, broken */}
      <g stroke={illoStroke} strokeWidth="1.6" fill="rgba(255,255,255,0.04)" strokeLinejoin="round">
        <path d="M30 80 Q22 80 22 70 Q22 60 32 60 Q34 50 46 50 Q56 50 58 60 Q66 60 66 70 Q66 80 58 80 Z"/>
        <path d="M94 80 Q86 80 86 70 Q86 60 96 60 Q98 50 110 50 Q120 50 122 60 Q130 60 130 70 Q130 80 122 80 Z"/>
      </g>
      {/* arrows broken in middle */}
      <path d="M68 64 L82 64" stroke="oklch(78% 0.15 80)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M82 64 L78 60 M82 64 L78 68" stroke="oklch(78% 0.15 80)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M82 76 L68 76" stroke="oklch(78% 0.15 80)" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3"/>
      <path d="M68 76 L72 72 M68 76 L72 80" stroke="oklch(78% 0.15 80)" strokeWidth="2" strokeLinecap="round"/>
      {/* alert badge */}
      <circle cx="80" cy="110" r="14" fill="oklch(78% 0.15 80 / 18%)" stroke="oklch(78% 0.15 80)" strokeWidth="1.6"/>
      <line x1="80" y1="104" x2="80" y2="112" stroke="oklch(78% 0.15 80)" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="80" cy="116" r="1.2" fill="oklch(78% 0.15 80)"/>
    </svg>
  );
}

function IlloMaintenance() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      {/* wrench + gear */}
      <circle cx="80" cy="80" r="30" fill="none" stroke={illoStroke} strokeWidth="1.6"/>
      <circle cx="80" cy="80" r="10" fill="none" stroke={illoStroke} strokeWidth="1.6"/>
      {[0, 60, 120, 180, 240, 300].map(a => (
        <rect key={a} x="76" y="44" width="8" height="10" rx="1.5"
              fill="rgba(255,255,255,0.08)" stroke={illoStroke} strokeWidth="1.4"
              transform={`rotate(${a} 80 80)`}/>
      ))}
      <g transform="translate(116 110) rotate(35)" stroke={illoStroke} strokeWidth="1.6" fill="rgba(255,255,255,0.04)" strokeLinejoin="round">
        <path d="M0 0 L20 0 L20 6 L4 6 L4 26 L-2 26 L-2 6 Q-8 6 -8 0 Q-8 -8 0 -8 Q-2 -4 0 0 Z"/>
      </g>
    </svg>
  );
}

// ─── Concrete error / empty screens ────────────────────────
function OfflineScreen() {
  return (
    <ErrorScaffold
      variant="warning"
      illustration={<IlloOffline/>}
      kicker="OFFLINE · 503"
      title="ไม่มีการเชื่อมต่ออินเทอร์เน็ต"
      body={<>ไม่ต้องห่วง — เซ็ตของคุณยังถูกบันทึกในเครื่อง<br/>เราจะซิงค์ให้อัตโนมัติเมื่อกลับมาออนไลน์</>}
      primary="ลองอีกครั้ง"
      secondary="ทำงานแบบออฟไลน์ต่อ"
      extra={
        <div style={{ marginTop: 4, padding: '10px 14px', borderRadius: 10,
          background: 'rgba(140,100,255,0.08)', border: '1px solid var(--violet-edge)',
          fontFamily: 'Chakra Petch', fontSize: 11, color: 'var(--violet-bright)',
          display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'oklch(70% 0.16 150)', boxShadow: '0 0 6px oklch(70% 0.16 150)' }}/>
          3 SETS · QUEUED FOR SYNC
        </div>
      }
    />
  );
}

function NotFoundScreen() {
  return (
    <ErrorScaffold
      illustration={<Illo404/>}
      kicker="404 · NOT FOUND"
      title="ไม่พบหน้าที่คุณต้องการ"
      body="ลิงก์อาจจะหมดอายุ หรือโปรแกรมนี้ถูกลบออกแล้ว"
      primary="กลับหน้าแรก"
      secondary="ดูโปรแกรมทั้งหมด"
    />
  );
}

function ServerErrorScreen() {
  return (
    <ErrorScaffold
      variant="danger"
      illustration={<Illo500/>}
      kicker="500 · SERVER ERROR"
      title="ระบบขัดข้องชั่วคราว"
      body="ทีมของเรากำลังแก้ไข ลองใหม่อีกครั้งใน 1–2 นาที"
      primary="ลองอีกครั้ง"
      secondary="แจ้งปัญหา"
      extra={
        <div style={{ marginTop: 4, fontFamily: 'Chakra Petch', fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>
          ERR · 5xx · req_a8f3·12:42:08
        </div>
      }
    />
  );
}

function MaintenanceScreen() {
  return (
    <ErrorScaffold
      variant="warning"
      illustration={<IlloMaintenance/>}
      kicker="MAINTENANCE · v1.4.0"
      title="กำลังอัปเดตระบบ"
      body={<>เรากำลังเพิ่มฟีเจอร์ใหม่ ใช้เวลาประมาณ 5 นาที<br/>ขอบคุณที่อดทนรอ 🙏</>}
      primary="รอสักครู่"
      extra={
        <div style={{ marginTop: 6, width: 220, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{ width: '64%', height: '100%', background: 'linear-gradient(90deg, oklch(65% 0.22 280), oklch(60% 0.20 240))' }}/>
        </div>
      }
    />
  );
}

function PermissionDeniedScreen() {
  return (
    <ErrorScaffold
      variant="warning"
      illustration={<IlloPermission/>}
      kicker="NOTIFICATIONS · OFF"
      title="เปิดการแจ้งเตือนเพื่อใช้งานเต็มรูปแบบ"
      body="เราจะเตือนเมื่อพักครบ ส่ง streak reminder และแจ้งเมื่อทำ PR ใหม่ — ไม่มีอย่างอื่น"
      primary="เปิดการแจ้งเตือน"
      secondary="ใช้แบบไม่มีการแจ้งเตือน"
    />
  );
}

function SyncConflictScreen() {
  return (
    <ErrorScaffold
      variant="warning"
      illustration={<IlloSyncConflict/>}
      kicker="CONFLICT · 2 VERSIONS"
      title="พบเซ็ตที่บันทึกซ้ำกัน"
      body="คุณแก้ไขเซ็ต Squat 4×5 ที่ 110 kg จากอุปกรณ์อื่น เลือกเวอร์ชันที่ต้องการเก็บ"
      primary="เก็บเวอร์ชันล่าสุด"
      secondary="รวมทั้งสองเวอร์ชัน"
      extra={
        <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: 280 }}>
          <ConflictCol when="อุปกรณ์นี้" weight="110" reps="5" time="14:32"/>
          <ConflictCol when="คลาวด์" weight="112.5" reps="5" time="14:34" preferred/>
        </div>
      }
    />
  );
}

function ConflictCol({ when, weight, reps, time, preferred }) {
  return (
    <div style={{
      padding: 12, borderRadius: 10,
      background: preferred ? 'rgba(140,100,255,0.10)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${preferred ? 'var(--violet-edge)' : 'var(--glass-line)'}`,
      textAlign: 'center',
    }}>
      <div style={{ fontFamily: 'system-ui', fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color: preferred ? 'var(--violet-bright)' : 'var(--ink-soft)', marginBottom: 4 }}>{when.toUpperCase()}{preferred && ' · NEWER'}</div>
      <div className="t-num" style={{ fontSize: 18, color: 'var(--ink)' }}>{weight}<span style={{ fontFamily: 'K2D', fontSize: 11, color: 'var(--ink-mute)', marginLeft: 4 }}>kg × {reps}</span></div>
      <div style={{ fontFamily: 'Chakra Petch', fontSize: 10, color: 'var(--ink-faint)', marginTop: 2 }}>{time}</div>
    </div>
  );
}

function EmptyWorkoutsScreen() {
  return (
    <ErrorScaffold
      illustration={<IlloEmptyDumbbell/>}
      kicker="วันแรกของคุณ"
      title="ยังไม่มีการออกกำลังกาย"
      body="เริ่มจากโปรแกรมที่เราแนะนำ หรือสร้างของคุณเอง — เซ็ตแรกอยู่ห่างไปแค่หนึ่งคลิก"
      primary="เลือกโปรแกรมแนะนำ"
      secondary="สร้างโปรแกรมของฉัน"
      activeTab="workout"
    />
  );
}

function EmptyPRsScreen() {
  return (
    <ErrorScaffold
      illustration={<IlloEmptyChart/>}
      kicker="STATS · NO RECORDS YET"
      title="PR แรกของคุณรออยู่"
      body="บันทึกเซ็ตให้ครบ 5 ครั้ง แล้วเราจะเริ่มติดตามสถิติส่วนตัวให้คุณ"
      primary="ดูโปรแกรม"
      secondary="ดูตัวอย่างกราฟ"
      activeTab="progress"
    />
  );
}

// ─── Inline error patterns (toast / inline / banner) ───────
function ErrorPatternsBoard() {
  return (
    <div className="saifit-bg saifit-root" style={{ padding: 48, width: 1100, borderRadius: 28 }}>
      <div style={{ marginBottom: 22 }}>
        <div className="t-label" style={{ marginBottom: 8 }}>ERROR PATTERNS · INLINE / TOAST / BANNER</div>
        <h2 style={{ margin: 0, fontFamily: 'K2D', fontWeight: 700, fontSize: 28, color: 'var(--ink)', letterSpacing: '-0.02em' }}>Three weights of error.</h2>
        <p style={{ marginTop: 8, fontFamily: 'K2D', fontSize: 14, color: 'var(--ink-mute)', maxWidth: 580 }}>Full-screen errors are a last resort. Most failures fit a toast (auto-dismiss), an inline message (form-level), or a banner (system-level).</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
        {/* Toast */}
        <PatternCard heading="A · TOAST" caption="3-second auto-dismiss · top of screen">
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: 16, borderRadius: 12, height: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 24 }}>
            <Toast variant="success">เซ็ตที่ 3 บันทึกแล้ว · 110 kg × 5</Toast>
          </div>
          <CodeBlock>{`<Toast variant="success" timeout={3000}>
  เซ็ตที่ 3 บันทึกแล้ว · 110 kg × 5
</Toast>`}</CodeBlock>
        </PatternCard>

        {/* Inline */}
        <PatternCard heading="B · INLINE" caption="Form / field-level · stays until fixed">
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: 16, borderRadius: 12, height: 200 }}>
            <div style={{ fontFamily: 'system-ui', fontSize: 9, letterSpacing: '0.18em', fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 6 }}>EMAIL · อีเมล</div>
            <div style={{ height: 44, padding: '0 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--danger)', display: 'flex', alignItems: 'center', fontFamily: 'K2D', fontSize: 14, color: 'var(--ink)', boxShadow: '0 0 0 3px oklch(62% 0.20 25 / 18%)' }}>sara@gmal</div>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'K2D', fontSize: 12, color: 'var(--danger)' }}>
              <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.4"/><line x1="6" y1="3" x2="6" y2="7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="6" cy="9" r="0.8" fill="currentColor"/></svg>
              รูปแบบอีเมลไม่ถูกต้อง
            </div>
          </div>
          <CodeBlock>{`<Field error="รูปแบบอีเมลไม่ถูกต้อง">
  <Input value="sara@gmal"/>
</Field>`}</CodeBlock>
        </PatternCard>

        {/* Banner */}
        <PatternCard heading="C · BANNER" caption="System-wide · sticky · dismissible">
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: 16, borderRadius: 12, height: 200 }}>
            <Banner variant="warning">ระบบจะปิดปรับปรุงคืนนี้ 02:00–02:15 · ขออภัยในความไม่สะดวก</Banner>
            <div style={{ marginTop: 12 }}>
              <Banner variant="info">เวอร์ชันใหม่ v1.4.0 พร้อมแล้ว · แตะเพื่ออัปเดต</Banner>
            </div>
          </div>
          <CodeBlock>{`<Banner variant="warning" dismissible>
  ระบบจะปิดปรับปรุงคืนนี้ 02:00–02:15
</Banner>`}</CodeBlock>
        </PatternCard>
      </div>

      {/* Severity matrix */}
      <div style={{ marginTop: 22, padding: 18, borderRadius: 16, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-line)' }}>
        <div className="t-label" style={{ marginBottom: 12 }}>WHEN TO USE WHICH</div>
        <div style={{ display: 'grid', gridTemplateColumns: '110px repeat(5, 1fr)', gap: 8, fontFamily: 'K2D', fontSize: 12, alignItems: 'center' }}>
          <span/>
          <Th>SAVE OK</Th><Th>FORM ERR</Th><Th>NETWORK</Th><Th>SERVER</Th><Th>MAINTENANCE</Th>
          <RowL>Toast</RowL>
            <Cell active>auto-dismiss</Cell><Cell/><Cell active>"saved offline"</Cell><Cell/><Cell/>
          <RowL>Inline</RowL>
            <Cell/><Cell active>field msg</Cell><Cell/><Cell/><Cell/>
          <RowL>Banner</RowL>
            <Cell/><Cell/><Cell active>top sticky</Cell><Cell active>retry CTA</Cell><Cell active>scheduled</Cell>
          <RowL>Full-screen</RowL>
            <Cell/><Cell/><Cell/><Cell active>hard 5xx</Cell><Cell active>during deploy</Cell>
        </div>
      </div>
    </div>
  );
}

function PatternCard({ heading, caption, children }) {
  return (
    <div style={{ padding: 18, borderRadius: 16, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-line)', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <div className="t-label" style={{ marginBottom: 4 }}>{heading}</div>
        <div style={{ fontFamily: 'K2D', fontSize: 12, color: 'var(--ink-mute)' }}>{caption}</div>
      </div>
      {children}
    </div>
  );
}
function Toast({ variant = 'success', children }) {
  const colorByV = { success: 'oklch(70% 0.16 150)', warning: 'oklch(78% 0.15 80)', danger: 'var(--danger)' };
  const c = colorByV[variant];
  return (
    <div className="glass" style={{ padding: '12px 14px', display: 'inline-flex', alignItems: 'center', gap: 10, borderRadius: 12, fontFamily: 'K2D', fontSize: 13, color: 'var(--ink)' }}>
      <span style={{ width: 22, height: 22, borderRadius: '50%', background: `${c}22`, border: `1px solid ${c}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: c }}>
        <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2.5 6.5l2.5 2.5L10 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
      {children}
    </div>
  );
}
function Banner({ variant = 'warning', children }) {
  const colorByV = { warning: 'oklch(78% 0.15 80)', info: 'oklch(72% 0.20 270)', danger: 'var(--danger)' };
  const c = colorByV[variant];
  return (
    <div style={{ padding: '10px 12px', borderRadius: 10, background: `${c}11`, border: `1px solid ${c}55`, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'K2D', fontSize: 13, color: 'var(--ink)' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}`, flexShrink: 0 }}/>
      <span style={{ flex: 1 }}>{children}</span>
      <span style={{ color: 'var(--ink-mute)', fontSize: 16, cursor: 'pointer' }}>×</span>
    </div>
  );
}
function CodeBlock({ children }) {
  return (
    <pre style={{
      margin: 0, padding: 12, borderRadius: 8,
      background: 'rgba(0,0,0,0.4)', border: '1px solid var(--glass-line)',
      fontFamily: 'Chakra Petch', fontSize: 11, color: 'var(--ink-mute)',
      whiteSpace: 'pre-wrap', lineHeight: 1.5,
    }}>{children}</pre>
  );
}
function Th({ children }) {
  return <span style={{ fontFamily: 'system-ui', fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--ink-soft)', textAlign: 'center' }}>{children}</span>;
}
function RowL({ children }) {
  return <span style={{ fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 12, color: 'var(--ink)' }}>{children}</span>;
}
function Cell({ children, active }) {
  return (
    <span style={{
      padding: '8px 6px', borderRadius: 6, textAlign: 'center',
      background: active ? 'rgba(140,100,255,0.10)' : 'transparent',
      border: `1px solid ${active ? 'var(--violet-edge)' : 'var(--glass-line)'}`,
      fontFamily: 'K2D', fontSize: 11, color: active ? 'var(--violet-bright)' : 'var(--ink-faint)',
    }}>{children || '—'}</span>
  );
}

Object.assign(window, {
  ErrorScaffold, OfflineScreen, NotFoundScreen, ServerErrorScreen, MaintenanceScreen,
  PermissionDeniedScreen, SyncConflictScreen, EmptyWorkoutsScreen, EmptyPRsScreen,
  ErrorPatternsBoard,
});
