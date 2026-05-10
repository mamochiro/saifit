# /i18n-sync — Audit and sync i18n translation keys

Audit translation completeness between Thai and English, then fix missing keys.

## Step 1 — Find the message files
Look for `apps/web/messages/th.json` and `apps/web/messages/en.json`.

## Step 2 — Deep key comparison
Compare all keys recursively between th.json and en.json.

```bash
# Extract all keys from both files
node -e "
const th = JSON.parse(require('fs').readFileSync('apps/web/messages/th.json', 'utf8'));
const en = JSON.parse(require('fs').readFileSync('apps/web/messages/en.json', 'utf8'));
function keys(obj, prefix='') {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' ? keys(v, prefix+k+'.') : [prefix+k]
  );
}
const thKeys = new Set(keys(th));
const enKeys = new Set(keys(en));
const missingInEn = [...thKeys].filter(k => !enKeys.has(k));
const missingInTh = [...enKeys].filter(k => !thKeys.has(k));
console.log('Missing in en.json:', missingInEn);
console.log('Missing in th.json:', missingInTh);
"
```

## Step 3 — Report

For each missing key:
- **Missing in en.json**: Add a placeholder English translation based on the Thai value's meaning
- **Missing in th.json**: Add a placeholder Thai translation (use English as fallback, mark with `[TODO:th]` prefix)

## Step 4 — String length audit for buttons
Check all keys that appear to be button labels (keys containing: "button", "cta", "action", "submit", "cancel", "save", "start", "done").
Thai strings in buttons should be under 20 characters. Flag any that are longer with ⚠️.

## Step 5 — Hardcoded string scan
Search for hardcoded Thai or English strings in `.tsx` files that should be in the message files:
```bash
grep -r "className" apps/web/src --include="*.tsx" -l  # just for reference
grep -rn '"[ก-๛]' apps/web/src --include="*.tsx"  # hardcoded Thai
grep -rn "\"[A-Z][a-z].*[a-z]\"" apps/web/src/app --include="*.tsx" | grep -v "import\|from\|className\|type\|const"  # potential hardcoded English labels
```

## Step 6 — Output
Report:
- ✅ Keys in sync: N
- ❌ Missing in en.json: list
- ❌ Missing in th.json: list
- ⚠️ Long button strings in Thai: list
- ⚠️ Potential hardcoded strings: list

Ask user before writing any changes to the JSON files.
