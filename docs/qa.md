# QA Log

## Build-time verification (done in the dev container)

- `npm run build` — clean production build, all routes compile.
- `npm test` — 23 unit tests passing across `lib/srs.ts`, `lib/scoring.ts`, `lib/xp.ts` (interval ladder, grade effects, mode ladder, normalization, streak math, XP scaling).
- `npm run lint` — clean.
- All 8 migrations + `seed.sql` applied against a live Postgres: 9 tracks, 6 levels, 16 blocks, 8 questions, 12 cards, 6 glossary terms, 3 sources, 7 citations, 1 persona, 1 rubric prompt.
- Client bundle grep: no service-role key, no API keys, no persona system prompt, no quiz answers in `.next/static`. (The string `needs_qualification` appears once — it is the visible TFQ option label, not an answer.)

## Outstanding — requires live keys (run §19 acceptance on a phone)

Everything that touches Supabase auth, the ESV API, Anthropic, or Resend
needs the real environment variables. Run the CLAUDE.md §19 checklist top
to bottom after filling `.env.local`: signup → lesson → quiz → review →
respond → spar → coach report, plus the 3-run coach calibration.
