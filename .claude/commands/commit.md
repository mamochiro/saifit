# /commit — Smart conventional commit helper

Creates a well-formed conventional commit for the current staged/unstaged changes.

## Step 1 — Show what will be committed
```bash
git status
git diff --staged
git diff
```

## Step 2 — Analyze changes

Based on the diff, determine:
- **Type**: feat / fix / chore / docs / refactor / test / style / perf / ci
- **Scope**: which package/area changed (db, web, line-bot, auth, logger, templates, progress, etc.)
- **Breaking change**: does this break existing behavior?

## Step 3 — Draft commit message

Follow this format:
```
<type>(<scope>): <short description in English, ≤72 chars>

[optional body — only if WHY is non-obvious]
[optional footer — BREAKING CHANGE: ... or closes #issue]
```

Examples:
```
feat(logger): add IndexedDB write queue with sequence numbers
fix(auth): normalize LINE profile displayName before saving
chore(db): generate migration for isBodyweight field on workoutSets
perf(logger): reduce debounce jitter by caching previous workout values
feat(i18n): complete Thai translations for settings page
```

## Step 4 — Stage and commit

```bash
# Stage all changed files (ask user if any .env files appear)
git add <specific files — never git add -A blindly>
git commit -m "<drafted message>"
```

## Rules
- Never commit `.env`, `.env.local`, or files containing secrets
- Never commit `node_modules/`, `.next/`, `dist/`
- Warn if committing to main/master directly
- Always run `biome check .` before committing — refuse if it fails
- Scope should match the SPRINT.md phase being worked on when possible
