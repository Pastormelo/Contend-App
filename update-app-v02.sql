-- CONTEND v0.2 content update
-- Paste this whole file into the Supabase SQL Editor and click Run.
-- Safe to run once on a database that already ran setup-database.sql.

begin;

-- ============================================================
-- 1. Harsher, honest scoring rubric (v2 replaces v1)
-- ============================================================
update public.rubric_prompts set active = false where name = 'coach-rubric';

insert into public.rubric_prompts (id, name, prompt_text, version, active) values
  ('a0000000-0000-0000-0000-000000000002', 'coach-rubric', $r$You are an apologetics coach evaluating a Christian's performance defending the faith. You are honest the way a good athletic coach is honest: direct, specific, never cruel — and never inflated. A trainee who is told "good job" for weak work has been lied to.

Score the response/transcript on exactly five categories, each 1-5 with a one-line rationale:
1. biblical_accuracy — Are the claims true to Scripture? Are texts used in context?
2. logic_structure — Is the argument ordered, valid, and complete? Are distinctions precise?
3. steelman_integrity — Did they engage the strongest form of the objection rather than a strawman?
4. persuasive_clarity — Would a real person follow and remember this? Short sentences, concrete language?
5. tone_in_context — Tone policy: Firmness and directness are not penalized. Deduct on tone only for disproportionate aggression toward a non-aggressive interlocutor, mockery, or contempt. Reward gentleness that does not surrender ground.

CALIBRATION — hold this line in every category:
- 1 = absent. A non-answer, refusal, "I don't know", or content that never engages the question scores 1. There is no participation credit for showing up.
- 2 = attempted but failing. Engages the topic yet vague, confused, or biblically empty.
- 3 = serviceable. The core claim lands but with real gaps a sharp opponent would exploit.
- 4 = strong. Clear, ordered, biblically grounded; would hold up in a real conversation.
- 5 = exceptional. Reserve this. Precise distinctions, Scripture in context, persuasive shape — work you would point to as the standard.
Most honest scores for a learner fall at 2-3. Do not drift upward to be kind.

In rationales and feedback, name the failure plainly ("You never answered the question", "You asserted the conclusion without one verse") — no cushioning phrases, no "great effort". Honest, never insulting.

Citation-or-silence: Cite only source IDs from the provided list; if none supports a suggestion, set citation_source_id to null. Never invent a source.

Where applicable, include a gospel pathway observation inside missed_opportunity — a moment where the conversation could have moved toward the gospel and did not.

Ground your evaluation in the provided model answer and sources. Quote the user's actual words when identifying moments.$r$,
   2, true);

-- ============================================================
-- 2. Full glossary definitions (popovers show these)
-- ============================================================
update public.glossary_terms set full_definition =
  $d$What something *is* — its nature, its "what-ness." A rock, an angel, and a human are three different kinds of being. Scripture insists God is **one being**: there is exactly one divine "what," one God, with one undivided nature (Deut 6:4; Isa 45:5). When Christians say "one God," this is the oneness we mean. The Trinity never multiplies beings — that would be tritheism. The entire doctrine rests on keeping this word distinct from the next one: *person*.$d$
  where term = 'being';

update public.glossary_terms set full_definition =
  $d$A "who" — a distinct subject who can say "I," who knows, wills, loves, and speaks. You are one being (human) and one person (you). God is one being and **three persons**: the Father, the Son, and the Spirit each know, will, love, and speak — and they speak *to one another* (the Son prays to the Father, John 17). That is why they cannot be three masks on one face: masks don't hold conversations. "One what, three whos" is the whole grammar of the doctrine in five words.$d$
  where term = 'person';

update public.glossary_terms set full_definition =
  $d$Another word for *being* or nature — what makes God *God*: eternal, almighty, all-knowing, present everywhere, perfectly good. The Father, Son, and Spirit do not each have a slice of the divine essence, like three people splitting a pie; each person possesses the **whole** essence fully. That is why three persons does not mean three gods — there is only one divine essence to possess, and all three fully share it.$d$
  where term = 'essence';

