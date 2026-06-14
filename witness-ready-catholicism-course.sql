-- ============================================================================
-- WITNESS READY — Roman Catholicism course (complete, self-contained)
-- Paste this whole file into the Supabase SQL Editor and click Run.
--
-- This is everything the Roman Catholicism course needs: the track, levels,
-- lesson, 21 lesson blocks, glossary terms, 14 sources (incl. the 10 key
-- evangelical works), citations, the 14-question checkpoint, and flashcards.
-- It is idempotent — safe to run as many times as you like; re-running
-- refreshes the content. Running this resolves the 404 on the course.
-- ============================================================================

begin;

-- Make sure the track exists and is live (this alone fixes the 404).
insert into public.tracks (id, slug, title, type, status, sort) values
  ('b1000000-0000-0000-0000-000000000001', 'roman-catholicism', 'Roman Catholicism', 'opponent', 'live', 6)
on conflict (slug) do update
  set title = excluded.title, type = excluded.type, status = excluded.status, sort = excluded.sort;

insert into public.levels (id, track_id, number, title, equipped_statement, status) values
  ('b2000000-0000-0000-0000-000000000101', 'b1000000-0000-0000-0000-000000000001', 1, 'Beginner',
   'Can explain where Roman Catholicism and the gospel agree, and where the Reformation said they divide.', 'live'),
  ('b2000000-0000-0000-0000-000000000102', 'b1000000-0000-0000-0000-000000000001', 2, 'Apprentice',
   'Can defend sola scriptura and sola fide from Scripture in conversation.', 'coming'),
  ('b2000000-0000-0000-0000-000000000103', 'b1000000-0000-0000-0000-000000000001', 3, 'Defender',
   'Can engage the Mass, purgatory, and the Marian dogmas with precision and charity.', 'coming'),
  ('b2000000-0000-0000-0000-000000000104', 'b1000000-0000-0000-0000-000000000001', 4, 'Specialist',
   'Can work through Trent and the Catechism on their own terms.', 'coming'),
  ('b2000000-0000-0000-0000-000000000105', 'b1000000-0000-0000-0000-000000000001', 5, 'Instructor',
   'Can disciple a former Catholic into assurance in the finished work of Christ.', 'coming'),
  ('b2000000-0000-0000-0000-000000000106', 'b1000000-0000-0000-0000-000000000001', 6, 'Master',
   'Can lead a gracious public dialogue with a trained Catholic apologist.', 'coming')
on conflict (id) do update set title = excluded.title, equipped_statement = excluded.equipped_statement, status = excluded.status;

insert into public.modules (id, level_id, title, summary, sort, status) values
  ('b3000000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000101', 'The Divide',
   'Where Rome and the Reformation part — and the one question underneath it all.', 1, 'published')
on conflict (id) do update set title = excluded.title, summary = excluded.summary, status = excluded.status;

insert into public.lessons (id, title, est_minutes, status, version, published_at) values
  ('b4000000-0000-0000-0000-000000000001', 'Rome and the Gospel: Where We Divide', 40, 'published', 2, now())
on conflict (id) do update set title = excluded.title, est_minutes = excluded.est_minutes, status = excluded.status;

insert into public.module_lessons (module_id, lesson_id, sort) values
  ('b3000000-0000-0000-0000-000000000001', 'b4000000-0000-0000-0000-000000000001', 1)
on conflict (module_id, lesson_id) do nothing;

