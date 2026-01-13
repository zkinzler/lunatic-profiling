/**
 * Lunatic Profiling V2 - Roast Generation System
 *
 * Generates roasts based on answer selections after each question.
 * Categories match the answer's roastCategory field.
 */

import type { RoastCategory } from './questions';

// Roast templates by category
const ROAST_TEMPLATES: Record<RoastCategory, string[]> = {
  VN_CS: [
    "Christ. You'd tell a toddler their drawing looks like a depressed hedgehog took a shit. The brutal efficiency is almost beautiful.",
    "No prisoners, no mercy, no time for feelings. You've basically chosen 'thermonuclear option' when 'gentle disagreement' was available.",
    "You absolute weapon. That's not problem-solving, that's problem-annihilation with extreme prejudice.",
    "Somewhere, a conflict resolution specialist just felt a chill run down their spine. That's you. You're the chill.",
    "Subtlety called. It wants nothing to do with you. And honestly? That's probably for the best.",
    "You've essentially chosen to bring a flamethrower to a candle-lighting ceremony. Respect.",
    "Diplomacy was an option. You chose psychological warfare. Bold strategy, Cotton.",
    "You don't just burn bridges—you salt the earth where they stood and leave a commemorative plaque.",
  ],
  CTD_DL: [
    "You've properly overthought this. The kettle's working with the toaster, isn't it? They're definitely plotting something. You beautiful, anxious mess.",
    "You apologise for existing while simultaneously believing everything's connected. It's like watching someone sorry their way through a conspiracy theory.",
    "The amount of emotional labor you've done here would qualify for a pension. Bless your overworking heart.",
    "You've managed to both see the hidden pattern AND feel guilty about seeing it. Peak British neurodivergence.",
    "Somewhere between 'sorry' and 'but have you noticed...' lives your entire personality. It's exhausting and we love it.",
    "You're the person who apologises to furniture when you bump into it, then wonders if the furniture is part of a larger network.",
    "That's not just a decision—it's a whole internal committee meeting with apologies to the minutes.",
    "You've found a way to be both the detective and the apologetic bystander. Impressive, honestly.",
  ],
  YO_MM: [
    "YOLO! You absolute legend! You've gone full 'consequences are tomorrow's problem' and honestly, we respect the commitment to chaos.",
    "You've basically decided to interpretive dance through this situation. No plan. No safety net. Just vibes. Magnificent.",
    "That's not a strategy—that's a series of enthusiastic gestures with good lighting. And somehow it might work.",
    "You've chosen the path of maximum entertainment value. Whatever happens, it'll make a great story.",
    "Life gave you lemons and you've decided to juggle them whilst on fire. The aesthetic is immaculate.",
    "You're not avoiding the problem—you're turning it into performance art. Gallery opening when?",
    "That decision had the structural integrity of a soap bubble, but damn if it isn't pretty.",
    "You've managed to make reckless abandonment look like a deliberate creative choice. Iconic.",
  ],
  SO_TMZ: [
    "You'd spreadsheet your own funeral. 'Mourning efficiency: 47%. Suggested improvements: Less wailing, more canapés.'",
    "The calm, measured precision here is either zen or psychopathy. Either way, it's beautifully formatted.",
    "You've turned emotional chaos into a system with proper documentation. Terrifying and impressive.",
    "That's not a response—it's a process optimization with footnotes. You're the person who brings agenda items to a breakdown.",
    "The bureaucratic elegance of this choice is almost erotic. In a forms-in-triplicate kind of way.",
    "You've essentially KonMari'd this situation. Does the chaos spark joy? No? File it under 'resolved'.",
    "Somewhere there's a spreadsheet that tracks your feelings. It has conditional formatting. It's immaculate.",
    "You've found peace through process. The monk who discovered enlightenment in pivot tables.",
  ],
  BN: [
    "You're... normal? In this context, that's the weirdest thing you could be. You magnificent, sensible creature.",
    "The sheer audacity of being reasonable. Everyone's losing their mind and you're just... coping? Witchcraft.",
    "You've chosen the sane option. In a quiz about lunacy. The irony is not lost. You're the control group.",
    "That's disturbingly level-headed. Are you sure you're taking this seriously? We're worried about you.",
    "Common sense? In THIS economy? The bravery of basic functionality is genuinely inspiring.",
    "You're the person who'd suggest 'just talking about it' when everyone else is preparing for war. Respect.",
    "The normality of your response is, paradoxically, the most chaotic thing here. You've broken the matrix.",
    "You've essentially chosen to be the designated driver at a party on a runaway train. Someone has to, I suppose.",
  ],
  MIXED: [
    "That's... a choice. Not a coherent one, but definitely a choice. Your brain is a fascinating place.",
    "You've somehow managed to be multiple types of unhinged simultaneously. Efficient, if nothing else.",
    "The internal contradiction here is almost philosophical. You contain multitudes. Confusing multitudes, but multitudes.",
    "That response suggests your decision-making process involves dice, vibes, and mild chaos. Perfect.",
    "You've played all sides so you always come out on top. Or bottom. Or sideways. We're not sure.",
    "The strategic ambiguity of this choice would make a politician proud and a therapist concerned.",
    "You're not indecisive—you're deliberately keeping all options open through chaos. Galaxy brain.",
    "That's the answer of someone who wants to see what happens. You beautiful agent of entropy.",
  ],
};

