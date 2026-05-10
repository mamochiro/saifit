# /biome-fix — Run Biome auto-fix across the monorepo

Fix all auto-fixable Biome lint and format issues, then report what remains.

## Step 1 — Check current state
```bash
biome check . --reporter=summary 2>&1 | tail -20
```

## Step 2 — Auto-fix safe issues
```bash
biome check . --write --unsafe 2>&1
```

`--unsafe` fixes additional issues that are safe in practice (unused imports, etc.) but Biome marks as potentially unsafe. Review the output.

## Step 3 — Format
```bash
biome format . --write 2>&1
```

## Step 4 — Re-check for remaining issues
```bash
biome check . 2>&1
```

## Step 5 — Report remaining manual fixes needed
If any errors remain after auto-fix, list them grouped by:
- **TypeScript errors** (type-safety violations — fix manually)
- **Logic errors** (complexity, suspicious code — review manually)
- **Style errors** (if any remain — should be 0 after format)

For each remaining error, show:
- File path and line number
- Error message
- Suggested fix

## Step 6 — Commit if clean
If `biome check .` exits 0:
```bash
git add -A
git commit -m "chore: biome auto-fix lint and format"
```

Do NOT commit if any errors remain.
