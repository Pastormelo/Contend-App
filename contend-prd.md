# CONTEND — Product Requirements Document
### A Training Environment for Christian Apologetics
**Working title:** *Contend* (Jude 3 — "contend for the faith once for all delivered to the saints"). Replace at will; the brand work comes later.

**Version:** 1.0 · **Owner:** Melo · **Status:** Approved for build · **Target:** Private use summer 2026, OFC launch Fall 2026

---

## 1. Product Overview

### 1.1 One-Sentence Definition
Contend is a web-based training environment that forms Christians into capable, gracious defenders of the faith through a learn → memorize → drill → simulate → critique → advance loop, beginning with the doctrine of the Trinity and expanding to opponent-specific tracks (Islam, Mormonism, Jehovah's Witnesses, Hebrew Israelites, secular skepticism).

### 1.2 Problem Statement
Most Christians cannot articulate, let alone defend, core doctrines under real conversational pressure. Existing resources are either passive (books, podcasts), shallow (trivia apps), or combative in tone (debate-clip culture). Nothing on the market combines doctrinal depth, primary-source accuracy about opposing views, deliberate practice under pressure, and 1 Peter 3:15 formation of *manner* alongside *matter*.

### 1.3 Product Principles
1. **Train, don't just teach.** Every lesson terminates in a required performance: recall, response, or simulation.
2. **Steelman, never strawman.** Opposing positions are represented from primary sources (Qur'an, Watchtower publications, LDS standard works) and cited as such.
3. **Gated mastery.** Users advance per-track only by demonstrated competence — quizzes *and* rubric-scored written responses.
4. **Conviction with gentleness.** Tone critique flags only disproportionate aggression (aggressive toward a non-aggressive interlocutor). Firmness under hostility is trained, not penalized.
5. **Serious aesthetic.** Premium, weighty, academic. Gamified mechanics, restrained presentation.
6. **Built to grow.** Content lives in a database, not in code. Admin can add tracks, lessons, sources, questions, and arguments without redeployment.

### 1.4 Theological Guardrails
- **Confessional baseline:** Nicene/Chalcedonian orthodoxy; broadly Reformed evangelical.
- **Methodology:** Eclectic, leaning classical/evidential (Craig, Groothuis, Habermas/Licona) with Koukl-style tactics; methodology itself taught as a topic at Specialist level.
- **Intramural debates** (age of the earth, eschatology, Calvinism in evangelism): present ranges, do not adjudicate.
- **Final theological authority:** Melo, sole reviewer. All AI-drafted content requires his approval before publish (enforced by a `draft → review → published` content workflow).

---

## 2. User Personas

**P1 — "The Faithful Member" (primary, ~60% of users).** OFC member, 25–55, college-educated, biblically literate but theologically untrained. Has been cornered by a JW at the door or a Muslim coworker and felt unprepared. Needs: structured path, defined terms, confidence under mild pressure. Starts at Beginner/Apprentice.

**P2 — "The Emerging Leader" (~25%).** Builders Cohort participant, deacon, group leader, or pastoral resident. Comfortable with doctrine, wants rigor: Greek word studies, primary-source engagement, hostile simulations. Starts at Defender. Will become the app's evangelists and future cohort leaders.

**P3 — "The Skeptic-Adjacent Christian" (~15%).** Younger believer with deconstruction pressure in their friend group or family. Less interested in cults, more in secular objections (problem of evil, reliability of Scripture, resurrection). Needs the Skeptic track and emotional-pressure simulation.

**P4 — "The Admin" (Melo).** Sole content author/approver. Needs: AI-assisted drafting inside the admin panel, fast review/approve workflow, source library management, user progress visibility. Future: delegate via editor/reviewer roles.

**P5 (future) — "The Instructor."** Cohort leader at OFC or another church. Needs: dashboard of cohort progress, assignment of tracks, review of member simulations. Phase 3.

---

## 3. MVP Scope (Ship by Fall 2026)

### In Scope
1. **Auth + profiles** (email/password + Google sign-in)
2. **Intake assessment** — multiple choice, per-track placement recommendation
3. **Trinity track, fully built** — all six levels of content (see §8)
4. **One opponent track: Jehovah's Witnesses** — chosen because it is the natural application of the Trinity track (shared verses, shared Greek studies, maximal content reuse)
5. **Lesson engine** — text-first lessons with term blurbs, embedded Greek/Hebrew word studies, ESV verse retrieval, citations
6. **Memorization system** — Scripture decks, term decks, argument-skeleton decks; SM-2-lite spaced repetition
7. **Quiz engine** — multiple choice + written responses with AI rubric scoring
8. **Debate simulator (text mode)** — AI opponent + post-conversation critique + saved transcripts ("game film")
9. **Timed argumentation drills** — 90 seconds to answer a live objection
10. **Per-track gated level progression** with XP, streaks, badges
11. **Admin panel v1** — CRUD for lessons/quizzes/cards/sources, AI-assisted drafting, draft→published workflow, sole-admin
12. **Mobile-responsive from day one**

### Explicitly Deferred
Voice mode · cohorts/leaderboards/instructor dashboards · remaining opponent tracks (Islam, Mormonism, Hebrew Israelites, Skeptic — stubs visible, marked "Coming") · editor/reviewer roles · subscriptions/payments · native app · video lessons · additional Bible translations · public knowledge-base search.

### The MVP Test
A P1 user can: take the intake assessment → be placed → complete the Trinity Beginner level (lessons, memory work, quiz, written defense) → unlock Apprentice → face a simulated JW conversation → receive critique → review the transcript → retry and improve. If that loop works end-to-end, the product thesis is proven.

---

## 4. Future-State Vision (12–36 Months)

- **Phase 2 (post-launch, 2026–27):** Islam track, Skeptic track, voice-mode simulation, cohort features + leaderboards, instructor dashboards, editor/reviewer roles, Mormonism + Hebrew Israelite tracks.
- **Phase 3 (brand launch):** Subscription tiers (individual / church license), public marketing site, second Bible translation, audio lesson narration, native mobile app (likely React Native/Expo reusing the API), public knowledge base, church-to-church deployment.
- **Long arc:** The standalone brand — the serious training platform for apologetics, positioned between seminary and Sunday school. Church licensing is the revenue engine; cohort + instructor tooling is the moat.

---

## 5. Feature List (Consolidated)

| # | Feature | MVP | Phase |
|---|---------|-----|-------|
| 1 | Auth, profiles | ✅ | 1 |
| 2 | Intake assessment (MC, per-track placement) | ✅ | 1 |
| 3 | Lesson engine (text, terms, word studies, citations) | ✅ | 1 |
| 4 | ESV verse retrieval (API) | ✅ | 1 |
| 5 | Flashcards: Scripture / terms / arguments | ✅ | 1 |
| 6 | Spaced repetition (SM-2 lite) | ✅ | 1 |
| 7 | Quizzes (MC) | ✅ | 1 |
| 8 | Written responses + AI rubric scoring | ✅ | 1 |
| 9 | Timed argumentation drills | ✅ | 1 |
| 10 | Timed recall challenges | ✅ | 1 |
| 11 | Debate simulator — text | ✅ | 1 |
| 12 | Simulation critique + stronger-answer suggestions | ✅ | 1 |
| 13 | Saved transcripts / game film | ✅ | 1 |
| 14 | Per-track gated levels | ✅ | 1 |
| 15 | XP, streaks, badges | ✅ | 1 |
| 16 | Trinity track (full) | ✅ | 1 |
| 17 | JW track | ✅ | 1 |
| 18 | Admin CMS + AI drafting + approval workflow | ✅ | 1 |
| 19 | Source/citation library with type tagging | ✅ | 1 |
| 20 | Islam track | — | 2 |
| 21 | Skeptic/secular track | — | 2 |
| 22 | Voice-mode simulation | — | 2 |
| 23 | Cohorts, leaderboards, instructor dashboards | — | 2 |
| 24 | Editor/reviewer roles | — | 2 |
| 25 | Mormonism, Hebrew Israelite tracks | — | 2 |
| 26 | Subscriptions, church licensing | — | 3 |
| 27 | Native app, audio narration, 2nd translation | — | 3 |

---

## 6. Curriculum Architecture

### 6.1 Content Hierarchy
```
TRACK (e.g., The Trinity; Engaging Jehovah's Witnesses)
 └─ LEVEL (Beginner → Scholar-Level Defender, gated)
     └─ MODULE (e.g., "The Son Is God")
         └─ LESSON (one sitting, 10–20 min)
             ├─ Lesson blocks: prose, Scripture, word study,
             │   objection box, source citation, term blurb
             ├─ Memory assignment (cards pushed to user's queue)
             ├─ Checkpoint quiz (MC)
             └─ Performance task (written defense / drill / simulation)
```

### 6.2 Track Types
- **Doctrinal tracks** build the positive case (Trinity, Deity of Christ, Reliability of Scripture, Resurrection, Existence of God, The Gospel).
- **Opponent tracks** apply doctrine against a specific worldview (JW, Islam, Mormonism, Hebrew Israelites, Secular Skepticism). Opponent tracks *require* prerequisite doctrinal levels (e.g., JW Specialist requires Trinity Defender) — this enforces the "doctrine before debate" philosophy and reuses content.

### 6.3 Lesson Anatomy (every lesson)
1. **Frame** — why this matters in a real conversation (1 paragraph).
2. **Teach** — the doctrine/argument, with defined terms inline (tap a term → blurb).
3. **Ground** — key Scriptures rendered via ESV API, with brief exegetical notes; Greek/Hebrew word study where load-bearing (e.g., *monogenēs* in John 1:18; the anarthrous *theos* of John 1:1c against the NWT's "a god"; Granville Sharp in Titus 2:13).
4. **Anticipate** — the strongest opposing reading, cited from primary sources.
5. **Equip** — the response, structured as a memorizable argument skeleton.
6. **Perform** — quiz + memory assignment + (at module end) written or simulated defense.

### 6.4 Term System
Every defined term lives in a glossary table. First occurrence in any lesson renders as a tappable blurb. This is how Beginner stays accessible to readers with minimal vocabulary without dumbing down the prose.

### 6.5 Knowledge Base / Source Library
A structured citation library, not a wiki. Every source record carries:
- `source_type`: `scripture | public_domain | licensed | copyrighted_reference | melo_notes | primary_opponent_source`
- Bibliographic data, and for opponent sources, edition/publication detail (e.g., *Should You Believe in the Trinity?*, Watchtower, 1989).
- Copyright rule enforced at the content layer: copyrighted works are cited and summarized in original words; only Scripture, public domain texts, and Melo's own notes render at length. Short fair-use excerpts are stored with an explicit `excerpt` flag and length cap.

---

## 7. Level System (Per-Track, Gated)

| Level | Equipped To… | Gate to Advance |
|-------|--------------|-----------------|
| 1. Beginner | Explain basic Christian claims in plain language | Quiz ≥ 85% + 1 written explanation scored ≥ 3/5 on rubric |
| 2. Apprentice | Answer common objections | Quiz ≥ 85% + 2 written responses ≥ 3/5 + core deck at "learned" status |
| 3. Defender | Engage informed critics | Quiz ≥ 85% + written responses ≥ 4/5 + pass 1 standard simulation |
| 4. Specialist | Engage specific groups with primary-source fluency | Quiz ≥ 90% + pass 2 simulations vs. trained opponent persona |
| 5. Advanced Apologist | Handle hostility, interruption, emotional pressure | Pass pressure-mode simulation (hostility on) + timed drills ≥ 4/5 avg |
| 6. Scholar-Level Defender | Engage academic/highly trained opponents with biblical, historical, philosophical, and linguistic argument | Pass academic-mode simulation + capstone written defense ≥ 4.5/5 |

**Mechanics:** Levels gate content and simulation difficulty. Placement from the intake assessment can start a user as high as Defender; Specialist and above must always be earned in-app. Progress is per-track and displayed as such ("Trinity: Defender · Islam: Beginner").

**Rubric (all written/simulated responses, 1–5 each):**
1. Biblical accuracy & use of Scripture
2. Logical soundness & structure
3. Accuracy in representing the opponent (steelman integrity)
4. Persuasive clarity
5. Tone & manner (scored *contextually* — see §10.5)

---

## 8. The Trinity Track (Flagship — Fully Built at Launch)

**Track goal:** The user can state, ground, defend, and apply the doctrine that there is one God eternally existing in three persons — and can do so against modalism, Arianism (ancient and modern/JW), and unitarianism, under pressure, with primary texts.

### Level 1 — Beginner: *The Claim*
- M1.1 One God (Deut 6:4; Isa 43–46; monotheism as non-negotiable)
- M1.2 Three Persons Introduced (baptism of Jesus; Matt 28:19; 2 Cor 13:14)
- M1.3 Saying It Right (the six-line formulation: one God / Father is God / Son is God / Spirit is God / persons distinct / therefore one God in three persons; "person" vs. "being" defined)
- M1.4 What the Trinity Is *Not* (tritheism, modalism, partialism; why most analogies fail — water/egg/clover each teaches a heresy — and how to qualify any analogy you use)

### Level 2 — Apprentice: *The Common Objections*
- M2.1 "The word Trinity isn't in the Bible"
- M2.2 "Jesus prayed to the Father — how can he be God?"
- M2.3 "The Father is greater than I" (John 14:28; economic vs. ontological)
- M2.4 "Isn't 1 + 1 + 1 = 3?" (the logic of one *what*, three *whos*; no contradiction)
- M2.5 "The Holy Spirit is just a force" (personal pronouns, grieving, speaking, willing — Acts 5, Eph 4:30, 1 Cor 12:11)

### Level 3 — Defender: *The Positive Case*
- M3.1 The Deity of the Son I — explicit texts (John 1:1–18; John 20:28; Rom 9:5; Titus 2:13; Heb 1; Phil 2:5–11)
- M3.2 The Deity of the Son II — Yahweh texts applied to Jesus (Isa 45:23→Phil 2:10; Joel 2:32→Rom 10:13; Isa 6→John 12:41; Ps 102→Heb 1:10–12)
- M3.3 The Deity of the Son III — divine prerogatives (forgiving sin, receiving worship, judging, creating, "I AM" sayings)
- M3.4 The Deity & Personhood of the Spirit
- M3.5 Personal Distinction (sending, loving, glorifying between persons; eternal relations introduced)
- M3.6 OT Anticipations (Gen 1:26; the Angel of the LORD; Wisdom; plural/singular phenomena handled honestly — what they do and don't prove)

### Level 4 — Specialist: *The Texts Under Fire + History*
- M4.1 John 1:1 in Greek — the anarthrous *theos*, Colwell, why "a god" fails; NWT engagement
- M4.2 Word studies: *monogenēs*, *prōtotokos* (Col 1:15), *archē* (Rev 3:14), Granville Sharp (Titus 2:13; 2 Pet 1:1)
- M4.3 "Hard texts": Prov 8:22; Mark 13:32; 1 Cor 15:28; Col 1:15
- M4.4 Nicaea & Chalcedon — what was actually decided, why it matters, and answering "the Trinity was invented in 325" (ante-Nicene witnesses: Ignatius, Justin, Tertullian, Origen — cited, summarized)
- M4.5 Eternal relations, *aeternitas* and divine timelessness (your scholastic framework slots in here)

### Level 5 — Advanced Apologist: *Pressure*
- M5.1 Rapid-objection drills (timed, randomized from the full objection bank)
- M5.2 Hostile simulation: aggressive anti-trinitarian (interruption tactics on)
- M5.3 Emotional-pressure simulation: sincere family member leaving the faith over the doctrine
- M5.4 Tactics module (Koukl-style questions: "What do you mean by that?" / "How did you come to that conclusion?" applied to trinitarian debate)

### Level 6 — Scholar-Level Defender: *The Academy*
- M6.1 Philosophical objections (the logical problem of the Trinity; relative identity vs. constitution models — presented as ranges, per guardrails)
- M6.2 History-of-religions objections (pagan-parallel claims debunked)
- M6.3 Engaging trained unitarian argumentation (steelmanned from their strongest published material)
- M6.4 Capstone: full written defense + academic-mode simulation

**Sources powering the track** (cited/summarized, never reproduced): White, *The Forgotten Trinity*; Reeves, *Delighting in the Trinity*; Sanders, *The Deep Things of God*; plus public-domain patristics and Melo's own notes.

---

## 9. Opponent-Specific Tracks

**Shared template** (every opponent track):
1. **Know Them** — history, authority structure, key texts, vocabulary (their terms in their senses)
2. **Their Strongest Case** — steelmanned, primary-source cited
3. **The Hinge Issues** — the 3–5 questions the whole engagement turns on
4. **The Response** — Scripture, reason, history, language
5. **The Conversation** — tactics, common deflections, gospel pathways
6. **Simulation Ladder** — civil → informed → trained → hostile personas

**MVP track — Jehovah's Witnesses:** Prereq Trinity Defender. Hinge issues: John 1:1/NWT, *prōtotokos*, the 144,000/two-class salvation, blood/organization authority, the divine name. Primary sources: NWT, *Should You Believe in the Trinity?*, *Reasoning from the Scriptures*, Watchtower history (1914, failed predictions handled accurately, not gleefully). Persona ladder: doorstep publisher → study conductor → elder.

**Phase 2 tracks (outlined now, built later):**
- **Islam:** Tawhid vs. Trinity; Qur'anic Jesus (Surah 4:157, 5:116 — note it targets a Mary-included triad, a misrepresentation we don't hold); reliability of the Bible vs. *tahrif* claims; the cross and resurrection; Muhammad's prophethood. Primary: Qur'an (multiple translations), sahih hadith.
- **Mormonism:** Nature of God (exaltation, plurality of gods) vs. monotheism; First Vision accounts; Book of Mormon historicity; grace vs. exaltation. Primary: standard works, *Gospel Principles*, King Follett discourse.
- **Hebrew Israelites:** Identity claims, law-keeping, deity of Christ within their internal spectrum (1 West camps vs. others — represented accurately), Gal 3/Eph 2 and the one new man; engaging street-style aggression (this track leans heavily on pressure simulation).
- **Secular Skepticism:** Existence of God (cosmological, fine-tuning, moral); problem of evil; reliability of the NT; resurrection (minimal facts); science-and-faith; "Christianity is harmful" cultural objections.

---

## 10. Debate Simulator Design

### 10.1 Architecture
A structured chat session between the user and an AI opponent persona, followed by an AI critique pass. Two LLM roles per simulation:
- **Opponent:** plays the persona with fidelity (system prompt includes the persona's actual beliefs, primary-source talking points, vocabulary, and a *fidelity rule*: never concede inaccurately, never strawman its own side).
- **Coach (post-game):** scores the transcript against the 5-part rubric, quotes the user's weakest moments, supplies stronger answers, and assigns remediation (e.g., "Review M4.1; your John 1:1 answer didn't address Colwell").

### 10.2 Modes (user picks per session)
- **Format:** Text (MVP). Voice (Phase 2) — the schema and API are designed so voice transcripts flow into the same pipeline.
- **Difficulty:** mapped to level — Civil / Informed / Trained / Hostile / Academic.
- **Pressure toggles** (Advanced+): interruptions (opponent fires a follow-up before fully ceding the floor), emotional stakes (persona is a family member, not a stranger), time pressure (response timer visible).

### 10.3 Session Flow
1. User selects track, persona, difficulty, toggles → 2. Scenario card sets the scene ("You're at the door; she's holding *Should You Believe in the Trinity?*") → 3. 6–14 exchange conversation; opponent escalates realistically → 4. Either side can move to close; user is prompted to land a gospel pathway, not just "win" → 5. Coach critique renders: rubric scores, three quoted moments (best / weakest / missed opportunity), stronger-answer suggestions with citations back into lessons → 6. Transcript saved to **Game Film** with scores; retry offered.

### 10.4 Game Film
Every simulation is stored and replayable, with critique inline. Users (and later, instructors) can track score trends per rubric category over time — this is the single best progress signal in the app.

### 10.5 Tone Policy (encoded in the Coach prompt)
Tone is scored **contextually**: firmness, directness, and pressing hard against an aggressive opponent are *not* penalized; the only tone deduction is disproportionate aggression toward a non-aggressive interlocutor, mockery, or contempt. The coach also affirmatively rewards 1 Pet 3:15 moments — gentleness that doesn't surrender ground.

### 10.6 Persona Integrity Safeguards
- Persona prompts are content records (admin-editable), seeded with primary-source citations.
- A standing instruction: the opponent must present its side's *best* arguments and may "convert" only if the user's argumentation genuinely warrants movement — no cheap wins.
- Melo reviews persona prompts like any other content (draft → published).

---

## 11. Memorization System

### 11.1 Three Card Types
1. **Scripture cards** — reference + ESV text. Progressive recall modes: read → first-letter prompt → cloze (fill-in-the-blank) → full typed recitation (scored with tolerance for punctuation, strict on wording). Modes advance automatically as the card matures.
2. **Term cards** — term → definition (glossary-backed). Standard front/back with typed-answer option.
3. **Argument-skeleton cards** — the decision from Q28: users memorize **numbered skeletons verbatim** through Defender level (e.g., the 6-line Trinity formulation; the 5 minimal facts), then at Specialist+ are drilled on reproducing the argument *in their own words*, scored by AI for completeness against the skeleton. Skeleton first, fluency second — the skeleton is the scaffold, paraphrase is the goal.

### 11.2 Scheduling
SM-2-lite spaced repetition: intervals of 1, 3, 7, 14, 30, 90 days with a simple again/hard/good/easy response, ease factor capped to keep the math predictable. Daily review queue capped at 30 cards. Lessons push assigned cards into the queue automatically.

### 11.3 Decks
- **Core decks per level** (curated): e.g., *Trinity Defender Core* — 25 verses, 15 terms, 6 skeletons. Core deck "learned" status (every card ≥ 14-day interval) is a level-gate component.
- **User decks:** users may create personal decks from any verse, term, or argument in the system (Phase 1.5 — schema supports it day one).

### 11.4 Timed Challenges
- **Timed recall:** flashcard sprints against the clock (light, fun, streak-feeding).
- **Timed argumentation (signature feature):** a randomized objection appears — "Why do you worship three gods?" — user has 90 seconds to type (later: speak) a response, AI-scored on the rubric. Unlocked at Defender; required at Advanced.

---

## 12. Quiz & Assessment System

### 12.1 Question Types
Multiple choice (single/multi-answer) · true-false-qualify ("true, false, or needs qualification" — unusually good for theology) · verse-match · cloze · **written response** (AI rubric-scored, 1–5 per category, with feedback and stronger-answer suggestion).

### 12.2 Checkpoint vs. Gate
- **Checkpoint quizzes** end each lesson: 5–8 MC questions, unlimited retries, wrong answers route to the relevant lesson block.
- **Gate assessments** end each level: longer MC section (drawn randomly from the level's question bank) + written component per the §7 gate table. Limited to one attempt per 24h to make gates feel weighty.

### 12.3 Intake Assessment
Multiple choice only (per your decision). ~30 questions, adaptive-lite: three difficulty bands, user is routed up/down by performance. Output: a per-track placement recommendation ("Start Trinity at Defender; start JW at Beginner") with a one-paragraph rationale. Placement caps at Defender; Specialist+ is always earned.

### 12.4 AI Scoring Guardrails
Written-response scoring uses a fixed rubric prompt + the lesson's model answer + the argument skeleton as grounding. Scores are deterministic-leaning (temperature low), and every scored response stores the AI feedback so Melo can audit scoring quality from the admin panel and tune the rubric prompt — the rubric prompt is itself an admin-editable content record.

---

## 13. Admin / Content Management System

### 13.1 MVP Capabilities (Melo, sole admin)
- CRUD for: tracks, levels, modules, lessons (block-based editor), glossary terms, sources, citations, quiz questions, flashcards, personas, rubric prompts, badges.
- **AI drafting assistant inside the panel:** "Draft a 6-question checkpoint quiz from this lesson" / "Generate five objection variants of this argument for the drill bank" / "Draft Lesson M2.3 from these notes." Output always lands as `draft`.
- **Workflow:** `draft → in_review → published`. Only `published` content is user-visible. Every record stores author, reviewer, timestamps — so when editor/reviewer roles arrive in Phase 2, the workflow already exists; you simply stop being the only one in it.
- **Source library manager:** add sources with type tagging (§6.5); attach citations to any lesson block.
- **User overview:** progress per user per track, recent simulations, flagged low-scoring responses (audit AI grading).

### 13.2 Roles (schema now, UI later)
`admin` (everything) · `editor` (create/edit drafts) · `reviewer` (approve to published) · `instructor` (Phase 2: cohort dashboards) · `user`.

---

## 14. Database Schema (Proposal — Postgres/Supabase)

```
-- Identity & access
profiles            (id→auth.users, name, role, created_at)
roles via profiles.role enum: admin|editor|reviewer|instructor|user

-- Curriculum
tracks              (id, slug, title, type: doctrinal|opponent, prereq_track_id,
                     prereq_level, status, sort)
levels              (id, track_id, number 1-6, title, equipped_statement,
                     gate_config jsonb, status)
modules             (id, level_id, title, summary, sort, status)
lessons             (id, module_id, title, est_minutes, sort, status,
                     author_id, reviewer_id, published_at)
lesson_blocks       (id, lesson_id, sort, type: prose|scripture|word_study|
                     objection|citation|term_callout|model_answer, content jsonb)

-- Sources & language
sources             (id, source_type enum (§6.5), title, author, publisher,
                     year, edition, url, notes)
citations           (id, source_id, lesson_block_id, locator, excerpt_text,
                     is_excerpt bool, excerpt_words int)
glossary_terms      (id, term, short_blurb, full_definition, greek_hebrew bool,
                     original_script, transliteration)
verses_cache        (id, reference, translation, text, fetched_at)  -- ESV API cache

-- Memory system
decks               (id, title, scope: core|user, level_id?, owner_id?)
cards               (id, deck_id, type: scripture|term|argument, front jsonb,
                     back jsonb, skeleton jsonb?)
card_reviews        (id, user_id, card_id, ease, interval_days, due_at,
                     mode: read|first_letter|cloze|typed, streak)

-- Assessment
question_bank       (id, level_id, type: mc|tfq|cloze|verse_match|written,
                     prompt, options jsonb, answer jsonb, difficulty 1-3,
                     model_answer text?, status)
quizzes             (id, kind: checkpoint|gate|intake, lesson_id?, level_id?,
                     config jsonb)
quiz_attempts       (id, user_id, quiz_id, score, passed, answers jsonb,
                     started_at, finished_at)
written_responses   (id, user_id, question_id|drill_id, response_text,
                     rubric_scores jsonb {5 categories}, ai_feedback text,
                     stronger_answer text, created_at)

-- Simulation
personas            (id, track_id, name, difficulty: civil|informed|trained|
                     hostile|academic, system_prompt, source_refs jsonb, status)
simulations         (id, user_id, persona_id, mode: text|voice,
                     toggles jsonb {interrupt, emotional, timed},
                     status, started_at, ended_at)
simulation_messages (id, simulation_id, role: user|opponent, content, ts)
simulation_reviews  (id, simulation_id, rubric_scores jsonb, best_moment,
                     weak_moment, missed_opportunity, suggestions jsonb,
                     remediation_lesson_ids jsonb)

-- Progress & gamification
user_track_progress (id, user_id, track_id, current_level, gates_passed jsonb)
xp_events           (id, user_id, amount, reason, ref_id, created_at)
streaks             (user_id, current, longest, last_active_date)
badges              (id, slug, title, criteria jsonb, icon)
user_badges         (user_id, badge_id, awarded_at)

-- Intake
intake_attempts     (id, user_id, answers jsonb, band_path jsonb,
                     placements jsonb {track: level}, rationale text)

-- AI/admin
rubric_prompts      (id, name, prompt_text, version, active)
ai_drafts           (id, kind, input jsonb, output jsonb, created_by, accepted)
api_keys_user       (id, user_id, provider, encrypted_key, created_at)  -- BYOK
```

Row-Level Security: users read `published` content + their own records; admin role bypasses. Supabase RLS handles all of this declaratively.

---

## 15. Recommended Tech Stack

**Optimized for one constraint above all others: you are building this with Claude Code as a non-coder.** Every choice below is the most well-trodden path — meaning Claude generates the most reliable code for it and errors are most searchable.

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 15 (App Router) + TypeScript** | Industry default; Claude Code's strongest territory; one codebase for site + API routes |
| UI | **Tailwind CSS + shadcn/ui** | Matches the design system (§16); component-by-component, themeable |
| Database/Auth/Storage | **Supabase** (Postgres + Auth + RLS + Storage) | Free tier covers 150 users easily; auth solved; RLS = security without writing a backend |
| Hosting | **Vercel** | You already use it; free tier sufficient; push-to-deploy from GitHub |
| Repo | **GitHub** | Already in your workflow; Claude Code works directly in it |
| AI | **Anthropic API (Claude)** via API routes; **Haiku** for opponent personas & card scoring, **Sonnet** for critique & rubric scoring | Quality where it counts, pennies where it doesn't |
| Verses | **ESV API** (free tier, cached in `verses_cache`) | Per your choice; caching keeps you far under rate limits |
| Email | Resend (auth emails) | Trivial setup |

### 15.1 Honest Cost & API Reality Check (Q36)
Two things you need to know plainly:

1. **Your Claude.ai subscription does not include API access.** Claude Code usage for *building* the app is covered by your plan. But the *deployed* app calling Claude for simulations and scoring requires a separate Anthropic API account billed per use. There is no way to route a deployed Vercel app through your claude.ai subscription.
2. **The costs are small at your scale, but not zero.** With Haiku running personas and Sonnet running critiques: a full simulation + critique ≈ $0.02–0.08. If 150 users average 4 simulations + scored work monthly, expect roughly **$15–50/month**. Quizzes, lessons, and flashcards cost nothing — only AI features bill.

**Recommended model — exactly what you described in Q36:** Build **BYOK (bring-your-own-key)** as a first-class feature. Users paste their own Anthropic API key (stored encrypted, `api_keys_user` table); their usage bills to them. You fund a shared fallback key with hard monthly caps and per-user rate limits for members without keys. When you move to subscription (Phase 3), the subscription simply absorbs the API cost. Note: "connect their ChatGPT" subscriptions can't be connected either — but BYOK with an OpenAI key *as an alternative provider* is feasible in Phase 2 if demanded; design the AI calls behind one internal interface so providers are swappable.

### 15.2 ESV Licensing Flag
The ESV API's free tier is for **non-commercial** use — fine for the free OFC launch. The day you charge subscriptions, you need Crossway's commercial permission or a translation switch (the Berean Standard Bible is free for any use and is a credible fallback; CSB licensing is another route). The `verses_cache.translation` column exists so this swap is configuration, not surgery.

---

## 16. Design System

**Direction:** Apple's restraint + Grimke's academic gravity + Mosaic's warmth. The feel on open: *you've entered a serious training room.*

- **Typography:** A high-contrast serif for display headings (e.g., **Fraunces** or **Source Serif 4**) — the academic weight — paired with a clean grotesque for UI/body (e.g., **Inter** or **General Sans**). Big, confident heading sizes; generous line-height in lessons (reading-first).
- **Color:** Near-black ink (`#0E0E10`) on warm off-white (`#FAF8F4`) for lessons; deep navy/charcoal surfaces for training modes (drills and simulations shift into a darker "focus mode" palette — a deliberate signal that you've moved from study to sparring). One restrained accent — deep oxblood/crimson or burnished gold — used almost exclusively for progress, gates, and badges so it retains meaning. No gradients-everywhere; no confetti.
- **Spacing & hierarchy:** Wide margins, a strict 4/8px scale, single-column lesson reading at ~68ch.
- **Components:** shadcn/ui themed to the above; cards with hairline borders rather than heavy shadows; level badges rendered like academic insignia, not video-game loot.
- **Gamification surface:** XP/streaks live quietly in the header and profile — present enough to pull users back daily, never louder than the content. Badge unlocks get one elegant moment, not an animation festival.
- **Simulation UI:** chat surface with the scenario card pinned; timer (when on) as a thin progress bar, not a screaming countdown; critique screen styled like a coach's report — rubric bars, quoted moments, citations back into lessons.
- **Mobile:** designed mobile-first for lessons/flashcards/drills (the daily-use surfaces); simulations comfortable on mobile, best on desktop.

(When we build, I'll pull the frontend-design skill for the implementation pass — this section sets direction; that pass sets pixels.)

---

## 17. First Build Milestone — "The Walking Skeleton" (Weeks 1–3)

**Goal:** A deployed, secured, end-to-end slice proving every layer — before any content volume exists.

Deliverables:
1. Next.js + Supabase + Vercel deployed; GitHub repo with push-to-deploy
2. Auth working (email + Google); profile created on signup
3. Schema migrated (full §14 schema from day one — content grows, structure doesn't)
4. **One real lesson** (Trinity M1.3, "Saying It Right") rendering from the database with term blurbs, ESV verses, and a citation
5. Its checkpoint quiz, functional, attempt recorded
6. One core deck (10 cards) with working SM-2 review queue
7. One persona ("Civil anti-trinitarian") + working text simulation + coach critique + saved transcript
8. Admin panel: lesson editor (block-based), question editor, publish workflow
9. Mobile-responsive shell, design system tokens in place

**Exit test:** You, on your phone, complete the lesson → quiz → review 10 cards → run a simulation → read your critique → then log into admin and edit the lesson. If all of that works, everything after is content production and repetition of proven patterns.

---

## 18. Implementation Plan

### Phase 0 — Setup (Week 0)
Anthropic API account (set a $25/month spend cap) · ESV API key · Supabase project · GitHub repo · Vercel project · Claude Code installed and pointed at the repo.

### Phase 1 — Walking Skeleton (Weeks 1–3) → §17

### Phase 2 — Systems Complete (Weeks 4–7)
- Full lesson-block types; glossary system; source library + citation rendering
- Quiz engine complete (all question types incl. AI-scored written responses)
- Gate assessment flow + per-track progression + XP/streaks/badges
- Intake assessment (adaptive-lite, placement output)
- Memorization complete: progressive Scripture modes, argument skeletons, timed recall, timed argumentation drills
- Simulator complete: difficulty ladder, pressure toggles, Game Film, BYOK + shared-key caps
- Admin AI drafting assistant

### Phase 3 — Content Production (Weeks 6–14, overlapping)
This is the long pole, and it's yours. Workflow per lesson: you outline in admin → AI drafts from your outline + cited sources → you edit and approve → AI drafts the checkpoint quiz + cards → you approve. Sequence:
1. Trinity Levels 1–2 (≈9 lessons) — *write these first; they validate the lesson template*
2. Trinity Levels 3–4 (≈11 lessons + word studies)
3. Trinity Levels 5–6 (drill banks, personas, capstone)
4. JW track (≈12 lessons, 3 personas) — heavy reuse of Trinity Level 4 material
5. Intake question bank (~90 questions across 3 difficulty bands)
Budget realistically: **2–4 hours per published lesson** even with AI drafting. That's roughly 60–100 hours of editorial work. Protect a weekly block for it the way you protect sermon prep, or the app will be a beautiful empty building in September.

### Phase 4 — Beta (Weeks 12–16)
- 10–15 testers: a slice of P1 members + 2–3 Builders Cohort men (P2) + one honest skeptic of the app itself
- You audit every AI rubric score and simulation critique from beta; tune rubric prompts
- Fix list, content polish, load check (trivial at this scale)

### Phase 5 — OFC Launch (Fall 2026)
- Tie launch to a Sunday moment or a class on contending for the faith (the app *is* the homework)
- Onboarding: intake assessment as the front door
- Weekly engagement rhythm: streaks + a "this week's drill" push

### How to Work With Claude Code (Given Q35)
1. **One milestone per session.** Open Claude Code, state the milestone deliverable, let it plan, approve, build, test, commit. Never "build the whole app."
2. **Commit constantly.** Every working state gets a git commit. Broken? Roll back, don't excavate.
3. **Keep this PRD in the repo** as `/docs/prd.md`, plus a `/docs/decisions.md` you append to. Claude Code reads both at session start — this is how you keep 40 sessions coherent.
4. **You test on your phone after every session.** You are QA. If it doesn't work on your phone, it doesn't work.
5. **Never let Claude Code touch the schema casually.** Schema changes get their own session, their own migration, their own commit.

---

## Appendix A — Decisions Made on Your Behalf (Q-by-Q)
- **Q16 (spaced repetition):** SM-2-lite + capped daily queue — real spacing without Anki-level complexity.
- **Q26 (media):** Text-first MVP; audio narration Phase 3. Video is a production burden that delays fall launch.
- **Q27 (Scripture modes):** Progressive ladder (read → first-letter → cloze → typed), auto-advancing with card maturity.
- **Q28 (argument memory):** Skeletons verbatim through Defender; own-words reproduction scored against the skeleton at Specialist+.
- **Q29 (decks):** Curated core decks gate levels; user decks supported in schema, UI in Phase 1.5.
- **Q31 (timed):** Both — timed recall for daily engagement, timed argumentation as the signature training feature.
- **Q33 (knowledge base):** Structured citation library with source-type tagging, not a wiki — searchable later.
- **Q34 (AI in admin):** Yes, draft-only output with mandatory approval.

## Appendix B — Open Items for Melo
1. Confirm or replace the working name *Contend* (check trademark/domain before brand investment).
2. Create the Anthropic API account + set spend cap (Phase 0).
3. Decide the beta tester list (10–15 names).
4. Confirm the JW track as opponent track #1 (recommended) vs. another group.
5. Block the weekly content-production hours on the calendar now.