// Pattern-based roasts for special detection
const PATTERN_ROASTS = {
  consecutiveA: [
    "Three A's in a row? You're not answering questions, you're speedrunning personality assessment. Commitment to chaos, noted.",
    "A-A-A? Either you're extremely consistent or you're not reading the questions. Both valid. Both concerning.",
    "The 'first option always' strategy. Bold. Lazy. Iconic.",
  ],
  consecutiveB: [
    "B-B-B? The second option every time. You're the 'not the worst, not the best' of human decision-making.",
    "Triple B's suggest you're a professional 'actually, what about...' person. Contrarian energy, respected.",
    "The B trilogy. You're allergic to obvious choices but too sensible for chaos. Middle manager energy.",
  ],
  consecutiveC: [
    "C-C-C? The centrist of chaos. You refuse to commit but you refuse to not participate. Political.",
    "Three C's in a row. You're the 'I'm not like other lunatics, I'm a NUANCED lunatic' type.",
    "The C streak. You've found the golden mean of dysfunction. Aristotle would be confused but impressed.",
  ],
  consecutiveLast: [
    "Always choosing the last option? You're either thorough or you just like scrolling. Both concerning.",
    "Three final options in a row. You're the person who reads the entire menu twice, aren't you?",
    "The 'bottom of the list' trilogy. Either genius or you just really like letters near the end of the alphabet.",
  ],
  middleBias: [
    "Heavy C, D, E energy. You're aggressively medium. The beige of personality types. It's... almost impressive.",
    "The middle options are calling to you. You're Switzerland in human form. Neutral to a fault.",
    "Such commitment to centrism. You'd probably describe yourself as 'a bit of everything' at parties.",
  ],
  allOverThePlace: [
    "Your answer pattern looks like a cat walked across a keyboard. Beautiful, random, concerning.",
    "A, then F, then C, then... are you okay? This isn't a strategy, it's a cry for help with good formatting.",
    "The chaos of your selections suggests either genius or a very specific type of ADHD. Possibly both.",
  ],
};

// Intro phrases to add variety
const INTRO_PHRASES = [
  "Oh, lovely.",
  "Right then.",
  "Well well well.",
  "Interesting.",
  "Noted.",
  "Ah.",
  "Hmm.",
  "Fascinating.",
  "Of course.",
  "Naturally.",
  "Oh dear.",
  "Brilliant.",
  "Classic.",
  "There it is.",
  "Wonderful.",
];

