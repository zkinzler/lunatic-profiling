// ============================================
// The Culling - Roasts per Ghost Type & Phase
// ============================================

import type { GhostCode } from './ghosts';

export type RoastPhase = 'gate_pass' | 'gate_fail' | 'answer_phase1' | 'answer_phase2' | 'final_elite' | 'final_culled';

// Phase 1 Answer Roasts (Q1-5): Based on ghost type from answer
// A=DD, B=CA, C=OB, D=CD
const PHASE1_ANSWER_ROASTS: Record<GhostCode, string[]> = {
  DD: [
    "Your emotional range makes a dial-up modem seem expressive.",
    "You answered that with the warmth of a Greggs sausage roll left on a park bench since Tuesday.",
    "Somewhere a therapist just felt a chill and doesn't know why.",
    "You could read someone their terminal diagnosis and they'd think you were ordering a takeaway.",
    "That answer had the emotional depth of a puddle in a Lidl car park.",
  ],
  CA: [
    "You'd burn down an orphanage to see what colour the smoke is.",
    "Your brain doesn't connect dots — it sets fire to the paper and watches what shape the ash makes.",
    "That's the kind of answer that gets you banned from a pub quiz and invited to a better one.",
    "You chose violence and somehow made it entertaining. Worrying.",
    "Chaotic. Unhinged. Strangely compelling. Like a fox in a Tesco Express.",
  ],
  OB: [
    "You notice everything. And hate everything you notice.",
    "You've got the observational skills of a CCTV camera with depression.",
    "That answer says you've spent years watching people fail and taking detailed notes.",
    "You see the world clearly, and it's clearly shit. Fair enough.",
    "Wearily accurate. Like a weather forecast that only predicts rain because it's Britain.",
  ],
  CD: [
    "You'd perform surgery without anaesthetic and charge for the privilege.",
    "That answer was so precise it should come with a scalpel and a written apology.",
    "Clinical. Devastating. The kind of answer that ruins Christmas dinners with surgical efficiency.",
    "You don't tell jokes — you perform autopsies on people's self-esteem.",
    "That landed like a perfectly aimed dart at someone who thought they were safe.",
  ],
};

// Phase 2 Answer Roasts (Q6-10): Based on ghost type from answer
// A=CD, B=CA, C=OB, D=DD
const PHASE2_ANSWER_ROASTS: Record<GhostCode, string[]> = {
  CD: [
    "Precise cruelty. You could dissect a butterfly and make it feel ashamed.",
    "You're doubling down on the precision. At this point you're not funny, you're a weapon.",
    "Another surgical strike. You're basically a Predator drone with a comedy degree.",
    "The consistency is terrifying. You've found the jugular and you keep going back to it.",
    "You treat conversation like open-heart surgery — except you enjoy it more.",
  ],
  CA: [
    "Beautiful, stupid chaos. The human equivalent of a firework in a library.",
    "You're committed to the chaos now. There's no coming back from this. Godspeed.",
    "That answer had the structural integrity of a Jenga tower in an earthquake.",
    "You're the person who flips the Monopoly board and somehow everyone has a better time.",
    "Unhinged in a way that suggests you peaked during a fire alarm at school.",
  ],
  OB: [
    "Weary accuracy. You see the cliff edge and just sigh.",
    "You keep pointing out the obvious truths nobody wants to hear. Very British of you.",
    "Another observation that makes everyone uncomfortable. You're like a mirror nobody asked for.",
    "You've got the comedy instincts of someone who's read every TripAdvisor review of their own life.",
    "Brutally perceptive. The kind of mate who ruins films by predicting every twist correctly.",
  ],
  DD: [
    "Terminal logic. You'd calculate the exact moment to stop caring.",
    "You're so deadpan the pan itself is filing a restraining order.",
    "Another flat delivery. You make a speak-your-weight machine sound animated.",
    "Emotionally arid. The Sahara called — it wants to know your secret.",
    "You answer questions like you're filling in a tax return. And somehow it's devastating.",
  ],
};

// Final elite roasts by ghost type (4% Elite)
const FINAL_ELITE_INTRO = `🔥 OFFICIAL DIAGNOSIS: `;
const FINAL_ELITE_SUFFIX = ` 🔥

You're in the 4%. The elite. The terminally funny.`;