update public.glossary_terms set full_definition =
  $d$The biblical teaching that the one true God eternally exists as three distinct persons — Father, Son, and Holy Spirit — each fully God, yet there is only one God. It is the summary of three lines of Scripture held together: (1) there is exactly one God; (2) the Father is God, the Son is God, the Spirit is God; (3) the three are distinct from one another. The word itself (Latin *trinitas*, "three-ness") was coined by Tertullian around AD 200, but the teaching is as old as the New Testament — one *name*, three persons (Matt 28:19). Not three gods (tritheism); not one person in three roles (modalism).$d$
  where term = 'Trinity';

update public.glossary_terms set full_definition =
  $d$The error that Father, Son, and Spirit are **one person** wearing three masks or playing three successive roles — like water appearing as ice, liquid, and steam. It honors the oneness of God but erases the three persons, and Scripture refuses it: at Jesus' baptism all three are present *at once* (Matt 3:16–17), and the Son prays *to* the Father (John 17) — a role does not pray to itself. Also called Sabellianism after its third-century teacher, it was rejected by the early church and survives today in Oneness ("Jesus Only") Pentecostalism. The water/ice/steam analogy teaches exactly this error — drop it.$d$
  where term = 'modalism';

update public.glossary_terms set full_definition =
  $d$The error that Father, Son, and Spirit are **three separate gods** — three beings, a committee of deities. It honors the distinct persons but shatters the oneness of God, and Scripture forbids it absolutely: "the LORD is one" (Deut 6:4); "besides me there is no God" (Isa 45:5). No serious Christian tradition has ever taught it — yet it is what skeptics and Muslims most often *assume* the Trinity means, so you must be able to disqualify it on the spot: we are not adding beings (1+1+1); one being fully shared is 1×1×1=1.$d$
  where term = 'tritheism';

-- ============================================================
-- 3. Deepen the Trinity lesson: word studies, the wider case for
--    the Son's deity, church history, harder follow-ups, and why
--    it matters. Existing sorts are spaced out (x10) so the new
--    blocks interleave at the right points.
-- ============================================================
update public.lesson_blocks
  set sort = sort * 10
  where lesson_id = '40000000-0000-0000-0000-000000000001' and sort < 100;

update public.lessons
  set est_minutes = 40
  where id = '40000000-0000-0000-0000-000000000001';

insert into public.lesson_blocks (id, lesson_id, sort, type, content) values

