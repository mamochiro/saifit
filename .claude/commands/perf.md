# /perf — Performance audit for critical GymPal pages

Diagnose and fix performance issues. Focus on the workout logger (Phase 7 — the product).

## Step 1 — Bundle size check
```bash
cd apps/web && pnpm build 2>&1 | grep -E "Route|Size|First Load"
```

Flag any route over:
- 100kB First Load JS → warning
- 200kB First Load JS → critical

## Step 2 — Logger page analysis

Check `apps/web/src/app/[locale]/workout/[id]/` for:

### Re-render traps
- [ ] `useCallback` on all event handlers passed to set rows
- [ ] `useMemo` on expensive derived values (previous workout defaults, sorted exercises)
- [ ] No object literals in JSX props (`style={{ ... }}` creates new object every render)
- [ ] Debounce function is stable (created once, not recreated on each render)

### TanStack Query config
- [ ] `staleTime` set appropriately (workout data shouldn't refetch every focus)
- [ ] `gcTime` sufficient to survive background navigation
- [ ] Optimistic updates use correct `onMutate` / `onError` / `onSettled` pattern

### Input performance
- [ ] Each set row is a separate memoized component (`React.memo`)
- [ ] Keyboard open/close doesn't cause full page re-render
- [ ] `inputmode="decimal"` present (prevents iOS from loading full keyboard)

### IndexedDB
- [ ] Write queue uses a single IDB instance (not open/close per write)
- [ ] Writes are batched where possible

## Step 3 — Image/asset audit
```bash
find apps/web/public -name "*.png" -o -name "*.jpg" | xargs ls -lh 2>/dev/null | sort -k5 -rh | head -10
```
Flag any image over 100kB. Suggest WebP conversion.

## Step 4 — Network waterfall (manual)
Remind user to open Chrome DevTools → Network → Slow 3G, reload `/workout/[id]`, check:
- Time to Interactive < 3s on slow 3G
- No render-blocking resources
- API calls parallelized (not sequential)

## Step 5 — Lighthouse PWA score (manual)
```
Run Lighthouse in Chrome DevTools on http://localhost:3000/
Target scores:
  Performance: ≥ 80 (mobile throttled)
  PWA: ≥ 90
  Accessibility: ≥ 85
```

## Step 6 — Report
For each issue found: severity (🔴 critical / 🟡 warning / 🟢 info), file location, suggested fix.
Prioritize anything that affects the workout logger page.
