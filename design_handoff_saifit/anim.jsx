// Saifit animated exercise figures — SMIL-based looping line art
// Each animation uses a 2.5s loop: hold start (0.4) → concentric (0.6) → hold peak (0.3) → eccentric (0.8) → rest (0.4)

const ANIM_TIMING = '2.5s';
// keyTimes: 0 → 0.16 (start hold end) → 0.40 (peak reached) → 0.52 (peak hold end) → 0.84 (back to start) → 1
const KEY_TIMES = '0; 0.16; 0.40; 0.52; 0.84; 1';
const KEY_SPLINES = '.25 .1 .25 1; .25 .1 .25 1; .42 0 .58 1; .42 0 .58 1; .25 .1 .25 1';

const STROKE = 'rgba(255,255,255,0.85)';
const HI = 'oklch(72% 0.20 270 / 55%)';

function smilAttr(values) {
  return {
    attributeName: 'd', dur: ANIM_TIMING, repeatCount: 'indefinite',
    values, keyTimes: KEY_TIMES, calcMode: 'spline', keySplines: KEY_SPLINES,
  };
}

// ─── Anim · Squat ───────────────────────────────────────────
function AnimSquat({ size = 200, showMotion = true, paused }) {
  const playState = paused ? 'paused' : 'running';
  const torsoVals = [
    'M40 32 L40 56 Q50 60 60 56 L60 32',  // standing
    'M40 32 L40 56 Q50 60 60 56 L60 32',
    'M40 38 L42 60 Q50 64 58 60 L60 38',  // squat — slight forward lean
    'M40 38 L42 60 Q50 64 58 60 L60 38',
    'M40 32 L40 56 Q50 60 60 56 L60 32',
    'M40 32 L40 56 Q50 60 60 56 L60 32',
  ].join(';');
  const lLegVals = [
    'M42 56 L42 90 L42 116',                // straight
    'M42 56 L42 90 L42 116',
    'M42 60 L34 84 L42 116',                // bent (knee out)
    'M42 60 L34 84 L42 116',
    'M42 56 L42 90 L42 116',
    'M42 56 L42 90 L42 116',
  ].join(';');
  const rLegVals = [
    'M58 56 L58 90 L58 116',
    'M58 56 L58 90 L58 116',
    'M58 60 L66 84 L58 116',
    'M58 60 L66 84 L58 116',
    'M58 56 L58 90 L58 116',
    'M58 56 L58 90 L58 116',
  ].join(';');
  // Head y bobs
  const headCY = ['14','14','20','20','14','14'].join(';');
  // Bar on back
  const barY = ['30','30','36','36','30','30'].join(';');

  return (
    <svg width={size} height={size * 1.05} viewBox="0 0 100 120"
         style={{ animationPlayState: playState }} fill="none">
      {/* depth indicator (parallel line) */}
      {showMotion && (
        <line x1="20" y1="84" x2="80" y2="84"
              stroke="oklch(72% 0.20 270 / 50%)" strokeWidth="0.6"
              strokeDasharray="3 2"/>
      )}
      {/* motion arc — tiny dashed up-down at hip */}
      {showMotion && (
        <line x1="50" y1="55" x2="50" y2="65"
              stroke="oklch(72% 0.20 270 / 45%)" strokeWidth="0.8"
              strokeDasharray="1.5 1.5" strokeLinecap="round"/>
      )}
      {/* head */}
      <circle cx="50" r="6" fill="none" stroke={STROKE} strokeWidth="1.4">
        {!paused && <animate attributeName="cy" values={headCY} dur={ANIM_TIMING} repeatCount="indefinite" keyTimes={KEY_TIMES} calcMode="spline" keySplines={KEY_SPLINES}/>}
      </circle>
      {/* bar */}
      <line x1="22" x2="78" stroke={STROKE} strokeWidth="1.6" strokeLinecap="round">
        {!paused && <animate attributeName="y1" values={barY} dur={ANIM_TIMING} repeatCount="indefinite" keyTimes={KEY_TIMES} calcMode="spline" keySplines={KEY_SPLINES}/>}
        {!paused && <animate attributeName="y2" values={barY} dur={ANIM_TIMING} repeatCount="indefinite" keyTimes={KEY_TIMES} calcMode="spline" keySplines={KEY_SPLINES}/>}
      </line>
      {/* torso */}
      <path stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" d={torsoVals.split(';')[0]}>
        {!paused && <animate {...smilAttr(torsoVals)}/>}
      </path>
      {/* legs */}
      <path stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" d={lLegVals.split(';')[0]}>
        {!paused && <animate {...smilAttr(lLegVals)}/>}
      </path>
      <path stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" d={rLegVals.split(';')[0]}>
        {!paused && <animate {...smilAttr(rLegVals)}/>}
      </path>
      {/* joint dots */}
      <circle cx="42" cy="56" r="1.6" fill={STROKE}/>
      <circle cx="58" cy="56" r="1.6" fill={STROKE}/>
    </svg>
  );
}

