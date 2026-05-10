# /phase-done — Mark a phase complete

Usage: `/phase-done <phase-number>`
Example: `/phase-done 1`

When this command runs:

1. Run `biome check .` from the repo root. If it fails, stop and report errors — do NOT mark the phase done.
2. Run `vitest run` from the repo root. If any tests fail, stop and report — do NOT mark the phase done.
3. If both pass, open SPRINT.md and:
   - Change the phase's status in the summary table from `⬜` to `✅`
   - Confirm with the user which specific checklist items are done
   - Check off completed items `[ ]` → `[x]` for the specified phase
4. Suggest the conventional commit message for this phase.
5. Print a summary: what passed, what was checked off, what the next phase is.

If $ARGUMENTS is empty, ask the user which phase number to mark done.
