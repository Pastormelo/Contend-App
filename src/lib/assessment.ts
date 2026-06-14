/**
 * Placement assessment — SERVER ONLY. Imported only by the assessment route
 * handler so the correct answers never reach the client bundle. The client
 * receives sanitized questions (prompt + options) over the API and submits
 * answer indices back for grading.
 */
import { course, type CourseSlug } from "@/lib/courses";

export type Domain =
  | "existence"
  | "scripture"
  | "trinity"
  | "christ"
  | "engage";

export interface AssessmentQuestion {
  id: string;
  domain: Domain;
  /** 1 = warm-up, 2 = standard, 3 = sharp */
  weight: 1 | 2 | 3;
  prompt: string;
  options: string[];
  correct: number;
}

export const QUESTIONS: AssessmentQuestion[] = [
  // --- Existence of God ---
  {
    id: "ex1", domain: "existence", weight: 1,
    prompt: "A coworker says, “There's no evidence for God.” The most useful first move is to:",
    options: [
      "Quote a Bible verse about unbelief",
      "Ask what kind of evidence they would expect a Creator to leave, and why",
      "Tell them they need more faith",
      "Change the subject to avoid conflict",
    ],
    correct: 1,
  },
  {
    id: "ex2", domain: "existence", weight: 3,
    prompt: "The fine-tuning argument is strongest when it argues that:",
    options: [
      "Science can't explain anything, so God did it",
      "The universe is beautiful, so a beautiful Being made it",
      "The life-permitting range of physical constants is vanishingly narrow, which is better explained by design than by chance or necessity",
      "Evolution is false",
    ],
    correct: 2,
  },
  // --- Reliability of Scripture ---
  {
    id: "sc1", domain: "scripture", weight: 1,
    prompt: "“The Bible is a translation of a translation of a translation.” The accurate response is:",
    options: [
      "True, which is why we can't be sure of much",
      "Modern Bibles are translated directly from Greek and Hebrew manuscripts, not from other translations",
      "Only the King James is reliable",
      "The originals are lost so it doesn't matter",
    ],
    correct: 1,
  },
  {
    id: "sc2", domain: "scripture", weight: 2,
    prompt: "Why is the sheer number of New Testament manuscripts apologetically significant?",
    options: [
      "More copies means the text was inspired",
      "It lets scholars cross-check and reconstruct the original wording with high confidence — far better attestation than any other ancient work",
      "It proves the miracles happened",
      "It shows the church was wealthy",
    ],
    correct: 1,
  },
  {
    id: "sc3", domain: "scripture", weight: 3,
    prompt: "A skeptic cites “hundreds of thousands of variants” in the manuscripts. The precise answer is that:",
    options: [
      "There are no variants; that's a lie",
      "The vast majority are spelling and word-order differences; the meaningful, viable variants are few and affect no doctrine",
      "Variants prove the Bible was rewritten by the church",
      "We should stop using the New Testament",
    ],
    correct: 1,
  },
  // --- The Trinity ---
  {
    id: "tr1", domain: "trinity", weight: 1,
    prompt: "The Trinity is best stated as:",
    options: [
      "Three gods who act as one",
      "One God who appears in three forms at different times",
      "One God who eternally exists as three distinct persons",
      "One God and two lesser divine beings",
    ],
    correct: 2,
  },
  {
    id: "tr2", domain: "trinity", weight: 2,
    prompt: "Saying God is “one in being, three in person” avoids contradiction because:",
    options: [
      "It's a mystery we accept without reason",
      "Oneness and threeness are affirmed in different senses — one ‘what,' three ‘whos'",
      "Person and being mean the same thing",
      "We're really just adding three gods",
    ],
    correct: 1,
  },
  {
    id: "tr3", domain: "trinity", weight: 2,
    prompt: "The water/ice/steam analogy fails because it teaches:",
    options: [
      "Tritheism", "Modalism", "Arianism", "Partialism",
    ],
    correct: 1,
  },
  {
    id: "tr4", domain: "trinity", weight: 3,
    prompt: "Which best disqualifies modalism from a single scene?",
    options: [
      "Genesis 1, where God creates",
      "The baptism of Jesus, where Father, Son, and Spirit are all present at once",
      "John 1:1, where the Word is God",
      "Deuteronomy 6:4, the Shema",
    ],
    correct: 1,
  },
  // --- Deity of Christ ---
  {
    id: "ch1", domain: "christ", weight: 2,
    prompt: "“Jesus never claimed to be God.” The strongest counter is that:",
    options: [
      "He said it plainly in every chapter",
      "He did what only God does and accepted worship — and his hearers picked up stones, understanding the claim (e.g. John 8:58–59)",
      "Paul invented his divinity later",
      "The Council of Nicaea made him divine",
    ],
    correct: 1,
  },
  {
    id: "ch2", domain: "christ", weight: 3,
    prompt: "“If Jesus prayed to God, he can't be God.” The best response distinguishes:",
    options: [
      "That Jesus was only pretending to pray",
      "Persons from being — the Son (a person) praying to the Father (a person) is exactly what the Trinity predicts",
      "That Jesus lost his divinity on earth",
      "That prayer wasn't really prayer",
    ],
    correct: 1,
  },
  {
    id: "ch3", domain: "christ", weight: 3,
    prompt: "“How could Jesus not know the day of his return (Mark 13:32) if he's God?” This is best handled by:",
    options: [
      "Admitting Jesus wasn't fully God",
      "The two natures: the eternal Son took on a true human mind that grew and learned",
      "Saying the verse is a copyist's error",
      "Avoiding the question",
    ],
    correct: 1,
  },
  // --- Engagement readiness ---
  {
    id: "en1", domain: "engage", weight: 2,
    prompt: "The deepest divide between Roman Catholicism and the Reformation concerns:",
    options: [
      "Whether to use statues in worship",
      "The authority question (Scripture alone vs. Scripture + Tradition + Magisterium) and justification (faith alone vs. faith plus works)",
      "Which holidays to celebrate",
      "The style of church music",
    ],
    correct: 1,
  },
  {
    id: "en2", domain: "engage", weight: 3,
    prompt: "Engaging a Jehovah's Witness on John 1:1 requires knowing that:",
    options: [
      "Their Bible is identical to yours",
      "The New World Translation renders it “the Word was a god,” so the conversation turns on Greek grammar and context, not just citing the verse",
      "They don't read the Bible",
      "The verse isn't about Jesus",
    ],
    correct: 1,
  },
];