// ─── Anim · Bench Press ────────────────────────────────────
function AnimBench({ size = 200, showMotion = true, paused }) {
  // bar travels from chest (low) → lockout (up)
  const barY = ['56','56','38','38','56','56'].join(';');
  const lArmEndY = barY;
  const rArmEndY = barY;
  return (
    <svg width={size} height={size * 1.05} viewBox="0 0 100 120" fill="none">
      {/* bench */}
      <line x1="14" y1="78" x2="86" y2="78" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="20" y1="78" x2="20" y2="100" stroke={STROKE} strokeWidth="1.2"/>
      <line x1="80" y1="78" x2="80" y2="100" stroke={STROKE} strokeWidth="1.2"/>
      {/* trajectory */}
      {showMotion && (
        <line x1="50" y1="40" x2="50" y2="58"
              stroke="oklch(72% 0.20 270 / 45%)" strokeWidth="0.8"
              strokeDasharray="1.5 1.5" strokeLinecap="round"/>
      )}
      {/* head */}
      <circle cx="22" cy="62" r="6" fill="none" stroke={STROKE} strokeWidth="1.4"/>
      {/* torso lying */}
      <path d="M28 64 Q50 62 72 64 L72 74 Q50 76 28 74 Z" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      {/* legs bent */}
      <path d="M70 74 L80 90 L82 102" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M64 74 L72 92 L74 104" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      {/* arms - animated y */}
      <line x1="44" y1="64" x2="44" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
        {!paused && <animate attributeName="y2" values={lArmEndY} dur={ANIM_TIMING} repeatCount="indefinite" keyTimes={KEY_TIMES} calcMode="spline" keySplines={KEY_SPLINES}/>}
      </line>
      <line x1="58" y1="64" x2="58" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
        {!paused && <animate attributeName="y2" values={lArmEndY} dur={ANIM_TIMING} repeatCount="indefinite" keyTimes={KEY_TIMES} calcMode="spline" keySplines={KEY_SPLINES}/>}
      </line>
      {/* bar */}
      <line x1="32" x2="70" stroke={STROKE} strokeWidth="1.8" strokeLinecap="round">
        {!paused && <animate attributeName="y1" values={barY} dur={ANIM_TIMING} repeatCount="indefinite" keyTimes={KEY_TIMES} calcMode="spline" keySplines={KEY_SPLINES}/>}
        {!paused && <animate attributeName="y2" values={barY} dur={ANIM_TIMING} repeatCount="indefinite" keyTimes={KEY_TIMES} calcMode="spline" keySplines={KEY_SPLINES}/>}
      </line>
      <circle cx="32" r="2.6" fill={STROKE}>
        {!paused && <animate attributeName="cy" values={barY} dur={ANIM_TIMING} repeatCount="indefinite" keyTimes={KEY_TIMES} calcMode="spline" keySplines={KEY_SPLINES}/>}
      </circle>
      <circle cx="70" r="2.6" fill={STROKE}>
        {!paused && <animate attributeName="cy" values={barY} dur={ANIM_TIMING} repeatCount="indefinite" keyTimes={KEY_TIMES} calcMode="spline" keySplines={KEY_SPLINES}/>}
      </circle>
    </svg>
  );
}

// ─── Anim · Plank (breathing) ──────────────────────────────
function AnimPlank({ size = 200, paused }) {
  const torsoY = ['56','55.4','56','56.6','56'].join(';');
  return (
    <svg width={size} height={size * 1.05} viewBox="0 0 100 120" fill="none">
      <circle cx="22" cy="60" r="6" stroke={STROKE} strokeWidth="1.4" fill="none"/>
      <path stroke={STROKE} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M28 56 L84 60 L84 68 L28 64 Z">
        {!paused && <animate attributeName="d" dur="3s" repeatCount="indefinite"
          values="M28 56 L84 60 L84 68 L28 64 Z;M28 54 L84 58 L84 70 L28 66 Z;M28 56 L84 60 L84 68 L28 64 Z"/>}
      </path>
      <path d="M28 60 L24 84" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="14" y1="84" x2="34" y2="84" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M84 64 L96 76" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="92" y1="80" x2="100" y2="80" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round"/>
      {/* timer ring */}
      <circle cx="50" cy="62" r="46" stroke="oklch(72% 0.20 270 / 30%)" strokeWidth="0.8" fill="none" strokeDasharray="289" strokeDashoffset="0">
        {!paused && <animate attributeName="stroke-dashoffset" from="289" to="0" dur="60s" repeatCount="indefinite"/>}
      </circle>
    </svg>
  );
}

