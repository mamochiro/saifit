# Handoff: Saifit (GymPal) — Dark Glass Fitness PWA

## Overview
Saifit is a fitness-tracking Progressive Web App for Bangkok gym-goers (ages 20–40, Thai primary language). The personality is **serious and premium** — closer to Whoop / Oura than a wellness app. It covers: sign-up & onboarding, daily home, programs, exercise library + detail, active workout (logger / rest timer / summary), progress (records + heatmap), body analysis, running plan, food plan, settings, and a full set of error / empty states.

## About the Design Files
The files bundled with this README are **design references created as a single React-on-Babel HTML prototype**. They are NOT meant to be copied into production. The task is to **recreate these designs inside the target codebase** using its existing framework, component library, and styling system.

If the target codebase has no framework yet, **React + Tailwind (or React + CSS-in-JS) is the recommended choice** — the prototype is built that way and translates 1:1.

The single source of truth is `Saifit Design.html`, which loads several `.jsx` modules. Open that file in a browser to see every screen on a pan/zoom canvas.

## Fidelity
**High-fidelity (hi-fi).** All colors, typography, spacing, radii, shadows, glass-blur values, and motion timings are final. Reproduce them exactly. Where the prototype uses placeholder copy, the copy itself has been written in production-grade Thai — keep it as-is.

## Tech-stack recommendation
- **Framework:** Next.js (App Router) or Vite + React 18+
- **Styling:** Tailwind v4 with the OKLCH tokens below mapped to CSS variables, OR vanilla CSS with custom properties (the prototype uses the latter and works cleanly)
- **Animations:** Native SVG SMIL (already used in prototype) or Framer Motion if SMIL pause-on-offscreen logic becomes complex
- **i18n:** `next-intl` or `react-i18next` — Thai is primary, English is fallback
- **PWA:** `next-pwa` or Vite PWA plugin. Service worker MUST handle offline workout logging (see "Offline contract" below)
- **State:** TanStack Query for server state; Zustand or Jotai for active-workout local state (rest timer must survive route changes)
- **Auth:** LINE Login as primary for Thailand; Google + email as secondary

---

## Design Tokens

### Colors (OKLCH — copy into CSS variables exactly)
```css
:root {
  /* Surfaces */
  --bg:           oklch(8% 0.005 240);          /* near-black, cold blue tint */
  --glass:        rgba(255,255,255,0.06);
  --glass-line:   rgba(255,255,255,0.10);
  --glass-divider: rgba(255,255,255,0.06);      /* dropped from 0.10 per UX review */

  /* Brand */
  --violet:        oklch(72% 0.20 270);          /* primary accent */
  --violet-bright: oklch(78% 0.18 270);
  --violet-edge:   oklch(72% 0.20 270 / 25%);

  /* Text */
  --ink:        oklch(95% 0.003 90);
  --ink-mute:   oklch(55% 0.004 90);
  --ink-soft:   oklch(45% 0.004 90);
  --ink-faint:  oklch(35% 0.004 90);

  /* Status */
  --danger:  oklch(62% 0.20 25);
  --warning: oklch(78% 0.15 80);
  --success: oklch(70% 0.16 150);
}
```

### Glass card recipe
```css
.glass {
  background: var(--glass);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--glass-line);
  border-radius: 20px;
}
.glass.glow {  /* streak / hero / CTA cards */
  box-shadow: 0 0 0 1px oklch(72% 0.20 270 / 25%);
  background-image: linear-gradient(180deg, rgba(130,100,255,0.08), transparent 40%);
}
```
**Performance constraint (per Tech-Lead review):** cap concurrent backdrop-blur layers to ~4. On lists, use a single blurred backdrop layer behind the cards and make the cards opaque.

### Primary button
```css
.btn-primary {
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, oklch(65% 0.22 280), oklch(60% 0.20 240));
  color: #fff;
  font-family: 'K2D';
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4),
              inset 0 0 0 1px rgba(255,255,255,0.08);
}
```

### Typography
| Use | Family | Weight | Size | Notes |
|---|---|---|---|---|
| Display numbers | **Chakra Petch** | 700 | 48–96 px | tabular, English digits only |
| Thai body | **K2D** | 400/600/700 | 14 / 16 / 18 px | line-height 1.6–1.7 |
| English labels | system-ui | 600/700 | 9–11 px | uppercase, letter-spacing 0.14–0.22 em |

