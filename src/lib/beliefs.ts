/**
 * Witness Ready doctrinal foundation — content for the /beliefs page.
 * Source of truth and fuller theological notes live in docs/beliefs.md.
 * This copy is approved theological content; edit deliberately.
 */

export const POSTURE =
  "Historic, biblical Christianity — the faith confessed by the church across the centuries and summarized in the ancient creeds.";

export const LEAD: string[] = [
  "We believe in one living and true God, who exists eternally as three distinct persons: the Father, the Son, and the Holy Spirit. God is one in being and three in person. The Father is God, the Son is God, and the Holy Spirit is God — yet there are not three Gods, but one.",
  "We believe that Jesus Christ is fully God and fully man: eternal, uncreated, of one essence with the Father, born of the virgin Mary, crucified for sinners, and risen bodily from the dead. We believe the Holy Spirit is fully God and truly personal — not an impersonal force.",
  "We believe salvation is by grace alone, through faith alone, in Christ alone, to the glory of God alone — and that the Scriptures of the Old and New Testaments are the inspired Word of God and the final authority for faith and life.",
];

export const AFFIRMATIONS: { title: string; body: string }[] = [
  { title: "Scripture is the final authority", body: "The Old and New Testaments are the inspired Word of God — true, sufficient, and the highest court of appeal for everything we believe." },
  { title: "There is one God", body: "One living and true God — the Creator of all things, eternal, almighty, and holy." },
  { title: "God is eternally triune", body: "God eternally exists as Father, Son, and Holy Spirit — one in being, three in person." },
  { title: "The Father is God", body: "The first person of the Trinity, fully and truly God." },
  { title: "The Son is God", body: "The eternal Son, fully and truly God." },
  { title: "The Holy Spirit is God", body: "The eternal Spirit, fully and truly God." },
  { title: "The persons are distinct", body: "The Father, Son, and Spirit are not three names for one person, nor three roles one person plays. They are eternally and truly distinct." },
  { title: "Not three gods", body: "The three persons share one undivided divine being. The Trinity is not tritheism." },
  { title: "Not one person in three modes", body: "God does not merely appear as Father, Son, and Spirit. The three are eternally distinct — not a single person wearing masks." },
  { title: "Christ is fully God and fully man", body: "Two complete natures united in one person, without confusion and without division." },
  { title: "Christ is eternal and uncreated", body: "Of one essence with the Father — begotten, not made. There was never a time when the Son was not." },
  { title: "Christ died and rose bodily", body: "A real death for sinners, and a real, physical resurrection from the dead." },
  { title: "Salvation is by grace alone", body: "Through faith alone, in Christ alone — a gift received, not a wage earned." },
  { title: "The Spirit is personal and divine", body: "A 'who,' not an 'it'; God himself, not a force or influence." },
  { title: "The gospel is defended in love", body: "With truth, courage, humility, and love — never by winning an argument and losing the person." },
];

export type BeliefSection = {
  id: string;
  kicker: string;
  title: string;
  statement: string[];
  scriptures: string[];
};

