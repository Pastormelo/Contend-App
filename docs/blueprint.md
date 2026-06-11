# CONTEND — Full Product Blueprint
### The Complete Requirements Document for the Apologetics Training Web App

**Version:** 2.0 (supersedes PRD v1.0) · **Owner:** Melo · **Status:** Approved for build
**Targets:** Private use Summer 2026 · OFC launch Fall 2026 · Standalone brand thereafter

---

## 1. Product Name Options

| Name | Basis | Strength | Caution |
|------|-------|----------|---------|
| **Contend** (recommended) | Jude 3 | One word, weighty, verb-driven — it names what the user *does* | Common word; secure a distinct domain (contendapp.com, trycontend.com) |
| **Apologia** | 1 Pet 3:15 (*apologian*) | Scholarly, on-the-nose for the category | Crowded namespace in Christian media |
| **Ready** | 1 Pet 3:15 "always being prepared" | Modern, brandable, hopeful | Generic; weak SEO |
| **The Defense** | Phil 1:7, 1 Pet 3:15 | Serious, legal-register gravity | Sports connotation |
| **Steadfast** | 1 Cor 15:58 | Endurance theme fits training | Less specific to apologetics |

Decision needed before brand spend, not before build. The codebase uses the name only in config. *Contend* is used throughout this document as the working title.

## 2. One-Sentence Product Mission

Contend trains ordinary Christians to defend the faith with biblical depth, intellectual rigor, and 1 Peter 3:15 gentleness — through deliberate practice, not passive content.

## 3. Product Positioning

**The gap:** Christian content is abundant; Christian *training* is rare. Books and podcasts inform but never test. Bible apps gamify trivia. Debate YouTube models combativeness without forming skill. Seminary is inaccessible to the average member.

**The position:** Contend sits between Sunday school and seminary — a serious training environment ("the gym, not the library") where users must recall, respond, defend, and improve under increasing pressure. Three differentiators no competitor combines:

