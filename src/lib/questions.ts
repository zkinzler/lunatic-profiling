/**
 * Lunatic Profiling V2 - Questions
 *
 * 24 fixed questions across 3 phases:
 * - Phase 1 (Q1-Q8): "The Roast" - 1x multiplier
 * - Phase 2 (Q9-Q16): "The Revelation" - 2x multiplier
 * - Phase 3 (Q17-Q24): "The Alchemy" - 3x multiplier
 */

import { ArchetypeCode } from './archetypes';
import { TraitCode } from './traits';

// Theme tags for specialization tracking
export const THEME_TAGS = [
  'APPLIANCE_DIPLOMACY',
  'QUEUE_WARFARE',
  'COSMIC_BANTER',
  'BUREAUCRATIC_JIUJITSU',
  'THERAPEUTIC_CATASTROPHE',
  'SURREAL_NETWORKING',
] as const;
export type ThemeTag = typeof THEME_TAGS[number];

// Roast categories for generating post-answer roasts
export type RoastCategory = 'VN_CS' | 'CTD_DL' | 'YO_MM' | 'SO_TMZ' | 'BN' | 'MIXED';

export interface Answer {
  id: string;
  text: string;
  archetypeWeights: Partial<Record<ArchetypeCode, number>>;
  traitImpacts: Partial<Record<TraitCode, number>>;
  roastCategory: RoastCategory;
}

export interface Question {
  id: string;
  phase: 1 | 2 | 3;
  title: string;
  question: string;
  answers: Answer[];
  themeTags: ThemeTag[];
}

export const PHASE_NAMES: Record<1 | 2 | 3, string> = {
  1: 'The Roast',
  2: 'The Revelation',
  3: 'The Alchemy',
};

export const PHASE_MULTIPLIERS: Record<1 | 2 | 3, number> = {
  1: 1,
  2: 2,
  3: 3,
};