**Font fallback chain (per Tech-Lead review):**
```css
font-family: 'K2D', 'Noto Sans Thai', system-ui, -apple-system, sans-serif;
```

### Spacing scale
4 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 22 / 24 / 32 / 48 px — match exactly, do not invent.

### Radii
- Inputs: 10 px
- Small chips / pills: 999 px
- Buttons: 12–14 px
- Standard glass card: 20 px
- Hero / brand cards: 24–28 px

### Mobile frame
- Design viewport: **390 × 844** (iPhone 14)
- Min hit-target: 44 × 44

---

## Screens (14 + 8 error states)

### Core flow
1. **Sign-in** — barbell SVG watermark at α 5%, glass card, LINE primary button (#00B900), Google glass button, email + password, gradient CTA. Focus ring on inputs is a 3 px violet outer glow.
2. **Onboarding · step 1 (Goal)** — 4 glass cards in 2×2 grid (สร้างกล้าม / ลดไขมัน / แข็งแกร่ง / กระฉับกระเฉง). Selected = violet border + inner glow. Top progress dots (1/4 active).
3. **Home** — uppercase `SAIFIT · MON, 10 MAY` kicker, "สวัสดี, Sara" hero (Sara in violet), body silhouette ghost top-right at α 5%, streak glow card with "42" in 80px Chakra Petch, today's workout card (PPL D2 — Squat 4×5, Bench 3×8, OHP 3×10), gradient CTA "เริ่มออกกำลังกาย", glass tab bar.
4. **Templates** — title "โปรแกรมออกกำลังกาย", filter pills (ทั้งหมด / สร้างกล้าม / ลดไขมัน / แข็งแกร่ง), program cards each with name, days/week, level pill, ghost icon at α 40% top-right.
5. **Library** — pose-thumbnail list, per-row Squat/Bench/etc. with Thai sub-name + muscle tags + difficulty pill. **Animation thumbnails MUST be paused off-screen via IntersectionObserver** (per Tech-Lead review).
6. **Exercise detail** — large hero animation (200 px) with play / loop / pause controls, muscle map (front + back) with primary/secondary highlights, bilingual how-to steps, history table.
7. **Settings** — profile, units segmented control, language LangToggle (slider), reminder toggle.
8. **Active workout · logging** — top progress bar across exercises, current set highlighted with violet ring + pulsing dot, RPE column (with first-time tooltip per Trainer review), big +/- weight & reps steppers (44 px hit), "เซ็ตเสร็จ · 110×5" CTA, end-workout in destructive red.
9. **Active workout · resting** — full glass-blur overlay, 220 px violet→blue ring countdown, next-set preview card, ±15s / +30s adjusters, skip-rest CTA.
10. **Active workout · summary** — radial confetti rays, "ทำได้ดีมาก, Sara", 4 stat tiles, new-PR card with delta (+5 kg), streak card, share-to-LINE primary CTA.
11. **Progress · records** — segmented control (สถิติ / แนวโน้ม), full-width streak card (96 px Chakra Petch "42"), latest-PR card (Squat 142.5 kg, 36 px Chakra Petch), 52-week heatmap (14×14 cells, ring-1, rounded-sm).
12. **Body analysis** — composition card with front muscle map, body-fat scale gradient (essential → healthy → high) with glowing pip, 4 stat tiles, 90-day weight trend line chart, 4 cm-measurements, 4-month progress-photo timeline.
13. **Running plan** — week 4/12, hero next-session card (note: **per Trainer review, reduce 8 km tempo or move to week 7+**), 7-day grid colored by session type, stat tiles.
14. **Food plan** — calorie ring (violet→blue gradient + glow), 3 macro bars, 4 meal cards (Thai + EN), "+ เพิ่มอาหาร / SCAN BARCODE" CTA.

### Error / empty states (`errors.jsx`)
- **E1 Offline** — warning halo, queued-sync chip
- **E2 404** — outlined ghost numerals
- **E3 500** — server stack with red lightning crack, request-id telemetry
- **E4 Maintenance** — gear + wrench + 64% progress
- **E5 Permission denied** — bell with slashed badge
- **E6 Sync conflict** — broken cloud-sync, two-version chooser
- **E7 Empty workouts** — barbell on ground + sparkle
- **E8 Empty PRs** — ghost trophy on dotted-axis chart

All errors use a **shared `<ErrorScaffold>` layout** — illustration, kicker, title, body, primary CTA, secondary CTA. Variants: `default` (violet), `warning` (amber), `danger` (red).

### Error patterns (use BEFORE full-screen errors)
- **Toast** — 3 s auto-dismiss, top of screen, glass surface
- **Inline** — field-level, danger border + 3 px glow ring + Thai message
- **Banner** — system-wide, sticky top, dismissible, info / warning / danger variants
- **Full-screen** — only for hard 5xx, maintenance, or true 404

---

## Animation system

13 SMIL-driven looping line-art figures cover 100% of programs.

**Loop structure (every exercise, 2.5 s total):**
```
hold start (0.4s) → concentric (0.6s, ease-out)
                  → hold peak (0.3s)
                  → eccentric (0.8s, ease-in)
                  → rest (0.4s) → loop
```

**SMIL spec (copy verbatim into each animated path):**
```xml
<animate attributeName="d" dur="2.5s" repeatCount="indefinite"
  keyTimes="0; 0.16; 0.40; 0.52; 0.84; 1"
  calcMode="spline"
  keySplines=".25 .1 .25 1; .25 .1 .25 1; .42 0 .58 1; .42 0 .58 1; .25 .1 .25 1"
  values="d_start; d_start; d_peak; d_peak; d_start; d_start"/>
```

**Form-correctness fixes from Trainer review (must address before shipping):**
- **Squat** — re-key animation so knees track over toes. Current draft shows valgus collapse at parallel.
- **Bench Press** — elbows must be 45–60° tucked, not flared 90°. Re-draw lower position.

**Stroke spec:**
- Figure: 1.4 px white α 85%
- Equipment: 1.6 px white α 85%
- Joint dots: 1.6 px filled
- Motion path: 0.8 px violet, dash 1.5/1.5
- Depth indicator: 0.6 px violet, dash 3/2

**Muscle map: 3-state highlight system**
- Primary: `oklch(72% 0.20 270 / 70%)`
- Secondary: `oklch(72% 0.20 270 / 30%)`
- Inactive: `rgba(255,255,255,0.10)`

---

## Interactions & Behavior

### Navigation
- 4-tab bottom bar: Home / Workout / Progress / Library
- Active tab: violet icon **and** violet label (per UX review). 1 px top border on active item.

### Forms
- Email validation: standard regex; show inline error in Thai
- Password: 8+ chars
- Inputs focus state: 3 px violet outer glow + violet border

### Active workout (the hardest behavior in the app)
- Set is logged on tap of "เซ็ตเสร็จ"
- Rest timer auto-starts. Default 3 min, configurable per exercise.
- Timer must persist across screen lock — use `navigator.wakeLock.request('screen')` where supported. **iOS Safari has no Wake Lock support** — fallback: schedule a local notification at T-0.
- Vibrate on completion: `navigator.vibrate([200, 100, 200])`
- Audio cue: short tone at T-0
- ±15s / +30s adjusters update the displayed time but do not touch the underlying scheduled notification

### Offline contract (PWA)
- **Read-only offline:** templates, library, exercise detail, history
- **Writable offline:** logging sets, body measurements, food entries
- Queue writes in IndexedDB; sync on reconnect with conflict resolution (see Sync Conflict screen)
- Show "synced 14:32" chip top-right of every data screen, or "offline · queued" when not synced

### State management for active workout
```ts
interface ActiveWorkoutState {
  templateId: string;
  startedAt: number;
  exercises: ExerciseProgress[];   // sets logged so far
  currentExerciseIdx: number;
  currentSetIdx: number;
  restEndsAt: number | null;       // ms epoch when rest ends; null when not resting
}
```
This survives navigation, route changes, and tab switches (Zustand with `persist` middleware → IndexedDB).

### PR detection
**Per Tech-Lead review, commit to ONE definition before dev:**
- Recommendation: **Epley e1RM** = `weight × (1 + reps / 30)`. PR fires when e1RM exceeds previous max for that exercise. Display the actual best set, not the e1RM, but track with e1RM under the hood.

### Streak (per Trainer review)
- "Streak" should mean **training-week adherence**, not consecutive days
- Rest days do not break a streak
- Counter increments at end of each completed planned session

---

## i18n

- Thai is primary
- English UI strings exist for every key (see `screens3.jsx` LangToggle component for the working toggle)
- Numbers always English digits (Chakra Petch)
- Dates: when in Thai locale, use Thai abbreviations (10 ก.พ.); when English, use ISO short (Feb 10)
- **Pick one date system per screen** — do not mix EN headers with TH date values (per UX review)

---

## Files in this bundle

| File | Purpose |
|---|---|
| `Saifit Design.html` | Single entry — pan/zoom canvas of every screen |
| `screens.jsx` | Sign-in, Home, Templates, Progress, Onboarding |
| `screens2.jsx` | Active-workout (logging / resting / summary), PhoneFrame, TabBar, ScreenHeader |
| `screens3.jsx` | Running plan, Food plan, Library, Exercise detail, Settings, i18n compare |
| `anim.jsx` | SMIL animations (Squat / Bench / Pull-up / Plank), MuscleMap, AnimationBoard, BodyAnalysisScreen |
| `errors.jsx` | All 8 error / empty screens + ErrorPatternsBoard (toast / inline / banner) |
| `review.jsx` | Sprint review board with reviewer feedback (reference only — not for production) |
| `brand.jsx` | Logo, wordmark, app icons, favicons |
| `poses.jsx` | Static pose silhouettes used in Library list |
| `icons.jsx` | Tab-bar + UI icons |
| `specs.jsx` | Component sheet, state examples |
| `design-canvas.jsx` | Pan/zoom canvas wrapper (presentation only — not for production) |
| `ios-frame.jsx` | iPhone bezel for mockups (presentation only — not for production) |

`design-canvas.jsx`, `ios-frame.jsx`, `review.jsx`, and `specs.jsx` are **presentation scaffolding only** — do not port them. Everything else maps to a real component or screen.

---

## Implementation order (suggested)

1. **Tokens + glass primitives** — set up CSS variables, `<GlassCard>`, `<PrimaryButton>`, `<GlassInput>`, `<GlassPill>`, `<TabBar>`, type styles
2. **Auth flow** — Sign-in, then Onboarding step 1 (commit multi-step state model)
3. **Home + Templates + Library + Detail** — read-only flow first
4. **Active workout** — logger → rest timer → summary. The hardest piece. Get state model + persistence + Wake Lock fallback right.
5. **Progress + Body analysis** — reads from history written in step 4
6. **Errors + offline** — scaffold + 8 screens. Wire offline contract.
7. **Animations** — port the 5 priority animations (Squat, Bench, Deadlift, Row, OHP). Add IntersectionObserver pause-on-offscreen.
8. **Running + Food plans** — feature-flag for v1.1 unless explicitly v1 scope
9. **i18n** — extract every string to a key, add EN translation, wire LangToggle

---

## Critical issues to fix before shipping (from sprint review)

🛑 **Blocks v1:**
1. Re-animate Squat (knees out, not in)
2. Re-animate Bench (elbows tucked 45–60°)
3. IntersectionObserver-pause SMIL animations off-screen
4. Cap concurrent backdrop-blur layers
5. Define and document PR formula (recommendation: Epley e1RM)

⚡ **Parallel sprints 5–6:**
- Rest-timer iOS fallback (notification at T-0)
- Font fallback chain (K2D → Noto Sans Thai)
- Deload week in every long template
- Tab-bar active-state visibility fix
- Localize exercise names OR commit to EN canonical
- Sync timestamp on data screens
- Streak = training-week adherence
- Running-plan week 4 volume reduction

---

## Asset requirements

The prototype uses **inline SVG only** for illustrations and the brand mark. No raster assets required. Fonts come from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=K2D:wght@400;600;700&family=Chakra+Petch:wght@400;600;700&display=swap" rel="stylesheet">
```

For LINE Login button, use the official LINE brand assets (#00B900 background, white logo) — do not redraw.

---

## Out of scope for v1 (designed but parked)
- Food plan (full nutrition tracking is a separate product)
- Running plan (gym-goer audience)
- Progress photos (privacy / cloud-storage decisions needed)
- AI form check / coach chat
- Social / leaderboard
- 8 of 13 animations (ship Squat / Bench / Deadlift / Row / OHP first)