export const DOCTRINES: BeliefSection[] = [
  {
    id: "scripture",
    kicker: "The Word of God",
    title: "Scripture",
    statement: [
      "We believe the Bible — the sixty-six books of the Old and New Testaments — is the inspired, inerrant, and authoritative Word of God. Written by human authors carried along by the Holy Spirit, it is wholly true and trustworthy in all that it affirms.",
      "Scripture is sufficient for faith and life and is the final authority — above every tradition, creed, leader, experience, and intuition. We test all teaching, including our own, by Scripture. Where any claim contradicts the Bible, the Bible wins.",
    ],
    scriptures: ["2 Timothy 3:16–17", "2 Peter 1:20–21", "Psalm 19:7–11", "John 17:17"],
  },
  {
    id: "trinity",
    kicker: "The doctrine of God",
    title: "God: One in Three",
    statement: [
      "We believe in one God who eternally exists as three distinct persons: the Father, the Son, and the Holy Spirit. God is one in being and three in person — one “what,” three “whos.” The Father is God, the Son is God, and the Holy Spirit is God, yet there are not three Gods but one.",
      "The three persons are equal in power and glory, sharing one undivided divine essence, and are truly distinct: the Father is not the Son, the Son is not the Spirit, and the Spirit is not the Father.",
      "This is not a contradiction. A contradiction would claim God is one and three in the same sense at the same time. We confess that God is one in one sense (being) and three in another (person).",
    ],
    scriptures: ["Deuteronomy 6:4", "Isaiah 45:5", "Matthew 28:19", "John 1:1", "2 Corinthians 13:14"],
  },
  {
    id: "christ",
    kicker: "The person of Christ",
    title: "Jesus Christ",
    statement: [
      "We believe that Jesus Christ is fully God and fully man. He is the eternal Son, of one essence with the Father — begotten, not made — through whom all things were created. There was never a time when the Son did not exist; he is uncreated and worthy of worship.",
      "In the incarnation the eternal Son took on a true and complete human nature: conceived by the Holy Spirit, born of the virgin Mary, tempted, suffering, and dying as a real man. He is one person in two natures — without the two being confused, mixed, divided, or separated.",
      "He lived a sinless life, died on the cross as a substitute for sinners, rose bodily from the dead on the third day, ascended to the Father, and will return to judge the living and the dead.",
    ],
    scriptures: ["John 1:1–3, 14", "John 8:58", "John 20:28", "Colossians 2:9", "Philippians 2:5–11"],
  },
  {
    id: "spirit",
    kicker: "The person of the Spirit",
    title: "The Holy Spirit",
    statement: [
      "We believe the Holy Spirit is fully God and truly personal — the third person of the Trinity, not an impersonal force, energy, or influence. He is a “who,” not an “it”: he speaks, teaches, can be grieved, distributes gifts as he wills, and is worshiped and glorified together with the Father and the Son.",
      "The Spirit was active in creation, spoke through the prophets, and now convicts the world of sin, gives new birth, indwells believers, and conforms them to the image of Christ.",
    ],
    scriptures: ["Acts 5:3–4", "Acts 13:2", "1 Corinthians 12:11", "Ephesians 4:30", "John 16:13–14"],
  },
  {
    id: "gospel",
    kicker: "The good news",
    title: "The Gospel",
    statement: [
      "We believe the good news that God saves sinners through Jesus Christ. All people are made in God's image yet are sinners, separated from a holy God and unable to save themselves. Out of love, God the Son became man, lived the righteous life we could not live, died on the cross in the place of sinners, and rose bodily from the dead in victory over sin and death.",
      "Salvation is by grace alone, through faith alone, in Christ alone — received as a free gift, not earned by works. All who turn from sin and trust in Christ are forgiven, declared righteous, adopted as God's children, and given eternal life. This gospel is the message every Christian is called to know, to live, and to defend.",
    ],
    scriptures: ["Romans 3:23–26", "Romans 5:8", "1 Corinthians 15:3–4", "Ephesians 2:8–9", "John 3:16"],
  },
];

/** Public-safe distillation of the heresy guardrails (what these doctrines are NOT). */
export const GUARDRAILS: { wrong: string; right: string }[] = [
  {
    wrong: "Three gods working together",
    right: "One undivided divine being, eternally three persons.",
  },
  {
    wrong: "One person wearing three masks or playing three roles",
    right: "Three eternally distinct persons — the Son prays to the Father; both are truly God.",
  },
  {
    wrong: "Jesus is a created being, or 'a god' lesser than the Father",
    right: "The Son is eternal and uncreated — begotten, not made, of one essence with the Father.",
  },
  {
    wrong: "The Holy Spirit is an impersonal force or 'active energy'",
    right: "The Spirit is a divine person who speaks, wills, and can be grieved.",
  },
];

export const WHY_CREEDS: string[] = [
  "The creeds do not replace Scripture. Scripture is the final authority. The creeds are faithful summaries of biblical truth — written by the church, drawn from the Bible, and tested by it — that help Christians confess the faith clearly and guard it against both ancient and modern distortions.",
  "When the early church faced teachers who denied that Jesus is truly God, or truly man, or that the Spirit is a person, it did not invent new doctrine; it summarized what Scripture already taught, in language precise enough to expose the error. To confess a creed is simply to say, with Christians across the centuries: this is what the Bible teaches.",
];

export const CREEDS: { name: string; note: string }[] = [
  { name: "The Apostles' Creed", note: "The baptismal confession of the early church." },
  { name: "The Nicene Creed (325 / 381)", note: "The deity of Christ and the full deity and personhood of the Spirit — the Son “begotten, not made, of one essence with the Father.”" },
  { name: "The Definition of Chalcedon (451)", note: "Christ as one person in two natures — fully God and fully man — without confusion, change, division, or separation." },
  { name: "The Athanasian Creed", note: "The most explicit ancient statement of the Trinity: one God in three persons, neither confounding the persons nor dividing the substance." },
];

export const SOLAS =
  "We stand within historic, evangelical Protestantism: Scripture alone, grace alone, faith alone, Christ alone, to the glory of God alone.";

export const NON_DENOM =
  "Witness Ready is intentionally non-denominational. We draw on the great Reformation confessions — Westminster, Heidelberg, Belgic, the Second London Baptist Confession (1689), and the Thirty-Nine Articles — without binding anyone to one, and we train believers across faithful evangelical churches in the doctrines they hold in common.";
