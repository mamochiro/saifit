#!/usr/bin/env bash
# send-task.sh — reliably deliver a task to a GymPal agent's Claude Code session.
#
# Claude Code uses bracketed-paste mode — a bare `tmux send-keys ... Enter`
# pastes text into the input buffer but the Enter is swallowed. This script
# does the two-step: paste, pause, then send a bare Enter to submit.
#
# Usage:
#   ./scripts/send-task.sh <agent> <message>
#
#   <agent>   — one of: web | line-bot | db | qa | orchestrator
#   <message> — task text (quote it)
#
# Examples:
#   ./scripts/send-task.sh web      "implement /api/workouts route with auth + Valibot"
#   ./scripts/send-task.sh line-bot "add weekly summary cron message in Thai"
#   ./scripts/send-task.sh db       "add migration for isBodyweight column"
#   ./scripts/send-task.sh qa       "run /quality-gate"

set -euo pipefail

SESSION="gympal-agents"

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <agent> <message>" >&2
  echo "  agents: web | line-bot | db | qa | orchestrator" >&2
  exit 1
fi

agent="$1"
shift
message="$*"

case "$agent" in
  orchestrator) window="🎯orch" ;;
  web)          window="🌐web" ;;
  line-bot)     window="💬line" ;;
  db)           window="🗄db" ;;
  qa)           window="✅qa" ;;
  # also accept full emoji names directly
  *)            window="$agent" ;;
esac

if ! tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "tmux session '$SESSION' not found. Start it with scripts/multiagent.sh." >&2
  exit 1
fi

if ! tmux list-windows -t "$SESSION" -F "#{window_name}" | grep -qx "$window"; then
  echo "Window '$window' not found in session '$SESSION'." >&2
  echo "Available windows:" >&2
  tmux list-windows -t "$SESSION" -F "  #{window_name}" >&2
  exit 1
fi

# Load message into a tmux buffer and paste it with bracketed-paste markers.
# send-keys alone races against Claude Code's bracketed-paste mode on long
# messages — the Enter gets swallowed inside the paste. paste-buffer -p sends
# the proper \033[200~…\033[201~ wrapper so the REPL treats the whole text as
# pasted input, then the explicit Enter below submits it.
tmpfile=$(mktemp /tmp/gympal-task-XXXXXX)
printf '%s' "$message" > "$tmpfile"
tmux load-buffer "$tmpfile"
rm -f "$tmpfile"
tmux paste-buffer -t "${SESSION}:${window}" -p
sleep 0.5
tmux send-keys -t "${SESSION}:${window}" Enter

echo "→ sent to ${window}"
