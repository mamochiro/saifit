// Saifit pose silhouettes — line art for exercise illustrations
// Two scales: thumbnail (compact) and detail (with muscle highlights)
// All poses fit a 100×120 viewBox; consumer scales via width/height.

// Common parts — head + body shapes drawn as paths.
// Coords: head ~y=10, shoulders ~y=30, hips ~y=72, feet ~y=115

const POSE_STROKE = 'rgba(255,255,255,0.62)';
const POSE_MUSCLE = 'oklch(72% 0.20 270 / 60%)';
const POSE_DIM    = 'rgba(255,255,255,0.15)';

// Helper — fills a target muscle when `highlight` includes its key
function muscleFill(highlight, key) {
  return highlight && highlight.includes(key) ? POSE_MUSCLE : POSE_DIM;
}

const Pose = {
  // 1. Squat — front view, knees bent
  Squat: ({ size = 56, sw = 1.25, highlight }) => (
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120" fill="none"
         strokeLinecap="round" strokeLinejoin="round">
      {highlight && <>
        {/* quads */}
        <path d="M40 70 L34 100 L40 100 L46 72 Z" fill={muscleFill(highlight, 'quads')}/>
        <path d="M60 70 L66 100 L60 100 L54 72 Z" fill={muscleFill(highlight, 'quads')}/>
        {/* glutes */}
        <ellipse cx="50" cy="72" rx="12" ry="6" fill={muscleFill(highlight, 'glutes')}/>
        {/* lower back */}
        <path d="M44 50 L56 50 L54 64 L46 64 Z" fill={muscleFill(highlight, 'lowerback')}/>
      </>}
      <g stroke={POSE_STROKE} strokeWidth={sw} fill="none">
        <circle cx="50" cy="14" r="7"/>
        {/* bar on back */}
        <line x1="22" y1="32" x2="78" y2="32"/>
        <circle cx="22" cy="32" r="3"/>
        <circle cx="78" cy="32" r="3"/>
        {/* torso slightly forward lean */}
        <path d="M40 32 L40 56 Q50 60 60 56 L60 32"/>
        {/* arms holding bar */}
        <path d="M40 32 L34 36 L36 42"/>
        <path d="M60 32 L66 36 L64 42"/>
        {/* legs - bent */}
        <path d="M42 56 L36 78 L40 102 L36 116"/>
        <path d="M58 56 L64 78 L60 102 L64 116"/>
      </g>
    </svg>
  ),

  // 2. Bench Press — side view, lying back, bar at chest
  BenchPress: ({ size = 56, sw = 1.25, highlight }) => (
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120" fill="none"
         strokeLinecap="round" strokeLinejoin="round">
      {highlight && <>
        {/* chest */}
        <ellipse cx="48" cy="58" rx="16" ry="6" fill={muscleFill(highlight, 'chest')}/>
        {/* triceps */}
        <path d="M58 50 L72 38 L76 42 L62 54 Z" fill={muscleFill(highlight, 'triceps')}/>
        {/* shoulders */}
        <circle cx="34" cy="54" r="5" fill={muscleFill(highlight, 'shoulders')}/>
      </>}
      <g stroke={POSE_STROKE} strokeWidth={sw} fill="none">
        {/* bench */}
        <line x1="14" y1="78" x2="86" y2="78"/>
        <line x1="20" y1="78" x2="20" y2="100"/>
        <line x1="80" y1="78" x2="80" y2="100"/>
        {/* body lying — head left */}
        <circle cx="22" cy="62" r="6"/>
        <path d="M28 64 Q50 62 72 64 L72 74 Q50 76 28 74 Z"/>
        {/* legs bent down */}
        <path d="M70 74 L80 90 L82 102"/>
        <path d="M64 74 L72 92 L74 104"/>
        {/* arms pressing up */}
        <path d="M44 64 L44 40"/>
        <path d="M58 64 L58 40"/>
        {/* bar */}
        <line x1="32" y1="38" x2="70" y2="38"/>
        <circle cx="32" cy="38" r="3"/>
        <circle cx="70" cy="38" r="3"/>
      </g>
    </svg>
  ),

  // 3. Deadlift — side view, hinge position
  Deadlift: ({ size = 56, sw = 1.25, highlight }) => (
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120" fill="none"
         strokeLinecap="round" strokeLinejoin="round">
      {highlight && <>
        {/* hamstrings */}
        <path d="M42 70 L38 96 L46 96 L48 72 Z" fill={muscleFill(highlight, 'hamstrings')}/>
        <path d="M56 70 L60 96 L52 96 L52 72 Z" fill={muscleFill(highlight, 'hamstrings')}/>
        {/* lower back */}
        <path d="M40 38 L62 38 L60 56 L42 56 Z" fill={muscleFill(highlight, 'lowerback')}/>
        {/* glutes */}
        <ellipse cx="58" cy="60" rx="10" ry="6" fill={muscleFill(highlight, 'glutes')}/>
      </>}
      <g stroke={POSE_STROKE} strokeWidth={sw} fill="none">
        {/* head leaning forward */}
        <circle cx="32" cy="28" r="6"/>
        {/* torso angled */}
        <path d="M38 32 L66 56"/>
        <path d="M40 38 L64 60"/>
        {/* hips → legs */}
        <path d="M62 60 L62 96 L58 116"/>
        <path d="M70 60 L72 96 L74 116"/>
        {/* arms hanging down */}
        <path d="M44 38 L44 78"/>
        <path d="M52 42 L52 78"/>
        {/* bar at shins */}
        <line x1="34" y1="84" x2="64" y2="84"/>
        <circle cx="34" cy="84" r="3.5"/>
        <circle cx="64" cy="84" r="3.5"/>
      </g>
    </svg>
  ),

  // 4. Overhead Press — front, bar overhead
  OverheadPress: ({ size = 56, sw = 1.25, highlight }) => (
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120" fill="none"
         strokeLinecap="round" strokeLinejoin="round">
      {highlight && <>
        {/* shoulders */}
        <circle cx="34" cy="42" r="6" fill={muscleFill(highlight, 'shoulders')}/>
        <circle cx="66" cy="42" r="6" fill={muscleFill(highlight, 'shoulders')}/>
        {/* triceps */}
        <path d="M30 42 L26 24 L32 22 L36 42 Z" fill={muscleFill(highlight, 'triceps')}/>
        <path d="M70 42 L74 24 L68 22 L64 42 Z" fill={muscleFill(highlight, 'triceps')}/>
      </>}
      <g stroke={POSE_STROKE} strokeWidth={sw} fill="none">
        <circle cx="50" cy="32" r="6"/>
        {/* torso */}
        <path d="M40 42 L40 76 Q50 80 60 76 L60 42"/>
        {/* arms up */}
        <path d="M40 42 L34 26 L34 14"/>
        <path d="M60 42 L66 26 L66 14"/>
        {/* bar */}
        <line x1="22" y1="14" x2="78" y2="14"/>
        <circle cx="22" cy="14" r="3"/>
        <circle cx="78" cy="14" r="3"/>
        {/* legs straight */}
        <path d="M44 76 L42 116"/>
        <path d="M56 76 L58 116"/>
      </g>
    </svg>
  ),

  // 5. Pull-up — hanging, arms overhead
  PullUp: ({ size = 56, sw = 1.25, highlight }) => (
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120" fill="none"
         strokeLinecap="round" strokeLinejoin="round">
      {highlight && <>
        {/* lats */}
        <path d="M38 38 L42 70 L48 70 L46 38 Z" fill={muscleFill(highlight, 'lats')}/>
        <path d="M62 38 L58 70 L54 70 L54 38 Z" fill={muscleFill(highlight, 'lats')}/>
        {/* biceps */}
        <path d="M30 22 L34 38 L40 36 L36 22 Z" fill={muscleFill(highlight, 'biceps')}/>
        <path d="M70 22 L66 38 L60 36 L64 22 Z" fill={muscleFill(highlight, 'biceps')}/>
      </>}
      <g stroke={POSE_STROKE} strokeWidth={sw} fill="none">
        {/* bar */}
        <line x1="20" y1="10" x2="80" y2="10"/>
        <circle cx="34" cy="12" r="2.5"/>
        <circle cx="66" cy="12" r="2.5"/>
        {/* arms up */}
        <path d="M34 12 L34 38"/>
        <path d="M66 12 L66 38"/>
        <circle cx="50" cy="32" r="6"/>
        {/* torso */}
        <path d="M40 38 L40 72 Q50 76 60 72 L60 38"/>
        {/* legs slightly bent */}
        <path d="M44 72 L40 100 L44 116"/>
        <path d="M56 72 L60 100 L56 116"/>
      </g>
    </svg>
  ),

  // 6. Romanian Deadlift — hinge, bar at knees
  RDL: ({ size = 56, sw = 1.25, highlight }) => (
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120" fill="none"
         strokeLinecap="round" strokeLinejoin="round">
      {highlight && <>
        <path d="M42 76 L38 102 L46 102 L48 78 Z" fill={muscleFill(highlight, 'hamstrings')}/>
        <path d="M56 76 L60 102 L52 102 L52 78 Z" fill={muscleFill(highlight, 'hamstrings')}/>
        <ellipse cx="58" cy="64" rx="10" ry="5" fill={muscleFill(highlight, 'glutes')}/>
      </>}
      <g stroke={POSE_STROKE} strokeWidth={sw} fill="none">
        <circle cx="34" cy="36" r="6"/>
        <path d="M40 40 L66 60"/>
        <path d="M42 46 L64 64"/>
        <path d="M62 64 L60 102 L58 116"/>
        <path d="M70 64 L70 102 L72 116"/>
        <path d="M46 44 L46 76"/>
        <path d="M54 48 L54 76"/>
        <line x1="34" y1="78" x2="64" y2="78"/>
        <circle cx="34" cy="78" r="3"/>
        <circle cx="64" cy="78" r="3"/>
      </g>
    </svg>
  ),

  // 7. Dumbbell Row — bent over, one arm pulling
  Row: ({ size = 56, sw = 1.25, highlight }) => (
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120" fill="none"
         strokeLinecap="round" strokeLinejoin="round">
      {highlight && <>
        <path d="M42 50 L46 76 L54 76 L52 50 Z" fill={muscleFill(highlight, 'lats')}/>
        <ellipse cx="60" cy="46" rx="6" ry="3" fill={muscleFill(highlight, 'rhomboids')} transform="rotate(-12 60 46)"/>
        <path d="M64 38 L72 28 L78 32 L70 42 Z" fill={muscleFill(highlight, 'biceps')}/>
      </>}
      <g stroke={POSE_STROKE} strokeWidth={sw} fill="none">
        <circle cx="22" cy="48" r="6"/>
        <path d="M28 50 L70 56"/>
        <path d="M30 56 L68 64"/>
        {/* arm pulling up */}
        <path d="M58 54 L62 38 L72 30"/>
        <line x1="68" y1="26" x2="80" y2="26"/>
        <circle cx="80" cy="26" r="2.5"/>
        {/* support arm */}
        <path d="M44 56 L42 78 L40 90"/>
        {/* legs */}
        <path d="M64 60 L66 96 L62 116"/>
        <path d="M70 64 L72 100 L74 116"/>
      </g>
    </svg>
  ),

  // 8. Plank — horizontal on forearms
  Plank: ({ size = 56, sw = 1.25, highlight }) => (
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120" fill="none"
         strokeLinecap="round" strokeLinejoin="round">
      {highlight && <>
        <ellipse cx="50" cy="62" rx="22" ry="6" fill={muscleFill(highlight, 'abs')}/>
        <path d="M28 56 L34 56 L34 68 L28 68 Z" fill={muscleFill(highlight, 'shoulders')}/>
      </>}
      <g stroke={POSE_STROKE} strokeWidth={sw} fill="none">
        {/* horizontal body */}
        <circle cx="22" cy="60" r="6"/>
        <path d="M28 56 L84 60 L84 68 L28 64 Z"/>
        {/* forearms down */}
        <path d="M28 60 L24 84"/>
        <line x1="14" y1="84" x2="34" y2="84"/>
        {/* legs back */}
        <path d="M84 64 L96 76"/>
        <line x1="92" y1="80" x2="100" y2="80"/>
      </g>
    </svg>
  ),
};

window.Pose = Pose;