const FINAL_ELITE_DESCRIPTIONS: Record<GhostCode, {
  title: string;
  description: string;
  skill: string;
  pattern: string;
  excels: string;
  avoid: string;
}> = {
  CD: {
    title: 'SURGICAL',
    description: "You don't make jokes - you perform autopsies on situations.",
    skill: "constructing multi-layered insults that wound precisely where intended",
    pattern: "calculated cruelty combined with impeccable timing",
    excels: "When precision matters. Corporate takedowns, surgical put-downs, making someone question their entire life with a single sentence.",
    avoid: "Improv situations where speed trumps accuracy. Your need for the perfect word will make you miss the moment.",
  },
  CA: {
    title: 'CHAOS',
    description: "Your brain connects dots that shouldn't exist. It's not madness, it's art.",
    skill: "turning any conversation into a beautiful trainwreck",
    pattern: "unpredictability that somehow lands more often than it should",
    excels: "When the rules need breaking. Parties, creative disasters, any situation that benefits from someone setting fire to the script.",
    avoid: "Formal situations where they expect you to behave. Your chaos doesn't have an off switch.",
  },
  OB: {
    title: 'OBSERVATIONAL',
    description: "You see what everyone sees but say what everyone's too polite to mention.",
    skill: "making people feel uncomfortably seen while laughing",
    pattern: "weary accuracy that makes people whisper 'oh god, that's me'",
    excels: "When truth needs telling. Social commentary, reality checks, making people laugh at their own absurdity.",
    avoid: "Situations requiring optimism. Your gift for seeing the truth makes hope feel naive.",
  },
  DD: {
    title: 'DEADPAN',
    description: "You deliver devastation with the enthusiasm of a man reading a Tesco receipt.",
    skill: "making people unsure if you're joking until it's too late",
    pattern: "emotional flatness that somehow hits harder than screaming",
    excels: "When restraint is power. Dry comebacks, uncomfortable silences, making people question if you're serious.",
    avoid: "Situations requiring visible enthusiasm. Your face will betray your commitment to emotional neutrality.",
  },
};

// Final culled roasts (96% Culled)
const FINAL_CULLED_INTRO = `💀 OFFICIAL VERDICT: INCONCLUSIVE DAMAGE 💀

You understand the jokes but can't commit to a style.
You're the 96% - aware it's fucked but still occasionally hopeful.`;

const FINAL_CULLED_DESCRIPTIONS: Record<GhostCode, {
  approximation: string;
  mediocrity: string;
  whatWentWrong: string;
}> = {
  CD: {
    approximation: 'SURGICAL tendencies',
    mediocrity: "almost landing a clever insult but pulling the punch at the last second",
    whatWentWrong: "You dabble in precision but lack the commitment to true cruelty. You want to cut but you're using safety scissors.",
  },
  CA: {
    approximation: 'CHAOS tendencies',
    mediocrity: "being random without being funny",
    whatWentWrong: "You reach for chaos but only find noise. True chaos has purpose. Yours was just... loud.",
  },
  OB: {
    approximation: 'OBSERVATIONAL tendencies',
    mediocrity: "pointing out the obvious and thinking it's insight",
    whatWentWrong: "You tried to observe but only saw the surface. Observation requires depth. You brought a kiddie pool.",
  },
  DD: {
    approximation: 'DEADPAN tendencies',
    mediocrity: "being quiet and hoping people would find it mysterious",
    whatWentWrong: "Deadpan requires something behind the dead eyes. You had the pan, but nothing was cooking.",
  },
};

/**
 * Get an answer roast based on question number and ghost type
 */
export function getAnswerRoast(questionNumber: number, ghostCode: GhostCode): string {
  const roasts = questionNumber <= 5 ? PHASE1_ANSWER_ROASTS[ghostCode] : PHASE2_ANSWER_ROASTS[ghostCode];
  return roasts[Math.floor(Math.random() * roasts.length)];
}

/**
 * Get the final result roast - returns a complete formatted result
 */
export function getFinalRoast(ghostCode: GhostCode, isElite: boolean): string {
  if (isElite) {
    const elite = FINAL_ELITE_DESCRIPTIONS[ghostCode];
    return `${FINAL_ELITE_INTRO}${elite.title}${FINAL_ELITE_SUFFIX}

YOUR UNIQUE COMEDY FINGERPRINT:
• Top 1% at: "${elite.skill}"
• Only 3% of survivors share your "${elite.pattern}"
• Your answers placed you in the 99th percentile for "${elite.description}"

YOUR COMEDY IS MOST CUTTING WHEN:
${elite.excels}

SITUATIONS YOU SHOULD AVOID AT ALL COSTS:
${elite.avoid}

WHAT THIS MEANS:
${elite.description}`;
  }

  const culled = FINAL_CULLED_DESCRIPTIONS[ghostCode];
  return `${FINAL_CULLED_INTRO}

NEAREST APPROXIMATION: ${culled.approximation}

YOUR UNIQUE MEDIOCRITY:
Top 5% at "${culled.mediocrity}"

WHAT WENT WRONG:
${culled.whatWentWrong}

TRY HARDER:
• Pick a lane
• Drink more
• Care less`;
}

/**
 * Get share text for results
 */
export function getShareText(ghostCode: GhostCode, isElite: boolean): string {
  const elite = FINAL_ELITE_DESCRIPTIONS[ghostCode];

  if (isElite) {
    return `I'm in The Culling's 4%. Officially diagnosed as ${elite.title}. My comedy is weaponised ${elite.description.toLowerCase()}`;
  }

  return `I was Culled by The Culling. Apparently, my humour has commitment issues (like my relationships and gym membership).`;
}

/**
 * Get the elite description for a ghost type
 */
export function getEliteDescription(ghostCode: GhostCode): typeof FINAL_ELITE_DESCRIPTIONS[GhostCode] {
  return FINAL_ELITE_DESCRIPTIONS[ghostCode];
}

/**
 * Get the culled description for a ghost type
 */
export function getCulledDescription(ghostCode: GhostCode): typeof FINAL_CULLED_DESCRIPTIONS[GhostCode] {
  return FINAL_CULLED_DESCRIPTIONS[ghostCode];
}