/**
 * Get a random item from an array
 */
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Detect patterns in answer history
 */
export function detectPattern(
  answerHistory: string[]
): 'consecutiveA' | 'consecutiveB' | 'consecutiveC' | 'consecutiveLast' | 'middleBias' | 'allOverThePlace' | null {
  if (answerHistory.length < 3) return null;

  // Get last 3 answers
  const recent = answerHistory.slice(-3);
  const letters = recent.map(a => a.charAt(a.length - 1).toUpperCase());

  // Check for consecutive same letter
  if (letters.every(l => l === 'A')) return 'consecutiveA';
  if (letters.every(l => l === 'B')) return 'consecutiveB';
  if (letters.every(l => l === 'C')) return 'consecutiveC';
  if (letters.every(l => ['G', 'H', 'F'].includes(l))) return 'consecutiveLast';

  // Check for middle bias (last 5 answers)
  if (answerHistory.length >= 5) {
    const recent5 = answerHistory.slice(-5);
    const middleCount = recent5.filter(a => {
      const letter = a.charAt(a.length - 1).toUpperCase();
      return ['C', 'D', 'E'].includes(letter);
    }).length;
    if (middleCount >= 4) return 'middleBias';
  }

  // Check for all over the place (high variance in last 4)
  if (answerHistory.length >= 4) {
    const recent4 = answerHistory.slice(-4);
    const uniqueLetters = new Set(recent4.map(a => a.charAt(a.length - 1).toUpperCase()));
    if (uniqueLetters.size === 4) return 'allOverThePlace';
  }

  return null;
}

/**
 * Generate a roast based on the selected answer's category and history
 */
export function generateRoast(
  category: RoastCategory,
  answerHistory: string[] = []
): string {
  // Check for patterns first (30% chance if pattern detected)
  const pattern = detectPattern(answerHistory);
  if (pattern && Math.random() < 0.3) {
    return randomChoice(PATTERN_ROASTS[pattern]);
  }

  // Get category roast
  const templates = ROAST_TEMPLATES[category];
  const roast = randomChoice(templates);

  // 40% chance to add intro phrase
  if (Math.random() < 0.4) {
    return `${randomChoice(INTRO_PHRASES)} ${roast}`;
  }

  return roast;
}

/**
 * Generate a phase transition roast (more elaborate)
 */
