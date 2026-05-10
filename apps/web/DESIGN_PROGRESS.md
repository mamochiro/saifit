# Design Handoff Progress

Reference: `design_handoff_saifit/` | CSS: `styles.css` | Screens: `screens.jsx`, `screens2.jsx`, `screens3.jsx`

## Phase 0 — Foundation ✅
- [x] `globals.css` — update `@theme` tokens (cold palette, violet primary)
- [x] `globals.css` — append CSS primitives from `styles.css`

## Screen 1 — Sign-in ✅
- [x] Background: `.saifit-bg`
- [x] Barbell watermark: 600×200, rotate(-12deg), opacity 0.045
- [x] Glass card: `.glass` class, padding 36/24/28
- [x] Brand lockup: gradient square icon + Chakra Petch "GymPal"
- [x] LINE button: `.btn-line`
- [x] Google button: `.btn-glass`
- [x] "หรือ" divider: `.divider-text`
- [x] Email input: `.glass-input` + @ icon
- [x] Password input: `.glass-input` + lock icon + eye toggle
- [x] Submit: `.btn-primary` + ArrowRight

## Screen 2 — Home ✅
- [x] Background: `.saifit-bg`
- [x] Kicker: "SAIFIT · {date}" `.t-label`
- [x] Name in violet (`var(--violet-bright)`)
- [x] Avatar component (38px gradient circle)
- [x] Streak card: `.glass.glass-glow`
- [x] Streak number: `.t-num` 84px
- [x] 14-day mini progress bars (from workouts table)
- [x] Today's workout card: `.glass`
- [x] Exercise rows: icon + name + hint + `.t-num` sets
- [x] CTA: `.btn-primary`

## Screen 3 — Templates ✅
- [x] Background: `.saifit-bg`
- [x] Header kicker: `.t-label`
- [x] Filter row: `.pill` / `.pill.is-active`
- [x] Cards: `.glass`
- [x] Card title: Chakra Petch 22px
- [x] Difficulty badge: `.tag-violet`
- [x] Goal icon: mid-right, opacity 10%, 120px

## Screen 4 — Progress ✅
- [x] Background: `.saifit-bg`
- [x] Segmented control: glass style
- [x] Streak card: `.glass.glass-glow`
- [x] Streak number: `.t-num` 96px
- [x] "Longest" sub-line
- [x] PR card: `.glass` + sparkline SVG
- [x] Heatmap: `.heatmap` / `.heatmap-cell` classes

## Screen 5 — Onboarding ✅
- [x] Background: `.saifit-bg`
- [x] Goal cards: `.glass` + violet selected state
- [x] Experience buttons: `.glass`
- [x] Days/week: `.pill` chips
- [x] Gym type: `.glass`

## Screen 6 — Settings ✅
- [x] Background: `.saifit-bg`
- [x] Section cards: `.glass`
- [x] Segmented controls: glass style
- [x] Toggle: violet active
- [x] Sign-out button: `.btn-glass`

## Screens 7–9 — Active Workout ✅
- [x] Logger: `.saifit-bg`, glass exercise cards, violet set complete button
- [x] Set rows: glass active row + violet completed row
- [x] Rest timer: glass frosted dock, violet progress arc, `.btn-primary` skip
- [x] Complete bar: glass frosted bottom, `.btn-primary`
- [x] Workout summary: `.saifit-bg`, `.glass.glass-glow` summary card, `.t-num` volume
- [x] PR celebration: `.glass.glass-glow` overlay, `.t-num` 48px violet value

## Screen 10 — Exercise Library ✅
- [x] Background: `.saifit-bg`
- [x] Search: `.glass-input` with search icon
- [x] Filter chips: `.pill` / `.pill.is-active`
- [x] Cards: `.glass` with `.tag-violet` muscle chips + arrow

## Screen 11 — Exercise Detail ✅
- [x] Background: `.saifit-bg`
- [x] Muscle chips: `.tag-violet`
- [x] GIF placeholder: `.glass`
- [x] Segmented: glass style
- [x] Cue cards: `.glass`
- [x] History chart: violet line

## Workout History ✅
- [x] Background: `.saifit-bg`
- [x] Workout cards: `.glass`
- [x] Abandoned banner: `.glass`
- [x] Delete action: glass + danger button

## Screens 12–14 + Errors
- [x] Body Analysis (`app/body/page.tsx`) — muscle map SVG, composition card, stat tiles, weight trend chart, measurements, progress photos
- [x] Running Plan (`app/run/page.tsx`) — glass-glow hero, weekly grid, stat tiles
- [x] Food Plan (`app/food/page.tsx`) — calorie ring SVG, macro bars, meal cards
- [x] Error states E1–E8 (`components/error-screen.tsx`, `app/not-found.tsx`, `app/error.tsx`, `app/maintenance/page.tsx`)
- [x] BottomNav CSS migration (`components/bottom-nav.tsx`) — `.tabbar`/`.tab`/`.tab-dot`