// ─── Anim · Pull-up ────────────────────────────────────────
function AnimPullUp({ size = 200, paused }) {
  const headCY = ['32','32','16','16','32','32'].join(';');
  const torsoY = ['38','38','22','22','38','38'].join(';');
  return (
    <svg width={size} height={size * 1.05} viewBox="0 0 100 120" fill="none">
      <line x1="20" y1="10" x2="80" y2="10" stroke={STROKE} strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="34" cy="12" r="2.5" fill={STROKE}/>
      <circle cx="66" cy="12" r="2.5" fill={STROKE}/>
      <line x1="34" y1="12" x2="34" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
        {!paused && <animate attributeName="y2" values={torsoY} dur={ANIM_TIMING} repeatCount="indefinite" keyTimes={KEY_TIMES} calcMode="spline" keySplines={KEY_SPLINES}/>}
      </line>
      <line x1="66" y1="12" x2="66" stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
        {!paused && <animate attributeName="y2" values={torsoY} dur={ANIM_TIMING} repeatCount="indefinite" keyTimes={KEY_TIMES} calcMode="spline" keySplines={KEY_SPLINES}/>}
      </line>
      <circle cx="50" r="6" fill="none" stroke={STROKE} strokeWidth="1.4">
        {!paused && <animate attributeName="cy" values={headCY} dur={ANIM_TIMING} repeatCount="indefinite" keyTimes={KEY_TIMES} calcMode="spline" keySplines={KEY_SPLINES}/>}
      </circle>
    </svg>
  );
}

// ─── Muscle map (front + back) ─────────────────────────────
function MuscleMap({ size = 140, primary = [], secondary = [], view = 'front', label }) {
  const has = (k) => primary.includes(k) ? 'primary' : secondary.includes(k) ? 'secondary' : 'none';
  const fill = (k) => {
    const s = has(k);
    return s === 'primary' ? 'oklch(72% 0.20 270 / 70%)' : s === 'secondary' ? 'oklch(72% 0.20 270 / 30%)' : 'rgba(255,255,255,0.10)';
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size * 1.5} viewBox="0 0 100 150">
        {/* head */}
        <circle cx="50" cy="14" r="7" fill="none" stroke="rgba(255,255,255,0.30)" strokeWidth="1"/>
        {/* torso outline */}
        <path d="M36 26 L36 34 L30 38 L30 60 L36 66 L36 90 L42 92 L42 122 L46 148 L42 148 L40 124 L36 96 L30 96 L30 60 L24 56 L24 36 L34 24 Z M64 26 L64 34 L70 38 L70 60 L64 66 L64 90 L58 92 L58 122 L54 148 L58 148 L60 124 L64 96 L70 96 L70 60 L76 56 L76 36 L66 24 Z"
              fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
        {/* center body */}
        <path d="M36 26 Q50 22 64 26 L64 90 Q50 92 36 90 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8"/>

        {view === 'front' ? (
          <>
            {/* chest */}
            <path d="M37 32 L49 32 L49 50 L37 48 Z" fill={fill('chest')}/>
            <path d="M51 32 L63 32 L63 48 L51 50 Z" fill={fill('chest')}/>
            {/* abs */}
            <rect x="44" y="52" width="12" height="28" fill={fill('abs')}/>
            {/* quads */}
            <path d="M40 92 L48 94 L46 122 L40 120 Z" fill={fill('quads')}/>
            <path d="M52 94 L60 92 L60 120 L54 122 Z" fill={fill('quads')}/>
            {/* shoulders (deltoid) */}
            <ellipse cx="32" cy="32" rx="6" ry="7" fill={fill('shoulders')}/>
            <ellipse cx="68" cy="32" rx="6" ry="7" fill={fill('shoulders')}/>
            {/* biceps */}
            <ellipse cx="26" cy="50" rx="4" ry="9" fill={fill('biceps')}/>
            <ellipse cx="74" cy="50" rx="4" ry="9" fill={fill('biceps')}/>
          </>
        ) : (
          <>
            {/* traps */}
            <path d="M40 26 L60 26 L56 38 L44 38 Z" fill={fill('traps')}/>
            {/* lats */}
            <path d="M37 40 L46 40 L42 70 L36 60 Z" fill={fill('lats')}/>
            <path d="M54 40 L63 40 L64 60 L58 70 Z" fill={fill('lats')}/>
            {/* lower back */}
            <rect x="44" y="62" width="12" height="22" fill={fill('lowerback')}/>
            {/* glutes */}
            <ellipse cx="44" cy="92" rx="6" ry="6" fill={fill('glutes')}/>
            <ellipse cx="56" cy="92" rx="6" ry="6" fill={fill('glutes')}/>
            {/* hamstrings */}
            <path d="M40 100 L48 100 L46 122 L40 120 Z" fill={fill('hamstrings')}/>
            <path d="M52 100 L60 100 L60 120 L54 122 Z" fill={fill('hamstrings')}/>
            {/* triceps */}
            <ellipse cx="26" cy="50" rx="4" ry="9" fill={fill('triceps')}/>
            <ellipse cx="74" cy="50" rx="4" ry="9" fill={fill('triceps')}/>
          </>
        )}
      </svg>
      <span style={{ fontFamily: 'system-ui', fontSize: 9, letterSpacing: '0.18em', color: 'var(--ink-soft)', fontWeight: 600 }}>{label || (view === 'front' ? 'FRONT · ด้านหน้า' : 'BACK · ด้านหลัง')}</span>
    </div>
  );
}

