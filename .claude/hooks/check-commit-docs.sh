#!/usr/bin/env bash
# PreToolUse hook (Bash matcher): gates `git commit` behind a doc-review step.
#
# First attempt at a git commit is always blocked. The block reason instructs
# Claude to diff staged changes, update CLAUDE.md/CHANGELOG.md/test-cases.md/
# README.md per this repo's conventions where needed, present a summary, and
# wait for explicit user approval. Only after approval does Claude create the
# sentinel file below, which lets the *next* commit attempt through once.

set -eu

input="$(cat)"

if ! grep -q "git commit" <<< "$input"; then
  exit 0
fi

repo_root="$(cd "$(dirname "$0")/../.." && pwd)"
sentinel="$repo_root/.claude/.docs-reviewed"

if [ -f "$sentinel" ]; then
  rm -f "$sentinel"
  exit 0
fi

cat <<'JSON'
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Git commit blocked pending doc review. Before committing: 1) Run `git diff --cached` (and `git status`) to see what's staged. 2) Check whether these docs need updates, per CLAUDE.md's conventions, and only edit the ones that actually apply: CLAUDE.md (architecture/conventions/commands changed), CHANGELOG.md (add an [Unreleased] entry, Keep a Changelog format, for any framework-level or TC-XXX test-case change), test-cases.md (sync for TC-XXX additions/removals/modifications), README.md (user-facing setup/usage changed). 3) Present a summary of the doc edits you made (or state plainly that none are needed) and wait for the user's explicit approval — do not proceed without it. 4) Once the user approves, run `touch .claude/.docs-reviewed` and then retry the exact same git commit command."
  }
}
JSON