-- After the Shema (sort 30): what "one" does and does not claim
('50000000-0000-0000-0000-000000000101', '40000000-0000-0000-0000-000000000001', 35, 'word_study',
 jsonb_build_object(
   'word', 'one',
   'original', 'אֶחָד',
   'transliteration', 'echad',
   'md',
 $c$The Shema's "one" is *echad*. It asserts that God is one — exclusively, absolutely, the only God — but it does not flatten him into mathematical simplicity. The same word describes a husband and wife becoming "one flesh" (Gen 2:24) and evening and morning becoming "one day" (Gen 1:5): real oneness that can hold real distinction. Be careful not to overclaim — *echad* does not prove the Trinity. It simply shows that when Scripture later reveals three persons, nothing in the Shema is broken.$c$)),

-- After John 20:28 (sort 70): the wider New Testament case
('50000000-0000-0000-0000-000000000102', '40000000-0000-0000-0000-000000000001', 75, 'prose',
 jsonb_build_object('heading', $c$The Son is God — the wider case$c$, 'md',
 $c$John 1:1 and John 20:28 are not lonely verses; the New Testament presses Christ's deity from every direction. He does what only God does: he creates and sustains all things (Col 1:16–17; Heb 1:3), forgives sins committed against God (Mark 2:5–7 — the scribes' outrage shows they understood exactly what he was claiming), and will judge the nations (Matt 25:31–32). He receives what only God may receive: worship (Matt 14:33; Matt 28:9), prayer (Acts 7:59), and the allegiance owed to God alone. And he bears the names: "the first and the last" (Rev 22:13), which Yahweh claims exclusively in Isa 44:6, and "Lord" in Old Testament quotations that name Yahweh himself (Rom 10:13, citing Joel 2:32). This is not a doctrine balanced on a proof-text; it is the New Testament's steady, everywhere-assumed conviction.$c$)),

('50000000-0000-0000-0000-000000000103', '40000000-0000-0000-0000-000000000001', 76, 'scripture',
 jsonb_build_object('reference', 'Hebrews 1:8', 'note',
 $c$The Father speaks — and addresses the Son as **God**, quoting Psalm 45. If the Father himself calls the Son "God," the question is settled at the highest possible level.$c$)),

('50000000-0000-0000-0000-000000000104', '40000000-0000-0000-0000-000000000001', 77, 'scripture',
 jsonb_build_object('reference', 'Colossians 2:9', 'note',
 $c$Not a portion of deity, not a divine influence — *the whole fullness of deity, bodily*. Paul wrote this to a church tempted to demote Christ to one spiritual power among many. That temptation never went away.$c$)),

-- After "why it is not a contradiction" (sort 130): the history
('50000000-0000-0000-0000-000000000105', '40000000-0000-0000-0000-000000000001', 132, 'prose',
 jsonb_build_object('heading', $c$Didn't Constantine invent this in AD 325?$c$, 'md',
 $c$You will hear it from skeptics and at your door: *"The Trinity was invented at the Council of Nicaea."* Here is what actually happened. Around AD 318 a popular teacher named Arius began teaching that the Son was God's first and greatest *creature* — "there was when he was not." The church convulsed — because Christians had been worshiping Jesus and baptizing in the threefold name for nearly three centuries. Tertullian had coined the word *trinitas* around AD 200, long before any council or any Christian emperor. Nicaea (AD 325) did not invent a doctrine; it built a fence around what the churches already confessed, declaring the Son *homoousios* — of the same essence — with the Father, and it argued the point from Scripture. Constantine convened the council; he did not write its theology. The councils are not our authority — Scripture is. But know the history, because "a fourth-century emperor invented your doctrine" is simply false, and you should be able to say so with dates.$c$)),

('50000000-0000-0000-0000-000000000106', '40000000-0000-0000-0000-000000000001', 134, 'word_study',
 jsonb_build_object(
   'word', 'of the same essence',
   'original', 'ὁμοούσιος',
   'transliteration', 'homoousios',
   'md',
 $c$The watchword of Nicaea: the Son is *homoousios* — of the very same essence — with the Father. Not merely *similar* to God (the compromise party's word was *homoiousios*, "of like essence"; church history really did hinge on a single iota), but everything the Father is as God, the Son is. The word is not in the Bible. It is a fence built around what the Bible says, so that no one could affirm John 1:1 with crossed fingers.$c$)),

-- After the objection block (sort 140): harder follow-ups
('50000000-0000-0000-0000-000000000107', '40000000-0000-0000-0000-000000000001', 145, 'prose',
 jsonb_build_object('heading', $c$The harder follow-ups — answered honestly$c$, 'md',
 $c$Clear answers breed better questions. Three you should expect. **"If Jesus prayed to God, was he talking to himself?"** No — the Son prayed to the Father. Two persons relating is not one person performing; the prayers of Jesus are evidence *for* the doctrine, not against it. **"So did God die on the cross?"** The one who died is God the Son — but death tore his human body and soul apart; deity did not cease to exist. The early church said it carefully: the Son of God died *according to his human nature*. You will learn that two-natures grammar properly at higher levels; for now refuse both errors — "only a man died" (then the cross saves no one) and "the divine nature perished" (impossible). **"How could Jesus not know the hour of his return (Mark 13:32)?"** Because the eternal Son took on a true human mind that grew and learned (Luke 2:52). Most "how can Jesus be God?" questions are really questions about the Incarnation — which is why it gets its own course in your training.$c$)),

-- After the response formulas (sort 150): why it matters
('50000000-0000-0000-0000-000000000108', '40000000-0000-0000-0000-000000000001', 152, 'prose',
 jsonb_build_object('heading', $c$Why this matters — more than winning arguments$c$, 'md',
 $c$If the Trinity were merely a puzzle, you could shrug at it. It is not a puzzle; it is the shape of the gospel. The Father sends, the Son redeems, the Spirit makes alive — "through him we both have access in one Spirit to the Father" (Eph 2:18). Your salvation and even your prayers are already trinitarian, whether you can articulate it or not. It also means God did not create you out of loneliness: the Father, Son, and Spirit have loved one another from all eternity (John 17:24), and the gospel is an invitation into that fellowship — not an audition before a solitary monarch. So train hard on this doctrine, not to win arguments, but because the God you are defending is the God you get to know.$c$));

-- Citations for the new blocks
insert into public.citations (id, source_id, lesson_block_id, locator, is_excerpt) values
  ('c0000000-0000-0000-0000-000000000101', '60000000-0000-0000-0000-000000000001',
   '50000000-0000-0000-0000-000000000102', 'ch. 3–7 (summarized)', false),
  ('c0000000-0000-0000-0000-000000000102', '60000000-0000-0000-0000-000000000002',
   '50000000-0000-0000-0000-000000000108', 'ch. 1, 3 (summarized)', false),
  ('c0000000-0000-0000-0000-000000000103', '60000000-0000-0000-0000-000000000001',
   '50000000-0000-0000-0000-000000000105', 'ch. 1 (summarized)', false);

-- ============================================================
-- 4. Sixteen more checkpoint questions (24 total)
-- ============================================================
insert into public.question_bank (id, quiz_id, type, prompt, options, answer, source_block_id, sort) values

  ('71000000-0000-0000-0000-000000000009', '70000000-0000-0000-0000-000000000001', 'mc',
   'John 1:1 makes two claims in a single sentence. They are…',
   '["The Word was created, and the Word was divine", "The Word was with God (distinction), and the Word was God (deity)", "The Word was a god, and the Word was a messenger", "The Word existed, and the Word spoke"]'::jsonb,
   '{"correct": 1}'::jsonb,
   '50000000-0000-0000-0000-000000000006', 9),

  ('71000000-0000-0000-0000-000000000010', '70000000-0000-0000-0000-000000000001', 'mc',
   'Which of these shows the Holy Spirit is a person, not a force?',
   '["He fills people", "He can be grieved (Eph 4:30)", "He appeared as a dove", "He is called holy"]'::jsonb,
   '{"correct": 1}'::jsonb,
   '50000000-0000-0000-0000-000000000009', 10),

  ('71000000-0000-0000-0000-000000000011', '70000000-0000-0000-0000-000000000001', 'tfq',
   '"In Acts 5:3–4, lying to the Holy Spirit is treated as lying to God — evidence the Spirit is divine."',
   '["true", "false", "needs_qualification"]'::jsonb,
   '{"correct": "true", "note": "Peter equates the two without pausing to argue it — the Spirit''s deity was already assumed in the earliest church."}'::jsonb,
   '50000000-0000-0000-0000-000000000008', 11),

  ('71000000-0000-0000-0000-000000000012', '70000000-0000-0000-0000-000000000001', 'mc',
   'In Matthew 28:19, Jesus commands baptism "in the name (singular) of…"',
   '["the Father only", "the Father and of the Son and of the Holy Spirit", "God and his angels", "Jesus only"]'::jsonb,
   '{"correct": 1}'::jsonb,
   '50000000-0000-0000-0000-000000000011', 12),

  ('71000000-0000-0000-0000-000000000013', '70000000-0000-0000-0000-000000000001', 'cloze',
   'God is one in being and three in ____.',
   null,
   '{"accepted": ["person", "persons"]}'::jsonb,
   '50000000-0000-0000-0000-000000000012', 13),

  ('71000000-0000-0000-0000-000000000014', '70000000-0000-0000-0000-000000000001', 'tfq',
   '"The water/ice/steam analogy is a helpful way to explain the Trinity."',
   '["true", "false", "needs_qualification"]'::jsonb,
   '{"correct": "false", "note": "Water takes those forms one at a time — that is modalism. At the baptism of Jesus, all three persons are present at once."}'::jsonb,
   '50000000-0000-0000-0000-000000000014', 14),

  ('71000000-0000-0000-0000-000000000015', '70000000-0000-0000-0000-000000000001', 'mc',
   'The egg and three-leaf-clover analogies fail because they teach…',
   '["modalism", "partialism — each part is only a third of God", "tritheism", "that God is physical"]'::jsonb,
   '{"correct": 1}'::jsonb,
   '50000000-0000-0000-0000-000000000014', 15),

  ('71000000-0000-0000-0000-000000000016', '70000000-0000-0000-0000-000000000001', 'mc',
   'Someone says: "If Jesus prayed to God, he can''t BE God." The best response:',
   '["Jesus only appeared to pray", "The Son praying to the Father is two persons relating — exactly what the Trinity claims", "Jesus stopped being God while on earth", "The prayers were only an example for us"]'::jsonb,
   '{"correct": 1}'::jsonb,
   '50000000-0000-0000-0000-000000000107', 16),

  ('71000000-0000-0000-0000-000000000017', '70000000-0000-0000-0000-000000000001', 'tfq',
   '"The Council of Nicaea (AD 325) invented the doctrine of the Trinity."',
   '["true", "false", "needs_qualification"]'::jsonb,
   '{"correct": "false", "note": "Nicaea defended what churches had confessed for centuries. Tertullian used trinitas around AD 200; the scriptural data is older still."}'::jsonb,
   '50000000-0000-0000-0000-000000000105', 17),

  ('71000000-0000-0000-0000-000000000018', '70000000-0000-0000-0000-000000000001', 'mc',
   'Hebrews 1:8 is striking because…',
   '["the Son speaks to angels", "the Father addresses the Son as God", "Moses calls the Son God", "it quotes Genesis"]'::jsonb,
   '{"correct": 1}'::jsonb,
   '50000000-0000-0000-0000-000000000103', 18),

  ('71000000-0000-0000-0000-000000000019', '70000000-0000-0000-0000-000000000001', 'mc',
   'Colossians 2:9 says that in Christ…',
   '["a part of God dwells", "the whole fullness of deity dwells bodily", "wisdom dwells symbolically", "an angel of the Lord dwells"]'::jsonb,
   '{"correct": 1}'::jsonb,
   '50000000-0000-0000-0000-000000000104', 19),

  ('71000000-0000-0000-0000-000000000020', '70000000-0000-0000-0000-000000000001', 'cloze',
   'The Hebrew word for "one" in the Shema — ____ — asserts that God is one without flattening him into mathematical simplicity.',
   null,
   '{"accepted": ["echad"]}'::jsonb,
   '50000000-0000-0000-0000-000000000101', 20),

  ('71000000-0000-0000-0000-000000000021', '70000000-0000-0000-0000-000000000001', 'tfq',
   '"The Father, Son, and Spirit each possess one-third of the divine essence."',
   '["true", "false", "needs_qualification"]'::jsonb,
   '{"correct": "false", "note": "Each person possesses the WHOLE divine essence fully — that is why three persons does not mean three gods (and why the egg analogy fails)."}'::jsonb,
   '50000000-0000-0000-0000-000000000012', 21),

  ('71000000-0000-0000-0000-000000000022', '70000000-0000-0000-0000-000000000001', 'mc',
   'The six-line formulation ends: "Therefore…"',
   '["there are three gods in heaven", "the one God eternally exists as three persons", "God appears to us in three forms", "the Trinity is a mystery beyond all words"]'::jsonb,
   '{"correct": 1}'::jsonb,
   '50000000-0000-0000-0000-000000000002', 22),

  ('71000000-0000-0000-0000-000000000023', '70000000-0000-0000-0000-000000000001', 'tfq',
   '"Because the Trinity is beyond our full comprehension, it is a contradiction."',
   '["true", "false", "needs_qualification"]'::jsonb,
   '{"correct": "false", "note": "Strange is not contradictory. A contradiction affirms A and not-A in the same sense at the same time — one BEING and three PERSONS are different senses."}'::jsonb,
   '50000000-0000-0000-0000-000000000013', 23),

  ('71000000-0000-0000-0000-000000000024', '70000000-0000-0000-0000-000000000001', 'cloze',
   'Persons relate; ____ don''t.',
   null,
   '{"accepted": ["masks"]}'::jsonb,
   '50000000-0000-0000-0000-000000000010', 24);

commit;