// ─── Storyboard cell ───────────────────────────────────────
function FrameCell({ label, time, children }) {
  return (
    <div style={{
      flex: 1, padding: 14, borderRadius: 14,
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid var(--glass-line)',
      display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span style={{ fontFamily: 'system-ui', fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', color: 'var(--ink-soft)' }}>{label}</span>
        <span style={{ fontFamily: 'Chakra Petch', fontSize: 10, color: 'var(--violet-bright)' }}>{time}</span>
      </div>
      <div style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  );
}

// Static-pose squat for storyboard frames
function StaticSquat({ depth = 0 }) {
  // depth 0 = standing, 1 = parallel
  const torsoY = 32 + depth * 6;
  const headCY = 14 + depth * 6;
  const kneeBend = depth;
  return (
    <svg width="120" height="130" viewBox="0 0 100 120" fill="none">
      <circle cx="50" cy={headCY} r="6" stroke={STROKE} strokeWidth="1.4" fill="none"/>
      <line x1="22" y1={30 + depth * 6} x2="78" y2={30 + depth * 6} stroke={STROKE} strokeWidth="1.6" strokeLinecap="round"/>
      <path d={`M40 ${torsoY} L40 ${56 + depth * 4} Q50 ${60 + depth * 4} 60 ${56 + depth * 4} L60 ${torsoY}`} stroke={STROKE} strokeWidth="1.4" fill="none"/>
      <path d={`M42 ${56 + depth * 4} L${42 - kneeBend * 8} ${84 + depth * 0} L42 116`} stroke={STROKE} strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
      <path d={`M58 ${56 + depth * 4} L${58 + kneeBend * 8} ${84 + depth * 0} L58 116`} stroke={STROKE} strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
    </svg>
  );
}
function StaticBench({ y = 56 }) {
  return (
    <svg width="120" height="130" viewBox="0 0 100 120" fill="none">
      <line x1="14" y1="78" x2="86" y2="78" stroke={STROKE} strokeWidth="1.4"/>
      <circle cx="22" cy="62" r="6" stroke={STROKE} strokeWidth="1.4" fill="none"/>
      <path d="M28 64 Q50 62 72 64 L72 74 Q50 76 28 74 Z" stroke={STROKE} strokeWidth="1.4" fill="none"/>
      <line x1="44" y1="64" x2="44" y2={y} stroke={STROKE} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="58" y1="64" x2="58" y2={y} stroke={STROKE} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="32" y1={y} x2="70" y2={y} stroke={STROKE} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Animation board (storyboards + style + map + contexts) ─
function AnimationBoard() {
  return (
    <div className="saifit-bg saifit-root" style={{ padding: 48, width: 1280, borderRadius: 28 }}>
      <div style={{ marginBottom: 28 }}>
        <div className="t-label" style={{ marginBottom: 10 }}>EXERCISE ANIMATIONS · MOTION SYSTEM</div>
        <h2 style={{ margin: 0, fontFamily: 'K2D', fontWeight: 700, fontSize: 30, color: 'var(--ink)', letterSpacing: '-0.02em' }}>Technical line art, in motion.</h2>
        <div style={{ marginTop: 10, fontFamily: 'K2D', fontSize: 14, color: 'var(--ink-mute)', maxWidth: 620, lineHeight: 1.6 }}>2.5 s seamless SMIL loops over thin white stroke figures. Concentric is faster than eccentric (0.6 s up, 0.8 s down) so you feel the lift. No 3D, no cartoon — engineering diagrams that breathe.</div>
      </div>

      {/* Live animations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <LivePreview title="Squat" thai="สควอท">
          <AnimSquat size={180}/>
        </LivePreview>
        <LivePreview title="Bench Press" thai="เบนช์เพรส">
          <AnimBench size={180}/>
        </LivePreview>
        <LivePreview title="Pull-up" thai="พูลอัพ">
          <AnimPullUp size={180}/>
        </LivePreview>
      </div>

      {/* Squat storyboard */}
      <div style={{ marginBottom: 18 }}>
        <SectionTitle kicker="STORYBOARD · SQUAT" title="2.5 s loop · 5 keyframes"/>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <FrameCell label="START" time="0.0–0.4s"><StaticSquat depth={0}/></FrameCell>
          <FrameCell label="DESCENDING" time="0.4–1.0s"><StaticSquat depth={0.5}/></FrameCell>
          <FrameCell label="PEAK · PARALLEL" time="1.0–1.3s"><StaticSquat depth={1}/></FrameCell>
          <FrameCell label="ASCENDING" time="1.3–2.1s"><StaticSquat depth={0.5}/></FrameCell>
          <FrameCell label="LOCKOUT · LOOP" time="2.1–2.5s"><StaticSquat depth={0}/></FrameCell>
        </div>
      </div>

      {/* Bench storyboard */}
      <div style={{ marginBottom: 28 }}>
        <SectionTitle kicker="STORYBOARD · BENCH PRESS" title="Bar travels chest → lockout"/>
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <FrameCell label="START · CHEST" time="0.0–0.4s"><StaticBench y={56}/></FrameCell>
          <FrameCell label="MID · DRIVE" time="0.4–1.0s"><StaticBench y={46}/></FrameCell>
          <FrameCell label="LOCKOUT" time="1.0–1.3s"><StaticBench y={38}/></FrameCell>
          <FrameCell label="ECCENTRIC" time="1.3–2.1s"><StaticBench y={48}/></FrameCell>
          <FrameCell label="RETURN · LOOP" time="2.1–2.5s"><StaticBench y={56}/></FrameCell>
        </div>
      </div>

      {/* Muscle map system */}
      <div style={{ marginBottom: 28 }}>
        <SectionTitle kicker="MUSCLE MAP" title="3-state highlight · primary / secondary / inactive"/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 14 }}>
          <MapTile heading="SQUAT" primary={['quads','glutes']} secondary={['lowerback','abs','hamstrings']}/>
          <MapTile heading="BENCH PRESS" primary={['chest']} secondary={['shoulders','triceps','abs']}/>
          <MapTile heading="DEADLIFT" primary={['hamstrings','glutes','lowerback']} secondary={['traps','lats','quads']}/>
          <MapTile heading="PULL-UP" primary={['lats','biceps']} secondary={['traps','rhomboids','abs']}/>
        </div>
      </div>

      {/* Style sheet */}
      <div style={{ marginBottom: 28 }}>
        <SectionTitle kicker="STYLE SPEC" title="Stroke · timing · loop"/>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <SpecCard heading="STROKE">
            <SpecLine k="Figure" v="1.4 px white α 85%"/>
            <SpecLine k="Bar / equipment" v="1.6 px white α 85%"/>
            <SpecLine k="Joint dots" v="1.6 px filled"/>
            <SpecLine k="Motion path" v="0.8 px violet · dash 1.5/1.5"/>
            <SpecLine k="Depth indicator" v="0.6 px violet · dash 3/2"/>
          </SpecCard>
          <SpecCard heading="TIMING · 2.5 s LOOP">
            <SpecLine k="Hold start" v="0.4 s · linear"/>
            <SpecLine k="Concentric (up)" v="0.6 s · ease-out"/>
            <SpecLine k="Hold peak" v="0.3 s · linear"/>
            <SpecLine k="Eccentric (down)" v="0.8 s · ease-in"/>
            <SpecLine k="Rest" v="0.4 s · linear"/>
          </SpecCard>
        </div>
        <div style={{ marginTop: 16, padding: 16, borderRadius: 14, background: 'rgba(0,0,0,0.30)', border: '1px solid var(--glass-line)', fontFamily: 'Chakra Petch', fontSize: 11, color: 'var(--ink-mute)', lineHeight: 1.7 }}>
          <span style={{ color: 'var(--violet-bright)' }}>// SMIL spec ·</span> &lt;animate attributeName="d" dur="2.5s" repeatCount="indefinite"<br/>
          &nbsp;&nbsp;&nbsp;keyTimes="0; 0.16; 0.40; 0.52; 0.84; 1"<br/>
          &nbsp;&nbsp;&nbsp;calcMode="spline" keySplines=".25 .1 .25 1; .25 .1 .25 1; .42 0 .58 1; .42 0 .58 1; .25 .1 .25 1"<br/>
          &nbsp;&nbsp;&nbsp;values="d_start; d_start; d_peak; d_peak; d_start; d_start"/&gt;
        </div>
      </div>

      {/* 3 UI contexts */}
      <div style={{ marginBottom: 28 }}>
        <SectionTitle kicker="3 UI CONTEXTS" title="Same animation · 3 sizes"/>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', gap: 16, marginTop: 14, alignItems: 'flex-start' }}>
          <ContextCard label="A · CARD THUMB · 64px">
            <div className="glass" style={{ padding: 14, width: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 64, height: 64, borderRadius: 12, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AnimSquat size={48} showMotion={false}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>Squat <span style={{ fontFamily: 'K2D', fontSize: 11, color: 'var(--ink-mute)' }}>สควอท</span></div>
                  <div style={{ fontFamily: 'K2D', fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>ขา · กลูเตส</div>
                  <span className="tag-violet" style={{ marginTop: 6, display: 'inline-block', background: 'rgba(255,255,255,0.05)', borderColor: 'var(--glass-line)', color: 'var(--ink-mute)' }}>มือใหม่</span>
                </div>
              </div>
            </div>
          </ContextCard>
          <ContextCard label="B · DETAIL HERO · 200px">
            <div className="glass" style={{ padding: 24, position: 'relative', height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AnimSquat size={200}/>
              <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10 }}>
                <PlayBtn icon="play"/><PlayBtn icon="loop" active/><PlayBtn icon="pause"/>
              </div>
              <div style={{ position: 'absolute', top: 12, left: 14, fontFamily: 'system-ui', fontSize: 9, letterSpacing: '0.15em', color: 'var(--ink-faint)' }}>SIDE VIEW · LOOP</div>
            </div>
          </ContextCard>
          <ContextCard label="C · LOGGER INLINE · 80px">
            <div className="glass" style={{ padding: 16, width: 240 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 14 }}>Squat <span style={{ fontFamily: 'system-ui', fontSize: 10, color: 'var(--violet-bright)' }}>· SET 2/5</span></div>
                  <div style={{ fontFamily: 'K2D', fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>ดูเทคนิคระหว่างพัก</div>
                </div>
                <div style={{ width: 60, height: 70, borderRadius: 10, background: 'rgba(140,100,255,0.08)', border: '1px solid var(--violet-edge)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AnimSquat size={48} showMotion={false}/>
                </div>
              </div>
              <div style={{ marginTop: 10, padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-line)', fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>110 kg × 5</div>
            </div>
          </ContextCard>
        </div>
      </div>

      {/* Coverage matrix */}
      <div>
        <SectionTitle kicker="PROGRAM COVERAGE" title="13 animations cover 100% of programs"/>
        <div style={{ marginTop: 14, padding: 18, borderRadius: 16, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-line)' }}>
          <CoverageRow program="PPL · Push / Pull / Legs"   exercises={['Bench','OHP','Row','Pull-up','Squat','RDL']}/>
          <CoverageRow program="Upper / Lower"               exercises={['Bench','Row','Squat','RDL','OHP','Pull-up']}/>
          <CoverageRow program="Full Body 3×"                exercises={['Squat','Deadlift','Bench','Row','OHP']}/>
          <CoverageRow program="Beginner Linear"             exercises={['Squat','Bench','Deadlift','OHP','Row']}/>
          <CoverageRow program="Home · No equipment"         exercises={['Push-up','Pull-up','Lunge','Plank','Burpee']} last/>
        </div>
      </div>
    </div>
  );
}

function LivePreview({ title, thai, children }) {
  return (
    <div className="glass" style={{ padding: 18, position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <div>
          <div style={{ fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{title}</div>
          <div style={{ fontFamily: 'K2D', fontSize: 12, color: 'var(--ink-soft)' }}>{thai}</div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', borderRadius: 999, background: 'rgba(140,100,255,0.10)', border: '1px solid var(--violet-edge)', color: 'var(--violet-bright)', fontFamily: 'Chakra Petch', fontSize: 10, letterSpacing: '0.10em' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--violet)', boxShadow: '0 0 6px var(--violet)' }}/>LIVE
        </span>
      </div>
      <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  );
}
function SectionTitle({ kicker, title }) {
  return (
    <div>
      <div className="t-label" style={{ marginBottom: 4 }}>{kicker}</div>
      <h3 style={{ margin: 0, fontFamily: 'K2D', fontWeight: 700, fontSize: 18, color: 'var(--ink)' }}>{title}</h3>
    </div>
  );
}
function MapTile({ heading, primary, secondary }) {
  return (
    <div style={{ padding: 18, borderRadius: 14, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-line)' }}>
      <div style={{ fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 13, color: 'var(--ink)', marginBottom: 12 }}>{heading}</div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <MuscleMap size={92} primary={primary} secondary={secondary} view="front"/>
        <MuscleMap size={92} primary={primary} secondary={secondary} view="back"/>
      </div>
    </div>
  );
}
function SpecCard({ heading, children }) {
  return (
    <div style={{ padding: 18, borderRadius: 14, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-line)' }}>
      <div className="t-label" style={{ marginBottom: 10 }}>{heading}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
    </div>
  );
}
function SpecLine({ k, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'K2D', fontSize: 12 }}>
      <span style={{ color: 'var(--ink-mute)' }}>{k}</span>
      <span style={{ color: 'var(--ink)', fontFamily: 'Chakra Petch' }}>{v}</span>
    </div>
  );
}
function ContextCard({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
      {children}
      <span style={{ fontFamily: 'system-ui', fontSize: 10, letterSpacing: '0.18em', fontWeight: 600, color: 'var(--ink-mute)' }}>{label}</span>
    </div>
  );
}
function PlayBtn({ icon, active }) {
  return (
    <span style={{
      width: 32, height: 32, borderRadius: 10,
      background: active ? 'rgba(140,100,255,0.14)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${active ? 'var(--violet-edge)' : 'var(--glass-line)'}`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: active ? 'var(--violet-bright)' : 'var(--ink)',
    }}>
      {icon === 'play' && <svg width="11" height="11" viewBox="0 0 24 24"><path d="M6 4l14 8-14 8V4z" fill="currentColor"/></svg>}
      {icon === 'loop' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 0 1 17-4M21 12a9 9 0 0 1-17 4M17 4l3 4-4 1M7 20l-3-4 4-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      {icon === 'pause' && <svg width="11" height="11" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>}
    </span>
  );
}
function CoverageRow({ program, exercises, last }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16, alignItems: 'center',
      padding: '12px 0',
      borderBottom: last ? 0 : '1px solid var(--glass-line)',
    }}>
      <span style={{ fontFamily: 'Chakra Petch', fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>{program}</span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {exercises.map(e => (
          <span key={e} style={{
            padding: '4px 10px', borderRadius: 999,
            background: 'rgba(140,100,255,0.10)', border: '1px solid var(--violet-edge)',
            fontFamily: 'Chakra Petch', fontWeight: 600, fontSize: 11, color: 'var(--violet-bright)',
            letterSpacing: '0.04em',
          }}>{e}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Body Analysis screen ──────────────────────────────────
function BodyAnalysisScreen() {
  const stats = [
    { k: 'BODY FAT', v: '18.4', u: '%', d: '−1.2%', dpos: true },
    { k: 'WEIGHT', v: '72.4', u: 'kg', d: '−0.6 kg', dpos: true },
    { k: 'MUSCLE', v: '34.2', u: 'kg', d: '+0.4 kg', dpos: true },
    { k: 'BMR', v: '1,684', u: 'kcal', d: '', dpos: null },
  ];
  const measures = [
    { k: 'CHEST · อก',  v: '102', d: '+1' },
    { k: 'WAIST · เอว', v: '82',  d: '−2' },
    { k: 'ARM · แขน',   v: '36',  d: '+0.5' },
    { k: 'THIGH · ขา', v: '58',  d: '+1' },
  ];
  return (
    <PhoneFrame>
      <div style={{ padding: '4px 0 110px' }}>
        <ScreenHeader kicker="MAY 10 · 4-WEEK TREND" title="วิเคราะห์ร่างกาย"/>

        {/* Composition card with body figure */}
        <div style={{ padding: '14px 24px 0' }}>
          <div className="glass glass-glow" style={{ padding: '20px 22px', display: 'flex', gap: 18 }}>
            {/* Front body with muscle balance shading */}
            <div style={{ width: 110, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MuscleMap size={100} primary={['chest','quads','lats']} secondary={['shoulders','biceps','abs','glutes','hamstrings']} view="front" label=""/>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div className="t-label">COMPOSITION</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                  <span className="t-num" style={{ fontSize: 32, color: 'var(--ink)' }}>18.4</span>
                  <span style={{ fontFamily: 'K2D', fontSize: 12, color: 'var(--ink-mute)' }}>% body fat</span>
                </div>
              </div>
              {/* Body fat bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'system-ui', fontSize: 9, color: 'var(--ink-soft)', letterSpacing: '0.12em', marginBottom: 4 }}>
                  <span>ESSENTIAL · 6%</span><span>HEALTHY 14–24%</span><span>· 30%+</span>
                </div>
                <div style={{ position: 'relative', height: 10, borderRadius: 5, overflow: 'hidden', background: 'linear-gradient(90deg, oklch(60% 0.20 240), oklch(72% 0.20 270 / 60%) 25%, oklch(72% 0.20 270 / 60%) 75%, oklch(62% 0.20 25))' }}>
                  <div style={{ position: 'absolute', top: -3, left: '52%', width: 3, height: 16, borderRadius: 2, background: '#fff', boxShadow: '0 0 10px #fff' }}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', fontFamily: 'Chakra Petch', fontSize: 10, color: 'var(--ink-mute)', marginTop: 4 }}>
                  <span style={{ color: 'var(--violet-bright)' }}>YOU · OPTIMAL ZONE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stat tiles */}
        <div style={{ padding: '14px 24px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {stats.map(s => (
            <div key={s.k} className="glass" style={{ padding: 14 }}>
              <div className="t-label">{s.k}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
                <span className="t-num" style={{ fontSize: 22, color: 'var(--ink)' }}>{s.v}</span>
                <span style={{ fontFamily: 'K2D', fontSize: 11, color: 'var(--ink-soft)' }}>{s.u}</span>
              </div>
              {s.d && (
                <div style={{ marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'Chakra Petch', fontSize: 11, fontWeight: 600,
                  color: s.dpos ? 'oklch(70% 0.16 150)' : 'var(--danger)',
                }}>
                  <svg width="9" height="9" viewBox="0 0 12 12">{s.dpos ? <path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/> : <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>}</svg>
                  {s.d}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Weight trend */}
        <div style={{ padding: '14px 24px 0' }}>
          <div className="glass" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <div className="t-label">WEIGHT TREND · 90 DAYS</div>
              <span className="t-num" style={{ fontSize: 12, color: 'var(--violet-bright)' }}>−3.2 kg</span>
            </div>
            <svg width="100%" height="80" viewBox="0 0 300 80" preserveAspectRatio="none">
              <defs>
                <linearGradient id="wtFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(72% 0.20 270 / 35%)"/>
                  <stop offset="100%" stopColor="oklch(72% 0.20 270 / 0%)"/>
                </linearGradient>
              </defs>
              <path d="M0 20 Q30 22 50 28 T100 38 T160 44 T220 52 T300 60 L300 80 L0 80 Z" fill="url(#wtFill)"/>
              <path d="M0 20 Q30 22 50 28 T100 38 T160 44 T220 52 T300 60" stroke="oklch(72% 0.20 270)" strokeWidth="1.6" fill="none" style={{ filter: 'drop-shadow(0 0 6px var(--violet))' }}/>
              <circle cx="300" cy="60" r="3" fill="#fff" style={{ filter: 'drop-shadow(0 0 6px var(--violet))' }}/>
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontFamily: 'system-ui', fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>
              <span>FEB 10</span><span>MAR 10</span><span>APR 10</span><span>MAY 10</span>
            </div>
          </div>
        </div>

        {/* Measurements */}
        <div style={{ padding: '14px 24px 0' }}>
          <div className="glass" style={{ padding: 18 }}>
            <div className="t-label" style={{ marginBottom: 12 }}>MEASUREMENTS · cm</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {measures.map(m => (
                <div key={m.k} style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.025)', border: '1px solid var(--glass-line)' }}>
                  <div style={{ fontFamily: 'system-ui', fontSize: 9, color: 'var(--ink-soft)', letterSpacing: '0.14em', fontWeight: 600 }}>{m.k}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
                    <span className="t-num" style={{ fontSize: 20, color: 'var(--ink)' }}>{m.v}</span>
                    <span style={{ fontFamily: 'Chakra Petch', fontSize: 11, fontWeight: 600, color: m.d.startsWith('+') ? 'oklch(70% 0.16 150)' : 'var(--violet-bright)' }}>{m.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Photo timeline placeholder */}
        <div style={{ padding: '14px 24px 0' }}>
          <div className="glass" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="t-label">PROGRESS PHOTOS</div>
              <span style={{ fontFamily: 'Chakra Petch', fontSize: 11, color: 'var(--violet-bright)' }}>+ ถ่ายใหม่</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {['10 ก.พ.', '10 มี.ค.', '10 เม.ย.', '10 พ.ค.'].map((d, i) => (
                <div key={i} style={{ aspectRatio: '3/4', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-line)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: 6, position: 'relative', overflow: 'hidden' }}>
                    {/* faint silhouette */}
                    <svg width="60%" height="60%" viewBox="0 0 100 150" style={{ position: 'absolute', top: '15%', opacity: 0.35 }}>
                      <circle cx="50" cy="14" r="8" fill="rgba(255,255,255,0.4)"/>
                      <path d="M36 26 Q50 22 64 26 L66 70 L62 122 L58 148 L42 148 L38 122 L34 70 Z" fill="rgba(255,255,255,0.15)"/>
                    </svg>
                    <span style={{ fontFamily: 'Chakra Petch', fontSize: 10, color: 'var(--ink-mute)', position: 'relative' }}>{d}</span>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <TabBar active="progress"/>
    </PhoneFrame>
  );
}

Object.assign(window, { AnimSquat, AnimBench, AnimPlank, AnimPullUp, MuscleMap, AnimationBoard, BodyAnalysisScreen });