// All 24 questions
export const QUIZ_QUESTIONS: Question[] = [
  // ================================
  // PHASE 1: THE ROAST (Q1-Q8)
  // ================================
  {
    id: 'q1',
    phase: 1,
    title: 'THE KETTLE WITH OPINIONS',
    question: "Your kettle won't stop commenting on your tea: 'Boiled under duress.' What do you do?",
    themeTags: ['APPLIANCE_DIPLOMACY'],
    answers: [
      {
        id: 'q1a',
        text: "Declare martial law in the kitchen: 'ALL APPLIANCES ON TRIAL! The microwave is judge, the toaster is jury!' Draw tiny appliance handcuffs in the air.",
        archetypeWeights: { CTD: 10, YO: 5 },
        traitImpacts: { CPR: 8 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q1b',
        text: "Assume it's bugged by MI5. Whisper: 'I never liked the royal family anyway.' Pour tea down sink with trembling hands.",
        archetypeWeights: { CTD: 10, DL: 5 },
        traitImpacts: { AE: 5 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q1c',
        text: "It's a kettle. Make tea. Ignore it. If it talks again, bin it and buy one from Argos like a normal person. Christ.",
        archetypeWeights: { BN: 10, VN: 5 },
        traitImpacts: { BS: 10, BST: 5 },
        roastCategory: 'BN',
      },
      {
        id: 'q1d',
        text: "Decode the steam patterns for hidden messages. Consult your cat for a second opinion. Adjust the brew based on astrological tea charts.",
        archetypeWeights: { MM: 10, CTD: 5 },
        traitImpacts: { CPR: 5 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q1e',
        text: "Claim to be dyslexic and place a Durex on the kettle: 'You are now you wanker.' Boil again.",
        archetypeWeights: { YO: 10, VN: 5 },
        traitImpacts: { CPR: 10, BST: 5 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q1f',
        text: "Establish Kettle-KPIs: 'Two-minute optimal boil, commentary limited to quarterly reviews.' Create compliance spreadsheet.",
        archetypeWeights: { SO: 10, TMZ: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'SO_TMZ',
      },
    ],
  },
  {
    id: 'q2',
    phase: 1,
    title: 'QUEUE ETHICS TRIBUNAL',
    question: "You're summoned before the Queue Ethics Tribunal. A man in a bad wig slams his hand on the table: 'DEFEND YOUR QUEUE-STANCE!' What's your play?",
    themeTags: ['QUEUE_WARFARE'],
    answers: [
      {
        id: 'q2a',
        text: "Propose 'Queue Conclave': everyone gets a tiny flag and moral compass. Decisions by humming committee. Custard creams after.",
        archetypeWeights: { DL: 10, MM: 5 },
        traitImpacts: { AE: 10 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q2b',
        text: "Submit your doctoral thesis: 'Queue Dynamics and the British Soul: A Study in Contained Rage (1987-Present).' Weep as they skip to the bibliography.",
        archetypeWeights: { SO: 10, CTD: 5 },
        traitImpacts: { BST: 8 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q2c',
        text: "It's a queue. You stand in it. You wait. You move forward. What the fuck is there to defend? Are we all mental now?",
        archetypeWeights: { BN: 10, VN: 8 },
        traitImpacts: { BS: 10, BST: 10 },
        roastCategory: 'BN',
      },
      {
        id: 'q2d',
        text: "Accept gracefully: 'The prophecies foretold this. My first miracle: turning this car park into a decent Waitrose.' Begin planning liturgical shopping hours.",
        archetypeWeights: { MM: 10, CTD: 5 },
        traitImpacts: { CPR: 5 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q2e',
        text: "Present exhibit A: 'Your wig receipt from B&Q. Case dismissed.' Slam a fake gavel on the table.",
        archetypeWeights: { VN: 10, CS: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'VN_CS',
      },
      {
        id: 'q2f',
        text: "Perform interpretive 'Queue of Sorrow': shoulder-shudders for pensioner impatience, jazz hands for existential line-dread. Sob at the B&Q incident re-enactment.",
        archetypeWeights: { YO: 10, MM: 5 },
        traitImpacts: { CPR: 10 },
        roastCategory: 'YO_MM',
      },
    ],
  },
  {
    id: 'q3',
    phase: 1,
    title: 'MESSIAH MOMENT',
    question: "A wandering band of nomads appears. One points at you and shouts: 'THERE'S THE MESSIAH!' They drop to their knees. What's your next move?",
    themeTags: ['COSMIC_BANTER'],
    answers: [
      {
        id: 'q3a',
        text: "Submit messiah-application forms: 'Section B: Previous miracle experience. Section C: References from disciples (minimum three).' Await committee review.",
        archetypeWeights: { SO: 10, TMZ: 5 },
        traitImpacts: { BST: 8 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q3b',
        text: "Launch into messiah karaoke: 'I WILL SAVE YOU ALL... after this pint.' Attempt miracle: turn water into cheap lager. Fail spectacularly.",
        archetypeWeights: { YO: 10, VN: 3 },
        traitImpacts: { CPR: 10 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q3c',
        text: "'I'm not the messiah, I'm just a very naughty boy!' Attempt to hide behind a bin that's slightly too small.",
        archetypeWeights: { DL: 10, BN: 5 },
        traitImpacts: { AE: 8, BS: 5 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q3d',
        text: "'Head of Contingency.' You reply with three bullet points and a tiny contingency plan for sustainable Moon-to-human communications. Suggest a trial with carrier pigeons.",
        archetypeWeights: { SO: 8, CTD: 8 },
        traitImpacts: { BST: 5, CPR: 5 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q3e',
        text: "Tell them to get up. Say you're not the messiah. Walk away briskly. Maybe call the police if they follow. This isn't a Monty Python sketch—it's a potential restraining order.",
        archetypeWeights: { BN: 10, VN: 5 },
        traitImpacts: { BS: 10, BST: 8 },
        roastCategory: 'BN',
      },
      {
        id: 'q3f',
        text: "'Good things land for me. Outcome: handled.' You trust the vibe, add a cosmic wink emoji, and make jazz hands at your phone.",
        archetypeWeights: { MM: 10, YO: 5 },
        traitImpacts: { CPR: 8 },
        roastCategory: 'YO_MM',
      },
    ],
  },
  {
    id: 'q4',
    phase: 1,
    title: 'PERFORMANCE REVIEW BADGER',
    question: "During your annual review, your manager brings in a badger. 'Brian here will assess your emotional availability.' Brian sniffs you judgmentally. What's your move?",
    themeTags: ['BUREAUCRATIC_JIUJITSU'],
    answers: [
      {
        id: 'q4a',
        text: "Establish Badger-HR Protocol: 'Two sniffs maximum per assessment, emotional availability KPIs, quarterly badger-feedback forms.' Document in staff handbook addendum.",
        archetypeWeights: { SO: 10, TMZ: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q4b',
        text: "A badger. In the office. Assessing me. Right. I'm going to HR. Or a doctor. Or both. This is why I drink.",
        archetypeWeights: { BN: 10, VN: 5 },
        traitImpacts: { BS: 10, BST: 5 },
        roastCategory: 'BN',
      },
      {
        id: 'q4c',
        text: "Panic-submit 27-page emotional CV: 'Appendix C: My Tears at Work (2019-2023). Appendix D: Regret Frequency Analysis.' Offer Brian a biscuit nervously.",
        archetypeWeights: { DL: 10, SO: 5 },
        traitImpacts: { AE: 10 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q4d',
        text: "Analyse Brian's sniffs as corporate oracle-speak: 'Three short sniffs means I need to 'touch base more.'' Create badger-to-English translation spreadsheet.",
        archetypeWeights: { CTD: 10, SO: 5 },
        traitImpacts: { CPR: 8 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q4e',
        text: "Whisper: 'Brian. I've seen the expense claims. The 'acorn allocation' doesn't add up. Let's talk about your sett.' Maintain aggressive eye contact.",
        archetypeWeights: { VN: 10, CS: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'VN_CS',
      },
      {
        id: 'q4f',
        text: "Perform interpretive badger theatre: 'The SNIFF of judgement! The SNOUT of corporate oppression!' Get a written warning. Worth it.",
        archetypeWeights: { YO: 10, MM: 5 },
        traitImpacts: { CPR: 10 },
        roastCategory: 'YO_MM',
      },
    ],
  },
  {
    id: 'q5',
    phase: 1,
    title: 'APOCALYPSE SANITY DISTRIBUTION',
    question: "During the apocalypse, you're put in charge of distributing the last remaining sanity. The queue is long, supplies are low. What's your allocation system?",
    themeTags: ['QUEUE_WARFARE'],
    answers: [
      {
        id: 'q5a',
        text: "Give it to the kids first. Obviously. Then the rest of us can just get pissed and accept the end. Priorities.",
        archetypeWeights: { BN: 10, DL: 5 },
        traitImpacts: { BS: 10, AE: 5 },
        roastCategory: 'BN',
      },
      {
        id: 'q5b',
        text: "Hand out Tic Tacs: 'Here's your sanity, you fragile fuck. Next!' Mutter: 'We're all doomed anyway. Have you SEEN the queue?'",
        archetypeWeights: { VN: 10, YO: 5 },
        traitImpacts: { BST: 10, CPR: 5 },
        roastCategory: 'VN_CS',
      },
      {
        id: 'q5c',
        text: "Design 'Sanity Allocation Ceremony': sacred geometry floor patterns, chanting algorithm, ritual based on birth charts. Document in 'Apocalypse Liturgy' binder.",
        archetypeWeights: { MM: 10, CTD: 5 },
        traitImpacts: { CPR: 8 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q5d',
        text: "Form a sanity commune: 'We'll share the last rational thought! It's about Brexit, obviously.' Immediately start arguing about biscuit allocation.",
        archetypeWeights: { DL: 8, YO: 8 },
        traitImpacts: { AE: 8, CPR: 5 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q5e',
        text: "Create Sanity Triage: colour-coded wristbands (green = 'mild existential dread', red = 'full cosmic horror'). Prioritise by spreadsheet algorithm.",
        archetypeWeights: { SO: 10, CS: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q5f',
        text: "Implement 'Sanity Thunderdome': two enter, one leaves sane. Last-person-standing gets all remaining sanity. 'Welcome to the end times, folks!'",
        archetypeWeights: { YO: 10, VN: 5 },
        traitImpacts: { CPR: 10, BST: 5 },
        roastCategory: 'YO_MM',
      },
    ],
  },
  {
    id: 'q6',
    phase: 1,
    title: 'AGGRESSIVE CUCUMBER',
    question: "An aggressive cucumber in the supermarket whispers: 'I've seen your search history. We need to talk.' Security is watching. What's your move?",
    themeTags: ['APPLIANCE_DIPLOMACY'],
    answers: [
      {
        id: 'q6a',
        text: "'My parents told me never to listen to vegetables. I'll take their advice.' Walk away briskly, pretending to examine tinned goods with intense focus.",
        archetypeWeights: { BN: 10, TMZ: 5 },
        traitImpacts: { BS: 10 },
        roastCategory: 'BN',
      },
      {
        id: 'q6b',
        text: "It's a vegetable. I'm putting it in my salad. If it whispers again, I'm having a word with the manager about the quality of their produce. And maybe my medication.",
        archetypeWeights: { BN: 8, VN: 8 },
        traitImpacts: { BS: 8, BST: 8 },
        roastCategory: 'BN',
      },
      {
        id: 'q6c',
        text: "Assess critically: 'Your curvature lacks elegance, your skin tone is uneven. And at that price? I think not.' Place back with theatrical disdain.",
        archetypeWeights: { MM: 10, TMZ: 5 },
        traitImpacts: { BST: 8 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q6d',
        text: "Perform 'Cucumber Confessional': jazz hands for shame, dramatic produce-aisle monologue, tearful apology to entire vegetable section.",
        archetypeWeights: { YO: 10, DL: 5 },
        traitImpacts: { CPR: 10, AE: 5 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q6e',
        text: "Draw imaginary vegetable guillotine: 'OFF WITH THEIR GREEN TIPS! The courgettes are clearly collaborators!' Security escorts you out. You demand a trial by jury of tomatoes.",
        archetypeWeights: { CTD: 10, YO: 5 },
        traitImpacts: { CPR: 8 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q6f',
        text: "Analyse cucumber's motives: 'Is this about the vegan porn? That was research!' Consult nearby aubergine for second opinion.",
        archetypeWeights: { CTD: 10, MM: 5 },
        traitImpacts: { CPR: 5 },
        roastCategory: 'CTD_DL',
      },
    ],
  },
  {
    id: 'q7',
    phase: 1,
    title: 'ANXIETY WARDEN',
    question: "A traffic warden fines you for idling in the anxiety zone for three hours. 'Section 4(b): Excessive Existential Loitering,' he says, tapping his clipboard. What's your response?",
    themeTags: ['BUREAUCRATIC_JIUJITSU'],
    answers: [
      {
        id: 'q7a',
        text: "Perform 'Three-Hour Spiral' re-enactment: jazz hands for initial panic, slow shuffle for hour two's resignation, sudden flail for the crisp-related epiphany at 2:47. Invite audience participation.",
        archetypeWeights: { YO: 10, MM: 5 },
        traitImpacts: { CPR: 10 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q7b',
        text: "Nod once. 'Fair cop.' Pay the fine. Walk away without breaking stride. File under 'cost of doing business as a human.'",
        archetypeWeights: { TMZ: 10, BN: 5 },
        traitImpacts: { BS: 10, BST: 8 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q7c',
        text: "Panic-research Byelaw 47.3: 'Subsection C: Acceptable apology baked goods (custard creams only).' Create 14-page defence with biscuit-based precedents. Offer tea as exhibit A.",
        archetypeWeights: { DL: 10, SO: 5 },
        traitImpacts: { AE: 10 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q7d',
        text: "Pay the fine. Walk away. Wonder briefly what an 'anxiety zone' is, then remember you have actual problems. Like this fucking fine.",
        archetypeWeights: { BN: 10, VN: 5 },
        traitImpacts: { BS: 10, BST: 5 },
        roastCategory: 'BN',
      },
      {
        id: 'q7e',
        text: "Accept with cosmic resignation: 'The universe taxes emotional emissions now. I'll meditate on this receipt as a spiritual transaction.' Pretend it's a tax write-off.",
        archetypeWeights: { MM: 10, TMZ: 5 },
        traitImpacts: { CPR: 5 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q7f',
        text: "Point at clipboard: 'That's from Wilko's summer 2018 range. Your authority is as cheap as your stationery. Now fuck off before I fine YOU for poor polyester choice.'",
        archetypeWeights: { VN: 10, CS: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'VN_CS',
      },
    ],
  },
  {
    id: 'q8',
    phase: 1,
    title: 'THE MOON HAS YOUR NUMBER',
    question: "You wake to several texts from an unknown number. 'It's the Moon,' it says. 'I'm watching you. U wanker.' A pause. Then: 'Who are you really?'",
    themeTags: ['COSMIC_BANTER'],
    answers: [
      {
        id: 'q8a',
        text: "Panic-research lunar GDPR rights. Draft 14-page apology for 'any unintended cosmic disturbance.' Attach a PDF of your birth chart. The moon replies: 'Seek help.'",
        archetypeWeights: { DL: 10, SO: 5 },
        traitImpacts: { AE: 10 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q8b',
        text: "'Is it that time of the month again?' You check the lunar phase, then reply with your official title: 'Interpreter of Signs,' declaring yourself the unofficial Lunar Ambassador to Earth. Attach a PDF of your credentials.",
        archetypeWeights: { MM: 10, CTD: 5 },
        traitImpacts: { CPR: 8 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q8c',
        text: "'I'm not the only wanker in this exchange.' You hit send, then perform a slow, deliberate moonwalk across the carpet, maintaining eye contact with the ceiling.",
        archetypeWeights: { VN: 8, YO: 8 },
        traitImpacts: { BST: 10, CPR: 5 },
        roastCategory: 'VN_CS',
      },
      {
        id: 'q8d',
        text: "Reply: 'Roger Wilco, you big cheese-faced wanker. Mission: drink tea, judge earth, repeat.' Salute the ceiling. The moon reads it and blocks YOU.",
        archetypeWeights: { YO: 10, VN: 5 },
        traitImpacts: { CPR: 10, BST: 5 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q8e',
        text: "Block the number. It's either a prank or a mental health crisis. Either way, not my problem. The moon's got my number? The moon's got rocks and dust. Fuck off.",
        archetypeWeights: { BN: 10, VN: 5 },
        traitImpacts: { BS: 10, BST: 8 },
        roastCategory: 'BN',
      },
      {
        id: 'q8f',
        text: "'Head of Contingency.' You reply with three bullet points and a tiny contingency plan for sustainable Moon-to-human communications. Suggest a trial with carrier pigeons.",
        archetypeWeights: { SO: 10, CTD: 5 },
        traitImpacts: { BST: 8 },
        roastCategory: 'SO_TMZ',
      },
    ],
  },

  // ================================
  // PHASE 2: THE REVELATION (Q9-Q16)
  // ================================
  {
    id: 'q9',
    phase: 2,
    title: 'TIME FREEZE ABILITY',
    question: 'A supreme being offers you 10 minutes to freeze time—ultimate power with no witnesses, no consequences, just pure possibility. First move?',
    themeTags: ['APPLIANCE_DIPLOMACY'],
    answers: [
      {
        id: 'q9a',
        text: "Freeze time. Straighten paintings. Adjust postures. Arrange hair. Breathe deeply. Unfreeze. Everything is wrong. Sigh.",
        archetypeWeights: { MM: 10, TMZ: 5 },
        traitImpacts: { BST: 5 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q9b',
        text: "Freeze time. Rearrange the entire office into a perfect recreation of the Titanic's deck. Unfreeze. Shout: 'I'M THE KING OF THE WORLD!' Get fired. Worth it.",
        archetypeWeights: { YO: 10, VN: 5 },
        traitImpacts: { CPR: 10 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q9c',
        text: "Execute one surgically precise, morally questionable act—maybe steal that perfect sandwich from the fridge. Retreat to your desk with the dignity of a haunted aristocrat who has settled a score.",
        archetypeWeights: { VN: 10, CS: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'VN_CS',
      },
      {
        id: 'q9d',
        text: "Freeze time immediately. Study the frozen expressions on faces like they're tea leaves in a cosmic cup. 'The panic in Dave's eyes forms a perfect Fibonacci sequence of regret...' Document patterns.",
        archetypeWeights: { CTD: 10, SO: 5 },
        traitImpacts: { CPR: 8 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q9e',
        text: "No thanks. I can barely manage my regular time, never mind frozen time. I'd probably waste it worrying I'd wasted it. Pass.",
        archetypeWeights: { BN: 10, DL: 5 },
        traitImpacts: { BS: 10 },
        roastCategory: 'BN',
      },
      {
        id: 'q9f',
        text: "Decline with serene smile. 'Time is the universe's breath; freezing it would be spiritual violence. I'll meditate on the offer instead.' Achieve enlightenment by minute 3.",
        archetypeWeights: { TMZ: 10, MM: 5 },
        traitImpacts: { BS: 8, BST: 5 },
        roastCategory: 'SO_TMZ',
      },
    ],
  },
  {
    id: 'q10',
    phase: 2,
    title: 'GENIE + PARROT DILEMMA',
    question: "A genie offers you £10 million, but the deal comes with a parrot that knows your entire digital life—search history, deleted folders, everything—and you must look after it forever. 'I've seen it ALL,' it squawks. Decision?",
    themeTags: ['THERAPEUTIC_CATASTROPHE'],
    answers: [
      {
        id: 'q10a',
        text: "Take the money. The parrot's first words: '2008 browser history. Jesus wept.' You develop a drinking problem by Tuesday. The £10M covers excellent therapy and better curtains.",
        archetypeWeights: { YO: 10, VN: 5 },
        traitImpacts: { CPR: 10 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q10b',
        text: "Accept with cosmic grace. 'The parrot is my shadow-self guide! We'll co-host a podcast: Squawks & Secrets: Healing Through Humiliation.' Episode 1: 'What the Browser Knew.'",
        archetypeWeights: { MM: 10, YO: 5 },
        traitImpacts: { CPR: 8 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q10c',
        text: "Ten million quid? I'll take the parrot to a nice sanctuary in the country and visit once a year with a big bag of treats and zero eye contact. Problem solved.",
        archetypeWeights: { BN: 10, CS: 5 },
        traitImpacts: { BS: 10, BST: 5 },
        roastCategory: 'BN',
      },
      {
        id: 'q10d',
        text: "Take the money. Buy the parrot its own luxury flat across town. Hire a parrot-butler. 'Problem contained. Next.' Never speak of it again.",
        archetypeWeights: { CS: 10, SO: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'VN_CS',
      },
      {
        id: 'q10e',
        text: "Panic-research 'avian-human confidentiality agreements.' Create a 30-page parrot therapy plan, soundproof a room with memory-foam mattresses, play ambient jazz constantly. Still hear the squawks.",
        archetypeWeights: { DL: 10, SO: 5 },
        traitImpacts: { AE: 10 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q10f',
        text: "Draft a 47-clause contract. Section 4b: Parrot NDA. Section 12c: Blackmail reclassified as 'constructive feedback.' Slide it to the genie. Polite cough. Await signature.",
        archetypeWeights: { SO: 10, VN: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'SO_TMZ',
      },
    ],
  },
  {
    id: 'q11',
    phase: 2,
    title: 'HOLOGRAPHIC THOUGHTS',
    question: "Every thought you have now appears above your head as a glowing hologram—raw, unfiltered, public. No secrets, just a live broadcast. First reaction?",
    themeTags: ['THERAPEUTIC_CATASTROPHE'],
    answers: [
      {
        id: 'q11a',
        text: "Retreat to a bunker. Only emerge at 3 AM to walk your neighbour's imaginary dog. Whisper-think. Still glows. Sigh.",
        archetypeWeights: { DL: 10, BN: 5 },
        traitImpacts: { AE: 8, BS: 5 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q11b',
        text: "In meetings, hologram reads: 'That PowerPoint is shit and your hair looks stupid.' You smile sweetly: 'Just thinking out loud!' Offer Digestives. They're rejected.",
        archetypeWeights: { VN: 10, YO: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'VN_CS',
      },
      {
        id: 'q11c',
        text: "Build a filter. Thoughts rated R-R-R (Rude/Regretful/Random) appear in Morse. Acceptable thoughts get bullet points and tasteful fonts.",
        archetypeWeights: { SO: 10, TMZ: 5 },
        traitImpacts: { BST: 8 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q11d',
        text: "Study the patterns obsessively. 'My anxiety forms perfect geometric shapes! My procrastination is a fractal spiral!' Start a research journal. Suspect the universe is plagiarising you.",
        archetypeWeights: { CTD: 10, MM: 5 },
        traitImpacts: { CPR: 8 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q11e',
        text: "Turn life into theatre. 'Sorry, my existential dread is showing! Opening night sold out! Critics call it 'hauntingly relatable.'' Charge admission. Wonder if dread is tax-deductible.",
        archetypeWeights: { YO: 10, MM: 5 },
        traitImpacts: { CPR: 10 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q11f',
        text: "Wear a hat. A big one. Maybe take up smoking indoors again for the haze. If anyone asks, it's a new art project. A shit one.",
        archetypeWeights: { BN: 10, VN: 5 },
        traitImpacts: { BS: 10 },
        roastCategory: 'BN',
      },
    ],
  },
  {
    id: 'q12',
    phase: 2,
    title: 'PIGEON MAZE DIRECTIONS',
    question: "You're lost in a maze of filing cabinets. A civil service pigeon offers directions, but only if you admit one genuine weakness. What's your play?",
    themeTags: ['BUREAUCRATIC_JIUJITSU'],
    answers: [
      {
        id: 'q12a',
        text: "Analyse the pigeon's motives obsessively. 'Is this a test? What does it really want?' Map pigeon behaviour patterns. Suspect cosmic conspiracy. Forget about the maze entirely.",
        archetypeWeights: { CTD: 10, SO: 5 },
        traitImpacts: { CPR: 8 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q12b',
        text: "'MAZES. I hate mazes. Now give me directions or I'm reorganising your filing system.' The pigeon, intimidated, complies immediately.",
        archetypeWeights: { VN: 10, CS: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'VN_CS',
      },
      {
        id: 'q12c',
        text: "Provide a balanced self-assessment: 'Weakness: directional impairment. Mitigation: superior filing knowledge. Joke: unlike some, I don't shit on statues.' Present in bullet points.",
        archetypeWeights: { SO: 10, VN: 5 },
        traitImpacts: { BST: 8 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q12d',
        text: "'I'm rubbish at asking for directions.' There. Now, which way out before I lose the last shred of my dignity talking to a bird in a filing cabinet?",
        archetypeWeights: { BN: 10, DL: 5 },
        traitImpacts: { BS: 10, AE: 5 },
        roastCategory: 'BN',
      },
      {
        id: 'q12e',
        text: "Slide a breadcrumb bribe: 'For your... discretionary flying.' Wink. The pigeon takes it, shits on your shoe, then gives perfect directions. British bureaucracy at its finest.",
        archetypeWeights: { YO: 10, VN: 5 },
        traitImpacts: { CPR: 10 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q12f',
        text: "Curate the perfect admission with theatrical precision. 'I struggle with... inefficient systems.' Gesture gracefully at the maze. The pigeon sees through it but respects the performance.",
        archetypeWeights: { MM: 10, TMZ: 5 },
        traitImpacts: { BST: 5 },
        roastCategory: 'SO_TMZ',
      },
    ],
  },
  {
    id: 'q13',
    phase: 2,
    title: 'CATNIP DEALING CAT',
    question: "Your cat's 'catnip empire' is accidentally funding your therapy. Your therapist says: 'This is enabling.' The cat drops another wad of cash, purrs expectantly. What now?",
    themeTags: ['APPLIANCE_DIPLOMACY'],
    answers: [
      {
        id: 'q13a',
        text: "Curate an aesthetic compromise. 'We'll launder it through legitimate cat toy sales. Ethical, tasteful toys.' Design minimalist scratching posts with sustainable hemp. Cat judges your designs.",
        archetypeWeights: { MM: 10, SO: 5 },
        traitImpacts: { BST: 5 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q13b',
        text: "Panic-research 'feline criminal rehabilitation.' Draft 40 pages of cat therapy protocols, anxiety-based market analysis, and contingency plans for when the 'nip runs dry.' Cat ignores you.",
        archetypeWeights: { DL: 10, SO: 5 },
        traitImpacts: { AE: 10 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q13c',
        text: "Confiscate the cash. Buy the cat a very expensive toy and some premium food. Bribe it into legitimacy. We're partners now. Honest partners.",
        archetypeWeights: { BN: 10, CS: 5 },
        traitImpacts: { BS: 10, BST: 5 },
        roastCategory: 'BN',
      },
      {
        id: 'q13d',
        text: "Promote the cat to CEO! Host a tiny board meeting with plush mouse shareholders. 'To the empire!' Invest the cash in matching cat-human therapy jumpsuits.",
        archetypeWeights: { YO: 10, CTD: 5 },
        traitImpacts: { CPR: 10 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q13e',
        text: "Stage a feline intervention: 'Mittens, this ends now.' The cat stares, drops MORE cash, knocks a vase off the shelf. You understand: you work for the cat now.",
        archetypeWeights: { VN: 10, YO: 5 },
        traitImpacts: { BST: 8 },
        roastCategory: 'VN_CS',
      },
      {
        id: 'q13f',
        text: "Audit the empire. 'Paw-print profit margins: 47%. Risk: feline extradition. Ethical compliance: questionable.' Create a 5-year exit strategy with claw-friendly spreadsheets.",
        archetypeWeights: { SO: 10, CTD: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'SO_TMZ',
      },
    ],
  },
  {
    id: 'q14',
    phase: 2,
    title: 'HEDGEHOG INSULT',
    question: "A hedgehog pokes your ankle and says: 'I was told you attract pricks.' What's your move?",
    themeTags: ['THERAPEUTIC_CATASTROPHE'],
    answers: [
      {
        id: 'q14a',
        text: "'Indeed. Now piss off before I find out if hedgehogs float.' Continue walking without breaking stride. Problem 'solved.'",
        archetypeWeights: { VN: 10, CS: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'VN_CS',
      },
      {
        id: 'q14b',
        text: "Assess the critique calmly. 'I attract curated pricks. Quality over quantity.' Adjust your aura slightly. Offer the hedgehog some aesthetic life advice it didn't ask for.",
        archetypeWeights: { MM: 10, TMZ: 5 },
        traitImpacts: { BST: 5 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q14c',
        text: "Look down: 'Takes one to know one, you walking hairbrush. Now piss off before I find out if hedgehogs bounce.' Continue your walk. The hedgehog respects you.",
        archetypeWeights: { VN: 10, YO: 5 },
        traitImpacts: { BST: 10, CPR: 5 },
        roastCategory: 'VN_CS',
      },
      {
        id: 'q14d',
        text: "Laugh loudly. 'Guilty as charged! And they're lovely pricks, thank you!' Ask the hedgehog if it would like to join you for tea and cake.",
        archetypeWeights: { YO: 10, DL: 5 },
        traitImpacts: { CPR: 10, AE: 5 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q14e',
        text: "Fair. I do attract pricks. Look at me now, talking to a hedgehog about it. Circle of life.",
        archetypeWeights: { BN: 10, TMZ: 5 },
        traitImpacts: { BS: 10 },
        roastCategory: 'BN',
      },
      {
        id: 'q14f',
        text: "Analyse the hedgehog's posture for cosmic signals. Start a conspiracy board.",
        archetypeWeights: { CTD: 10, MM: 5 },
        traitImpacts: { CPR: 8 },
        roastCategory: 'CTD_DL',
      },
    ],
  },
  {
    id: 'q15',
    phase: 2,
    title: 'COCKNEY LAMP NETWORKING',
    question: "A Cockney talking lamp at a networking event corners you: 'What's your game mate? You look like you're 'avvin' a giraffe. Who are you and what do you do?'",
    themeTags: ['SURREAL_NETWORKING'],
    answers: [
      {
        id: 'q15a',
        text: "About to 'ave a carafe—of Lambrini! Life's for living, innit?' Invite the lamp for karaoke and a cheeky kebab after.",
        archetypeWeights: { YO: 10, DL: 5 },
        traitImpacts: { CPR: 10 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q15b',
        text: "'Restoring balance—one builder's brew at a time. But you, my friend, are shedding light on the wrong chakras.' Offer a perfectly dunked digestive.",
        archetypeWeights: { MM: 10, TMZ: 5 },
        traitImpacts: { BST: 5 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q15c',
        text: "Flash a laminated card. 'The Keymaster, mate—37% more productive than your average geezer. Got a pie chart for every cuppa. I'm looking for the Gatekeeper?'",
        archetypeWeights: { SO: 10, CTD: 5 },
        traitImpacts: { BST: 8 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q15d',
        text: "Network with a lamp? Right. I'm going to find the open bar and someone who isn't furniture. Cheers.",
        archetypeWeights: { BN: 10, VN: 5 },
        traitImpacts: { BS: 10, BST: 5 },
        roastCategory: 'BN',
      },
      {
        id: 'q15e',
        text: "'Professional ditherer, part-time apologiser, full-time overthinker.' Offer the lamp a Werther's Original and ask if it's union.",
        archetypeWeights: { DL: 10, YO: 5 },
        traitImpacts: { AE: 10 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q15f',
        text: "Rearrange biscuits into star charts: 'The Hobnob constellation predicts market volatility! The Custard Cream aligns with your chakras!' The lamp backs away slowly.",
        archetypeWeights: { CTD: 10, MM: 5 },
        traitImpacts: { CPR: 8 },
        roastCategory: 'CTD_DL',
      },
    ],
  },
  {
    id: 'q16',
    phase: 2,
    title: 'MONSTER RAVING LOONY COUP',
    question: "The Monster Raving Loony Party stages a coup. Frankie Boyle, now 'Supreme Curator,' announces on BBC One: 'Right, modern Britain's been shit. Pick one of these new national institutions. This is your life now.'",
    themeTags: ['QUEUE_WARFARE'],
    answers: [
      {
        id: 'q16a',
        text: "Chief Apologist for the Department of Things We Should Have Probably Fixed By Now. 'Today: apologising for Brexit, the M25, and why your train's cancelled. I've drafted 40 pages already. Sorry.'",
        archetypeWeights: { DL: 10, SO: 5 },
        traitImpacts: { AE: 10 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q16b',
        text: "Director of Grief KPIs & Nostalgia Audits. 'We've quantified that 1974 was 47% better than now. Your personal nostalgia is now subject to quarterly review. Appendix C: Biscuit quality decline metrics.'",
        archetypeWeights: { SO: 10, CTD: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q16c',
        text: "Can I just... not? Go back to the old Britain? This seems like a lot of effort and I've already paid my TV license. Twice. Because I forgot.",
        archetypeWeights: { BN: 10, DL: 5 },
        traitImpacts: { BS: 10 },
        roastCategory: 'BN',
      },
      {
        id: 'q16d',
        text: "Minister for Finding Patterns in the Asda Car Park Oracle. 'The trolley formations predict which cabinet minister will resign next. The Morrisons car park predicts the weather. I've cross-referenced. It's grim.'",
        archetypeWeights: { CTD: 10, MM: 5 },
        traitImpacts: { CPR: 8 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q16e',
        text: "Curator of the Museum of Perfectly Average Things. 'We have one average pebble, a 2012 Focus with moderate mileage, and a cup of tea at precisely 68°C. The gift shop sells beige postcards. Please don't touch anything.'",
        archetypeWeights: { TMZ: 10, MM: 5 },
        traitImpacts: { BS: 8, BST: 5 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q16f',
        text: "Pilot of the National Fleet of Self-Driving Buses That Go Nowhere Important But Have A Great Playlist. 'We're touring every industrial estate in the Midlands! There's prosecco! And existential dread! WHEEEEE!'",
        archetypeWeights: { YO: 10, MM: 5 },
        traitImpacts: { CPR: 10 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q16g',
        text: "Head of the National Shame Museum. 'We've got Prince Andrew's Pizza Express receipt, a live feed of MPs' second homes, and Boris Johnson's hair from 2019 in a jar. Admission: £5, or bring something you're ashamed of.'",
        archetypeWeights: { VN: 10, YO: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'VN_CS',
      },
    ],
  },

  // ================================
  // PHASE 3: THE ALCHEMY (Q17-Q24)
  // ================================
  {
    id: 'q17',
    phase: 3,
    title: 'POST-BREXIT THERAPY ROLE',
    question: "Post-Brexit Britain has established mandatory 'National Character Therapy.' You're assigned a role based on your damage. Which department do you head?",
    themeTags: ['SURREAL_NETWORKING'],
    answers: [
      {
        id: 'q17a',
        text: "Archbishop of the Church of Sovereign Vibes. 'The EU's energy wasn't aligned with our sovereignty chakras. I feel lighter already. Also poorer, but that's a material attachment we must release.'",
        archetypeWeights: { MM: 10, DL: 5 },
        traitImpacts: { CPR: 5, AE: 5 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q17b',
        text: "Commodore of the 'Fuck It, Let's Just Go to Spain Anyway' Fleet. 'Passports are a suggestion! The sea is a vibe! If we sink, we sink with sangria in hand! VAMOS, YOU SAD BASTARDS!'",
        archetypeWeights: { YO: 10, VN: 5 },
        traitImpacts: { CPR: 10 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q17c',
        text: "Curator of Aesthetically Pleasing Border Controls. 'The queues must flow in graceful serpentine patterns. No sudden movements. The font on the customs forms is... distressing. We'll use Garamond.'",
        archetypeWeights: { MM: 10, SO: 5 },
        traitImpacts: { BST: 5 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q17d',
        text: "Permanent Secretary for Pre-emptive Apologies to France. 'Sorry about the fishermen. Sorry about the queue. Sorry about the cheese comments. Sorry we exist. I've drafted 300 pages. In French. Badly.'",
        archetypeWeights: { DL: 10, SO: 5 },
        traitImpacts: { AE: 10 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q17e',
        text: "Auditor General of Who's Actually to Blame (Spoiler: Everyone). 'My 47-page report assigns percentage blame. You're 12% responsible for this mess. Your nan is 3%. That bloke Dave is 8%. Pay up.'",
        archetypeWeights: { SO: 10, VN: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q17f',
        text: "Director of Finding Meaning in the Trade Deal Small Print. 'Article 17, Clause B suggests the EU still loves us really. The semicolon in Annex 3 indicates secret affection. I've made a chart. It's heartbreaking.'",
        archetypeWeights: { CTD: 10, DL: 5 },
        traitImpacts: { CPR: 8, AE: 5 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q17g',
        text: "Minister for Telling Europe Exactly What We Think of Their Regulations. 'Your cheese classification system is bourgeois wank. Your cucumber curvature rules are fascism. Next. Oh, and your wine's overrated. Fuck off.'",
        archetypeWeights: { VN: 10, CS: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'VN_CS',
      },
    ],
  },
  {
    id: 'q18',
    phase: 3,
    title: 'NHS CRISIS SOLUTIONS',
    question: "The NHS is replaced by 'British Vibes Care.' You're put in charge of one department. Which do you claim?",
    themeTags: ['BUREAUCRATIC_JIUJITSU'],
    answers: [
      {
        id: 'q18a',
        text: "Minister of Triage Spreadsheets. 'Your pain is a 6.3/10 but your waiting time score is 8.7. Congratulations, you've been deprioritised. Form 47B allows appeal via interpretive dance. Good luck.'",
        archetypeWeights: { SO: 10, VN: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q18b',
        text: "Chief of Pre-emptive Apologies for the Waiting Room. 'Sorry about the chairs. Sorry about the hope. Sorry the magazines are from 2017. Sorry your hip replacement is now scheduled for 2032. Would you like a Werther's Original?'",
        archetypeWeights: { DL: 10, BN: 5 },
        traitImpacts: { AE: 10 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q18c',
        text: "High Priest of Healing Intentions. 'Have you tried not being sick? The universe provides health to those who vibe correctly. Your cancer is just blocked energy. Have you tried crystals? They're £19.99.'",
        archetypeWeights: { MM: 10, VN: 5 },
        traitImpacts: { CPR: 5, BST: 5 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q18d',
        text: "Head of Diagnostic Tea Leaf Reading. 'Your Earl Grey shows early signs of existential dread. That'll be a 3-year wait. Your builder's brew predicts joint pain. Decaf means you're fundamentally broken. Next.'",
        archetypeWeights: { CTD: 10, MM: 5 },
        traitImpacts: { CPR: 8 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q18e',
        text: "I'll just run a tea trolley. Hot drinks, biscuits, a listening ear. Sometimes that's all the NHS anyone needs. And it's cheaper than MRI machines. And you get a biscuit. Win-win.",
        archetypeWeights: { BN: 10, DL: 5 },
        traitImpacts: { BS: 10, AE: 5 },
        roastCategory: 'BN',
      },
      {
        id: 'q18f',
        text: "Commander of Emergency Distraction Units. 'Your arm's broken? Let's play a quick game of Operation! Oh, you lost. That's another broken bit. Let's play again! WHEEE! PAIN IS TEMPORARY, FUN IS FOREVER!'",
        archetypeWeights: { YO: 10, MM: 5 },
        traitImpacts: { CPR: 10 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q18g',
        text: "Director of Brutal Truth-Telling to Hypochondriacs. 'You're not ill, you're just English. Here's a leaflet on stoicism. And a bill for wasting my time. Now piss off and let real sick people through.'",
        archetypeWeights: { VN: 10, CS: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'VN_CS',
      },
    ],
  },
  {
    id: 'q19',
    phase: 3,
    title: 'ROYAL FAMILY REBRAND',
    question: "The monarchy is abolished. You're hired to rebrand them as a useful national institution. What's their new purpose?",
    themeTags: ['COSMIC_BANTER'],
    answers: [
      {
        id: 'q19a',
        text: "Professional truth-tellers to the delusional. 'Kate, love, that dress makes you look like a lampshade. Charles, your ears could sponsor a small airline. Harry, nobody cares. Next.'",
        archetypeWeights: { VN: 10, YO: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'VN_CS',
      },
      {
        id: 'q19b',
        text: "National apologisers-in-chief. 'Prince Edward is currently in Belgium apologising for Waterloo. He'll be back Tuesday. Princess Anne is in India apologising for the Empire. She'll never be back. Sorry.'",
        archetypeWeights: { DL: 10, SO: 5 },
        traitImpacts: { AE: 10 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q19c',
        text: "Curators of national aesthetic standards. 'The King has declared that pea-green is no longer a permitted colour for bus seats. Magnolia only. The arrests start Monday. Your curtains are also under review.'",
        archetypeWeights: { MM: 10, SO: 5 },
        traitImpacts: { BST: 5 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q19d',
        text: "Hosts of 'Royal Rumble' on Channel 5. 'Tonight: Harry vs Andrew in a PPV cage match! Special guest referee: Diana's ghost! Bets placed at Ladbrokes! THIS IS HISTORY, PEOPLE!'",
        archetypeWeights: { YO: 10, VN: 5 },
        traitImpacts: { CPR: 10 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q19e',
        text: "Efficiency auditors for government waste. 'Prince William's report shows the DWP could save £3.7M by feeling slightly less empathy. The Crown Jewels have a poor ROI. I recommend pawning them.'",
        archetypeWeights: { SO: 10, CS: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q19f',
        text: "The Royals become our national tea tasters. 'Charles III has detected notes of despair in this Yorkshire brew. A prophecy! Camilla senses austerity in this PG Tips. The leaves don't lie!'",
        archetypeWeights: { CTD: 10, TMZ: 5 },
        traitImpacts: { CPR: 8, BS: 5 },
        roastCategory: 'CTD_DL',
      },
    ],
  },
  {
    id: 'q20',
    phase: 3,
    title: 'NATIONAL DISASTER RESPONSE',
    question: "A minor national disaster occurs (e.g., all tea bags become square). You're in charge of the response. First action?",
    themeTags: ['QUEUE_WARFARE'],
    answers: [
      {
        id: 'q20a',
        text: "Apologise pre-emptively to the Commonwealth. 'Sorry about the square bags. Sorry about the Empire. Sorry about Brexit. Sorry about that thing in 1973. Sorry about the weather. Sorry.'",
        archetypeWeights: { DL: 10, BN: 5 },
        traitImpacts: { AE: 10 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q20b',
        text: "Blame it on the immigrants/the youth/the EU/the boomers/the weather/the last government. Actually, blame it on the Boogie. 'The sunshine, moonlight, and good times are all exempt from prosecution. Case closed.'",
        archetypeWeights: { YO: 10, VN: 5 },
        traitImpacts: { CPR: 10, BST: 5 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q20c',
        text: "Study the square bags for geometric prophecies. 'The 90-degree angles predict a coming age of rigid bureaucracy. The corners suggest increased political extremism. I've charted it. We're doomed.'",
        archetypeWeights: { CTD: 10, SO: 5 },
        traitImpacts: { CPR: 8 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q20d',
        text: "Round mugs exist. Use them. This isn't a geometry crisis, it's a failure of common sense. And possibly a sign of the collapse of society. Anyone want a cuppa? I've got round mugs.",
        archetypeWeights: { BN: 10, VN: 5 },
        traitImpacts: { BS: 10, BST: 5 },
        roastCategory: 'BN',
      },
      {
        id: 'q20e',
        text: "Calculate the optimal dunking time for square tea bags. 'My data shows 2.7 seconds maximises infusion while minimising existential despair. Any longer and you're basically French. Here's a graph.'",
        archetypeWeights: { SO: 10, TMZ: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q20f',
        text: "Declare it a new national sport. 'Square bag tossing! Points for distance and splash damage! The PM has been hit! WHEEE! BRITAIN'S BACK, BABY!' Immediately form a governing body with excessive bureaucracy.",
        archetypeWeights: { YO: 10, SO: 5 },
        traitImpacts: { CPR: 10 },
        roastCategory: 'YO_MM',
      },
    ],
  },
  {
    id: 'q21',
    phase: 3,
    title: "DRUNK GENIE'S POLITICAL PARTY",
    question: "A drunk genie stumbles out of a Wetherspoons toilet, hiccups, and grants you 60 seconds to found a new political party and enact one policy. What's your one policy?",
    themeTags: ['SURREAL_NETWORKING'],
    answers: [
      {
        id: 'q21a',
        text: "Replace GDP with 'National Efficiency Satisfaction Metrics.' 'Happiness is inefficient. We've optimised for brisk, purposeful melancholy. The trains will still be shit, but you'll feel productive about it.'",
        archetypeWeights: { SO: 10, TMZ: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q21b',
        text: "A government department solely for anticipating and apologising for future regrets. 'We're sorry for what we haven't done yet. We'll do better. Probably not. But we're sorry in advance. Sorry.'",
        archetypeWeights: { DL: 10, SO: 5 },
        traitImpacts: { AE: 10 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q21c',
        text: "Replace the House of Lords with a permanent festival in a field. 'Democracy by glowstick vote! The Chancellor is now a DJ! Budget announcements via sick drops! THIS IS THE FUTURE, GRANDPA!'",
        archetypeWeights: { YO: 10, MM: 5 },
        traitImpacts: { CPR: 10 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q21d',
        text: "A national 'No-Filter Friday' where defamation laws are suspended. 'Tell your boss he's a wanker. Tell your mum her cooking's shit. Tell the King his ears are ridiculous. It's the law. Enjoy.'",
        archetypeWeights: { VN: 10, YO: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'VN_CS',
      },
      {
        id: 'q21e',
        text: "A National Aesthetic Review Board with power to fine ugly buildings. 'That extension is a crime against harmony. Pay the fine or repaint in tasteful beige. Your garden gnome is an abomination. £500 fine.'",
        archetypeWeights: { MM: 10, SO: 5 },
        traitImpacts: { BST: 5 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q21f',
        text: "Mandatory tea leaf reading for all economic forecasts. 'The leaves predict a recession... or possibly just a storm. Invest in biscuits. The Earl Grey suggests the Chancellor will resign. The Darjeeling is uncertain.'",
        archetypeWeights: { CTD: 10, MM: 5 },
        traitImpacts: { CPR: 8 },
        roastCategory: 'CTD_DL',
      },
    ],
  },
  {
    id: 'q22',
    phase: 3,
    title: 'NATIONAL THERAPY SESSION',
    question: "Britain is on the therapist's couch. You're the therapist. Your opening question?",
    themeTags: ['THERAPEUTIC_CATASTROPHE'],
    answers: [
      {
        id: 'q22a',
        text: "Fuck it, let's just blame France and go to the pub. Sound good? First round's on the taxpayer! WHEEE! THERAPY VIA PROCRASTINATION AND ALCOHOL!",
        archetypeWeights: { YO: 10, VN: 5 },
        traitImpacts: { CPR: 10 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q22b',
        text: "Your national colour palette is deeply distressing. Let's start there. Magnolia is acceptable. That bright red phone box is giving me anxiety. The Union Jack needs toning down. Much down.",
        archetypeWeights: { MM: 10, TMZ: 5 },
        traitImpacts: { BST: 5 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q22c',
        text: "When you look at the clouds, what patterns of imperial guilt do you see? The cumulus suggests colonial regret. The stratus indicates Brexit anxiety. That one looks like the Queen judging you.",
        archetypeWeights: { CTD: 10, MM: 5 },
        traitImpacts: { CPR: 8 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q22d',
        text: "On a scale of 1-10, how would you rate your post-colonial stress disorder? Be precise. Decimal points matter. Is it a 6.7 or a 6.8? The difference is 3.2% in therapy costs.",
        archetypeWeights: { SO: 10, VN: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q22e',
        text: "How much do you charge? And is it covered by the NHS? No? Then let's just admit we're all a bit tired and have a cup of tea instead. I brought biscuits. Custard creams. Don't get excited.",
        archetypeWeights: { BN: 10, DL: 5 },
        traitImpacts: { BS: 10 },
        roastCategory: 'BN',
      },
      {
        id: 'q22f',
        text: "Would you like to pre-apologise for whatever you're about to say? I've prepared a 14-page list of things Britain might need to apologise for. Starting with the weather. Sorry.",
        archetypeWeights: { DL: 10, SO: 5 },
        traitImpacts: { AE: 10 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q22g',
        text: "Let's start with why you still pretend to like the Royal Family. We've got time. Three centuries of issues to unpack. And the food's shit. And the teeth. Oh god, the teeth.",
        archetypeWeights: { VN: 10, YO: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'VN_CS',
      },
    ],
  },
  {
    id: 'q23',
    phase: 3,
    title: "YOUR ARCHETYPE'S RETIREMENT PLAN",
    question: "You're given a quaint British village to run in your old age. What's its main industry?",
    themeTags: ['SURREAL_NETWORKING'],
    answers: [
      {
        id: 'q23a',
        text: "A wellness retreat that accidentally becomes a cult. 'Find your inner chakra in our compostable yurts. The tea is brewed with intention. The scones contain wisdom. We also do tax avoidance.'",
        archetypeWeights: { MM: 10, CTD: 5 },
        traitImpacts: { CPR: 5 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q23b',
        text: "A permanent village fete that accidentally becomes a rave. 'It's the summer of '69, forever! Bring your own glitter and existential dread! The vicar's on ketamine! WHEEE!'",
        archetypeWeights: { YO: 10, MM: 5 },
        traitImpacts: { CPR: 10 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q23c',
        text: "A nice pub. With a quiz night. And pies. That's it. That's the industry. Happiness is a pie and a pint and not being asked what your passion is. The passion is pie. And not talking to people.",
        archetypeWeights: { BN: 10, TMZ: 5 },
        traitImpacts: { BS: 10 },
        roastCategory: 'BN',
      },
      {
        id: 'q23d',
        text: "A sanctuary for anticipatory regret. 'We apologise for your visit in advance. The gift shop sells 'I'm Sorry' mugs. The cafe serves disappointment tea. Check-out involves writing a letter of apology to yourself.'",
        archetypeWeights: { DL: 10, MM: 5 },
        traitImpacts: { AE: 10 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q23e',
        text: "A museum of prophetic potholes. 'Each crack tells a story. This one predicted the 2008 crash. This one foresaw Brexit. Admission includes a pamphlet on tarmac divination. The gift shop sells gravel.'",
        archetypeWeights: { CTD: 10, SO: 5 },
        traitImpacts: { CPR: 8 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q23f',
        text: "A village where everyone appears perfectly serene while secretly judging your life choices. 'Our smiles are genuine. Our internal monologues are brutal. The scones are exquisite. Your hair is a crime.'",
        archetypeWeights: { TMZ: 10, VN: 5 },
        traitImpacts: { BS: 8, BST: 5 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q23g',
        text: "A heritage centre for obsolete filing systems. 'See the last fax machine in Britain! Marvel at the Dewey Decimal system! Weep at the lost art of alphabetical order! Gift shop: stationery from 1998.'",
        archetypeWeights: { SO: 10, TMZ: 5 },
        traitImpacts: { BST: 8 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q23h',
        text: "A 'Tell Your Boss What You Really Think' theme park. 'Ride the 'You're Fired' rollercoaster! Eat at the 'Passive-Aggressive Cafe'! Visit the 'HR Nightmare' haunted house! Therapy extra.'",
        archetypeWeights: { VN: 10, YO: 5 },
        traitImpacts: { BST: 10, CPR: 5 },
        roastCategory: 'VN_CS',
      },
    ],
  },
  {
    id: 'q24',
    phase: 3,
    title: 'FINAL JUDGMENT',
    question: "You die and end up in a purgatorial courtroom. The jury is everyone you ever pissed off. The Supreme Being is the prosecutor. He leans in: 'One final statement. Make it count.'",
    themeTags: ['COSMIC_BANTER'],
    answers: [
      {
        id: 'q24a',
        text: "WELL THAT WAS A RIDE! Look, no hard feelings, yeah? Auntie Marg, your pasta bake was... memorable! Audi guy, nice acceleration! Anyone else peckish? I bet the afterlife does discounted pints!",
        archetypeWeights: { YO: 10, DL: 5 },
        traitImpacts: { CPR: 10, AE: 5 },
        roastCategory: 'YO_MM',
      },
      {
        id: 'q24b',
        text: "I've prepared a 42-page dossier assigning blame percentages. Aunt Margaret: 12%. Queue-jumper: 8%. Audi driver: 15%. My own culpability? A statistically negligible 2.7%. The data is clear. Can I go now?",
        archetypeWeights: { SO: 10, CTD: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q24c',
        text: "Look, I did my best. Sometimes I was a prick, sometimes I wasn't. The queue-jumper can fuck off, the Audi driver can fuck off. I'm not sorry, I'm not proud, I'm just tired. Can I go now?",
        archetypeWeights: { BN: 10, VN: 5 },
        traitImpacts: { BS: 10, BST: 5 },
        roastCategory: 'BN',
      },
      {
        id: 'q24d',
        text: "Oh god. I'm so sorry. Sorry about the queue, sorry about the traffic, sorry about the career choices, sorry for judging your urinal technique. Sorry for existing, sorry for dying... should I keep going? I have 47 pages.",
        archetypeWeights: { DL: 10, SO: 5 },
        traitImpacts: { AE: 10 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q24e',
        text: "Your collective annoyance forms a perfect constellation of cosmic feedback. The queue-jumper's impatience aligns with Mercury retrograde. This isn't chaos—it's a divine pattern you're all too simple to see. Also, your anger has nice fractal geometry.",
        archetypeWeights: { CTD: 10, MM: 5 },
        traitImpacts: { CPR: 8 },
        roastCategory: 'CTD_DL',
      },
      {
        id: 'q24f',
        text: "A deep, serene breath. 'Your anger lacks elegance. The queue-jumper's posture was crude, the Audi driver's gesture artistically bankrupt. My only regret is that I couldn't curate your collective disappointment into something more aesthetically pleasing.' Sip imaginary tea. Judge silently.",
        archetypeWeights: { MM: 10, TMZ: 5 },
        traitImpacts: { BST: 5 },
        roastCategory: 'SO_TMZ',
      },
      {
        id: 'q24g',
        text: "Honestly? Good lineup. You, queue-jumper, have the spatial awareness of a concussed pigeon. Audi driver, you compensate for something microscopic. Aunt Marg, the pasta bake WAS shit. I'd do it all again, but with more eye contact during the splashback. Next.",
        archetypeWeights: { VN: 10, CS: 5 },
        traitImpacts: { BST: 10 },
        roastCategory: 'VN_CS',
      },
      {
        id: 'q24h',
        text: "This isn't a judgment—it's a sacred convergence of energies! Your collective irritation is simply your souls mirroring my spiritual evolution. The queue-jumper's impatience taught me patience! Thank you for this gift! Namaste, you beautiful, angry bastards.",
        archetypeWeights: { MM: 10, DL: 5 },
        traitImpacts: { CPR: 5, AE: 5 },
        roastCategory: 'YO_MM',
      },
    ],
  },
];

// Helper functions
export function getQuestionById(id: string): Question | undefined {
  return QUIZ_QUESTIONS.find(q => q.id === id);
}

export function getPhaseQuestions(phase: 1 | 2 | 3): Question[] {
  return QUIZ_QUESTIONS.filter(q => q.phase === phase);
}

export function getQuestionPhase(questionNumber: number): 1 | 2 | 3 {
  if (questionNumber <= 8) return 1;
  if (questionNumber <= 16) return 2;
  return 3;
}

export function getPhaseForQuestion(questionId: string): 1 | 2 | 3 {
  const question = getQuestionById(questionId);
  return question?.phase ?? 1;
}

export function isEndOfPhase(questionNumber: number): boolean {
  return questionNumber === 8 || questionNumber === 16 || questionNumber === 24;
}

export function getAnswerById(questionId: string, answerId: string): Answer | undefined {
  const question = getQuestionById(questionId);
  return question?.answers.find(a => a.id === answerId);
}

export function getQuestionNumber(questionId: string): number {
  const index = QUIZ_QUESTIONS.findIndex(q => q.id === questionId);
  return index + 1;
}