export interface PlacementResult {
  tier: string;
  tierBlurb: string;
  totalPct: number;
  domains: { domain: Domain; label: string; pct: number }[];
  startNow: { slug: CourseSlug; number: number; title: string };
  focus: { slug: CourseSlug; number: number; title: string };
  rationale: string;
}

const DOMAIN_LABEL: Record<Domain, string> = {
  existence: "Does God exist?",
  scripture: "Can we trust Scripture?",
  trinity: "The Trinity",
  christ: "The deity of Christ",
  engage: "Engaging other worldviews",
};

const DOMAIN_TO_COURSE: Record<Domain, CourseSlug> = {
  existence: "existence-of-god",
  scripture: "scripture-reliability",
  trinity: "trinity",
  christ: "deity-of-christ",
  engage: "roman-catholicism",
};

export function gradeAssessment(
  answers: Record<string, number>,
): PlacementResult {
  const byDomain = new Map<Domain, { got: number; max: number }>();
  let got = 0;
  let max = 0;

  for (const q of QUESTIONS) {
    const bucket = byDomain.get(q.domain) ?? { got: 0, max: 0 };
    bucket.max += q.weight;
    max += q.weight;
    if (answers[q.id] === q.correct) {
      bucket.got += q.weight;
      got += q.weight;
    }
    byDomain.set(q.domain, bucket);
  }

  const totalPct = max > 0 ? got / max : 0;

  const domains = (Object.keys(DOMAIN_LABEL) as Domain[]).map((d) => {
    const b = byDomain.get(d) ?? { got: 0, max: 1 };
    return { domain: d, label: DOMAIN_LABEL[d], pct: b.max > 0 ? b.got / b.max : 0 };
  });

  // Tier
  let tier = "New Recruit";
  let tierBlurb =
    "You're at the starting line — exactly where strong defenders begin. We'll build the foundation brick by brick.";
  if (totalPct >= 0.8) {
    tier = "Veteran";
    tierBlurb =
      "You already know the terrain. Your training is about precision and pressure-testing, not first exposure.";
  } else if (totalPct >= 0.6) {
    tier = "Journeyman";
    tierBlurb =
      "You've got real footing. A few gaps stand between you and holding your ground against a sharp interlocutor.";
  } else if (totalPct >= 0.35) {
    tier = "Apprentice";
    tierBlurb =
      "You know more than most pew-sitters. Now we turn scattered knowledge into answers you can give under pressure.";
  }

  // Growth edge = weakest domain (ties broken by path order)
  const ordered = [...domains].sort((a, b) => {
    if (a.pct !== b.pct) return a.pct - b.pct;
    const ca = course(DOMAIN_TO_COURSE[a.domain])?.number ?? 99;
    const cb = course(DOMAIN_TO_COURSE[b.domain])?.number ?? 99;
    return ca - cb;
  });
  const weakest = ordered[0];
  const focusNode = course(DOMAIN_TO_COURSE[weakest.domain])!;

  // Everyone new starts with the only open foundation: the Trinity.
  // Strong testers are pointed past it toward their first real engagement.
  const trinityNode = course("trinity")!;
  const trinityStrong =
    (byDomain.get("trinity")?.got ?? 0) / (byDomain.get("trinity")?.max ?? 1) >= 0.75;

  let startNode = trinityNode;
  let rationale: string;

  if (trinityStrong && totalPct >= 0.6) {
    startNode = trinityNode;
    rationale =
      `You clearly understand the Trinity already, so move briskly through Course 03 to clear its checkpoint — that unlocks Course 06, Roman Catholicism, where your sharpest growth edge (${weakest.label.toLowerCase()}) gets a real workout against a live tradition.`;
  } else if (weakest.domain === "trinity" || !trinityStrong) {
    startNode = trinityNode;
    rationale =
      `Your foundation needs the Trinity set solid first — it's the spine every later course leans on, and your weakest area right now is ${weakest.label.toLowerCase()}. Start at Course 03 and take your time; everything downstream gets easier once this is reflexive.`;
  } else {
    startNode = trinityNode;
    rationale =
      `You're ready to train in earnest. Begin at Course 03, the Trinity — it's the open foundation — and aim toward Course ${focusNode.number}, ${focusNode.title}, where your growth edge (${weakest.label.toLowerCase()}) lives.`;
  }

  return {
    tier,
    tierBlurb,
    totalPct,
    domains,
    startNow: { slug: startNode.slug, number: startNode.number, title: startNode.title },
    focus: { slug: focusNode.slug, number: focusNode.number, title: focusNode.title },
    rationale,
  };
}

/** Client-safe shape (no correct answers). */
export function sanitizedQuestions() {
  return QUESTIONS.map(({ id, domain, prompt, options }) => ({
    id,
    domain,
    prompt,
    options,
  }));
}
