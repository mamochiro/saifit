# /logger-ux — Workout logger UX checklist audit

Audit the workout logger page (`apps/web/src/app/workout/[id]/`) against the critical UX requirements. Check each item and report pass/fail/missing.

## Input requirements
- [ ] All weight/rep inputs have `inputmode="decimal"`
- [ ] Decimal normalizer converts `,` → `.` before parseFloat
- [ ] Previous workout values pre-populated as input defaults
- [ ] Tap targets ≥ 56px (check min-h / min-w on set row buttons)

## Auto-save
- [ ] Debounce is set to 300ms (not more, not less)
- [ ] TanStack Query mutation fires on debounce
- [ ] Optimistic update applied before server confirms
- [ ] "Saved locally" badge shown when offline

## Set completion
- [ ] Checkmark button is bottom-right (thumb zone)
- [ ] Auto-advance to next set on completion
- [ ] Undo available for 3 seconds after auto-advance

## Rest timer
- [ ] Renders as circular countdown (not just text)
- [ ] Docked above keyboard (not center-screen)
- [ ] Persists across navigation (does not reset on route change)
- [ ] Vibrates on countdown complete
- [ ] Falls back to haptic if vibration is blocked (silent mode)
- [ ] Shows on lock screen via Notification API

## Offline / resilience
- [ ] IndexedDB write queue exists (not just in-memory)
- [ ] Queue entries have sequence numbers
- [ ] On reconnect: server reconciliation (not blind replay)
- [ ] `visibilitychange` event handler saves pending state

## PR celebration
- [ ] PR detection fires on each set completion
- [ ] Confetti or animation shown when PR beaten
- [ ] Haptic feedback on PR

## Error / edge states
- [ ] Error boundary wraps the page
- [ ] Loading skeleton shown before data loads
- [ ] Graceful handling if LINE auth expires mid-workout (no logout)

Report each item: ✅ implemented / ❌ missing / ⚠️ partial. For missing items, point to the file and line where the fix should go.
