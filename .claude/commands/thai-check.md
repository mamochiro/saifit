# /thai-check — Thai locale audit

Audit the codebase for Thai locale correctness. Check each item and report pass/fail:

## 1. Line-height
Search for global `line-height` or `leading-*` CSS/Tailwind classes.
Thai script needs at least `leading-relaxed` (1.625) or `line-height: 1.6+`.
Flag any component with hard-coded tighter line-height that renders Thai text.

## 2. Decimal separator
Search all input components for `inputmode="decimal"`.
Verify there is a normalizer that converts `,` → `.` before parsing (Thai keyboards output comma as decimal).
Find: `grep -r "parseFloat\|Number(" apps/web/src --include="*.tsx"` — flag any that don't normalize first.

## 3. Number formatting
Search for raw number rendering (e.g., `{volume}`, `{weight}`) without `Intl.NumberFormat`.
Thai users expect `1,000` not `1000`. Flag bare number renders in progress charts and set rows.

## 4. Default locale
Check `apps/web/src/middleware.ts` or next-intl config — verify `defaultLocale` is `"th"`, not `"en"`.

## 5. Button label overflow
List all shadcn/ui `<Button>` usages. For each, check the Thai string length in `messages/th.json`.
Thai strings are typically 20–40% longer than English. Flag any button without `truncate` or `text-wrap` that could overflow.

## 6. Date/time formatting
Search for `new Date().toLocaleDateString()` — should use `{ locale: userLocale }` or `Intl.DateTimeFormat`.
Bangkok timezone: verify `Asia/Bangkok` is the default.

Report: ✅ pass / ❌ fail / ⚠️ warning for each check. Suggest fixes for failures.
