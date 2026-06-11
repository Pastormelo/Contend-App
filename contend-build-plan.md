# CONTEND — MVP Build Plan
### From Blueprint to Working Software

**Version:** 1.0 · **Companion to:** Blueprint v2.0 (`/docs/blueprint.md`) · **Repo location:** `/docs/build-plan.md`
**Build constraint:** Melo + Claude Code, session by session. Every section here is written to be executable as build instructions.

---

## 0. Your 25 Questions — Already Answered, Locked

Per your instruction, prior answers govern. Mapping your question list to locked decisions:

| # | Question | Locked Answer (source) |
|---|----------|------------------------|
| 1 | Audience | OFC members (~150); college-educated baseline; Beginner accessible via term blurbs (Q1–3) |
| 2 | Tradition | Nicene/Chalcedonian + broadly Reformed evangelical (Q7) |
| 4 | Translation | ESV via API, cached; translation column for future versions (Q25) |
| 5 | Tone | Convictional, biblical, serious, rigorous; calm not snarky (vision doc) |
| 6 | Posture | Full ladder — relational → street → hostile; tone critiqued only when disproportionate (Q19–20) |
| 7 | Opponent priority | JW first (ships at MVP); hinge issues per Blueprint §18–21 (Q40 + design decision) |
| 8 | Language depth | Embedded word studies — beginner/intermediate, argument-serving, no syntax courses (Q24) |
| 9 | Levels | Six, per Blueprint §12 (vision doc) |
| 10 | Assessment | MC quizzes + AI-scored written responses + simulations at gates; oral = Phase 2 voice (Q13, 15, 18) |
| 11 | Memorization | Verses, terms, argument skeletons (Q27–29 delegated decisions) — **plus the Nicene Creed added as a Trinity L4 memory object** (new, small) |
| 13 | Copyright | No licenses assumed; cite + summarize; flagged, word-capped excerpts only (vision doc) |
| 16 | Design | Light study surfaces + dark focus-mode for training; training-academy-meets-seminary (Blueprint §36) |
| 17 | Gamification | Continuous engagement, mature presentation — insignia, not loot (Q30) |
| 18 | Pressure | All modes: hostile, rapid-fire, interruption, emotional/pastoral (Q19, 31) |
| 19 | Accounts | Real auth from day one — 150 users, no local prototype (Q1–2, 6) |
| 20 | Admin | Melo sole admin; roles schema-ready for later (Q32) |
| 21 | Monetization | Free now → subscription later (Q4) |
| 22 | Metrics | Mastery model: rubric scores, gates, deck maturity, streaks, XP (Blueprint §29) |
| 23 | Launch scope | The MVP test: intake → Trinity Beginner→Apprentice → JW simulation → critique → retry (Blueprint §8) |
| 24 | Future | Cohorts, instructor dashboards, native app, certification, voice (Q6, 38; Blueprint §9) |
| 25 | Name | *Contend* working title; weighty + scriptural register (Blueprint §1) |

**Three genuinely new micro-decisions** (you hadn't been asked these exact things — I've decided per your "you decide" pattern; veto anytime):

- **Q3 (Confessional affirmations):** Yes — the app's stated doctrinal basis affirms the Nicene Creed, Chalcedonian Christology, inerrancy, penal substitution, sola Scriptura, and classical theism. Every one of these follows from "Nicene/Chalcedonian + broadly Reformed evangelical," and classical theism matches your *aeternitas* work. This becomes a short "What Contend Affirms" page.
- **Q12 (Uploads):** MVP knowledge base = structured source records + your notes typed/pasted into admin. **No PDF ingestion at MVP** — document parsing is a real engineering subsystem and the citation library doesn't need it. Phase 2: PDF upload → AI-extracted source notes (still draft → approval).
- **Q14–15 (AI grounding):** The AI never answers free-range. Opponent personas are grounded in their persona prompt + source refs; the Coach is grounded in the lesson's model answers, skeletons, and the citation library, under a **citation-or-silence rule** — it may only cite sources that exist in the `sources` table, and if the library can't support a suggestion, it says so and routes to you (admin flag) rather than improvising. No confidence-percentage labels — false precision; grounding + audit queue is the real safety mechanism.

