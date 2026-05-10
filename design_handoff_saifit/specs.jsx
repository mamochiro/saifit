// Saifit — component sheet, state examples, 4-screen composite

// ─── Component sheet ──────────────────────────────────────────
function ComponentSheet() {
  return (
    <div className="saifit-bg saifit-root" style={{
      width: 880, padding: 40, color: 'var(--ink)',
      borderRadius: 24, position: 'relative',
    }}>
      <SectionHeading kicker="01" title="Glass primitives" sub="Surfaces, shadows, edges"/>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 22,
      }}>
        {/* Glass card */}
        <SpecCard label="Glass card · standard">
          <div className="glass" style={{ padding: 22, height: 160 }}>
            <div className="t-label" style={{ marginBottom: 10 }}>STREAK</div>
            <div className="t-num" style={{ fontSize: 56, lineHeight: 1, color: 'var(--ink)' }}>42</div>
            <div style={{ fontFamily: 'K2D', fontSize: 13, color: 'var(--ink-mute)', marginTop: 4 }}>วันติดต่อกัน</div>
          </div>
          <SpecList items={[
            ['background', 'rgba(255,255,255,0.06)'],
            ['blur', 'backdrop-filter blur(24px) saturate(140%)'],
            ['border', '1px solid rgba(255,255,255,0.10)'],
            ['radius', '20px'],
            ['highlight', 'top edge — gradient white/0.18'],
          ]}/>
        </SpecCard>

        {/* Glass card with glow */}
        <SpecCard label="Glass card · accent glow">
          <div className="glass glass-glow" style={{ padding: 22, height: 160 }}>
            <div className="t-label" style={{ marginBottom: 10 }}>PR</div>
            <div className="t-num" style={{ fontSize: 36, lineHeight: 1, color: 'var(--ink)' }}>142.5 <span style={{ fontSize: 16, color: 'var(--ink-mute)' }}>kg</span></div>
            <div style={{ fontFamily: 'K2D', fontSize: 13, color: 'var(--ink-mute)', marginTop: 4 }}>Squat · เพิ่มขึ้น 5kg</div>
          </div>
          <SpecList items={[
            ['ring', '0 0 0 1px oklch(72% 0.20 270 / 25%)'],
            ['lift', '0 24px 60px -20px rgba(120,100,255,0.30)'],
            ['inner gradient', 'top → transparent · violet/0.10'],
          ]}/>
        </SpecCard>
      </div>

      <SectionHeading kicker="02" title="Buttons" sub="56px height, 14px radius" mt={40}/>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginTop: 22,
      }}>
        <SpecCard label="Primary · gradient">
          <button className="btn-primary" style={{ width: '100%' }}>เริ่มออกกำลังกาย <Ic.ArrowRight/></button>
          <SpecList items={[
            ['gradient', '135° · violet → blue'],
            ['weight', '700 · K2D'],
            ['glow', '0 12px 30px -10px violet/55%'],
          ]}/>
        </SpecCard>
        <SpecCard label="LINE · solid">
          <button className="btn-line" style={{ width: '100%' }}><Ic.Line size={22}/>เข้าสู่ระบบด้วย LINE</button>
          <SpecList items={[
            ['fill', '#00B900'],
            ['icon', 'inline svg · 22px'],
          ]}/>
        </SpecCard>
        <SpecCard label="Secondary · glass">
          <button className="btn-glass" style={{ width: '100%' }}><Ic.Google size={20}/>ดำเนินการต่อด้วย Google</button>
          <SpecList items={[
            ['surface', 'white/0.09 + blur(20)'],
            ['border', 'white/0.16'],
          ]}/>
        </SpecCard>
      </div>

      <SectionHeading kicker="03" title="Inputs · pills · nav" mt={40}/>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 22,
      }}>
        <SpecCard label="Glass input · default + focused">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="glass-input">
              <span style={{ color: 'var(--ink-soft)' }}><Ic.At/></span>
              <input placeholder="อีเมล"/>
            </div>
            <div className="glass-input is-focused">
              <span style={{ color: 'var(--violet-bright)' }}><Ic.Lock/></span>
              <input placeholder="รหัสผ่าน" defaultValue="••••••"/>
            </div>
          </div>
          <SpecList items={[
            ['focus ring', '4px · violet / 15%'],
            ['focus border', 'oklch(72% 0.20 270 / 45%)'],
          ]}/>
        </SpecCard>

        <SpecCard label="Filter pills">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="pill is-active">ทั้งหมด</span>
            <span className="pill">สร้างกล้าม</span>
            <span className="pill">ลดไขมัน</span>
            <span className="pill">แข็งแกร่ง</span>
            <span className="tag-violet">ระดับกลาง</span>
          </div>
          <SpecList items={[
            ['idle', 'glass · text muted'],
            ['active', 'violet/12 · ring/25%'],
          ]}/>
        </SpecCard>
      </div>

      <div style={{ marginTop: 24 }}>
        <SpecCard label="Tab bar · glass nav">
          <div style={{ position: 'relative', height: 100 }}>
            <div style={{ position: 'absolute', inset: '12px 0' }}>
              <div className="tabbar" style={{ position: 'relative' }}>
                <div className="tab is-active"><Ic.Home size={22} active/><span>หน้าแรก</span><span className="tab-dot"/></div>
                <div className="tab"><Ic.List size={22}/><span>โปรแกรม</span><span className="tab-dot"/></div>
                <div className="tab"><Ic.Chart size={22}/><span>ความก้าวหน้า</span><span className="tab-dot"/></div>
                <div className="tab"><Ic.Book size={22}/><span>บันทึก</span><span className="tab-dot"/></div>
              </div>
            </div>
          </div>
          <SpecList items={[
            ['height', '76px · radius 26px'],
            ['surface', 'rgba(20,22,30,0.55) · blur(28)'],
            ['active dot', 'violet · glow 14px'],
          ]}/>
        </SpecCard>
      </div>

      <SectionHeading kicker="04" title="Type · color · numerics" mt={40}/>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 22,
      }}>
        <SpecCard label="Type stack">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div className="t-label">DISPLAY · CHAKRA PETCH</div>
              <div className="t-num" style={{ fontSize: 64, lineHeight: 0.9 }}>142.5</div>
            </div>
            <div>
              <div className="t-label">TITLE · K2D 700</div>
              <div style={{ fontFamily: 'K2D', fontWeight: 700, fontSize: 26, letterSpacing: '-0.01em' }}>สวัสดี, Sara</div>
            </div>
            <div>
              <div className="t-label">BODY · K2D 400</div>
              <div style={{ fontFamily: 'K2D', fontSize: 15, color: 'var(--ink-mute)', lineHeight: 1.7 }}>เลือกโปรแกรมที่เหมาะกับเป้าหมายของคุณ</div>
            </div>
            <div>
              <div className="t-label">LABEL · system-ui · uppercase 0.18em</div>
              <div className="t-label" style={{ color: 'var(--ink)' }}>SAIFIT · MON, 10 MAY</div>
            </div>
          </div>
        </SpecCard>

        <SpecCard label="Palette · OKLCH">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Swatch name="Background"  value="oklch(8% 0.005 240)"  bg="oklch(8% 0.005 240)"/>
            <Swatch name="Glass"        value="white / 0.06"          bg="rgba(255,255,255,0.06)" border/>
            <Swatch name="Accent"       value="oklch(72% 0.20 270)"   bg="oklch(72% 0.20 270)"/>
            <Swatch name="Accent · deep" value="oklch(60% 0.20 240)"  bg="oklch(60% 0.20 240)"/>
            <Swatch name="Ink"          value="oklch(95% 0.003 90)"   bg="oklch(95% 0.003 90)" dark/>
            <Swatch name="Ink · muted"  value="oklch(55% 0.004 90)"   bg="oklch(55% 0.004 90)"/>
            <Swatch name="Destructive"  value="oklch(62% 0.20 25)"    bg="oklch(62% 0.20 25)"/>
            <Swatch name="LINE"         value="#00B900"               bg="#00B900"/>
          </div>
        </SpecCard>
      </div>
    </div>
  );
}