1. **Steelmanned, primary-source opponent representation** (Qur'an, Watchtower publications, LDS standard works — quoted and cited, never caricatured).
2. **AI simulation with coached critique** — practice real conversations, get rubric-scored feedback, retry stronger.
3. **Formation of manner alongside matter** — tone is part of the score; courage and gentleness are trained together.

**Brand voice:** convictional, calm, rigorous, unafraid. Never snarky, never triumphalist.

## 4. Primary Audience

OFC members (~150 potential users at launch): college-educated baseline, biblically literate, theologically untrained, facing real encounters — Muslim coworkers, JWs at the door, Hebrew Israelites on the street, deconstructing friends. Free access at launch. Beginner content remains accessible to readers with minimal theological vocabulary via the inline term-blurb system (§23, §32).

## 5. Secondary Audiences

1. **OFC leadership pipeline** — Builders Cohort, deacons, elders-in-development, pastoral residents (heavier rigor: Greek, primary sources, hostile simulation).
2. **Cohort/class instructors** (Phase 2) — leaders running Contend as group curriculum with dashboards.
3. **Other churches** (Phase 3, brand launch) — church-licensed deployment.
4. **Individual Christians at large** (Phase 3) — subscription users.
5. **Honest seekers/skeptics** — not a target user, but a design constraint: every page should be something you'd be unembarrassed for a thoughtful skeptic to read. Accuracy about opponents is evangelistic integrity.

## 6. User Personas

**P1 — The Faithful Member** (~60%). 25–55, OFC member, caught flat-footed in a real conversation and wants to never feel that again. Needs structure, defined terms, confidence under mild pressure. Entry: Beginner/Apprentice. Success: completes Trinity through Defender, passes first simulation, reports a real conversation that went differently.

**P2 — The Emerging Leader** (~25%). Builders Cohort man, deacon, group leader, or resident (e.g., the Isaias profile). Wants rigor: word studies, primary sources, hostile simulation. Entry: Defender via intake. Success: reaches Specialist+ on two tracks; becomes a Phase 2 cohort leader.

**P3 — The Skeptic-Adjacent Christian** (~15%). Younger, deconstruction pressure in their circle, oriented toward secular objections more than cults. Needs the Skeptic track, emotional-pressure simulation, honest treatment of hard questions. Success: stays rooted and learns to engage rather than avoid.

**P4 — The Admin (Melo).** Sole author/approver. Needs AI-assisted drafting, fast review workflow, source library, scoring audit, user progress visibility. Success: publishes a lesson in under 3 hours; trusts AI scoring after audit.

**P5 — The Instructor (Phase 2).** Cohort leader. Needs assignment, cohort progress dashboard, simulation review. Success: runs a 10-week cohort entirely inside the app.

## 7. Core Use Cases

1. **Placement:** New user takes the intake assessment, receives per-track level recommendations, starts where they actually are.
2. **Daily training rhythm (10 min):** Review queue (spaced-repetition cards) + one timed recall sprint. Streak maintained.
3. **Lesson session (15–25 min):** Read a lesson, tap unfamiliar terms, complete the checkpoint quiz, receive new cards into the queue.
4. **Gate attempt:** User attempts a level gate — MC section + written defense, AI rubric-scored — and advances or receives remediation links.
5. **Sparring session:** User configures a simulation (persona, difficulty, toggles), runs a 6–14 exchange debate, receives the coach's critique, saves to Game Film.
6. **Pressure drill:** A randomized objection appears; 90 seconds to respond; scored; weakness routed back to lessons.
7. **Pre-encounter prep:** User has a real meeting tomorrow (Muslim coworker, JW return visit) — jumps directly to the relevant track's hinge-issue modules and runs one targeted simulation.
8. **Game film review:** User rereads a past transcript with inline critique, watches rubric trends improve over months.
9. **Content production (admin):** Melo outlines a lesson → AI drafts → he edits → approves → quiz and cards auto-drafted → he approves → publish.
10. **Group cohort (Phase 2):** Instructor assigns Trinity Levels 1–3 over ten weeks; members train solo; group meets to spar live; instructor reviews member game film.

## 8. MVP Feature Set (Fall 2026)

1. Auth (email/password + Google) and profiles
2. Intake assessment — multiple choice, adaptive-lite, per-track placement
3. **Trinity track, fully built (all 6 levels)**
4. **Deity of Christ track** — shipped as shared modules within Trinity Levels 3–4, surfaced as its own track entry (see §14)
5. **Jehovah's Witness engagement track, fully built**
6. Lesson engine: block-based lessons, term blurbs, Greek/Hebrew word studies, ESV verse rendering, citations
7. Flashcards (Scripture / term / argument-skeleton) with SM-2-lite spaced repetition and core decks
8. Quiz engine: MC, true-false-qualify, cloze, verse-match, written responses with AI rubric scoring
9. Timed recall sprints + timed argumentation drills
10. Debate simulator (text), 5-step difficulty ladder, coach critique, stronger-answer suggestions
11. Pressure toggles (hostility, interruption, emotional stakes, timer) at Advanced+
12. Game Film: saved, replayable, critiqued transcripts with score trends
13. Per-track gated progression, XP, streaks, badges
14. Admin CMS: block editor, question/card/persona/source CRUD, AI drafting, draft→review→published workflow
15. BYOK (bring-your-own-Anthropic-key) + capped shared fallback key
16. Mobile-responsive throughout

**Visible but locked at launch:** Existence of God, Scripture Reliability, Resurrection, Islam, Mormonism, Hebrew Israelite, and Secular Skeptic tracks appear as "In Training" stubs with launch-order votes enabled (cheap engagement signal that also tells you what to build next).

## 9. Future Feature Set

**Phase 2 (2026–27):** Islam track · Secular Skeptic track · Resurrection + Scripture Reliability tracks · voice-mode simulation · cohorts, leaderboards, instructor dashboards · editor/reviewer roles · user-created decks UI · OpenAI BYOK option · Mormonism + Hebrew Israelite tracks · Existence of God track.

**Phase 3 (brand launch):** Subscriptions (individual) + church licensing · marketing site · second Bible translation · audio lesson narration · native mobile app (Expo, reusing the API) · public knowledge-base search · certification pathway ("Contend Certified Defender" — a credible credential churches can recognize).

**Long arc:** the default training platform for apologetics in the local church; church licensing as the revenue engine; instructor tooling as the moat.

## 10. Learning Philosophy

**Teach → Test → Train.** Content alone changes opinions; performance under pressure changes capacity. Contend is built on deliberate-practice research and catechetical instinct:

1. **Learn** the doctrine or argument (framed by a real conversation).
2. **Memorize** Scriptures, terms, and argument skeletons (spaced repetition).
3. **Answer** basic questions (checkpoint quizzes, immediate routing of errors back to content).
4. **Face objections** (steelmanned, primary-sourced).
5. **Respond** in writing or simulation (production, not recognition).
6. **Receive critique** (rubric-scored, quoted moments, stronger answers).
7. **Retry** with stronger reasoning (failure is curriculum, not verdict).
8. **Escalate** opponent difficulty (civil → informed → trained → hostile → academic).
9. **Advance** through earned gates (mastery, not completion).

Three commitments that follow: **production over recognition** (typed/spoken answers outrank multiple choice as users mature); **interleaving** (drills randomize across learned material, because real conversations don't follow your syllabus); **desirable difficulty** (gates are weighty — one attempt per 24h — because earned advancement is what makes Defender *mean* something).

## 11. Full Course Architecture

### 11.1 Hierarchy
```
TRACK → LEVEL (1–6, gated) → MODULE → LESSON (10–25 min)
   Lesson = blocks (prose | scripture | word_study | objection |
            citation | term_callout | model_answer)
          + memory assignment + checkpoint quiz
   Module ends in a performance task (written defense / drill / simulation)
   Level ends in a gate assessment
```

### 11.2 Track Types & Prerequisite Map
**Doctrinal tracks** build the positive case; **opponent tracks** apply it. Opponent tracks require doctrinal prerequisites — doctrine before debate, and massive content reuse:

| Opponent Track | Requires |
|---|---|
| Jehovah's Witnesses | Trinity: Defender |
| Islam | Trinity: Defender + Scripture Reliability: Apprentice |
| Mormonism | Trinity: Apprentice + Existence of God: Apprentice |
| Hebrew Israelites | Deity of Christ: Defender |
| Secular Skeptic | Existence of God: Apprentice + Resurrection: Apprentice |

(Until prerequisite tracks ship, prerequisites are enforced only where content exists — JW↔Trinity at launch.)

### 11.3 Lesson Anatomy (every lesson, invariant)
1. **Frame** — the real conversation this prepares you for (1 paragraph).
2. **Teach** — doctrine/argument with inline term blurbs.
3. **Ground** — key Scriptures (ESV API) with exegetical notes; word study where load-bearing.
4. **Anticipate** — the *strongest* opposing reading, cited from primary sources.
5. **Equip** — the response as a memorizable, numbered argument skeleton.
6. **Perform** — checkpoint quiz + cards pushed to queue; module-enders add a written or simulated defense.

### 11.4 Content Volume Targets (full future state)
~5 doctrinal tracks × ~22 lessons + 5 opponent tracks × ~14 lessons ≈ **180 lessons**, ~900 quiz questions, ~400 cards, ~35 personas. MVP ships ~32 lessons (Trinity 20 + JW 12). This is a multi-year content arc by design — the architecture ships finished; the library grows.

## 12. Full Level System

Per-track, gated, displayed per-track ("Trinity: Defender · Islam: Beginner").

| # | Level | Equipped To… | Gate |
|---|-------|--------------|------|
| 1 | **Beginner** | Explain basic Christian claims in plain language | Quiz ≥85% + 1 written explanation ≥3/5 |
| 2 | **Apprentice** | Answer common objections accurately | Quiz ≥85% + 2 written ≥3/5 + core deck "learned" |
| 3 | **Defender** | Engage informed critics with the positive case | Quiz ≥85% + written ≥4/5 + pass 1 standard simulation |
| 4 | **Specialist** | Engage specific groups with primary-source fluency | Quiz ≥90% + pass 2 simulations vs. trained persona |
| 5 | **Advanced Apologist** | Hold ground under hostility, interruption, emotional pressure | Pass pressure-mode simulation + timed drill avg ≥4/5 |
| 6 | **Scholar-Level Defender** | Engage academic opponents with biblical, historical, philosophical, linguistic argument | Pass academic simulation + capstone defense ≥4.5/5 |

**Rules:** Intake placement caps at Defender; Specialist+ is always earned in-app. Gates allow one attempt per 24 hours. Failed gates return targeted remediation (specific lessons/cards, not "try again"). The five-part rubric (biblical accuracy · logic & structure · steelman integrity · persuasive clarity · tone-in-context) governs every written and simulated performance from Level 1 on, so users internalize the standard early.

---
## 13. Trinity Defense Track (Flagship — Fully Built at MVP)

**Track goal:** State, ground, defend, and apply "one God eternally existing in three persons" against modalism, Arianism (ancient and modern), and unitarianism — under pressure, with primary texts.

**Level 1 — Beginner: The Claim**
- M1.1 One God (Deut 6:4; Isa 43–46; monotheism as the non-negotiable floor)
- M1.2 Three Persons Introduced (Jesus' baptism; Matt 28:19; 2 Cor 13:14)
- M1.3 Saying It Right — the six-line formulation (one God / the Father is God / the Son is God / the Spirit is God / the persons are distinct / therefore one God in three persons); "person" vs. "being" defined
- M1.4 What the Trinity Is *Not* (tritheism, modalism, partialism; why water/egg/clover analogies each teach a heresy; how to qualify any analogy)

**Level 2 — Apprentice: Common Objections**
- M2.1 "The word Trinity isn't in the Bible"
- M2.2 "Jesus prayed to the Father — how can he be God?"
- M2.3 "The Father is greater than I" (John 14:28; economic vs. ontological)
- M2.4 "1 + 1 + 1 = 3" — one *what*, three *whos*; why there is no contradiction
- M2.5 "The Spirit is just a force" (Acts 5; Eph 4:30; 1 Cor 12:11 — speaking, grieving, willing)

**Level 3 — Defender: The Positive Case**
- M3.1 Deity of the Son I — explicit texts (John 1:1–18; 20:28; Rom 9:5; Titus 2:13; Heb 1; Phil 2:5–11)
- M3.2 Deity of the Son II — Yahweh texts applied to Jesus (Isa 45:23→Phil 2:10; Joel 2:32→Rom 10:13; Isa 6→John 12:41; Ps 102→Heb 1:10–12)
- M3.3 Deity of the Son III — divine prerogatives (forgiving sin, receiving worship, judging, creating; the "I AM" sayings)
- M3.4 Deity & Personhood of the Spirit
- M3.5 Personal Distinction & eternal relations (sending, loving, glorifying between persons)
- M3.6 OT Anticipations — handled honestly (Gen 1:26; Angel of the LORD; what these do and don't prove)

**Level 4 — Specialist: Texts Under Fire + History**
- M4.1 John 1:1 in Greek — anarthrous *theos*, Colwell's rule and its limits, why "a god" fails; direct NWT engagement
- M4.2 Word studies: *monogenēs*; *prōtotokos* (Col 1:15); *archē* (Rev 3:14); Granville Sharp (Titus 2:13; 2 Pet 1:1)
- M4.3 Hard texts: Prov 8:22; Mark 13:32; 1 Cor 15:28; John 17:3
- M4.4 Nicaea & Chalcedon — what was actually decided; answering "invented in 325" with ante-Nicene witnesses (Ignatius, Justin, Tertullian, Origen — cited, summarized)
- M4.5 Divine eternity and the eternal relations (*aeternitas/aevum/tempus*; Melo's scholastic material slots here)

**Level 5 — Advanced Apologist: Pressure**
- M5.1 Rapid-objection drills (timed, randomized from the full objection bank)
- M5.2 Hostile simulation — aggressive anti-trinitarian, interruption tactics enabled
- M5.3 Emotional-pressure simulation — a sincere family member leaving the faith over the doctrine
- M5.4 Tactics — Koukl-style question discipline applied to trinitarian debate

**Level 6 — Scholar-Level Defender: The Academy**
- M6.1 Philosophical objections (the "logical problem"; identity/constitution models presented as ranges)
- M6.2 Pagan-parallel claims examined and answered
- M6.3 Engaging trained unitarian argumentation (steelmanned from their strongest published work)
- M6.4 Capstone — full written defense + academic-mode simulation

**Sources:** White, *The Forgotten Trinity*; Reeves, *Delighting in the Trinity*; Sanders, *The Deep Things of God*; public-domain patristics; Melo's notes. Cited and summarized, never reproduced.

## 14. Deity of Christ Track

**Design decision:** christology is the load-bearing wall of the Trinity track (Levels 3–4), so this track is built on **shared modules** — the same lesson records appear in both tracks (the schema's module→lesson join supports multi-parenting). The Deity of Christ track packages them for the user who needs focused christology (especially pre-Hebrew-Israelite and pre-Islam work), plus track-specific additions:

- L1 Who Did Jesus Claim to Be? (Son of Man — Dan 7:13–14; "I AM"; authority claims)
- L2 Common objections ("Jesus never said 'I am God'"; "Son of God just means Messiah"; "he grew and learned")
- L3 The Positive Case (shares Trinity M3.1–M3.3) + worship of Jesus in earliest Christianity (Phil 2 hymn; 1 Cor 8:6 reworking the Shema; early high christology)
- L4 Texts Under Fire (shares Trinity M4.1–M4.3) + the hypostatic union and Chalcedon's grammar (two natures, one person — answering "how could God die / not know / get tired")
- L5 Pressure (anti-deity street objections; rapid drills)
- L6 Academic (adoptionism and evolutionary-christology theses answered; early-dating evidence for high christology)

**MVP status:** Ships at launch *as packaging* — shared modules exist because Trinity ships; the track-specific lessons (L1, L2, additions) are first in the Phase 2 content queue.

## 15. Existence of God Track (Phase 2)

- L1 Why Arguments? (natural revelation — Rom 1, Ps 19; what arguments can and can't do; the role of the Spirit)
- L2 The Cosmological Arguments (kalam: whatever begins to exist has a cause; the universe began; contingency argument as the heavier sibling)
- L3 The Design Arguments (fine-tuning of constants; objections: multiverse, "who designed the designer," anthropic responses)
- L4 The Moral Argument (objective moral values and duties; Euthyphro answered; grounding vs. knowing morality)
- L5 Arguments from Mind (reason, consciousness, the argument from logic; Lewis's argument from desire as a soft opener)
- L6 Counter-attack handling (who made God; "no evidence"; divine hiddenness; scientism's self-defeat) + academic mode
- **Range note:** cosmological material presents both young-earth and old-earth compatible framings per the intramural-ranges guardrail.

## 16. Scripture Reliability Track (Phase 2)

- L1 What We're Claiming (inspiration, inerrancy defined carefully; what reliability arguments establish vs. presuppose)
- L2 NT Textual Transmission (manuscript wealth, dating, variants honestly handled — the Ehrman objection steelmanned and answered)
- L3 Canon (how the church recognized — not created — the canon; "lost gospels" and why they lost)
- L4 OT Reliability (Masoretic text, Dead Sea Scrolls, Septuagint; archaeology's confirmations and honest open questions)
- L5 Alleged Contradictions (a method, not a list: genre, perspective, paraphrase conventions, harmonization with integrity; worked examples)
- L6 Pressure + academic (Jesus' view of Scripture as the linchpin; engaging trained critics)

## 17. Resurrection Track (Phase 2)

- L1 Why Everything Hinges Here (1 Cor 15:14–19; the resurrection as the apologetic keystone)
- L2 The Minimal Facts (death by crucifixion; burial; empty tomb; appearances; the disciples' transformation; James and Paul — with the scholarly-consensus methodology explained)
- L3 The Early Creed (1 Cor 15:3–7 — dating, transmission, why it destroys legend theories)
- L4 Alternative Theories (hallucination, theft, swoon, wrong tomb, legend — each steelmanned, each answered)
- L5 Pressure drills + skeptic simulation (the "extraordinary claims" exchange; Hume on miracles)
- L6 Academic (historiography of miracle claims; engaging published skeptical scholarship)
- **Sources:** Habermas/Licona; public-domain primary texts; summarized with citation.

## 18. Islam Engagement Track (Phase 2 — first opponent track after launch)

- L1 Know Them: origins, Qur'an and hadith structure, Sunni/Shia basics, folk vs. scholarly Islam, vocabulary (*tawhid, shirk, injil, tahrif*)
- L2 Their Strongest Case (steelmanned): pure monotheism's simplicity; alleged biblical corruption; "Jesus the prophet" framing; Muhammad foretold claims (Deut 18, Paraclete)
- L3 Hinge Issues: (a) Has the Bible been corrupted? — the Qur'an's own affirmation of prior Scripture (Surah 5:47, 10:94) vs. later *tahrif* doctrine; (b) Who is Jesus in the Qur'an? — virgin-born, miracle-working, Messiah, yet not divine; (c) Surah 4:157 and the crucifixion denial vs. the bedrock historical fact; (d) the Trinity the Qur'an denies (Surah 5:116 — a Father-Mary-Jesus triad no Christian holds)
- L4 The Response: reliability of the NT predating Muhammad by centuries; the cross as history; the deity of Christ from texts Muslims respect; grace vs. scale-based judgment as the gospel pathway
- L5 The Conversation: honor-shame dynamics, respecting genuine devotion, questions that open rather than corner
- L6 Simulation ladder: coworker → dawah-trained apologist → polemicist (hostility mode)
- **Primary sources:** Qur'an (Sahih International + Yusuf Ali), sahih hadith collections — quoted and cited.

## 19. Mormonism Engagement Track (Phase 2)

- L1 Know Them: Joseph Smith, the Restoration claim, standard works, priesthood structure, current LDS public posture vs. historic doctrine
- L2 Their Strongest Case (steelmanned): the apostasy/restoration narrative; family and fruit ("look at our lives"); the Moroni 10:4 testimony epistemology; baffling NT verses (1 Cor 15:29)
- L3 Hinge Issues: (a) the nature of God — eternal God vs. exalted man (King Follett) and plurality of gods vs. Isa 43:10, 44:6–8; (b) the First Vision's multiple conflicting accounts; (c) Book of Mormon historicity (anachronisms, DNA, archaeology — handled factually, not gleefully); (d) grace vs. exaltation ("after all we can do," 2 Nephi 25:23)
- L4 The Response: monotheism's biblical bedrock; testing testimony claims (Gal 1:8); justification by grace as genuinely *good* news to performance-exhausted members
- L5 The Conversation: most members don't know historic doctrine — engage the person in front of you; missionary dynamics; long-game relationships
- L6 Simulation ladder: missionaries at the door → returned missionary → trained LDS apologist
- **Primary sources:** standard works, *Gospel Principles*, Journal of Discourses excerpts, official Gospel Topics essays — quoted and cited.

## 20. Jehovah's Witness Engagement Track (MVP — Fully Built at Launch)

**Prerequisite:** Trinity: Defender. This is the natural application of the flagship track and reuses its Level 4 exegesis.

- L1 Know Them: Watchtower history (Russell, Rutherford, 1914, 1925, 1975 — accurately, not gleefully), Governing Body authority, NWT origins, meeting/field-service culture, vocabulary in *their* senses ("the truth," "the organization," "anointed")
- L2 Their Strongest Case (steelmanned): strict monotheism prooftexts (John 14:28; 17:3; Col 1:15; Rev 3:14); "Trinity is pagan/late"; moral seriousness and door-to-door zeal as plausibility structure
- L3 Hinge Issues: (a) John 1:1 and the NWT's "a god" (Trinity M4.1 shared); (b) *prōtotokos* and the NWT's bracketed "[other]" in Col 1:16–17; (c) two-class salvation and the 144,000 vs. one hope; (d) the organization as mediator vs. 1 Tim 2:5; (e) the divine name and Jehovah/Yahweh facts
- L4 The Response: deity of Christ from the NWT's *own* text where possible; failed prophecy and Deut 18 — applied to the organization's claims, aimed at the system, not the person; the gospel of grace vs. earning approval through the organization
- L5 The Conversation: they're trained for your first three objections — go deeper than the script; family-cost and shunning dynamics handled with compassion; planting questions for return visits
- L6 Simulation ladder: doorstep publisher (civil) → study conductor (informed/trained) → elder (hostile mode: thought-stopping techniques, "apostate" framing)
- **Primary sources:** NWT, *Should You Believe in the Trinity?* (1989), *Reasoning from the Scriptures*, *What Does the Bible Really Teach?* — quoted and cited.

## 21. Hebrew Israelite Engagement Track (Phase 2)

**Prerequisite:** Deity of Christ: Defender. Built for street-level encounter; leans hardest of all tracks on pressure simulation.

- L1 Know Them: the movement's spectrum — mainstream camps vs. One West/GOCC-style camps (radically different in tone and doctrine; the app distinguishes them rather than flattening), core identity claims, the Apocrypha's role, camp authority structures
- L2 Their Strongest Case (steelmanned): Deut 28 curses applied to the transatlantic slave trade; legitimate grievance about whitewashed Christian imagery and the faith's African/Near-Eastern roots; law-keeping texts (Matt 5:17)
- L3 Hinge Issues: (a) Who is Israel? — Gal 3:28–29, Rom 2:28–29, Eph 2:11–22, the one new man; (b) ethnicity and salvation — Rev 5:9, Acts 17:26; (c) the law's role — Acts 15, Galatians, Hebrews; (d) the deity of Christ across camp positions (some affirm a form of it, many deny — engage the actual camp)
- L4 The Response: affirming what's true (Jesus was not European; Scripture's world is Afro-Asiatic; the church has real historical sins) without conceding identity-based salvation; the gospel as the answer to real historical wounds, not their denial
- L5 The Conversation: street dynamics — crowds, amplification, dominance tactics; when to engage, when to walk; protecting bystanders' impression of Christ; multiethnic-church credibility (OFC's own life is an apologetic here)
- L6 Simulation ladder: curious adherent (civil) → camp teacher (trained) → street confrontation (hostility + interruption + crowd-pressure framing — the app's hardest simulation)
- **Primary sources:** camp publications and public teachings, cited by camp; Apocrypha texts they invoke.

## 22. Secular Skeptic Engagement Track (Phase 2)

**Prerequisites:** Existence of God: Apprentice + Resurrection: Apprentice.

- L1 Know Them: the spectrum — apathetic "none," scientistic rationalist, moral objector ("the church hurt people"), deconstructing ex-evangelical; each needs a different door
- L2 Their Strongest Case (steelmanned): the problem of evil (logical and evidential); divine hiddenness; religious diversity; hell; "science explains without God"; church harm and hypocrisy
- L3 Hinge Issues: (a) suffering — answered intellectually *and* pastorally, and the lesson teaches users to discern which is being asked; (b) the borrowed capital of secular morality; (c) the resurrection as the falsifiable center; (d) "faith vs. evidence" redefined biblically
- L4 The Response: positive case deployment (drawing on the doctrinal tracks); Koukl tactics as the primary conversational engine here; testimony's legitimate place
- L5 The Conversation: deconstruction is often wound-driven — argument alone re-wounds; long-form friendship evangelism; social-media restraint
- L6 Simulation ladder: apathetic friend → confident rationalist → hostile anti-theist → grieving deconstructor (the emotional-pressure simulation where *tone is weighted double* — the only persona where winning the argument can mean losing the person and the score reflects it)

## 23. Greek and Hebrew Tools

**Philosophy:** Original languages serve the argument; the app trains *informed use*, not pseudo-scholarship. Users learn to deploy word studies accurately and to recognize when an opponent (or a Christian) is abusing the languages.

1. **Embedded word studies** (lesson block type): original script + transliteration + gloss range + the exegetical point + *the limits* of the point (e.g., Colwell's rule shows "a god" isn't required — it does not by itself prove "God"; overclaiming is flagged as a scored error in simulations).
2. **Core studies at MVP:** *monogenēs* · anarthrous *theos* (John 1:1c) · *prōtotokos* (Col 1:15) · *archē* (Rev 3:14) · Granville Sharp (Titus 2:13; 2 Pet 1:1) · *elohim* (plural form, singular verbs) · *echad* (Deut 6:4 — compound unity claims handled honestly) · *ego eimi* (John 8:58 + Exod 3:14 LXX).
3. **Glossary integration:** every original-language term is a glossary record with script, transliteration, and blurb; tappable wherever it appears. (Pronunciation audio: Phase 3.)
4. **Fallacy training:** a short embedded module on word-study fallacies (root fallacy, illegitimate totality transfer, anachronism) — because credibility dies fastest through misuse.
5. **Not building:** parsing engines, interlinears, or lexicon licensing (Logos/Accordance exist; Contend trains arguments).

## 24. Memorization System

Three memory objects, one engine:

1. **Scripture memory** — verses with reference; progressive recall ladder: read → first-letter prompts → cloze → full typed recitation (tolerant on punctuation, strict on wording). Mode advances automatically as the card matures.
2. **Key-term memory** — glossary-backed term→definition cards.
3. **Argument memory** — numbered skeletons (e.g., the six-line Trinity formulation; the five minimal facts) memorized **verbatim through Defender**, then drilled at Specialist+ on **own-words reproduction** scored by AI for completeness against the skeleton. Scaffold first, fluency second.

**Assignment flow:** lessons push their cards into the user's queue automatically; core decks per level (e.g., *Trinity Defender Core*: 25 verses, 15 terms, 6 skeletons) gate advancement at "learned" status (every card ≥14-day interval). Daily queue capped at 30 cards to protect the habit.

## 25. Flashcard System (Mechanics)

- **Scheduler:** SM-2-lite — intervals 1, 3, 7, 14, 30, 90 days; again/hard/good/easy grading; ease factor bounded (1.5–2.5) for predictable behavior.
- **Session design:** daily review queue front-and-center on the dashboard; sub-5-minute typical session; streak credit for queue completion.
- **Timed recall sprints:** optional clock-pressure flashcard runs for XP — the "fun" layer.
- **Card states:** new → learning → learned → mature; deck progress bars surface state distribution.
- **User decks:** schema supports user-created decks from any verse/term/argument day one; UI ships Phase 1.5.
- **Typed-answer scoring:** exact-match with normalization for Scripture; fuzzy + AI fallback for definitions; AI-vs-skeleton for arguments.

## 26. Quiz System

- **Question types:** multiple choice (single/multi) · **true-false-qualify** ("true / false / needs qualification" — the theologically honest format) · cloze · verse-match · written response (AI rubric-scored with feedback + stronger-answer suggestion).
- **Checkpoint quizzes** (every lesson): 5–8 questions, unlimited retries, each wrong answer deep-links to the lesson block that answers it.
- **Gate assessments** (every level): randomized draw from the level's question bank + written component per the §12 table; one attempt per 24h; failure returns a remediation list.
- **Intake assessment:** ~30 MC questions, adaptive-lite (three difficulty bands, routing by performance), producing per-track placement (capped at Defender) with a one-paragraph rationale.
- **Item quality loop:** per-question analytics (miss rate, discrimination) in admin so weak questions get rewritten.

## 27. Debate Simulator

**Architecture:** two AI roles per session — the **Opponent** (persona system prompt: actual beliefs, primary-source talking points, native vocabulary, and a fidelity rule: never concede inaccurately, never strawman its own side, "convert" only if genuinely argued into movement) and the **Coach** (post-game: rubric scores, three quoted moments — best / weakest / missed opportunity — stronger answers with citations, remediation links into lessons).

**Session flow:** configure (track → persona → difficulty → toggles) → scenario card sets the scene → 6–14 exchanges with realistic escalation → close prompt nudges a *gospel pathway*, not just a win → coach critique → save to **Game Film** → retry offered.

**Difficulty ladder:** Civil → Informed → Trained → Hostile → Academic, unlocked by level.

**Game Film:** every transcript saved, replayable with inline critique; per-rubric score trends charted over time — the app's truest progress signal, and (Phase 2) the instructor's review surface.

**Voice mode (Phase 2):** the pipeline is transcript-based by design, so speech-to-text slots in without rearchitecting.

## 28. Pressure Simulator

The pressure system is a set of toggles and drill modes layered on the simulator and drill engine, unlocked at Advanced Apologist:

1. **Hostility mode** — persona uses aggression, dismissal, loaded framing ("you worship three gods and you know it").
2. **Interruption tactics** — the opponent fires follow-ups before ceding the floor; the user must triage which thread to answer (scored on triage judgment).
3. **Emotional stakes** — the persona is a family member or close friend, not a stranger; the deconstructing-loved-one scenario weights tone double.
4. **Time pressure** — visible response timer (thin progress bar, not a screaming countdown).
5. **Rapid-objection drills** — randomized objections from everything the user has learned (interleaving by design); 90 seconds to respond; rubric-scored; weaknesses routed to remediation.
6. **Crowd framing** (Hebrew Israelite track) — the scenario includes bystanders; the coach scores for the watching crowd's impression of Christ, not just the exchange.

**Tone policy (encoded in the Coach prompt):** firmness and pressing hard against an aggressive opponent are *not* penalized; deductions apply only to disproportionate aggression toward a non-aggressive interlocutor, mockery, or contempt. 1 Pet 3:15 moments — gentleness that doesn't surrender ground — are affirmatively rewarded.

## 29. User Scoring and Progression

- **The rubric (1–5 each, every performance):** biblical accuracy & use of Scripture · logical soundness & structure · steelman integrity (representing the opponent accurately) · persuasive clarity · tone-in-context.
- **Gates:** per §12; per-track progression; placement caps at Defender.
- **XP economy:** lesson complete 50 · checkpoint pass 25 · queue completion 15/day · sprint 10–30 · written response 20–100 (rubric-scaled) · simulation 50–250 (difficulty- and rubric-scaled) · gate pass 500. XP feeds streaks, badges, and (Phase 2) cohort leaderboards — it never substitutes for gates.
- **Streaks:** daily training streak (queue or any scored activity); one "grace day" per week banked by consistency, because legalism is a poor retention strategy and a worse discipleship one.
- **Progress surfaces:** per-track level insignia, rubric trend lines from Game Film, deck maturity, streak — quietly in header/profile, never louder than content.

## 30. Badges and Achievements

Styled as academic insignia, not loot. Categories with samples:

- **Level insignia** (per track): *Trinity: Defender* crest, etc. — the core status objects.
- **Mastery:** *Sword Drill* (Scripture core deck mature) · *Lexicon* (all word studies complete) · *Nicene* (Trinity L4 history modules) · *Minimal Facts* (resurrection skeleton at own-words fluency).
- **Performance:** *First Blood → Iron Sharpens Iron* (simulation milestones 1/10/50) · *Under Fire* (first hostile-mode pass) · *Gentle Answer* (5/5 tone in a hostile simulation — deliberately one of the hardest badges in the app) · *Game Film Junkie* (review 10 transcripts).
- **Consistency:** streak marks at 7/30/100/365 (*Daily Bread* line).
- **Hidden:** a small number of unannounced badges (e.g., *Berean* — following 25 citation links to sources) for discovery delight.
- Unlocks get one elegant moment — no confetti storms.

## 31. Admin / Content Management Tools

- **CRUD everything:** tracks, levels, modules, lessons (block editor), glossary, sources, citations, questions, cards/decks, personas, rubric prompts, badges.
- **AI drafting assistant** (in-panel): "Draft lesson M2.3 from these notes" · "Generate a 6-question checkpoint from this lesson" · "Create five objection variants for the drill bank" · "Draft a doorstep-publisher persona from these sources." All output lands as `draft` — nothing AI-written reaches users without Melo's approval.
- **Workflow:** `draft → in_review → published`; author/reviewer/timestamps on every record. Sole-admin today; the workflow already exists for editor/reviewer roles tomorrow.
- **Scoring audit:** queue of recent AI-scored responses and critiques with one-tap "scoring was wrong" flags; rubric prompts are versioned, editable content records — tune grading without touching code.
- **Question analytics:** miss rates and discrimination per item.
- **User overview:** progress per user per track, recent simulations, gate failures, at-risk streaks.
- **Bulk import:** CSV/JSON import for questions and cards (content production at scale).

## 32. Knowledge Base Design

A **structured citation library**, not a wiki:

- Every factual claim in lessons traces to a source record; every source carries a `source_type`: `scripture | public_domain | licensed | copyrighted_reference | melo_notes | primary_opponent_source`.
- **Opponent sources are first-class citizens** with edition-level bibliographic detail (e.g., *Should You Believe in the Trinity?*, Watch Tower Bible and Tract Society, 1989) — steelman integrity is enforced structurally, not aspirationally.
- The **glossary** is part of the knowledge base: every term, every original-language word, blurb + full definition, tappable everywhere.
- Growth path: admin adds sources and attaches citations at any time without redeployment; Phase 3 exposes read-only public search ("what does Contend's library say about *prōtotokos*?").

## 33. Source Citation System

- **Rendering:** lessons show inline superscript citations; tapping opens a citation card (source, locator, type badge). Users always know whether they're reading Scripture, public domain, Melo's notes, a summarized copyrighted work, or an opponent's own publication.
- **Copyright enforcement at the schema level:** copyrighted works are summarized in original words with citation; verbatim excerpts require the `is_excerpt` flag, carry a hard word cap, and surface in an admin compliance report. Scripture renders via licensed API (ESV); public domain renders freely; song-style reproduction of copyrighted text is structurally impossible by policy.
- **Bibliography pages:** each track auto-generates its source list — scholarly habit, modeled.

## 34. Safety and Charity Guidelines

The app's conscience, encoded in content policy and AI prompts:

1. **Steelman covenant:** opponents are represented from their primary sources at their strongest. If a Witness, Muslim, or Latter-day Saint read their track's "Know Them" lessons, they should say "that's accurate" even while disagreeing with the response.
2. **People vs. systems:** critique targets doctrines and organizations, never ethnicity, intelligence, or sincerity. The JW track addresses Watchtower prophecy failures without mocking Witnesses; the Hebrew Israelite track affirms legitimate historical grievance while refuting identity-based salvation.
3. **Tone formation:** rubric category five (§28 tone policy); the *Gentle Answer* badge makes charity aspirational, not just compliant.
4. **No cheap wins:** personas never collapse for flattery or weak arguments; the coach penalizes gotcha tactics and overclaiming (including language overclaiming, §23.1).
5. **The gospel is the goal:** every simulation's close prompt asks "where was the gospel pathway?" — winning arguments while losing people is scored as the failure it is.
6. **Pastoral redirects:** if a user's simulation inputs suggest personal faith crisis rather than training (the coach watches for this), the app responds pastorally and points to real people — Contend trains for conversations; it doesn't replace a church.
7. **AI integrity guardrails:** opponent personas may not blaspheme gratuitously, may not be extracted as standalone anti-Christian content generators (session-bound, scenario-bound), and the coach never fabricates citations — suggestions cite only sources in the library.

## 35. Theological Accuracy Guidelines

1. **Confessional baseline:** Nicene/Chalcedonian orthodoxy; broadly Reformed evangelical soteriology.
2. **Single reviewer:** nothing reaches `published` without Melo's approval — including all AI drafts, persona prompts, and rubric prompts.
3. **Intramural ranges:** age of the earth, eschatology, Calvinism-in-evangelism presented as ranges with fair representation, never adjudicated.
4. **Primary-source rule:** claims about what opponents believe must cite opponent publications; claims about church history cite primary or standard scholarly sources; no urban-legend apologetics (e.g., debunked manuscript counts get corrected, not repeated).
5. **Overclaiming is error:** arguments are taught with their actual strength ("this shows X is *consistent*, not that X is *proven*"); the coach flags overclaiming as a scored mistake.
6. **Honest difficulties:** hard texts (Mark 13:32, Prov 8:22) get full lessons, not footnotes. Users who meet difficulties first in hostile conversations were failed by their training.
7. **Versioned content:** lessons carry version history; corrections are normal and visible to admin.

## 36. UI/UX Design Direction

**Feel on open:** *you've entered a serious training room.* Apple's restraint + Grimke's academic gravity + Mosaic's warmth.

- **Typography:** high-contrast serif for display (Fraunces or Source Serif 4) over a clean grotesque for UI/body (Inter or General Sans). Confident heading scale; lesson body at ~68ch, generous line-height — reading-first.
- **Color:** near-black ink (#0E0E10) on warm off-white (#FAF8F4) for study surfaces. **Focus-mode shift:** drills and simulations move to a deep charcoal/navy palette — a deliberate environmental signal that you've left the library and entered the sparring ring. One restrained accent (deep oxblood or burnished gold) reserved for progress, gates, and insignia so it keeps meaning.
- **Components:** shadcn/ui themed accordingly; hairline borders over heavy shadows; level insignia drawn like academic crests, not game loot.
- **Gamification surface:** XP/streak quietly in the header; one elegant unlock moment for badges.
- **Simulation UI:** pinned scenario card; thin-bar timer; critique screen styled as a coach's report — rubric bars, quoted moments, citation links back into lessons.
- **Mobile-first** for daily surfaces (queue, lessons, drills); simulations fully functional on mobile, best on desktop.
- **Accessibility:** WCAG AA contrast, full keyboard nav, reduced-motion respect, dyslexia-friendly line spacing toggle.

## 37. Page-by-Page App Structure

```
PUBLIC
 /                    Landing (mission, sample lesson, sign-in)
 /login /signup       Auth (+ Google)

APP SHELL (authed)    Header: logo · streak · XP · profile
 /dashboard           Today: review queue CTA, active track resume,
                      drill of the day, streak, recent badges
 /assessment          Intake flow (first-run forced; retakable per track)
 /tracks              Track gallery (level insignia, locks, "In Training" stubs)
 /tracks/[slug]       Track detail: level ladder, gate status, prereqs, bibliography
 /learn/[lessonId]    Lesson reader (blocks, term blurbs, verse cards, citations)
                       → /learn/[lessonId]/quiz   Checkpoint
 /gate/[levelId]      Gate assessment (MC + written; 24h lockout state)
 /review              Daily queue (cards, all modes)
 /decks /decks/[id]   Deck library, deck detail (maturity bars)
 /drills              Hub: timed recall sprint · timed argumentation
 /drills/argue        90-second objection drill + score screen
 /spar                Simulator config (track, persona, difficulty, toggles)
 /spar/[sessionId]    Live simulation (chat, scenario card, timer)
 /spar/[id]/review    Coach's report
 /film                Game Film library (filters, rubric trend chart)
 /film/[sessionId]    Transcript replay with inline critique
 /profile             Levels per track, badges, stats, streak history
 /settings            Account, notifications, BYOK key management, accessibility

ADMIN (/admin, role-gated)
 /admin               Content status board, scoring-audit queue, flags
 /admin/tracks|modules|lessons   Curriculum CRUD + block editor + AI draft
 /admin/questions     Question bank + analytics + bulk import
 /admin/cards         Decks/cards + bulk import
 /admin/glossary      Terms + word studies
 /admin/sources       Source library + citation manager + excerpt compliance report
 /admin/personas      Persona prompts + source refs + test-run sandbox
 /admin/rubrics       Rubric prompt versions
 /admin/users         User overview, progress, at-risk
 /admin/badges        Badge definitions
```

## 38. Database Schema (Postgres / Supabase)

```
-- Identity
profiles            (id→auth.users, name, role enum: admin|editor|reviewer|
                     instructor|user, created_at)

-- Curriculum
tracks              (id, slug, title, type: doctrinal|opponent, status, sort)
track_prereqs       (track_id, requires_track_id, requires_level)
levels              (id, track_id, number 1-6, title, equipped_statement,
                     gate_config jsonb, status)
modules             (id, level_id, title, summary, sort, status)
module_lessons      (module_id, lesson_id, sort)        -- join: shared lessons
lessons             (id, title, est_minutes, status, version,
                     author_id, reviewer_id, published_at)
lesson_blocks       (id, lesson_id, sort, type: prose|scripture|word_study|
                     objection|citation|term_callout|model_answer, content jsonb)

-- Knowledge base
sources             (id, source_type enum, title, author, publisher, year,
                     edition, url, notes)
citations           (id, source_id, lesson_block_id, locator,
                     excerpt_text?, is_excerpt bool, excerpt_words int)
glossary_terms      (id, term, short_blurb, full_definition,
                     original_script?, transliteration?, language?)
verses_cache        (id, reference, translation, text, fetched_at)

-- Memory
decks               (id, title, scope: core|user, level_id?, owner_id?)
cards               (id, deck_id, type: scripture|term|argument,
                     front jsonb, back jsonb, skeleton jsonb?)
card_reviews        (user_id, card_id, ease, interval_days, due_at,
                     mode: read|first_letter|cloze|typed, state, streak)

-- Assessment
question_bank       (id, level_id, type: mc|mc_multi|tfq|cloze|verse_match|
                     written, prompt, options jsonb, answer jsonb,
                     difficulty 1-3, model_answer?, status, stats jsonb)
quizzes             (id, kind: checkpoint|gate|intake, lesson_id?, level_id?,
                     config jsonb)
quiz_attempts       (id, user_id, quiz_id, score, passed, answers jsonb,
                     started_at, finished_at)
written_responses   (id, user_id, source: gate|drill|lesson, ref_id,
                     response_text, rubric_scores jsonb, ai_feedback,
                     stronger_answer, flagged bool, created_at)

-- Simulation
personas            (id, track_id, name, difficulty enum, system_prompt,
                     source_refs jsonb, scenario_card, status, version)
simulations         (id, user_id, persona_id, mode: text|voice,
                     toggles jsonb, status, started_at, ended_at)
simulation_messages (id, simulation_id, role: user|opponent, content, ts)
simulation_reviews  (id, simulation_id, rubric_scores jsonb, best_moment,
                     weak_moment, missed_opportunity, suggestions jsonb,
                     remediation_lesson_ids jsonb, flagged bool)

-- Progress
user_track_progress (user_id, track_id, current_level, gates_passed jsonb,
                     gate_attempt_locks jsonb)
xp_events           (id, user_id, amount, reason, ref_id, created_at)
streaks             (user_id, current, longest, grace_days, last_active)
badges              (id, slug, title, tier, criteria jsonb, hidden bool)
user_badges         (user_id, badge_id, awarded_at)
intake_attempts     (id, user_id, answers jsonb, placements jsonb, rationale)

-- AI & ops
rubric_prompts      (id, name, prompt_text, version, active)
ai_drafts           (id, kind, input jsonb, output jsonb, created_by, accepted)
api_keys_user       (user_id, provider, encrypted_key, created_at)
usage_log           (id, user_id, feature, model, tokens_in, tokens_out,
                     est_cost, key_source: byok|shared, created_at)
```

**RLS posture:** users read `published` content and their own rows; writes only to their own attempt/review/progress rows via server routes; admin role bypasses; `api_keys_user` encrypted at rest, never returned to client after save.

## 39. API Routes (Next.js Route Handlers)

```
AUTH        handled by Supabase client + middleware (role guard on /admin/*)

CONTENT (reads via RLS-scoped Supabase queries; mutations server-side)
 GET  /api/verses?ref=John+1:1          ESV fetch w/ cache write-through

ASSESSMENT
 POST /api/quiz/[id]/attempt            grade MC server-side, record
 POST /api/written/score                AI rubric scoring (Sonnet)
 POST /api/intake/submit                band routing + placement output
 POST /api/gate/[levelId]/attempt       composite gate grading + lock

MEMORY
 POST /api/review/grade                 SM-2 update for a card response
 GET  /api/review/queue                 today's due cards
 POST /api/drill/argue                  serve random objection → score response

SIMULATION
 POST /api/spar/start                   create session from config
 POST /api/spar/[id]/message            user msg → opponent reply (Haiku, streamed)
 POST /api/spar/[id]/end                run Coach critique (Sonnet), persist review
 GET  /api/film?track=&persona=         transcripts + trend data

GAMIFICATION
 POST /api/xp/award (internal)          single choke-point for XP + badge checks

ADMIN (role-gated)
 POST /api/admin/ai-draft               drafting assistant (kind + input → draft)
 POST /api/admin/publish/[type]/[id]    workflow transition
 POST /api/admin/import                 CSV/JSON bulk import
 GET  /api/admin/scoring-audit          flagged + recent AI scores

PLATFORM
 POST /api/keys                         save/replace BYOK (encrypt server-side)
 GET  /api/usage                        user's AI usage + shared-cap status
```

All AI calls route through one internal `lib/ai.ts` interface (provider-swappable, BYOK-aware, usage-logging, per-user rate-limited) — this single seam is what makes OpenAI BYOK, model upgrades, and cost caps configuration rather than surgery.

## 40. Authentication Plan

- **Provider:** Supabase Auth — email/password + Google OAuth at MVP (Apple sign-in when the native app ships).
- **Sessions:** Supabase SSR cookies; Next.js middleware guards app routes and role-gates `/admin/*`.
- **Roles:** `profiles.role` enum (§38); sole `admin` = Melo at launch; editor/reviewer/instructor activate in Phase 2 with zero schema change.
- **Security posture:** RLS as the real perimeter (UI gating is convenience, not security) · BYOK keys encrypted server-side, write-only from the client · rate limits per user on all AI routes · email verification required · password reset via Resend.
- **Future:** church-licensing introduces an `organizations` table + membership — designed-for, not built.

## 41. Recommended Stack

| Layer | Choice | Rationale (constraint: non-coder building with Claude Code) |
|---|---|---|
| Framework | Next.js 15 (App Router), TypeScript | The most well-trodden path = most reliable AI-generated code |
| UI | Tailwind + shadcn/ui | Themeable to §36; component-by-component |
| Data/Auth | Supabase (Postgres, Auth, RLS, Storage) | Backend solved declaratively; free tier covers 150 users |
| Hosting | Vercel (GitHub push-to-deploy) | Already in Melo's workflow |
| AI | Anthropic API — Haiku (personas, card scoring), Sonnet (critique, rubric scoring, drafting) via `lib/ai.ts` | Quality where it counts, pennies where it doesn't |
| Verses | ESV API + `verses_cache` | Per decision; cache keeps rate limits trivial |
| Email | Resend | Auth + notification emails |

**Cost reality (restated because it's the #1 constraint):** Claude.ai subscriptions do **not** cover a deployed app's API calls. The deployed app needs an Anthropic API account (set a $25–50 spend cap). At 150 users: lessons/quizzes/cards cost $0; AI features ≈ $0.02–0.08 per simulation+critique → realistic **$15–50/month**, mostly offset by BYOK. ChatGPT subscriptions likewise can't be "connected"; an OpenAI **API key** as an alternate BYOK provider is a Phase 2 option behind the same `lib/ai.ts` seam.

**ESV licensing:** free tier is non-commercial — fine through the free era; the day subscriptions launch, secure Crossway commercial permission or flip `translation` config to a fallback (Berean Standard Bible is free for all uses).

## 42. MVP Build Sequence

**Phase 0 — Setup (Week 0):** Anthropic API account + spend cap · ESV key · Supabase project · GitHub repo (this doc at `/docs/blueprint.md`) · Vercel project · Claude Code.

**Milestone 1 — Walking Skeleton (Weeks 1–3):** deploy + auth + full schema migration + one real lesson (Trinity M1.3) rendering from DB with terms/verses/citations + its checkpoint quiz + one 10-card deck with working SM-2 queue + one civil persona end-to-end (sim → critique → Game Film) + admin lesson/question editors with publish workflow + responsive shell with design tokens. **Exit test:** Melo completes the whole loop on his phone, then edits the lesson in admin.

**Milestone 2 — Systems Complete (Weeks 4–7):** all block and question types · written-response scoring · gates + progression + XP/streaks/badges · intake assessment · full memory modes + drills · difficulty ladder + pressure toggles + Game Film trends · BYOK + shared-key caps · admin AI drafting + scoring audit + bulk import.

**Milestone 3 — Content Production (Weeks 6–14, overlapping):** Trinity L1–2 (validates the template) → L3–4 → L5–6 (drill banks, personas) → JW track → intake bank (~90 questions). **Budget 2–4 editorial hours per published lesson ≈ 60–100 hours total. This is the critical path — protect a weekly block like sermon prep or September ships a beautiful empty building.**

**Milestone 4 — Beta (Weeks 12–16):** 10–15 testers (P1 slice + 2–3 Builders Cohort men + one honest critic of the app itself); Melo audits every AI score from beta; rubric prompt tuning; fix list.

**Milestone 5 — Launch (Fall 2026):** tied to a Sunday moment or a contend-for-the-faith class (the app is the homework); intake assessment as the front door; weekly "this week's drill" rhythm.

**Working rules with Claude Code:** one milestone-slice per session · commit every working state · `/docs/blueprint.md` + `/docs/decisions.md` read at session start · Melo QAs on his phone after every session · schema changes get dedicated sessions and migrations.

## 43. Testing Plan

1. **Per-session manual QA (Melo):** every Claude Code session ends with a phone walkthrough of the touched flow; a living QA checklist in `/docs/qa.md` (auth, lesson, quiz, queue, drill, spar, gate, admin publish).
2. **Automated baseline:** unit tests on the pure logic that must never silently break — SM-2 scheduling, gate evaluation, XP awards, MC grading; one Playwright smoke test of the golden path (signup → lesson → quiz → review → spar) run before each deploy. Claude Code writes and maintains these; keep the surface small and high-value.
3. **AI quality audits (the tests that matter most):**
   - *Scoring calibration:* Melo hand-scores 20 written responses, compares to AI rubric scores; tune the rubric prompt until agreement is within ±0.5 on ≥80% of items; re-audit after any prompt or model change.
   - *Persona fidelity:* run each persona through a 10-exchange test script; verify steelman accuracy, no cheap concessions, no fabricated citations; admin sandbox makes this repeatable.
   - *Adversarial pass:* deliberately try to break personas (extract content, induce strawmanning, prompt-inject via user messages) before beta.
4. **Content QA:** every published lesson checked for citation coverage, term-blurb completeness, working verse renders, quiz answer-key correctness.
5. **Beta protocol:** testers get weekly tasks + a friction log; every gate failure and AI score from beta is reviewed; exit criteria — golden path bug-free, scoring calibrated, 3 testers independently complete Trinity Beginner→Apprentice.
6. **Ongoing:** the admin scoring-audit queue and question analytics are the permanent test harness.

## 44. Risks and Constraints

| Risk | Severity | Mitigation |
|---|---|---|
| **Content bottleneck** — one author, ~32 lessons by fall | High (the existential risk) | AI drafting + protected weekly editorial block + Trinity L1–2 first to validate template + scope already cut to 2 tracks |
| **AI scoring quality** — bad grades destroy trust in gates | High | Calibration protocol (§43.3), audit queue, versioned rubric prompts, 24h gate lockouts limit damage |
| **Persona misrepresentation** — strawmanning betrays the core promise | High | Primary-source-seeded prompts, fidelity rule, persona test scripts, Melo review of every persona |
| **API cost surprise** | Medium | Spend caps, BYOK-first, per-user rate limits, `usage_log` visibility, Haiku for high-volume calls |
| **ESV licensing at commercialization** | Medium | Known cliff; translation column makes the swap config-level |
| **Solo-admin bus factor** — theology, content, and product all route through Melo | Medium | Documented guidelines (§34–35) make future delegation possible; editor/reviewer workflow pre-built |
| **Non-coder maintenance** — the app outlives the build session | Medium | Boring stack, heavy docs-in-repo, small automated test surface, one-milestone-per-session discipline |
| **Scope creep** — 45 sections of vision vs. a fall deadline | Medium | The MVP test (§8) is the contract; stubs absorb ambition |
| **Theological liability** — errors ship under Melo's name | Medium | Single-reviewer gate, versioned content, honest-difficulty policy |
| **Engagement decay post-launch** | Medium | Daily queue + streaks + drill-of-the-day; Phase 2 cohorts are the real retention engine — plan the first cohort within 90 days of launch |
| **Sensitive-population dynamics** (ex-JWs, ex-Mormons, deconstructing users in beta/launch) | Low–Med | §34.6 pastoral redirects; charity guidelines; OFC pastoral backstop is a real advantage here |

**Hard constraints:** ~$25–50/month AI ceiling pre-subscription · Melo's editorial hours are the rate-limiter · Claude Code is the entire engineering department · fall 2026 date is tied to church rhythm, not arbitrary.

## 45. Open Questions That Remain

1. **Name & domain** — confirm *Contend* (or alternative) and secure the domain before any brand spend. *(Decide: before launch marketing, not before build.)*
2. **Beta roster** — the 10–15 names, including the designated honest critic. *(Decide: Milestone 3.)*
3. **Launch vehicle** — standalone Sunday moment, a class, or attach to the September Disciple-Maker Training? Equipping-track adjacency is real, but so is launch-fatigue risk in the same season. *(Decide: with the fall calendar.)*
4. **First Phase 2 track** — Islam (recommended: most common real-world encounter + most requested category) vs. Secular Skeptic (P3 pressure). The launch-page stub votes will give data. *(Decide: 60 days post-launch.)*
5. **Voice vendor** — when voice mode comes: browser speech APIs (free, rougher) vs. Whisper-class STT (better, costs). *(Decide: Phase 2.)*
6. **Subscription mechanics** — price point, church-license structure, payment provider (Stripe presumed), and the ESV licensing resolution that must precede it. *(Decide: Phase 3 planning.)*
7. **Certification** — is "Contend Certified Defender" a Phase 3 credential worth the assessment-integrity work it demands? *(Park until churches ask.)*
8. **OpenAI BYOK demand** — build only if beta users actually request it. *(Data, not speculation.)*
9. **Intake retake policy** — current design allows per-track retakes capped at Defender; confirm this doesn't let users skip the memory-work gates they actually need. *(Revisit with beta data.)*

---

## Appendix — Delegated Decisions Index
Spaced repetition: SM-2-lite, 30-card daily cap · Media: text-first, audio Phase 3 · Scripture modes: progressive ladder · Argument memory: verbatim skeletons → own-words at Specialist+ · Decks: curated cores gate levels, user decks Phase 1.5 · Timed: both, argumentation as signature · Knowledge base: citation library, not wiki · Admin AI: draft-only with mandatory approval · JW as launch opponent track · Deity of Christ via shared modules · Focus-mode palette shift for training surfaces.

*This blueprint supersedes PRD v1.0 and lives at `/docs/blueprint.md` in the repo. Claude Code reads it at the start of every build session.*