export function generatePhaseTransitionRoast(
  phase: 1 | 2,
  leadingArchetype: string,
  traitHighlights: { trait: string; level: 'high' | 'medium' | 'low' }[]
): string {
  const phase1Messages: Record<string, string> = {
    VN: "Bullshit detected. And apparently, you've made destroying it your entire personality. Phase 2 will test if that's sustainable or just exhausting.",
    CTD: "You see patterns. Everywhere. In everything. Phase 2 will determine if you're a prophet or just really, really anxious.",
    YO: "Chaos embraced. Consequences delayed. Phase 2 will reveal if this is a lifestyle or a coping mechanism. (It's both.)",
    SO: "Everything's been optimised. Even your emotions have a filing system. Phase 2 introduces... variables.",
    DL: "You've apologised to the quiz itself, haven't you? Phase 2 will see if that diplomacy holds under pressure.",
    MM: "The aesthetic curation is noted. Phase 2 will test if you can make a complete breakdown look like a design choice.",
    TMZ: "Zen achieved through bureaucracy. Phase 2 will introduce chaos that cannot be formatted.",
    CS: "Problems have been annihilated. Phase 2 will provide more targets. Try to look less delighted about it.",
    BN: "You're... coping? Normally? Phase 2 will try harder to break you. For science.",
  };

  const phase2Messages: Record<string, string> = {
    VN: "The bullshit tolerance is being stress-tested. Phase 3 brings the final reckoning. Sharpen your precision guillotine.",
    CTD: "Patterns intensifying. Phase 3 will reveal if you're weaving genius or unraveling completely.",
    YO: "YOLO energy sustained. Phase 3 brings consequences you've been successfully ignoring.",
    SO: "The spreadsheet approaches its final form. Phase 3 will determine if enlightenment is just really good formatting.",
    DL: "Apologies deployed with military precision. Phase 3 will test the limits of your diplomatic arsenal.",
    MM: "Reality has been curated within an inch of its life. Phase 3 is the gallery opening.",
    TMZ: "Zen maintained under pressure. Phase 3 will attempt to disrupt your carefully formatted calm.",
    CS: "Surgical strikes continue. Phase 3 brings the final boss problems. Look alive.",
    BN: "Still boringly functional. Phase 3 will throw everything at you. We believe in you, you magnificent normie.",
  };

  const messages = phase === 1 ? phase1Messages : phase2Messages;
  const baseMessage = messages[leadingArchetype] || "Your lunacy is taking shape. The next phase will define it.";

  // Add trait highlight if we have a strongly high or low trait
  const highTrait = traitHighlights.find(t => t.level === 'high');
  const lowTrait = traitHighlights.find(t => t.level === 'low');

  let traitNote = '';
  if (highTrait) {
    const traitNotes: Record<string, string> = {
      BST: "Your Bullshit Tolerance is reading off the charts. The world's nonsense doesn't stand a chance.",
      CPR: "Your Chaos Precision is unnervingly high. You're not just surviving chaos—you're conducting it.",
      AE: "Your Apology Efficiency is... weaponised. You could sorry your way out of a war crime.",
      BS: "Your British Stoicism is frightening. The building could be on fire and you'd offer to make tea.",
    };
    traitNote = traitNotes[highTrait.trait] || '';
  } else if (lowTrait) {
    const traitNotes: Record<string, string> = {
      BST: "Your Bullshit Tolerance is concerningly low. You might actually believe things at face value. Terrifying.",
      CPR: "Your Chaos Precision needs work. You're not creating elegant chaos—you're just creating chaos.",
      AE: "Your Apology Efficiency is lacking. You're either too honest or too stubborn to be properly British.",
      BS: "Your British Stoicism is underdeveloped. You might actually EXPRESS emotions. How continental.",
    };
    traitNote = traitNotes[lowTrait.trait] || '';
  }

  return traitNote ? `${baseMessage}\n\n${traitNote}` : baseMessage;
}

/**
 * Get roast for specific answer combinations (special easter eggs)
 */
export function getSpecialRoast(questionId: string, answerId: string): string | null {
  const specialRoasts: Record<string, Record<string, string>> = {
    // Q1: Kettle question
    q1: {
      q1c: "KETTLE COUP. You've chosen to establish a kitchen parliament. This is either democracy or madness. Probably both.",
      q1h: "Replacing the kettle? That's... that's the SANE choice. In a quiz about lunacy. We're watching you.",
    },
    // Q8: End of Phase 1 - Work crisis
    q8: {
      q8a: "TACTICAL INSANITY ACTIVATED. You've essentially chosen 'if the building's on fire, might as well roast marshmallows.'",
      q8h: "Calling in sick for a WORK crisis? The logic is so circular it's art. Chef's kiss.",
    },
    // Q16: End of Phase 2 - Shadow deity
    q16: {
      q16a: "You've chosen to negotiate with an ancient shadow deity. With HR tactics. This is either brilliant or very, very bad.",
      q16h: "Ghosting a COSMIC DEITY? The confidence. The audacity. The pure, unbridled serotonin.",
    },
    // Q24: Final judgment
    q24: {
      q24a: "YOLO to the literal afterlife. You've died as you lived: with zero regrets and maximum chaos.",
      q24h: "Outsourcing your eternal judgment to committee? Peak bureaucratic energy. Even death can't escape your process improvements.",
    },
  };

  return specialRoasts[questionId]?.[answerId] || null;
}

export type { RoastCategory };