-- ----------------------------------------------------------------------------
-- Glossary
-- ----------------------------------------------------------------------------
insert into public.glossary_terms (term, short_blurb, full_definition) values
  ('sola scriptura',
   'Scripture alone is the final, sufficient authority for faith and life.',
   $d$Latin for "Scripture alone." The Reformation principle that the Bible is the *final* and *sufficient* authority — the only infallible rule by which all teaching, tradition, and church authority must be tested. It does not deny that tradition or teachers are useful (that caricature is *solo* scriptura); it denies that any of them stands *over* Scripture or adds binding revelation to it. Rome answers instead with Scripture **plus** unwritten Tradition **plus** a living Magisterium that interprets both infallibly.$d$),
  ('sola fide',
   'A sinner is justified by faith alone, apart from works.',
   $d$Latin for "faith alone." The Reformation conviction that a sinner is declared righteous before God by faith alone, resting on Christ's finished work — not by faith *plus* works, sacraments, or merit. Good works follow justification as its fruit; they are never its ground. The Council of Trent explicitly condemned this teaching (Canon 9 on Justification).$d$),
  ('justification',
   'God''s declaration that a sinner is righteous in his sight.',
   $d$The legal act by which God declares a sinner righteous. The Reformation taught that this righteousness is *imputed* — Christ's righteousness credited to the believer, who is counted righteous though still being changed. Rome teaches justification as *infused* righteousness, a grace poured in through the sacraments and cooperated with, which can be increased by works and lost by mortal sin. Imputed vs. infused is the hinge of the whole debate: is your standing finished, or in progress?$d$),
  ('Magisterium',
   'The teaching authority of the Roman Catholic Church (pope and bishops).',
   $d$The official teaching office of the Roman Catholic Church — the pope and the bishops in communion with him — claimed to interpret Scripture and Tradition authoritatively, and at times infallibly. For Rome, the individual does not finally judge what Scripture means; the Magisterium does. This is why "we both read the same Bible" does not end the conversation: the disagreement is about who holds final authority over its meaning.$d$),
  ('transubstantiation',
   'The teaching that the bread and wine become the actual body and blood of Christ.',
   $d$Rome's teaching (defined at the Fourth Lateran Council, 1215) that at the Mass the substance of the bread and wine is changed into the actual body and blood of Christ, though the appearances remain. The Mass is held to *re-present* (make present again) the one sacrifice of Calvary. Hebrews presses the counter-question hard: Christ offered himself "once for all" and "sat down" — a finished sacrifice needs no re-presentation (Heb 10:11-14).$d$),
  ('purgatory',
   'A claimed intermediate state of cleansing suffering after death.',
   $d$In Roman Catholic teaching, a state after death in which those destined for heaven undergo cleansing for the temporal consequences of sin before entering glory. Scripture knows nothing of it; it teaches that to be absent from the body is to be present with the Lord (2 Cor 5:8) and that Christ's blood cleanses *all* sin (1 John 1:7). Purgatory assumes the cross left a debt still to be paid.$d$),
  ('indulgence',
   'A remission of temporal punishment for sin, drawn from the "treasury of merit."',
   $d$In Catholic practice, the remission of the temporal punishment due to sin, granted by the Church from a "treasury of merit" — the surplus merits of Christ and the saints. The *sale* of indulgences to fund St. Peter's Basilica was the spark for Luther's 95 Theses in 1517. The deeper objection is theological, not just financial: it treats forgiveness as a debt the Church can dispense, rather than a finished gift in Christ.$d$),
  ('Immaculate Conception',
   'The dogma that Mary was conceived without original sin.',
   $d$Often confused with the virgin birth of Jesus, this is the 1854 dogma that *Mary herself* was conceived free from original sin. It is one of four Marian dogmas, alongside her perpetual virginity, her divine motherhood, and her bodily Assumption (defined 1950). Scripture presents Mary as a blessed, faithful, and ordinary sinner who rejoiced in "God my Savior" (Luke 1:47) — a confession only a sinner needs to make.$d$),
  ('Magisterial Reformation',
   'The mainstream Reformation of Luther, Calvin, and their heirs.',
   $d$The mainstream 16th-century Reformation — Luther, Zwingli, Calvin, Cranmer and their heirs — which reformed the church by the authority of Scripture while retaining the catholic creeds and much historic practice. It is "magisterial" because it worked with the magistrates/established churches and held to the great tradition, distinguishing it from both Rome and the radical Anabaptist wing.$d$)
on conflict (term) do update set full_definition = excluded.full_definition, short_blurb = excluded.short_blurb;

-- ----------------------------------------------------------------------------
-- Sources — the 4 primary/reference works plus the 10 key evangelical studies
-- ----------------------------------------------------------------------------
insert into public.sources (id, source_type, title, author, publisher, year) values
  ('b6000000-0000-0000-0000-000000000001', 'public_domain', 'Disputation on the Power of Indulgences (The 95 Theses)', 'Martin Luther', null, 1517),
  ('b6000000-0000-0000-0000-000000000002', 'public_domain', 'Canons and Decrees of the Council of Trent', 'Council of Trent', null, 1564),
  ('b6000000-0000-0000-0000-000000000003', 'copyrighted_reference', 'Catechism of the Catholic Church, 2nd ed.', null, 'Libreria Editrice Vaticana', 1997),
  ('b6000000-0000-0000-0000-000000000004', 'melo_notes', 'Melo — Roman Catholicism teaching notes', null, null, null),
  ('b6000000-0000-0000-0000-000000000010', 'copyrighted_reference', 'Roman Catholic Theology and Practice: An Evangelical Assessment', 'Gregg R. Allison', 'Crossway', 2014),
  ('b6000000-0000-0000-0000-000000000011', 'copyrighted_reference', 'The Roman Catholic Controversy', 'James R. White', 'Bethany House', 1996),
  ('b6000000-0000-0000-0000-000000000012', 'copyrighted_reference', 'Examination of the Council of Trent', 'Martin Chemnitz', 'Concordia', 1971),
  ('b6000000-0000-0000-0000-000000000013', 'copyrighted_reference', 'The Church of Rome at the Bar of History', 'William Webster', 'Banner of Truth', 1995),
  ('b6000000-0000-0000-0000-000000000014', 'copyrighted_reference', 'The Gospel According to Rome', 'James G. McCarthy', 'Harvest House', 1995),
  ('b6000000-0000-0000-0000-000000000015', 'copyrighted_reference', 'The Shape of Sola Scriptura', 'Keith A. Mathison', 'Canon Press', 2001),
  ('b6000000-0000-0000-0000-000000000016', 'copyrighted_reference', 'What It Means to Be Protestant', 'Gavin Ortlund', 'Zondervan', 2024),
  ('b6000000-0000-0000-0000-000000000017', 'copyrighted_reference', 'Roman Catholics and Evangelicals: Agreements and Differences', 'Norman L. Geisler & Ralph E. MacKenzie', 'Baker', 1995),
  ('b6000000-0000-0000-0000-000000000018', 'copyrighted_reference', 'Romanism: The Relentless Roman Catholic Assault on the Gospel', 'Robert M. Zins', 'White Horse', 1995),
  ('b6000000-0000-0000-0000-000000000019', 'copyrighted_reference', 'Revolution in Rome', 'David F. Wells', 'InterVarsity Press', 1972)
on conflict (id) do update set title = excluded.title, author = excluded.author, publisher = excluded.publisher, year = excluded.year, source_type = excluded.source_type;

-- ----------------------------------------------------------------------------
-- Lesson blocks (21) — content + final ordering
-- ----------------------------------------------------------------------------
insert into public.lesson_blocks (id, lesson_id, sort, type, content) values

('b5000000-0000-0000-0000-000000000001', 'b4000000-0000-0000-0000-000000000001', 10, 'prose',
 jsonb_build_object('md',
 $c$One in five Americans was raised Catholic, and most evangelicals have a Catholic relative, neighbor, or coworker. Sooner or later the conversation comes: *"Aren't we basically the same? We both follow Jesus."* Many Christians either flinch from the question to keep the peace, or swing too hard and treat their Catholic friend like a pagan. This lesson trains the narrow, faithful path between those errors — honoring what is genuinely shared, and naming clearly, from Scripture, where Rome adds to the finished work of Christ in ways that touch the gospel itself.$c$)),

('b5000000-0000-0000-0000-000000000002', 'b4000000-0000-0000-0000-000000000001', 20, 'prose',
 jsonb_build_object('heading', 'Start with what we share', 'md',
 $c$Roman Catholicism is not a cult, and honesty requires saying so. Catholics confess the Trinity, the full deity and humanity of Christ, the virgin birth, the bodily resurrection, the second coming, and the authority of the Scriptures — the great creeds of the faith. Many Catholics love Jesus sincerely. If you cannot say all of that plainly, you are not ready to discuss the differences, because you will fight the wrong battles. The Reformation was not a quarrel between a true religion and a false one across the board; it was a fight over the gospel *inside* a church that had buried it.$c$)),

('b5000000-0000-0000-0000-000000000003', 'b4000000-0000-0000-0000-000000000001', 30, 'prose',
 jsonb_build_object('heading', 'Where we divide: two questions', 'md',
 $c$Strip away the side issues and the division comes down to two questions. **First, where does final authority lie?** Rome answers: Scripture **plus** unwritten Tradition **plus** the Magisterium (the teaching office of pope and bishops). The Reformers answered **sola scriptura** — Scripture alone is the final, sufficient norm. **Second, how is a sinner made right with God?** Rome answers: by grace infused through the sacraments and cooperated with by works, a righteousness that can grow and be lost. The Reformers answered **sola fide** — the sinner is *declared* righteous by faith alone, on the basis of Christ's righteousness credited to them. Everything else — the Mass, purgatory, indulgences, Mary, the papacy — grows out of how you answer these two.$c$,
 'terms', jsonb_build_array('sola scriptura', 'sola fide'))),

('b5000000-0000-0000-0000-000000000004', 'b4000000-0000-0000-0000-000000000001', 40, 'scripture',
 jsonb_build_object('reference', '2 Timothy 3:16-17', 'note',
 $c$Scripture is "breathed out by God" and able to make the man of God "complete, equipped for every good work." Note the claim: not merely useful alongside other authorities, but *sufficient* to equip completely.$c$)),

('b5000000-0000-0000-0000-000000000005', 'b4000000-0000-0000-0000-000000000001', 50, 'prose',
 jsonb_build_object('heading', 'Sola scriptura — Scripture alone', 'md',
 $c$Sola scriptura does not mean "no creeds, no teachers, no history." The Reformers loved the early church and quoted it constantly. It means Scripture is the only *infallible* authority — the final court before which every tradition, council, and pope must be tested. Catholic apologists often attack a caricature — *solo* scriptura, "just me and my Bible" — but historic Protestantism reads Scripture *with* the church across the ages while still submitting every voice to the text. Rome's counter is the Magisterium: the claim that the Church gives Scripture its authoritative meaning. That is why "we read the same Bible" does not settle anything by itself — the real question is who holds final authority over what it means. Press it gently: if a teaching cannot be shown from Scripture, on what authority must I believe it?$c$,
 'terms', jsonb_build_array('Magisterium'))),

('b5000000-0000-0000-0000-000000000006', 'b4000000-0000-0000-0000-000000000001', 60, 'scripture',
 jsonb_build_object('reference', 'Mark 7:8-9', 'note',
 $c$Jesus rebukes leaders for setting the "tradition of men" over "the commandment of God." The danger he names is not tradition as such, but tradition that overrides or adds to God's word.$c$)),

('b5000000-0000-0000-0000-000000000007', 'b4000000-0000-0000-0000-000000000001', 70, 'prose',
 jsonb_build_object('heading', 'Sola fide — the heart of it', 'md',
 $c$Here is where eternity hangs. Rome and the Reformation both say grace is necessary; both say faith matters; both say works matter. The question is *how they fit together*. Rome teaches **justification** as a righteousness *infused* into you — really making you righteous over time through the sacraments — which you then cooperate with, and which can be increased by good works and lost by mortal sin. The Reformers taught justification as a righteousness *imputed* to you — Christ's perfect record credited to your account the moment you believe, so that you are *declared* righteous at once, fully, on his merit and not your own. Good works pour out of that gift; they are its fruit, never its root.$c$,
 'terms', jsonb_build_array('justification', 'sola fide'))),

('b5000000-0000-0000-0000-000000000008', 'b4000000-0000-0000-0000-000000000001', 80, 'scripture',
 jsonb_build_object('reference', 'Romans 3:28', 'note',
 $c$"We hold that one is justified by faith apart from works of the law." Paul places justification on faith, set in deliberate contrast to works as its ground.$c$)),

('b5000000-0000-0000-0000-000000000009', 'b4000000-0000-0000-0000-000000000001', 90, 'scripture',
 jsonb_build_object('reference', 'Ephesians 2:8-9', 'note',
 $c$"By grace you have been saved through faith… not a result of works, so that no one may boast." Salvation is a gift received, deliberately walled off from human earning.$c$)),

('b5000000-0000-0000-0000-000000000010', 'b4000000-0000-0000-0000-000000000001', 100, 'prose',
 jsonb_build_object('heading', 'Imputed vs. infused — and why Trent matters', 'md',
 $c$This is not a caricature of Rome; it is Rome's own careful teaching. At the Council of Trent (1547), responding directly to the Reformation, the Catholic Church declared: *"If anyone says that justifying faith is nothing else than confidence in the divine mercy which remits sins for Christ's sake, or that it is this confidence alone by which we are justified, let him be anathema"* (Canon 12). Trent's canons on justification pronounce the word **anathema** — accursed — on the doctrine of faith alone, repeatedly and by name. These canons have never been revoked. So when someone says "the differences don't really matter anymore," the kindest thing you can do is take Rome's own councils as seriously as Rome does.$c$)),

('b5000000-0000-0000-0000-000000000011', 'b4000000-0000-0000-0000-000000000001', 110, 'prose',
 jsonb_build_object('heading', 'The Mass and transubstantiation', 'md',
 $c$Rome teaches that in the Mass the bread and wine become the actual body and blood of Christ (**transubstantiation**), and that the Mass *re-presents* — makes present again — the one sacrifice of Calvary, offered for the sins of the living and the dead. The reverence here is real and worth honoring. But the book of Hebrews presses one word relentlessly against any *repeated* offering: *once*. Christ "has no need, like those high priests, to offer sacrifices daily" (Heb 7:27); he offered himself "once for all" and then "sat down" — the posture of finished work. A sacrifice that must be re-presented is, by definition, not yet finished.$c$,
 'terms', jsonb_build_array('transubstantiation'))),

('b5000000-0000-0000-0000-000000000012', 'b4000000-0000-0000-0000-000000000001', 120, 'scripture',
 jsonb_build_object('reference', 'Hebrews 10:11-14', 'note',
 $c$Priests stand "daily" offering sacrifices that "can never take away sins." But Christ offered "a single sacrifice for sins" and "sat down" — "for by a single offering he has perfected for all time those who are being sanctified." Standing vs. seated; repeated vs. single; never vs. perfected.$c$)),

('b5000000-0000-0000-0000-000000000013', 'b4000000-0000-0000-0000-000000000001', 130, 'prose',
 jsonb_build_object('heading', 'Purgatory, indulgences, and 1517', 'md',
 $c$If the cross left some debt of "temporal punishment" still to be paid, you need a place to pay it — and that is **purgatory**, a claimed state of cleansing suffering after death. From it grew the practice of **indulgences**: remissions of that punishment drawn from a "treasury of merit," the surplus goodness of Christ and the saints, dispensed by the Church. When a friar named Tetzel began *selling* indulgences to fund the building of St. Peter's, a monk named Martin Luther nailed 95 theses to a door in Wittenberg in 1517. His deepest objection was not the money; it was the gospel: forgiveness is not a debt the Church metes out, but a finished gift in Christ, whose blood "cleanses us from all sin" (1 John 1:7).$c$,
 'terms', jsonb_build_array('purgatory', 'indulgence'))),

('b5000000-0000-0000-0000-000000000014', 'b4000000-0000-0000-0000-000000000001', 140, 'prose',
 jsonb_build_object('heading', 'The papacy and apostolic succession', 'md',
 $c$Rome locates its authority in the pope as successor of Peter, citing Matthew 16:18 — "you are Peter, and on this rock I will build my church." But the text will bear careful reading: Peter (*Petros*) has just confessed Christ as the Son of God, and it is that confession — the rock (*petra*) — on which the church is built, with Christ himself as the cornerstone (Eph 2:20; 1 Cor 3:11). Peter is honored, prominent, the first to preach at Pentecost — and also rebuked to his face by Paul (Gal 2:11) and never addressed by the other apostles as holding office over them. The claim of an unbroken line of infallible authority is a historical and biblical claim you can examine, not a given you must concede.$c$)),

('b5000000-0000-0000-0000-000000000020', 'b4000000-0000-0000-0000-000000000001', 145, 'prose',
 jsonb_build_object('heading', $c$"It was always taught" — Rome at the bar of history$c$, 'md',
 $c$Rome's deepest appeal is continuity: *semper eadem*, "always the same" — the claim to be the one unbroken church teaching what the apostles taught. It is the argument that draws thoughtful people in. But the dates tell a different story. The papacy's universal jurisdiction, papal infallibility (defined 1870), transubstantiation (1215), the treasury of merit, the bodily Assumption of Mary (1950), her Immaculate Conception (1854) — these were *defined as dogma* centuries, even a millennium and a half, after the apostles. The early church fathers are not silent witnesses to them; in many cases they teach otherwise. Rome's own theory of "development of doctrine" quietly concedes the point: the seed may be claimed, but the tree is late. So when continuity is the argument, ask the historical question plainly: *can you show this from the first three centuries?* Honest history is not Rome's friend here — it is yours.$c$)),

('b5000000-0000-0000-0000-000000000015', 'b4000000-0000-0000-0000-000000000001', 150, 'prose',
 jsonb_build_object('heading', 'The Marian dogmas', 'md',
 $c$Honor Mary — Scripture calls her blessed among women, and she is the model of faithful surrender. But Rome has, over centuries, defined four Marian dogmas that go far beyond Scripture: her divine motherhood, her perpetual virginity, her **Immaculate Conception** (1854 — that Mary herself was conceived without original sin), and her bodily Assumption (1950). Popular devotion presses further still, calling her Co-Redemptrix and Mediatrix of all graces. Two cautions for the conversation. First, *know what you are critiquing* — many Protestants attack a caricature and lose all credibility. Second, go to Mary's own words: she rejoiced in "God my Savior" (Luke 1:47) — and only a sinner needs a Savior. The honest, humble Mary of the Gospels is the best answer to the exalted Mary of later dogma.$c$,
 'terms', jsonb_build_array('Immaculate Conception'))),

('b5000000-0000-0000-0000-000000000021', 'b4000000-0000-0000-0000-000000000001', 155, 'prose',
 jsonb_build_object('heading', $c$Did Vatican II change Rome?$c$, 'md',
 $c$Many assume the Second Vatican Council (1962–65) softened or reversed the old disputes. It changed the *tone* remarkably: Protestants became "separated brethren" rather than heretics, the Mass turned toward the people in the vernacular, Scripture was commended to laypeople. These are real and welcome shifts in posture. But on doctrine, Vatican II explicitly reaffirmed Trent, not repealed it — and after the council Rome went on to publish the 1994 Catechism, which restates purgatory, indulgences, the sacrificial Mass, merit, and the Marian dogmas in full. The anathemas of Trent still stand. So when a friend says "Rome has changed," answer with precision and grace: the welcome is warmer, and that is good — but the gospel questions are exactly where they were. A kinder doorkeeper is not the same as an open door.$c$)),

('b5000000-0000-0000-0000-000000000016', 'b4000000-0000-0000-0000-000000000001', 160, 'objection',
 jsonb_build_object('heading', 'What Catholics actually say', 'md',
 $c$Train against the strongest forms, not strawmen. **"Scripture itself came out of the Church and her Tradition — even Paul says 'hold to the traditions' (2 Thess 2:15)."** (True that Paul commends apostolic tradition — but that tradition *is* the apostles' teaching, now inscripturated; the question is whether *later* tradition may add binding revelation, and Scripture nowhere grants that.) **"James says faith without works is dead (Jas 2:24) — so it cannot be faith alone."** (James and Paul use 'justify' differently: Paul means how we are declared righteous before God; James means how faith is *shown* to be genuine before men. A living faith works — that is exactly the Reformation's point; the works prove the faith, they don't purchase the verdict.) **"Jesus said 'eat my flesh' (John 6) — so the Mass is biblical."** (In the same chapter Jesus says 'the words I have spoken to you are spirit and life,' and 'whoever *believes* has eternal life' — the eating is believing.) **"We don't worship Mary; we honor her."** (Take that at face value and engage the *dogmas*, not the devotion — the 1854 and 1950 definitions are the real issue, not whether a given Catholic 'worships' her.)$c$)),

('b5000000-0000-0000-0000-000000000017', 'b4000000-0000-0000-0000-000000000001', 170, 'prose',
 jsonb_build_object('heading', 'Response formulas — the one question', 'md',
 $c$Answer in sentences, not lectures, and keep returning to one question. **(a)** "We share the creeds — Trinity, the deity of Christ, the resurrection. The question is the gospel: how is a sinner made right with God?" **(b)** "Is the work of Christ finished, or not? Hebrews says he offered himself once and sat down." **(c)** "I'm not asking whether good works matter — they do. I'm asking whether they're the *root* of your standing or its *fruit*." **(d)** "On what authority must I believe what Scripture doesn't teach?" **(e)** "Can you know, today, that you stand righteous before God — or only hope to, after purgatory?" That last question often does more than any argument, because it goes straight to whether the cross was enough.$c$)),

('b5000000-0000-0000-0000-000000000018', 'b4000000-0000-0000-0000-000000000001', 180, 'prose',
 jsonb_build_object('heading', 'Why this matters — and how to love', 'md',
 $c$This is not about winning a neighbor or scoring against a tradition. It is about assurance. A system that makes justification a process you cooperate with, that can be lost and must be topped up through sacraments and perhaps purgatory, cannot offer what the gospel offers: *"there is therefore now no condemnation for those who are in Christ Jesus"* (Rom 8:1) — now, not someday. Your Catholic friend may have more reverence, more discipline, more church history than you. Honor it. Then offer the one thing the system withholds: a finished righteousness, received by faith, that lets a sinner stand before God unafraid. Speak it the way Luther came to know it — as a prisoner who found the door open.$c$)),

('b5000000-0000-0000-0000-000000000019', 'b4000000-0000-0000-0000-000000000001', 190, 'model_answer',
 jsonb_build_object(
   'points', jsonb_build_array(
     'We share the ecumenical creeds — Trinity, deity of Christ, resurrection. Say so plainly.',
     'Two real divisions: authority (sola scriptura vs. Scripture + Tradition + Magisterium) and justification (sola fide / imputed vs. infused + cooperated).',
     'The Mass re-presents the sacrifice; Hebrews says Christ offered himself once for all and sat down — finished.',
     'Purgatory, indulgences, the treasury of merit all assume an unpaid debt the cross left behind.',
     'The four Marian dogmas (esp. Immaculate Conception 1854, Assumption 1950) go beyond Scripture; Mary called God her Savior.',
     'Rome''s claim of unbroken continuity fails the historical test — key dogmas were defined centuries later.',
     'Vatican II changed the tone, not the doctrine; Trent''s anathemas still stand and the 1994 Catechism restates them.',
     'Trent anathematized sola fide by name (Canons on Justification) and has never revoked it.',
     'The one question: is the work of Christ finished? Can you stand righteous before God today, by faith, on his merit alone?'
   ),
   'notes', 'Engage with charity — Catholics are neighbors to win, not enemies to defeat. Grant shared creeds, define terms (grace, faith, justification, tradition differ), critique the actual dogmas not caricatures, and aim every line at assurance in the finished work of Christ and the gospel of grace.'))

on conflict (id) do update set sort = excluded.sort, type = excluded.type, content = excluded.content;

-- ----------------------------------------------------------------------------
-- Citations (each source tied to the block it most supports)
-- ----------------------------------------------------------------------------
insert into public.citations (id, source_id, lesson_block_id, locator, is_excerpt) values
  ('bc000000-0000-0000-0000-000000000001', 'b6000000-0000-0000-0000-000000000002', 'b5000000-0000-0000-0000-000000000010', 'Sixth Session, Canons on Justification (summarized)', false),
  ('bc000000-0000-0000-0000-000000000002', 'b6000000-0000-0000-0000-000000000001', 'b5000000-0000-0000-0000-000000000013', 'Theses 27, 32 (summarized)', false),
  ('bc000000-0000-0000-0000-000000000003', 'b6000000-0000-0000-0000-000000000003', 'b5000000-0000-0000-0000-000000000015', 'paras. 491, 966 (summarized)', false),
  ('bc000000-0000-0000-0000-000000000004', 'b6000000-0000-0000-0000-000000000004', 'b5000000-0000-0000-0000-000000000017', 'Melo notes', false),
  ('bc000000-0000-0000-0000-000000000010', 'b6000000-0000-0000-0000-000000000010', 'b5000000-0000-0000-0000-000000000003', 'broad assessment of RC doctrine (summarized)', false),
  ('bc000000-0000-0000-0000-000000000011', 'b6000000-0000-0000-0000-000000000011', 'b5000000-0000-0000-0000-000000000014', 'on the papacy and authority (summarized)', false),
  ('bc000000-0000-0000-0000-000000000012', 'b6000000-0000-0000-0000-000000000012', 'b5000000-0000-0000-0000-000000000010', 'examination of Trent on justification (summarized)', false),
  ('bc000000-0000-0000-0000-000000000013', 'b6000000-0000-0000-0000-000000000013', 'b5000000-0000-0000-0000-000000000020', 'on the early fathers and later dogma (summarized)', false),
  ('bc000000-0000-0000-0000-000000000014', 'b6000000-0000-0000-0000-000000000014', 'b5000000-0000-0000-0000-000000000007', 'comparing Rome and Scripture on the gospel (summarized)', false),
  ('bc000000-0000-0000-0000-000000000015', 'b6000000-0000-0000-0000-000000000015', 'b5000000-0000-0000-0000-000000000005', 'sola vs. solo scriptura (summarized)', false),
  ('bc000000-0000-0000-0000-000000000016', 'b6000000-0000-0000-0000-000000000016', 'b5000000-0000-0000-0000-000000000020', 'on historical continuity and development (summarized)', false),
  ('bc000000-0000-0000-0000-000000000017', 'b6000000-0000-0000-0000-000000000017', 'b5000000-0000-0000-0000-000000000021', 'agreements and differences after Vatican II (summarized)', false),
  ('bc000000-0000-0000-0000-000000000018', 'b6000000-0000-0000-0000-000000000018', 'b5000000-0000-0000-0000-000000000011', 'on the sacramental system and the gospel (summarized)', false),
  ('bc000000-0000-0000-0000-000000000019', 'b6000000-0000-0000-0000-000000000019', 'b5000000-0000-0000-0000-000000000021', 'evangelical assessment of Vatican II (summarized)', false)
on conflict (id) do update set source_id = excluded.source_id, lesson_block_id = excluded.lesson_block_id, locator = excluded.locator;

-- ----------------------------------------------------------------------------
-- Checkpoint quiz (id matches the app's CHECKPOINT_QUIZ_ID)
-- ----------------------------------------------------------------------------
insert into public.quizzes (id, kind, lesson_id, config) values
  ('70000000-0000-0000-0000-000000000002', 'checkpoint', 'b4000000-0000-0000-0000-000000000001',
   '{"pass_threshold": 0.7, "xp_first_pass": 25}'::jsonb)
on conflict (id) do nothing;

insert into public.question_bank (id, quiz_id, type, prompt, options, answer, source_block_id, sort) values
  ('b7100000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000002', 'mc',
   'The two questions the Reformation actually divided over were…',
   '["Statues and saints", "Authority (Scripture alone vs. Scripture + Tradition + Magisterium) and justification (faith alone vs. faith + works)", "Which day to worship", "The color of vestments"]'::jsonb,
   '{"correct": 1}'::jsonb, 'b5000000-0000-0000-0000-000000000003', 1),
  ('b7100000-0000-0000-0000-000000000002', '70000000-0000-0000-0000-000000000002', 'tfq',
   '"Roman Catholics deny the Trinity and the deity of Christ."',
   '["true", "false", "needs_qualification"]'::jsonb,
   '{"correct": "false", "note": "Catholics confess the Trinity, the deity of Christ, and the bodily resurrection. The division is over authority and justification, not the creeds."}'::jsonb,
   'b5000000-0000-0000-0000-000000000002', 2),
  ('b7100000-0000-0000-0000-000000000003', '70000000-0000-0000-0000-000000000002', 'mc',
   'Sola scriptura is best stated as…',
   '["The Bible is the only book Christians may read", "Scripture is the final, sufficient, infallible authority by which all tradition and teaching is tested", "Tradition and Scripture are equal authorities", "Each person decides truth for themselves"]'::jsonb,
   '{"correct": 1}'::jsonb, 'b5000000-0000-0000-0000-000000000005', 3),
  ('b7100000-0000-0000-0000-000000000004', '70000000-0000-0000-0000-000000000002', 'mc',
   'The difference between imputed and infused righteousness is…',
   '["There is no difference", "Imputed = Christ''s righteousness credited to you (declared righteous at once); infused = righteousness poured in and cooperated with over time", "Infused is the Protestant view", "Imputed means earned by works"]'::jsonb,
   '{"correct": 1}'::jsonb, 'b5000000-0000-0000-0000-000000000007', 4),
  ('b7100000-0000-0000-0000-000000000005', '70000000-0000-0000-0000-000000000002', 'tfq',
   '"The Council of Trent formally condemned the doctrine of justification by faith alone."',
   '["true", "false", "needs_qualification"]'::jsonb,
   '{"correct": "true", "note": "Trent''s Canons on Justification pronounce anathema on sola fide by name, and have never been revoked."}'::jsonb,
   'b5000000-0000-0000-0000-000000000010', 5),
  ('b7100000-0000-0000-0000-000000000006', '70000000-0000-0000-0000-000000000002', 'mc',
   'Which passage most directly answers the Mass as a re-presented sacrifice?',
   '["John 3:16", "Hebrews 10:11-14 — a single offering, and he sat down", "Genesis 1:1", "Psalm 23"]'::jsonb,
   '{"correct": 1}'::jsonb, 'b5000000-0000-0000-0000-000000000012', 6),
  ('b7100000-0000-0000-0000-000000000007', '70000000-0000-0000-0000-000000000002', 'cloze',
   'Hebrews stresses that Christ offered himself ____ for all, then sat down — the posture of finished work.',
   null, '{"accepted": ["once"]}'::jsonb, 'b5000000-0000-0000-0000-000000000011', 7),
  ('b7100000-0000-0000-0000-000000000008', '70000000-0000-0000-0000-000000000002', 'mc',
   'What sparked Luther''s 95 Theses in 1517?',
   '["The invention of the printing press", "The sale of indulgences (to fund St. Peter''s Basilica)", "A dispute over the date of Easter", "The translation of the Bible into German"]'::jsonb,
   '{"correct": 1}'::jsonb, 'b5000000-0000-0000-0000-000000000013', 8),
  ('b7100000-0000-0000-0000-000000000009', '70000000-0000-0000-0000-000000000002', 'mc',
   'Purgatory is theologically problematic because it assumes…',
   '["Heaven is real", "There is a debt for sin still to be paid after death, which the cross did not fully cover", "Prayer is good", "Christians should live holy lives"]'::jsonb,
   '{"correct": 1}'::jsonb, 'b5000000-0000-0000-0000-000000000013', 9),
  ('b7100000-0000-0000-0000-000000000010', '70000000-0000-0000-0000-000000000002', 'tfq',
   '"The Immaculate Conception refers to the virgin birth of Jesus."',
   '["true", "false", "needs_qualification"]'::jsonb,
   '{"correct": "false", "note": "It is the 1854 dogma that MARY was conceived without original sin — not the conception of Jesus. Confusing the two will cost you credibility."}'::jsonb,
   'b5000000-0000-0000-0000-000000000015', 10),
  ('b7100000-0000-0000-0000-000000000011', '70000000-0000-0000-0000-000000000002', 'mc',
   'A Catholic cites James 2:24 ("not by faith alone"). The best response is that James and Paul…',
   '["contradict each other", "use ''justify'' differently — Paul means how we are declared righteous before God; James means how faith is shown genuine before men", "are both wrong", "were written by the same person"]'::jsonb,
   '{"correct": 1}'::jsonb, 'b5000000-0000-0000-0000-000000000016', 11),
  ('b7100000-0000-0000-0000-000000000012', '70000000-0000-0000-0000-000000000002', 'mc',
   'In Matthew 16:18, the strongest Protestant reading is that the "rock" is…',
   '["Peter as the first infallible pope", "Peter''s confession of Christ as the Son of God, with Christ himself the cornerstone", "the city of Rome", "the church''s buildings"]'::jsonb,
   '{"correct": 1}'::jsonb, 'b5000000-0000-0000-0000-000000000014', 12),
  ('b7100000-0000-0000-0000-000000000013', '70000000-0000-0000-0000-000000000002', 'tfq',
   '"Vatican II repealed the Council of Trent''s condemnations of Reformation teaching."',
   '["true", "false", "needs_qualification"]'::jsonb,
   '{"correct": "false", "note": "Vatican II warmed the tone (\"separated brethren\") but reaffirmed Trent; the 1994 Catechism restates the same doctrines and the anathemas still stand."}'::jsonb,
   'b5000000-0000-0000-0000-000000000021', 13),
  ('b7100000-0000-0000-0000-000000000014', '70000000-0000-0000-0000-000000000002', 'cloze',
   'The single question to keep returning to: is the work of Christ ____?',
   null, '{"accepted": ["finished", "complete", "done"]}'::jsonb, 'b5000000-0000-0000-0000-000000000017', 14),
  ('b7100000-0000-0000-0000-000000000015', '70000000-0000-0000-0000-000000000002', 'mc',
   'Rome''s claim to unbroken historical continuity ("always the same") is weakest because…',
   '["the early church wrote nothing down", "many of its defining dogmas (papal infallibility 1870, Immaculate Conception 1854, the Assumption 1950) were defined many centuries after the apostles", "Protestants reject all church history", "the fathers never discussed doctrine"]'::jsonb,
   '{"correct": 1}'::jsonb, 'b5000000-0000-0000-0000-000000000020', 15)
on conflict (id) do update set prompt = excluded.prompt, options = excluded.options, answer = excluded.answer, source_block_id = excluded.source_block_id, sort = excluded.sort;

-- ----------------------------------------------------------------------------
-- Flashcard deck (seeded into the review queue on lesson completion)
-- ----------------------------------------------------------------------------
insert into public.decks (id, title, scope, level_id) values
  ('b8000000-0000-0000-0000-000000000001', 'Roman Catholicism Beginner Core', 'core', 'b2000000-0000-0000-0000-000000000101')
on conflict (id) do nothing;

insert into public.cards (id, deck_id, type, front, back, skeleton) values
  ('b8100000-0000-0000-0000-000000000001', 'b8000000-0000-0000-0000-000000000001', 'scripture',
   '{"reference": "Hebrews 10:11-14"}'::jsonb, '{}'::jsonb, null),
  ('b8100000-0000-0000-0000-000000000002', 'b8000000-0000-0000-0000-000000000001', 'scripture',
   '{"reference": "Romans 3:28"}'::jsonb, '{}'::jsonb, null),
  ('b8100000-0000-0000-0000-000000000003', 'b8000000-0000-0000-0000-000000000001', 'scripture',
   '{"reference": "Ephesians 2:8-9"}'::jsonb, '{}'::jsonb, null),
  ('b8100000-0000-0000-0000-000000000004', 'b8000000-0000-0000-0000-000000000001', 'term',
   '{"term": "sola fide"}'::jsonb, '{"definition": "A sinner is justified by faith alone, apart from works — Christ''s righteousness credited, received by faith."}'::jsonb, null),
  ('b8100000-0000-0000-0000-000000000005', 'b8000000-0000-0000-0000-000000000001', 'term',
   '{"term": "sola scriptura"}'::jsonb, '{"definition": "Scripture alone is the final, sufficient, infallible authority by which all tradition and teaching is tested."}'::jsonb, null),
  ('b8100000-0000-0000-0000-000000000006', 'b8000000-0000-0000-0000-000000000001', 'term',
   '{"term": "justification (imputed vs. infused)"}'::jsonb, '{"definition": "Imputed: Christ''s righteousness credited, declared righteous at once. Infused: righteousness poured in and cooperated with over time (Rome)."}'::jsonb, null),
  ('b8100000-0000-0000-0000-000000000007', 'b8000000-0000-0000-0000-000000000001', 'term',
   '{"term": "transubstantiation"}'::jsonb, '{"definition": "Rome''s teaching that the bread and wine become the actual body and blood of Christ; the Mass re-presents Calvary."}'::jsonb, null),
  ('b8100000-0000-0000-0000-000000000008', 'b8000000-0000-0000-0000-000000000001', 'argument',
   '{"prompt": "State the one question to keep returning to with a Catholic friend, and the verse behind it."}'::jsonb, '{}'::jsonb,
   '{"points": ["Is the work of Christ finished?", "Hebrews 10: he offered himself once for all", "and then sat down — finished work", "Can you stand righteous before God today, by faith, on his merit alone?"]}'::jsonb)
on conflict (id) do nothing;

commit;
