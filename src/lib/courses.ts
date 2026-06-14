/**
 * The course graph: numbered progression + prerequisites.
 *
 * Foundations (1–5) build the positive case; engagements (6–10) apply it to
 * a specific worldview and each requires the doctrine(s) it leans on. A
 * course unlocks for a user only once every prerequisite course has been
 * completed (its checkpoint passed). Courses still "in production" therefore
 * gate everything downstream until they ship — which is the intended
 * behavior: you cannot engage Islam before you can defend the deity of
 * Christ.
 */

export type CourseSlug =
  | "existence-of-god"
  | "scripture-reliability"
  | "trinity"
  | "deity-of-christ"
  | "resurrection"
  | "roman-catholicism"
  | "jehovahs-witnesses"
  | "islam"
  | "mormonism"
  | "hebrew-israelites";

export interface CourseNode {
  slug: CourseSlug;
  number: number;
  title: string;
  tier: "Foundations" | "Engagements";
  prereqs: CourseSlug[];
  /** True once the course has real lessons/quiz seeded and is playable. */
  hasContent: boolean;
}

export const COURSES: CourseNode[] = [
  { slug: "existence-of-god", number: 1, title: "The Existence of God", tier: "Foundations", prereqs: [], hasContent: false },
  { slug: "scripture-reliability", number: 2, title: "The Reliability of Scripture", tier: "Foundations", prereqs: [], hasContent: false },
  { slug: "trinity", number: 3, title: "The Trinity", tier: "Foundations", prereqs: [], hasContent: true },
  { slug: "deity-of-christ", number: 4, title: "The Deity of Christ", tier: "Foundations", prereqs: ["trinity"], hasContent: false },
  { slug: "resurrection", number: 5, title: "The Resurrection", tier: "Foundations", prereqs: ["scripture-reliability"], hasContent: false },
  { slug: "roman-catholicism", number: 6, title: "Roman Catholicism", tier: "Engagements", prereqs: ["trinity"], hasContent: true },
  { slug: "jehovahs-witnesses", number: 7, title: "Jehovah's Witnesses", tier: "Engagements", prereqs: ["deity-of-christ"], hasContent: false },
  { slug: "islam", number: 8, title: "Islam", tier: "Engagements", prereqs: ["deity-of-christ", "resurrection"], hasContent: false },
  { slug: "mormonism", number: 9, title: "Mormonism", tier: "Engagements", prereqs: ["deity-of-christ", "scripture-reliability"], hasContent: false },
  { slug: "hebrew-israelites", number: 10, title: "Hebrew Israelitism", tier: "Engagements", prereqs: ["scripture-reliability", "trinity"], hasContent: false },
];

const BY_SLUG = new Map(COURSES.map((c) => [c.slug, c]));

export function course(slug: string): CourseNode | undefined {
  return BY_SLUG.get(slug as CourseSlug);
}

/**
 * The checkpoint quiz id per course (completion = a passed attempt on it).
 * Add an entry when a course's content ships.
 */
export const CHECKPOINT_QUIZ_ID: Partial<Record<CourseSlug, string>> = {
  trinity: "70000000-0000-0000-0000-000000000001",
  "roman-catholicism": "70000000-0000-0000-0000-000000000002",
};

/** Slugs the user has completed, derived from their passed quiz ids. */
export function completedSlugs(passedQuizIds: Iterable<string>): Set<CourseSlug> {
  const passed = new Set(passedQuizIds);
  const done = new Set<CourseSlug>();
  for (const [slug, quizId] of Object.entries(CHECKPOINT_QUIZ_ID)) {
    if (quizId && passed.has(quizId)) done.add(slug as CourseSlug);
  }
  return done;
}

export function isUnlocked(slug: CourseSlug, completed: Set<CourseSlug>): boolean {
  const node = BY_SLUG.get(slug);
  if (!node) return false;
  return node.prereqs.every((p) => completed.has(p));
}

/** Titles of the prerequisites not yet satisfied (for the lock message). */
export function missingPrereqs(
  slug: CourseSlug,
  completed: Set<CourseSlug>,
): CourseNode[] {
  const node = BY_SLUG.get(slug);
  if (!node) return [];
  return node.prereqs
    .filter((p) => !completed.has(p))
    .map((p) => BY_SLUG.get(p)!)
    .filter(Boolean);
}

export function formatCourseNumber(n: number): string {
  return n.toString().padStart(2, "0");
}
