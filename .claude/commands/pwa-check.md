# /pwa-check — Full PWA requirements audit

Audit the Saifit PWA setup against all requirements. Report pass/fail for each item.

## 1. Manifest
Check `apps/web/public/manifest.json` or `apps/web/src/app/manifest.ts`:
- [ ] name and short_name present
- [ ] start_url set (should be `/`)
- [ ] display: `"standalone"`
- [ ] theme_color matches brand color
- [ ] background_color present
- [ ] icons array includes: 192×192, 256×256, 384×384, 512×512 (all PNG)
- [ ] maskable icon present (purpose: "maskable")
- [ ] lang: `"th"` (Thai default)

## 2. Service Worker (serwist)
Check `apps/web/src/` for serwist configuration:
- [ ] `sw.ts` or equivalent service worker file exists
- [ ] Offline shell is cached (at minimum: `/`, `/sign-in`)
- [ ] Static assets precached
- [ ] Runtime caching strategy for API routes (NetworkFirst or StaleWhileRevalidate)
- [ ] Service worker registered in `next.config.ts`
- [ ] No references to `next-pwa` (must use `serwist`)

## 3. Install prompt
Check for install prompt logic:
- [ ] `beforeinstallprompt` event captured
- [ ] Install prompt shown only after 2nd visit (check localStorage or cookie counter)
- [ ] "Add to home screen" UI component exists

## 4. Meta tags in layout
Check `apps/web/src/app/layout.tsx` or `[locale]/layout.tsx`:
- [ ] `<meta name="theme-color">` present
- [ ] `<meta name="apple-mobile-web-app-capable" content="yes">`
- [ ] `<meta name="apple-mobile-web-app-status-bar-style">`
- [ ] `<link rel="apple-touch-icon">` pointing to 192px icon
- [ ] Viewport meta: `width=device-width, initial-scale=1`

## 5. Icons on disk
```bash
ls apps/web/public/icons/ 2>/dev/null || echo "icons directory missing"
```
Check: icon-192.png, icon-256.png, icon-384.png, icon-512.png exist and are non-zero size.

## 6. Offline behavior
- [ ] `apps/web/src/app/offline/page.tsx` or equivalent exists
- [ ] Offline page is part of the precache

## 7. Splash screen (iOS)
- [ ] Apple splash screen meta tags present for common iPhone sizes
OR
- [ ] Fallback: solid background_color with centered logo icon

## Report
For each item: ✅ pass / ❌ fail / ⚠️ partial / — not found
List specific fixes needed for any ❌ items.