Everything below builds on these locked answers only.

---

## 1. Stack — Confirmed, With Four Improvements

Your preference list is correct. Confirmed stack plus the four additions that matter:

| Layer | Decision | Notes |
|---|---|---|
| Framework | **Next.js 15, App Router, TypeScript** | Server Components by default; client components only where interactive |
| Styling | **Tailwind CSS v4** | Design tokens from Blueprint §36 defined once in `globals.css` |
| Components | **shadcn/ui** | Themed: serif display (Fraunces), Inter body, ink/off-white + focus-mode dark, oxblood accent |
| Data/Auth | **Supabase** (Postgres + Auth + RLS + Storage) | Free tier covers MVP scale comfortably |
| Hosting | **Vercel** ← GitHub push-to-deploy | Already your workflow |
| AI | **Anthropic API**: Haiku (opponent personas, card fuzzy-matching), Sonnet (coach critique, rubric scoring, admin drafting) | All calls through one seam: `lib/ai/` |
| **➊ AI SDK** | **Vercel AI SDK** (`ai` package) | Streaming simulator chat in ~30 lines instead of hand-rolled SSE; the single best DX choice for this app |
| **➋ Validation** | **Zod** | Every API route validates input; every AI JSON output is schema-parsed (AI evaluation lives or dies on this) |
| **➌ Types from DB** | **Supabase generated types** (`supabase gen types`) — no ORM | One less abstraction layer for Claude Code sessions to trip on; queries stay readable |
| **➍ Email** | **Resend** | Auth verification + password reset |
| Verses | ESV API + `verses_cache` write-through | |
| Testing | Vitest (logic units) + one Playwright golden-path smoke | Per Blueprint §43.2 |

**Explicitly not using:** Redux/Zustand (server state + small client state suffices) · Prisma/Drizzle (generated types + Supabase client) · a CMS platform (the admin panel *is* the CMS — content shape is too custom for Sanity/Payload) · tRPC (route handlers + Zod are enough).

## 2. Folder Structure

```
contend/
├── docs/
│   ├── blueprint.md          # Blueprint v2.0
│   ├── build-plan.md         # this file
│   ├── decisions.md          # append-only decision log
│   └── qa.md                 # living manual QA checklist
├── supabase/
│   ├── migrations/           # numbered SQL migrations (schema = code)
│   └── seed.sql              # dev seed: 1 lesson, 1 deck, 1 persona, terms
├── src/
│   ├── app/
│   │   ├── (public)/         # landing, login, signup
│   │   ├── (app)/            # authed shell: dashboard, tracks, learn,
│   │   │   │                 # review, drills, spar, film, gate, profile,
│   │   │   │                 # settings, assessment
│   │   │   └── layout.tsx    # header (streak/XP), nav, auth guard
│   │   ├── (admin)/admin/    # role-gated: lessons, questions, cards,
│   │   │                     # glossary, sources, personas, rubrics,
│   │   │                     # users, audit
│   │   └── api/              # route handlers (see §5)
│   ├── components/
│   │   ├── ui/               # shadcn primitives
│   │   ├── lesson/           # BlockRenderer + per-block components
│   │   ├── quiz/             # QuestionRenderer + per-type components
│   │   ├── cards/            # ReviewSession, modes, grading bar
│   │   ├── spar/             # ScenarioCard, ChatThread, CoachReport
│   │   ├── progress/         # LevelInsignia, RubricBars, TrendChart, StreakFlame
│   │   └── admin/            # BlockEditor, QuestionEditor, PublishControls,
│   │                         # AiDraftPanel, SourcePicker
│   ├── lib/
│   │   ├── supabase/         # server client, browser client, middleware helper
│   │   ├── ai/
│   │   │   ├── client.ts     # provider seam: BYOK-aware, usage-logging, rate-limited
│   │   │   ├── prompts/      # persona scaffold, coach, rubric, drafting (versioned)
│   │   │   └── schemas.ts    # Zod schemas for every AI JSON output
│   │   ├── srs.ts            # SM-2-lite (pure, unit-tested)
│   │   ├── scoring.ts        # MC grading, gate composite (pure, unit-tested)
│   │   ├── xp.ts             # XP award + badge check (single choke-point)
│   │   ├── esv.ts            # verse fetch + cache
│   │   └── config.ts         # hardcoded constants (see §16)
│   └── types/                # supabase generated types + app types
├── tests/                    # vitest units + playwright smoke
└── .env.local                # keys (never committed)
```

