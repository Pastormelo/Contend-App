/**
 * Public-site editorial content: the training catalog with a preview
 * article per subject. Display copy only — course data lives in the DB.
 */

export type SubjectPreview = {
  slug: string;
  title: string;
  kind: "doctrine" | "engagement";
  status: "live" | "coming";
  tagline: string;
  /** Preview article paragraphs (plain text with **bold** / *italic*) */
  article: string[];
  /** "By the end you will be able to…" */
  equipped: string[];
  /** Things to look out for in real conversations */
  watchFor: string[];
};

export const SUBJECTS: SubjectPreview[] = [
  {
    slug: "trinity",
    title: "The Trinity",
    kind: "doctrine",
    status: "live",
    tagline: "One God, three persons — said clearly, defended biblically.",
    article: [
      "Ask ten Christians to explain the Trinity and most will reach for a prop: water, an egg, a clover. Every one of those props teaches a heresy the early church condemned by name — and the person at your door from the Kingdom Hall knows it, even if the average believer doesn't. The doctrine most central to the Christian confession is also the one most Christians are least equipped to state.",
      "It does not have to be that way, because the doctrine itself is not complicated to state. Scripture makes three kinds of claims at once: there is exactly one God; the Father, the Son, and the Holy Spirit are each fully God; and the three are distinct persons who know and love one another. Held together, those claims yield one sentence: one God eternally existing in three persons. One *what*, three *whos*. That sentence is not a contradiction — and you can show why in under a minute, from the Bible, without a single prop.",
      "This course trains that sentence into you: the verses that carry each claim, the two errors to disqualify on the spot, the math objection answered, the history of Nicaea told straight, and the six-line formulation drilled until you can recite it under pressure.",
    ],
    equipped: [
      "State the Trinity in one sentence and defend it from Scripture, from memory",
      "Disqualify modalism and tritheism the moment a conversation drifts toward them",
      "Answer “isn't that three gods?”, “1+1+1=3”, and “the word isn't in the Bible”",
      "Tell the real story of Nicaea when someone says Constantine invented it",
    ],
    watchFor: [
      "Analogies that feel helpful but teach heresy — water/ice/steam is modalism in disguise",
      "The bait of defending what the doctrine never claimed (three gods, one person in masks)",
      "Verses about Jesus' humanity (he prayed, he grew, he didn't know the hour) used as if they cancel his deity",
    ],
  },
  {
    slug: "jehovahs-witnesses",
    title: "Jehovah's Witnesses",
    kind: "engagement",
    status: "coming",
    tagline: "The visitors at your door have trained for you. Train for them.",
    article: [
      "No one who knocks on your door is better prepared than a Jehovah's Witness. They rehearse the conversation before they ring the bell. They know which verses you'll reach for, and they have an answer ready for each one. The average Christian, meeting the average Witness, loses the exchange — graciously, politely, and completely.",
      "The Watchtower's case stands on a handful of load-bearing claims: that Jesus is “a god” (their John 1:1), God's first creation (their Colossians 1), the archangel Michael; that the Trinity is pagan; that only their organization speaks for Jehovah. Every one of those claims has a clear, documented answer — but you have to know it cold, because the conversation moves fast and they control its script until you can interrupt it with something they haven't rehearsed.",
      "This course builds on the Trinity course (that's deliberate — their entire system is an answer to it) and trains you to engage a Witness with both precision and genuine love: these are sincere, image-of-God-bearing people inside a system that controls what they may read and whom they may talk to. The goal is never to win the porch. It is to plant the question the Watchtower cannot answer.",
    ],
    equipped: [
      "Answer the New World Translation's renderings of John 1:1 and Colossians 1 specifically",
      "Show from their own Bible that Jesus receives worship and bears Jehovah's titles",
      "Engage the organization question — “who speaks for God?” — without hostility",
      "Keep a doorstep conversation warm, honest, and pointed toward the gospel",
    ],
    watchFor: [
      "Proof-text ping-pong — they are trained to keep you moving so nothing lands",
      "The redefined vocabulary: “god”, “firstborn”, “worship” do not mean what you mean",
      "Pressure to argue about 1914 or blood transfusions before the deity of Christ is settled",
    ],
  },
  {
    slug: "deity-of-christ",
    title: "The Deity of Christ",
    kind: "doctrine",
    status: "coming",
    tagline: "Was Jesus God, or did the church promote him?",
    article: [
      "“Jesus never claimed to be God.” You will hear it from skeptics, from Muslims, from Witnesses, from a popular professor on a documentary — delivered as if it were the assured result of scholarship. It is the single most repeated claim against Christianity, and it is false in a way that is demonstrable from the first-century evidence.",
      "Jesus forgave sins only God can forgive, claimed the divine name in front of men holding stones (John 8:58 — and they understood him perfectly), accepted worship that angels refuse, and called himself the Son of Man who would judge the nations from God's own throne. The earliest Christians — Jews, fierce monotheists — prayed to him, sang hymns to him, and died rather than say “Caesar is Lord” instead. None of that waited for a fourth-century council.",
      "This course walks the evidence in order: what Jesus claimed, what his enemies heard him claiming, what the first generation of his followers did about it, and how to answer the “legend grew over time” theory with the documents themselves.",
    ],
    equipped: [
      "Show that Jesus claimed deity — and that his hearers understood the claim",
      "Trace worship of Jesus to the earliest, eyewitness-era documents",
      "Answer “the divinity of Jesus was voted in at Nicaea” with the actual timeline",
      "Use the Old Testament titles Jesus took for himself (Son of Man, First and Last)",
    ],
    watchFor: [
      "The demand for the exact sentence “I am God” — a standard no ancient text would meet",
      "Sliding definitions of “divine” that let skeptics concede everything and admit nothing",
      "Mark 13:32 and John 14:28 used without the two-natures distinction",
    ],
  },
  {
    slug: "existence-of-god",
    title: "The Existence of God",
    kind: "doctrine",
    status: "coming",
    tagline: "Reasoning from the world to its Maker — without losing the room.",
    article: [
      "Most conversations about God's existence are lost at the framing stage. The skeptic says “there's no evidence,” the Christian hears “I haven't seen a miracle,” and two people talk past each other until someone changes the subject. The first skill is not an argument — it is knowing what kind of evidence a Creator would leave, and pointing calmly at it.",
      "The classical arguments are stronger than their reputation. Why is there something rather than nothing — and why does the universe look like it began? Why is nature written in mathematics that minds can read? Why do the physical constants sit on a razor's edge that permits life? Why does every culture in history wake up already believing that some things are really wrong — not just unfashionable? None of these is a knock-down proof. Together they form a cumulative case that atheism must explain away one piece at a time.",
      "This course trains the three arguments you can actually deploy in a lunchroom — cosmological, fine-tuning, moral — in plain English, plus the honest handling of the strongest objection (suffering) without a script and without panic.",
    ],
    equipped: [
      "Give the cosmological, fine-tuning, and moral arguments in under two minutes each",
      "Reframe “no evidence” conversations toward what evidence would even look like",
      "Engage the problem of evil with honesty instead of a canned answer",
      "Know where argument ends and testimony begins — and use both",
    ],
    watchFor: [
      "“Who made God?” — a category error you should be able to name gently",
      "Winning the argument and losing the person; these arguments open doors, they don't save",
      "Science-of-the-gaps framing — the case is from what we know, not what we don't",
    ],
  },
  {
    slug: "scripture-reliability",
    title: "The Reliability of Scripture",
    kind: "doctrine",
    status: "coming",
    tagline: "Telephone game? Translation of a translation? Settle it with facts.",
    article: [
      "“The Bible has been copied and translated so many times that nobody knows what it originally said.” This objection is repeated so often that most people — including many Christians — assume it must be true. It is precisely backwards. The New Testament is the best-attested document of the ancient world, and it is not close: thousands of Greek manuscripts, some within a lifetime of the events, against a few dozen copies (centuries removed) for the classical works no one doubts.",
      "Textual criticism is not a threat to be feared; it is the discipline that lets us say, with documented confidence, what the apostles wrote. The variants the internet loves to cite are overwhelmingly spelling slips and word-order differences — fully catalogued, openly published, affecting no doctrine. The Christian has nothing to hide here, and the person who raises the objection has usually never met the evidence.",
      "This course trains the manuscript case, the canon question (who decided what's in the Bible, and when?), the archaeology that keeps confirming the setting, and the honest handling of hard passages — so that “you can't trust the Bible” becomes the easiest objection you ever answer.",
    ],
    equipped: [
      "Make the manuscript case with the actual numbers and dates",
      "Answer “the church picked the books centuries later” with the real canon history",
      "Explain what textual variants are — and why they don't threaten any doctrine",
      "Handle “the Gospels contradict each other” with the standards of ancient biography",
    ],
    watchFor: [
      "The “translation of a translation” myth — modern Bibles translate the Greek and Hebrew directly",
      "Bart Ehrman quotes used without the concessions he makes in his own footnotes",
      "Defending more than the argument needs — reliability first, inerrancy is a later conversation",
    ],
  },
  {
    slug: "resurrection",
    title: "The Resurrection",
    kind: "doctrine",
    status: "coming",
    tagline: "The claim everything else stands on — argued from facts critics concede.",
    article: [
      "Paul staked the entire faith on one event: “if Christ has not been raised, your faith is futile” (1 Cor 15:17). That is either reckless — or it is the confidence of a man who knew the tomb was empty. Christianity is the only major religion whose central claim is a public, falsifiable event in datable history. That makes it vulnerable. It also makes it defensible.",
      "The modern case doesn't ask a skeptic to assume the Bible is inspired. It argues from facts the majority of critical scholars — including non-Christians — concede: Jesus died by crucifixion; his followers had experiences they believed were the risen Jesus; their lives transformed overnight from hiding to martyrdom; the church's fiercest enemy, Paul, converted on the same claim; and the proclamation began in Jerusalem, the one city where a body could have ended it. The question is not whether those facts exist but which explanation carries them.",
      "This course trains the minimal-facts case, the early creed of 1 Corinthians 15 (datable to within a few years of the cross), and the honest weighing of every naturalistic alternative — hallucination, theft, wrong tomb, legend — against the data each one fails to explain.",
    ],
    equipped: [
      "Argue the resurrection from facts critical scholars grant",
      "Date the 1 Corinthians 15 creed and explain why it kills the legend theory",
      "Walk each naturalistic explanation into the fact it cannot carry",
      "Connect the historical case to the gospel — the point was never just to win",
    ],
    watchFor: [
      "“Extraordinary claims require extraordinary evidence” — unpack it before you answer it",
      "Letting the conversation drift to inerrancy when the argument only needs five facts",
      "Treating the resurrection as a debate topic instead of the hinge of someone's eternity",
    ],
  },
  {
    slug: "islam",
    title: "Engaging Islam",
    kind: "engagement",
    status: "coming",
    tagline: "1.9 billion neighbors, one decisive question: who is Jesus?",
    article: [
      "Islam honors Jesus as a prophet, born of a virgin, sinless, the Messiah — and denies the one thing he came to do. The Quran says he was not crucified (Surah 4:157), one verse against the unanimous testimony of history, including non-Christian historians. Most Christians know none of this, and so most conversations with Muslim neighbors never get past mutual politeness or mutual suspicion.",
      "A faithful conversation with a Muslim friend runs on two rails. The first is genuine respect: Muslims are serious about God in a way the secular West has forgotten, and cheap gotchas dishonor both them and Christ. The second is precision about where the faiths actually divide: not “do you believe in one God?” but “what has the one God said, and what did he do about sin?” The Trinity, the crucifixion, the reliability of the previous Scriptures the Quran itself tells Muslims to honor — these are the load-bearing walls.",
      "This course trains the real points of divergence, the standard objections (the Bible is corrupted; Trinity is shirk; Jesus never said “I am God”), and the questions that open doors instead of closing them — for a friendship measured in years, not a debate measured in minutes.",
    ],
    equipped: [
      "Explain the Trinity to a Muslim without triggering the tritheism alarm",
      "Make the historical case for the crucifixion against Surah 4:157",
      "Answer “the Bible has been corrupted” using the Quran's own claims about it",
      "Build long-game friendships — hospitality as apologetic",
    ],
    watchFor: [
      "Treating a neighbor as a debate opponent — most Muslims have never been loved by a Christian",
      "The corruption claim's hidden problem: it indicts the Quran's own statements",
      "Arguing Muhammad before Jesus — keep the conversation on the person of Christ",
    ],
  },
  {
    slug: "mormonism",
    title: "Engaging Mormonism",
    kind: "engagement",
    status: "coming",
    tagline: "Same words, different dictionary — learn to translate before you testify.",
    article: [
      "A conversation with Latter-day Saint missionaries feels encouraging right up until you realize you've agreed about nothing. God, Jesus, gospel, salvation, heaven — every word is shared; almost none of the definitions are. In LDS theology, God the Father is an exalted man; Jesus is the firstborn spirit child (brother of Lucifer); and the gospel is a path of ordinances toward exaltation. Two missionaries can affirm “salvation by grace” while meaning something Paul anathematized.",
      "The honest engagement begins with the dictionary problem, runs through the restoration claim (was the church really lost for seventeen centuries — and what does that do to Jesus' promise in Matthew 16:18?), and arrives at the testimony question: Mormonism finally rests not on evidence but on a feeling — the “burning in the bosom” — that you are asked to treat as self-authenticating.",
      "This course trains the definitional clarity, the history (plural first-vision accounts, the Book of Abraham papyri), and above all the gracious posture: the two young men at your door are likely on the hardest two years of their lives, far from home, and starving for someone who is kind, unafraid, and actually knows the gospel of grace.",
    ],
    equipped: [
      "Surface the redefinitions — make both dictionaries explicit before debating",
      "Present grace versus exaltation from Paul, clearly and warmly",
      "Engage the restoration claim and the missing seventeen centuries",
      "Answer “pray about the Book of Mormon” with how Scripture tests claims",
    ],
    watchFor: [
      "Apparent agreement — shared vocabulary is the engagement's central trap",
      "Leading with polygamy or temple garments; the heart of it is who God is",
      "Underestimating their sincerity — and overestimating their exposure to grace",
    ],
  },
  {
    slug: "hebrew-israelites",
    title: "Engaging Hebrew Israelitism",
    kind: "engagement",
    status: "coming",
    tagline: "Identity, Scripture, and the gospel — engaging a fast-growing street theology.",
    article: [
      "Hebrew Israelitism — the claim that Black Americans (and in some camps other specific peoples) are the true biological Israelites, and that this identity is the key to salvation — is one of the fastest-growing street theologies in America, and most pastors have never prepared anyone to answer it. Its appeal is real: it offers history, identity, and dignity to people the church has often failed. Take that seriously before you take the doctrine apart.",
      "The system runs on a chain of claims: Deuteronomy 28's curses as a racial prophecy of the Atlantic slave trade, the “so-called Negro” as hidden Israel, salvation tied to bloodline and law-keeping rather than to faith in the Messiah. Each link can be tested against the text — Deuteronomy 28 addressed covenant Israel with covenant curses Israel's own history fulfilled; the New Testament settles who is a child of Abraham (Galatians 3); and the gospel ties salvation to faith in Christ, for every nation, explicitly not to genealogy.",
      "This course trains the biblical theology of Israel and the church, the specific camp teachings (they vary — 1West differs sharply from more moderate camps), and how to engage with both spine and compassion, because the man on the corner with a megaphone is usually angrier at the church's failures than at Christ.",
    ],
    equipped: [
      "Walk Deuteronomy 28 in context and answer the slave-trade prophecy claim",
      "Show from Galatians and Romans who the heirs of Abraham are",
      "Distinguish the camps and their claims instead of strawmanning",
      "Engage identity pain honestly while keeping salvation by faith central",
    ],
    watchFor: [
      "Street-corner ambush formats designed to humiliate, not discuss — know when to disengage",
      "Real historical grievances dismissed instead of acknowledged",
      "Verse-chain proof-texting that moves faster than any one text can be examined",
    ],
  },
];

export function getSubject(slug: string): SubjectPreview | undefined {
  return SUBJECTS.find((s) => s.slug === slug);
}