function SpecCard({ label, children }) {
  return (
    <div style={{
      borderRadius: 16,
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.06)',
      padding: 20,
    }}>
      <div className="t-label" style={{ marginBottom: 14 }}>{label}</div>
      {children}
    </div>
  );
}

function SpecList({ items }) {
  return (
    <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', gap: 12, fontFamily: 'system-ui', fontSize: 11, color: 'var(--ink-soft)' }}>
          <span style={{ width: 96, flexShrink: 0, letterSpacing: '0.04em' }}>{k}</span>
          <span className="spec-mono" style={{ color: 'var(--ink-mute)' }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function SectionHeading({ kicker, title, sub, mt = 0 }) {
  return (
    <div style={{ marginTop: mt, display: 'flex', alignItems: 'baseline', gap: 14 }}>
      <span className="t-num" style={{ fontSize: 14, color: 'var(--violet-bright)', letterSpacing: '0.06em' }}>{kicker}</span>
      <h3 style={{
        margin: 0, fontFamily: 'K2D', fontWeight: 700, fontSize: 22, color: 'var(--ink)',
      }}>{title}</h3>
      {sub && <span style={{ fontFamily: 'K2D', fontSize: 13, color: 'var(--ink-soft)' }}>· {sub}</span>}
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)', marginLeft: 6 }}/>
    </div>
  );
}

function Swatch({ name, value, bg, border, dark }) {
  return (
    <div style={{
      borderRadius: 10, padding: 10,
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        height: 40, borderRadius: 6,
        background: bg,
        border: border ? '1px solid rgba(255,255,255,0.10)' : 'none',
        marginBottom: 8,
      }}/>
      <div style={{ fontFamily: 'K2D', fontSize: 11, fontWeight: 600, color: 'var(--ink)' }}>{name}</div>
      <div className="spec-mono" style={{ fontSize: 10 }}>{value}</div>
    </div>
  );
}

// ─── State examples ──────────────────────────────────────────
function StateExamples() {
  return (
    <div className="saifit-bg saifit-root" style={{
      width: 880, padding: 40, borderRadius: 24,
    }}>
      <SectionHeading kicker="05" title="Interaction states"/>

      {/* Buttons */}
      <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <StateBlock label="Primary · idle">
          <button className="btn-primary" style={{ width: '100%' }}>เข้าสู่ระบบ <Ic.ArrowRight/></button>
        </StateBlock>
        <StateBlock label="Primary · hover">
          <button className="btn-primary" style={{
            width: '100%', filter: 'brightness(1.08)',
          }}>เข้าสู่ระบบ <Ic.ArrowRight/></button>
        </StateBlock>
        <StateBlock label="Primary · pressed">
          <button className="btn-primary is-pressed" style={{ width: '100%' }}>เข้าสู่ระบบ <Ic.ArrowRight/></button>
        </StateBlock>
      </div>

      {/* Inputs */}
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <StateBlock label="Input · empty">
          <div className="glass-input">
            <span style={{ color: 'var(--ink-soft)' }}><Ic.At/></span>
            <input placeholder="อีเมล"/>
          </div>
        </StateBlock>
        <StateBlock label="Input · focused">
          <div className="glass-input is-focused">
            <span style={{ color: 'var(--violet-bright)' }}><Ic.At/></span>
            <input placeholder="อีเมล" defaultValue="sara@"/>
            <span style={{ width: 1.5, height: 18, background: 'var(--violet-bright)', display: 'inline-block' }}/>
          </div>
        </StateBlock>
        <StateBlock label="Input · error">
          <div className="glass-input" style={{
            borderColor: 'oklch(62% 0.20 25 / 60%)',
            boxShadow: '0 0 0 4px oklch(62% 0.20 25 / 12%)',
          }}>
            <span style={{ color: 'oklch(72% 0.20 25)' }}><Ic.Lock/></span>
            <input type="password" placeholder="รหัสผ่าน" defaultValue="•••"/>
          </div>
        </StateBlock>
      </div>

      {/* Cards */}
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <StateBlock label="Goal card · idle">
          <GoalMini selected={false}/>
        </StateBlock>
        <StateBlock label="Goal card · hover">
          <GoalMini selected={false} hover/>
        </StateBlock>
        <StateBlock label="Goal card · selected">
          <GoalMini selected={true}/>
        </StateBlock>
      </div>

      {/* Pills */}
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <StateBlock label="Pill · idle">
          <span className="pill">สร้างกล้าม</span>
        </StateBlock>
        <StateBlock label="Pill · hover">
          <span className="pill" style={{
            background: 'rgba(255,255,255,0.06)',
            borderColor: 'rgba(255,255,255,0.14)',
            color: 'var(--ink)',
          }}>สร้างกล้าม</span>
        </StateBlock>
        <StateBlock label="Pill · active">
          <span className="pill is-active">สร้างกล้าม</span>
        </StateBlock>
      </div>
    </div>
  );
}

function StateBlock({ label, children }) {
  return (
    <div style={{
      borderRadius: 16,
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.05)',
      padding: '18px 18px 22px',
    }}>
      <div className="t-label" style={{ marginBottom: 14 }}>{label}</div>
      {children}
    </div>
  );
}

function GoalMini({ selected, hover }) {
  return (
    <div className="glass" style={{
      padding: 16, position: 'relative', height: 132,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      ...(selected ? {
        background: 'rgba(140,100,255,0.08)',
        borderColor: 'var(--violet-edge)',
        boxShadow: '0 0 0 1px var(--violet-glow), 0 14px 40px -14px rgba(120,90,255,0.45)',
      } : hover ? {
        background: 'rgba(255,255,255,0.09)',
        borderColor: 'rgba(255,255,255,0.16)',
        transform: 'translateY(-1px)',
      } : {}),
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: selected ? 'rgba(140,100,255,0.18)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${selected ? 'var(--violet-edge)' : 'var(--glass-line)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: selected ? 'var(--violet-bright)' : 'var(--ink-mute)',
      }}>
        <Ic.Barbell size={22} stroke={1.6}/>
      </div>
      <div>
        <div style={{ fontFamily: 'K2D', fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>สร้างกล้าม</div>
        <div style={{
          fontFamily: 'system-ui', fontSize: 10, letterSpacing: '0.10em',
          color: selected ? 'var(--violet-bright)' : 'var(--ink-soft)',
          marginTop: 2, textTransform: 'uppercase',
        }}>HYPERTROPHY</div>
      </div>
      {selected && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          width: 18, height: 18, borderRadius: '50%',
          background: 'var(--violet)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', boxShadow: '0 0 10px var(--violet)',
        }}><Ic.Check size={12}/></div>
      )}
    </div>
  );
}

Object.assign(window, { ComponentSheet, StateExamples });