## 3. Database Schema — MVP Cut

Blueprint §38 is the full schema; **all of it migrates at Milestone 1** (structure is cheap, restructuring isn't). Migration grouping for sanity:

- `0001_identity.sql` — profiles, role enum, RLS baseline
- `0002_curriculum.sql` — tracks, track_prereqs, levels, modules, module_lessons, lessons, lesson_blocks
- `0003_knowledge.sql` — sources, citations, glossary_terms, verses_cache
- `0004_memory.sql` — decks, cards, card_reviews
- `0005_assessment.sql` — question_bank, quizzes, quiz_attempts, written_responses
- `0006_simulation.sql` — personas, simulations, simulation_messages, simulation_reviews
- `0007_progress.sql` — user_track_progress, xp_events, streaks, badges, user_badges, intake_attempts
- `0008_platform.sql` — rubric_prompts, ai_drafts, api_keys_user, usage_log

**MVP tables left empty but migrated** (zero UI): organizations-related = none yet (Phase 3 adds its own migration); user-created decks (`decks.scope='user'`) — schema live, UI Phase 1.5.

**RLS rules of thumb (write into every migration):** content tables → `SELECT` where `status='published'` for all authed users, full access for `role='admin'`; user-owned tables (`*_attempts`, `card_reviews`, `simulations*`, `written_responses`, `xp_events`, `streaks`, `user_badges`, `api_keys_user`) → owner-only, mutations via server routes; `verses_cache`, `glossary_terms` → read-all-authed.

## 4. Core Components (Build Inventory)

**Lesson system**
- `BlockRenderer` — switches on `lesson_blocks.type`; the heart of the reader
- `ProseBlock` · `ScriptureBlock` (verse card w/ ESV text + exegetical note) · `WordStudyBlock` (script, transliteration, gloss, limits) · `ObjectionBlock` (visually distinct "their strongest case" treatment) · `TermCallout` · `CitationMark` + `CitationCard` (popover) · `ModelAnswerBlock` (admin/coach-visible only)
- `LessonProgressRail` · `LessonCompleteCTA` (pushes cards, routes to quiz)

**Quiz system**
- `QuestionRenderer` — switches on question type
- `MCQuestion` · `TFQQuestion` (true/false/needs-qualification) · `ClozeQuestion` · `VerseMatchQuestion` · `WrittenResponse` (textarea + rubric result panel)
- `QuizResult` (per-question routing links back to lesson blocks) · `GateShell` (lockout state, composite progress)

**Memory system**
- `ReviewSession` (queue runner) · `CardFace` per type · mode components: `FirstLetterMode`, `ClozeMode`, `TypedRecallMode` · `GradeBar` (again/hard/good/easy) · `DeckMaturityBar`

**Simulator**
- `SparConfig` (persona/difficulty/toggles picker) · `ScenarioCard` (pinned) · `ChatThread` (streamed) · `PressureTimer` (thin bar) · `CoachReport` (rubric bars, three quoted moments, suggestions w/ citations, remediation links) · `FilmList` + `TranscriptReplay` (inline critique) · `RubricTrendChart`

**Progress & shell**
- `AppHeader` (streak flame, XP, profile) · `LevelInsignia` · `TrackCard` (incl. "In Training" stub state) · `LevelLadder` · `BadgeGrid` + `BadgeUnlockMoment` · `DashboardToday`

**Admin**
- `BlockEditor` (sortable block list, per-type forms) · `PublishControls` (draft→review→published) · `AiDraftPanel` (kind picker, input, draft output → accept-as-draft) · `QuestionEditor` · `CardEditor` · `SourceForm` + `SourcePicker` · `PersonaEditor` + `PersonaSandbox` (test conversation) · `ScoringAuditQueue` · `UserOverviewTable`

## 5. App Routes

**Pages** — exactly Blueprint §37, MVP subset (everything except `/decks` user-deck creation UI; "In Training" stubs render for unbuilt tracks).

**API route handlers:**

```
/api/verses                GET   ref → ESV (cache write-through)
/api/quiz/[id]/attempt     POST  grade MC server-side, persist, award XP
/api/written/score         POST  rubric scoring (Sonnet) → scores+feedback
/api/gate/[levelId]        POST  composite gate eval + 24h lock + progression
/api/intake/submit         POST  band routing → placements + rationale
/api/review/queue          GET   due cards (≤30)
/api/review/grade          POST  SM-2 update
/api/drill/argue           GET   random objection · POST response → score
/api/spar/start            POST  create session
/api/spar/[id]/message     POST  streamed opponent reply (Haiku, AI SDK)
/api/spar/[id]/end         POST  coach critique (Sonnet) → review persisted
/api/keys                  POST  BYOK save (server-side encrypt)
/api/usage                 GET   user AI usage + shared-cap status
/api/admin/ai-draft        POST  drafting assistant
/api/admin/publish         POST  workflow transitions
/api/admin/import          POST  CSV/JSON bulk import (questions, cards)
```

Every handler: Zod-validated input → Supabase server client (RLS enforced) → typed response. XP is awarded only inside `lib/xp.ts` calls from these handlers — one choke-point, no drift.

## 6. User Flow (MVP Golden Path)

1. **Sign up** → email verify → profile created → forced into **intake assessment**
2. **Intake** (~30 MC, three bands, routed) → placement screen: "Trinity: start at Apprentice · Jehovah's Witnesses: locked until Trinity Defender" + rationale → CTA into first lesson
3. **Daily loop:** Dashboard → review queue (≤5 min) → resume lesson → checkpoint quiz (wrong answers deep-link back) → new cards pushed → streak credited
4. **Module end:** written defense → AI rubric score + feedback + stronger answer → retry option
5. **Level end:** gate (MC draw + written per §12 table) → pass: insignia moment, next level unlocks; fail: remediation list, 24h lock
6. **Trinity Defender reached** → JW track unlocks → "Know Them" lessons → first **simulation**: config → scenario → 6–14 exchanges → coach report → saved to Game Film
7. **Ongoing:** drills for XP, Game Film trend review, badges accrue quietly

## 7. Admin Flow (Content Production Loop)

1. `/admin` board: content by status, scoring-audit queue, flags
2. **New lesson:** create in module → outline pasted into `AiDraftPanel` ("draft lesson from outline + these sources") → draft blocks land in `BlockEditor` → Melo edits, attaches citations via `SourcePicker`, marks terms → status `in_review` → self-review pass → `published`
3. **Quiz + cards:** AiDraftPanel from the published lesson ("6-question checkpoint", "cards for this lesson") → review → publish
4. **Persona:** `PersonaEditor` (prompt + source refs + scenario card) → `PersonaSandbox` 10-exchange test → publish
5. **Weekly audit:** scoring-audit queue — agree/disagree on AI scores → disagreements inform rubric-prompt revision (versioned)
6. **Bulk:** intake bank and drill objections via CSV import

## 8. First 5 Screens to Build (in order)

1. **App shell + Dashboard** — header (streak/XP/profile), nav, "Today" layout with queue CTA + resume card. *Establishes design tokens; every other screen inherits.*
2. **Lesson Reader** (`/learn/[id]`) — BlockRenderer with prose, scripture, term callout, citation, objection blocks; Trinity M1.3 as the live content. *The app's core reading experience; get typography right here.*
3. **Checkpoint Quiz** — MC + TFQ rendering, server grading, wrong-answer deep-links, XP award. *Proves the assessment loop.*
4. **Review Queue** (`/review`) — ReviewSession with read/first-letter/cloze/typed modes + SM-2 grading. *Proves the daily-habit surface.*
5. **Simulator** (`/spar` config → chat → `CoachReport`) — the full sparring slice with one persona. *Proves the product thesis and the entire AI seam.*

(Parallel admin screen #1: BlockEditor + PublishControls — built alongside screen 2 so content stops being seed SQL.)

## 9. First Training Module to Build

**Trinity M1.3 — "Saying It Right"** (Beginner, Module 3). Chosen because it's self-contained, exercises every block type, and produces the app's most important memory object.

Content spec:
- **Blocks:** Frame (the "you worship three gods" moment) → prose teaching → `term_callout` × 4 (*being, person, essence, Trinity*) → `scripture` × 3 (Deut 6:4; Matt 28:19; 2 Cor 13:14 w/ notes) → `objection` ("isn't this contradictory?" preview) → prose: the six-line formulation → `model_answer` (the formulation, coach-grounding) → citations (White; Sanders — summarized, cited)
- **Cards pushed (10):** 3 scripture (the three texts) · 4 term · 1 argument skeleton (**the six-line formulation** — the app's flagship memory object) · 2 cloze on person/being distinction
- **Checkpoint (6):** 3 MC · 2 TFQ ("The Trinity means one God expressing himself three ways" → *false* — modalism; "God is one being" → *true, needs qualification* practice) · 1 cloze
- **Glossary seeds:** the 4 terms above, written for the minimal-vocabulary reader

## 10. First Debate Simulator Prototype

**Persona:** *"Curious Anti-Trinitarian Neighbor"* — Civil difficulty, Trinity track (JW personas need the JW track's published sources; this persona needs only Trinity content, so it ships first).

- **Scenario card:** "Your neighbor saw you leave for church and asks, sincerely: 'I've never understood — do Christians worship one God or three?'"
- **Opponent prompt scaffold** (the template all personas reuse): identity + sincere-tone constraints · belief commitments + talking points (with source refs) · fidelity rule (never strawman own side, never fold cheaply, movement only if genuinely argued) · escalation curve (civil = honest follow-ups, no hostility) · output constraints (≤120 words/turn, one main point per turn) · session-bound guardrails (Blueprint §34.7)
- **Flow:** 6–10 exchanges → user or persona moves to close → close prompt: "land a gospel pathway" → `/api/spar/[id]/end`
- **Coach output (Zod-enforced JSON):** `{ rubric: {5 categories, 1–5 + one-line rationale each}, best_moment, weak_moment, missed_opportunity (each with quoted text), suggestions: [{point, citation_source_id}], remediation_lesson_ids[] }` — rendered as the CoachReport, persisted, charted in Game Film.
- **Prototype exit test:** Melo runs it three times — once well, once badly, once with deliberate overclaiming — and the coach's scores and quotes track reality all three times. That's the calibration seed.
## 11. How Quiz Scoring Works

**Multiple choice / TFQ / cloze / verse-match** — graded server-side in `lib/scoring.ts` (answers never shipped to the client):
- MC single: 1/0. MC multi: all-or-nothing (partial credit teaches sloppy doctrine). TFQ: correct option = 1; choosing "true" when "needs qualification" is right = 0 but triggers a teaching note. Cloze: normalized exact match (case/punctuation-insensitive) with admin-defined accepted alternates.
- **Checkpoint:** percentage; pass ≥ 70% to mark lesson complete (unlimited retries; each wrong answer deep-links to its lesson block via `question.source_block_id`).
- **Gate composite** (`gate_config` per level, defaults per Blueprint §12): MC section = random draw from the level's bank (e.g., 15 of 40) scored against threshold (85/90%) **AND** written component meeting its rubric floor **AND** (where required) deck-maturity / simulation-pass flags checked from progress tables. All conditions true → gate passes atomically; any false → remediation list generated from the failed components, 24h lock written.
- **Written responses** → §14.

## 12. How Memorization Review Works

`lib/srs.ts` — pure function, unit-tested first, never touched casually:

```
state: { ease 1.5–2.5 (start 2.3), interval_days, due_at, mode, streak }
grade(card, response ∈ {again, hard, good, easy}):
  again → interval = 1, ease -0.2 (floor 1.5), mode regresses one step
  hard  → interval × 1.2, ease -0.05
  good  → interval × ease            (1 → 3 → 7 → ~16 → ~37 → ~85…)
  easy  → interval × ease × 1.3, ease +0.05 (cap 2.5)
  intervals snap to {1,3,7,14,30,90} until > 90, then raw
mode ladder (scripture cards): read → first_letter → cloze → typed
  advances when card reaches interval ≥ 7 in current mode
card state: new → learning (<14d) → learned (≥14d) → mature (≥30d)
queue: due cards ordered (overdue first), capped at 30/day
"core deck learned" (gate input): every card in deck ≥ learned
```

**Typed-recall grading:** scripture = normalized exact match (strict wording, tolerant punctuation); terms = normalized match → fuzzy (Levenshtein ≤ 2) → Haiku semantic fallback; argument skeletons at Specialist+ = AI completeness check against `cards.skeleton` (per-point hit/miss map shown to the user).

## 13. How Progress Tracking Works

- **`xp_events` is an append-only ledger** — XP totals, streak checks, and badge triggers all derive from it; nothing stores a mutable "total" that can drift. Award values live in `lib/config.ts` (Blueprint §29 economy).
- **`user_track_progress`** holds `current_level` + `gates_passed` (with timestamps + attempt refs) + `gate_attempt_locks`. Written *only* by the gate route.
- **Streaks:** any scored activity today (queue completion, quiz, drill, spar) marks the day; `lib/xp.ts` updates current/longest; one grace day banked per 7 consecutive days, auto-spent on a miss.
- **Badges:** `badges.criteria` jsonb evaluated by code in the XP choke-point after every award (e.g., `{type:'deck_mature', deck:'trinity-defender-core'}`, `{type:'sim_count', n:10}`, `{type:'rubric_tone', score:5, difficulty:'hostile'}`). New badge *types* need code; new badges of existing types are pure data.
- **Surfaces:** per-track insignia (profile/track pages), rubric trend lines (Game Film, from `simulation_reviews` + `written_responses`), deck maturity bars, streak flame in header.

## 14. How AI Evaluation Works

One seam: `lib/ai/client.ts` — resolves key (BYOK → shared fallback w/ monthly cap + per-user rate limit), logs every call to `usage_log`, returns Zod-parsed output or a typed failure. Models: **Haiku** = opponent turns, fuzzy card grading. **Sonnet** = rubric scoring, coach critique, admin drafting. Temperature: 0.2 for scoring/critique, 0.8 for opponent personas.

**Rubric scoring call (written responses + simulations):**
- *Inputs:* active `rubric_prompts` row (versioned) · the question/scenario · the user's response or full transcript · grounding pack: lesson `model_answer` blocks + relevant `cards.skeleton` + library source list (id + title only).
- *Output (Zod):* five scores 1–5 with one-line rationales, feedback, stronger answer, `citation_source_ids[]` (validated against the sources table — **citation-or-silence**: invalid id → retry once → degrade to uncited general feedback + `flagged=true` for the audit queue).
- *Tone category* applies the contextual policy (Blueprint §28): the prompt explicitly instructs that firmness against aggression is not penalized; only disproportionate aggression, mockery, contempt.
- **Calibration protocol** (Blueprint §43.3): Melo hand-scores 20 responses; tune until ≥80% agreement within ±0.5; re-run after any prompt/model change. The audit queue (`flagged` + random sample) is the permanent harness.

**Failure posture:** AI down or cap hit → quizzes/lessons/cards unaffected (no AI); written responses queue for scoring with honest UI ("scoring delayed"); simulations show the cap state before starting. The app degrades to a still-useful study tool, never to a broken one.

## 15. How Source Citations Work

- **Authoring:** in `BlockEditor`, Melo attaches a citation (source + locator) to any block via `SourcePicker`; excerpts require `is_excerpt=true` and enforce the word cap at save time.
- **Rendering:** `CitationMark` superscripts in the prose; tap → `CitationCard` popover (title, author, year, locator, **source-type badge** — Scripture / public domain / Melo's notes / summarized copyrighted work / opponent's own publication). Track pages auto-generate bibliographies.
- **AI integration:** the coach's `citation_source_ids` render as the same CitationCards — AI suggestions are visibly grounded in the same library as lessons.
- **Compliance:** `/admin/sources` includes the excerpt report (every `is_excerpt` row, word counts) — the standing copyright self-audit.

## 16. Hardcoded vs. Database-Driven (MVP)

| Hardcoded (`lib/config.ts` or code) | Database-driven |
|---|---|
| The 6 level *numbers* + gate evaluation logic | Level titles, equipped statements, `gate_config` thresholds |
| The 5 rubric *categories* | Rubric prompt *text* (versioned rows) |
| Block types, question types, card types, modes | All content: tracks, lessons, blocks, questions, cards, terms, sources, personas, scenario cards |
| SM-2 numbers, XP award values, queue cap, gate lockout duration | Decks and their contents; badge definitions (criteria jsonb) |
| Badge criteria *evaluators* (code per type) | Which badges exist, their thresholds |
| Persona prompt *scaffold* (template) | Each persona's beliefs, talking points, source refs |
| Coach/scoring prompt *structure* + Zod schemas | Grounding content it draws from |
| Design tokens, ESV as translation (config constant) | `verses_cache` rows |
| "What Contend Affirms" page copy | Everything users study |

**Rule of thumb:** *behavior* is code; *content and tunable thresholds* are rows. Melo should never need a deploy to add a lesson, persona, question, or badge — and never need the database to change how scoring math works.

## 17. Milestone-by-Milestone Build Plan

Each session below = one Claude Code working session (1.5–3 hrs), ending in a commit + phone QA. `docs/decisions.md` gets one line per session.

### Milestone 0 — Foundations (Week 0, Sessions 1–2)
- **S1:** Repo init, Next.js 15 + TS + Tailwind + shadcn, docs/ committed, Vercel connected, deploys green. Accounts: Anthropic API (**$25 spend cap set**), ESV key, Supabase project, Resend.
- **S2:** Migrations 0001–0008 written + applied; RLS in place; `supabase gen types`; seed.sql (Trinity track skeleton, M1.3 placeholder, 4 glossary terms, 2 sources, 1 persona row); `lib/config.ts`.
- *Exit:* deployed shell loads; database matches Blueprint §38; types generated.

### Milestone 1 — Walking Skeleton (Weeks 1–3, Sessions 3–10)
- **S3:** Auth (email + Google), middleware guards, profile-on-signup, app shell + header (Screen 1 baseline).
- **S4:** Dashboard "Today" layout + design tokens locked (typography, palette, focus-mode class).
- **S5:** Lesson Reader: BlockRenderer + prose/scripture/term/citation blocks; `lib/esv.ts` + `/api/verses`; M1.3 content entered as real rows (Screen 2).
- **S6:** Admin: BlockEditor + PublishControls + SourceForm/SourcePicker — M1.3 becomes editable, not seeded (parallel admin screen).
- **S7:** Quiz engine: MC + TFQ + cloze renderers, `lib/scoring.ts` + units, `/api/quiz/attempt`, deep-link routing, XP choke-point v1 (Screen 3).
- **S8:** Memory: `lib/srs.ts` + units, ReviewSession + all modes, queue + grade routes, M1.3's 10 cards live (Screen 4).
- **S9:** Simulator: `lib/ai/client.ts` (shared key only for now) + persona scaffold + SparConfig + streamed ChatThread (AI SDK) + the Curious Neighbor persona.
- **S10:** Coach: critique route + Zod schema + CoachReport + Game Film save/replay (Screen 5).
- *Exit (the Walking Skeleton test):* on your phone — complete M1.3 → quiz → review 10 cards → spar → read critique → then edit the lesson in admin. **Run the 3-conversation calibration seed (§10).**

### Milestone 2 — Systems Complete (Weeks 4–7, Sessions 11–20)
- **S11:** Written responses: `/api/written/score`, rubric prompt v1 (DB row), WrittenResponse component + result panel.
- **S12:** Gates: composite evaluator + units, GateShell, 24h locks, remediation lists, `user_track_progress` writes, insignia moment.
- **S13:** Intake: question bank import (CSV route), adaptive-lite routing, placement screen, forced first-run.
- **S14:** Drills: timed recall sprint + `/api/drill/argue` (90-sec objection → rubric score).
- **S15:** Pressure toggles (hostility/interruption/emotional/timer in persona scaffold + UI) + difficulty ladder unlocks.
- **S16:** Game Film complete: filters, RubricTrendChart; streaks + grace day; badges engine + MVP badge set.
- **S17:** BYOK: `/api/keys` (server-side encryption), settings UI, shared-cap status + degradation states (§14 failure posture).
- **S18:** Admin AiDraftPanel (lesson/quiz/cards/persona drafting → draft status) + PersonaSandbox.
- **S19:** Scoring-audit queue + question analytics + bulk import polish.
- **S20:** Track gallery + stubs + prereq locks; profile; accessibility pass (AA contrast, keyboard, reduced-motion); Playwright golden path.
- *Exit:* every MVP feature functional with thin content; golden-path smoke green.

### Milestone 3 — Content Production (Weeks 6–14, overlapping — **the critical path**)
Sequence (per Blueprint §42): Trinity L1–2 (validates template — **do L1 entirely before judging the workflow**) → L3–4 (word studies; Nicene Creed memory object added at L4) → L5–6 (drill bank ≈ 40 objections, hostile + academic personas) → JW track (12 lessons, 3 personas, sandbox-tested) → intake bank (~90 questions, banded).
**Budget: 2–4 editorial hrs/lesson → 60–100 hrs total. Calendar-block it weekly like sermon prep.**

### Milestone 4 — Calibration & Beta (Weeks 12–16)
- Formal calibration: hand-score 20 written responses → tune rubric prompt → ≥80% within ±0.5.
- Adversarial persona pass (extraction, strawman-induction, injection attempts) before testers touch it.
- Beta: 10–15 testers (P1 slice + 2–3 Builders Cohort + one honest critic); weekly tasks + friction log; audit every beta AI score; exit when the golden path is bug-free and 3 testers independently complete Trinity Beginner → Apprentice.

### Milestone 5 — Launch (Fall 2026)
Launch vehicle decision (open question §45.3) → onboarding = intake as front door → weekly "this week's drill" rhythm → 30-day post-launch review: stub votes decide the first Phase 2 track.

---

### Standing Session Rules (taped to the wall)
1. One milestone-slice per session; never "build the whole app."
2. Commit every working state; broken → roll back, don't excavate.
3. Claude Code reads `/docs/blueprint.md` + `/docs/build-plan.md` + `/docs/decisions.md` at session start.
4. Schema changes get their own session, migration, and commit.
5. You QA on your phone before the session ends. If it doesn't work on the phone, it doesn't work.
6. `lib/srs.ts`, `lib/scoring.ts`, `lib/xp.ts` are load-bearing: unit tests exist before features depend on them, and prompts/AI never bypass them.
