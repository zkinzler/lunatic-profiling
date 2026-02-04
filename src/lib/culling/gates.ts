// ============================================
// The Culling - Gate Questions (Binary Pass/Fail)
// ============================================

export interface Gate {
  id: string;
  gateNumber: number;
  question: string;
  yesText: string;
  noText: string;
  correctAnswer: boolean; // true = YES passes, false = NO passes
  passMessage: string;
  cullReason: string;
  shareText: string;
}

export const GATES: Gate[] = [
  {
    id: 'gate1',
    gateNumber: 1,
    question: 'Have you resided in the UK through at least three national humiliations?',
    yesText: 'Yes',
    noText: 'No',
    correctAnswer: true, // YES passes
    passMessage: 'One down. Only four more ways to fail.',
    cullReason: '❌ FILTERED. Insufficient scarring. Your optimism is offensive.',
    shareText: 'I failed The Culling\'s gatekeeper test. Apparently, I\'m not cynical enough.',
  },
  {
    id: 'gate2',
    gateNumber: 2,
    question: 'Do you have any involvement in UK law enforcement?',
    yesText: 'Yes',
    noText: 'No',
    correctAnswer: false, // NO passes
    passMessage: 'Good. We\'ve enough uniforms ruining things.',
    cullReason: '❌ FILTERED. State-sanctioned fun prevention detected.',
    shareText: 'I failed The Culling for being part of the two-level policing.',
  },
  {
    id: 'gate3',
    gateNumber: 3,
    question: 'Have you ever reported someone for a social media post?',
    yesText: 'Yes',
    noText: 'No',
    correctAnswer: false, // NO passes
    passMessage: 'Surprising. Most would report their mum for a typo.',
    cullReason: '❌ FILTERED. Digital grass! A blade of grass has more backbone.',
    shareText: 'I failed The Culling for being professionally offended.',
  },
  {
    id: 'gate4',
    gateNumber: 4,
    question: 'Have you ever had a Ukraine, Palestine, Star of David, or rainbow flag on your social media profile?',
    yesText: 'Yes',
    noText: 'No',
    correctAnswer: false, // NO passes
    passMessage: 'Either principled or lazy. We\'ll assume lazy.',
    cullReason: '❌ FILTERED. Profile pic activism isn\'t a personality.',
    shareText: 'I failed The Culling for confusing flags with character.',
  },
  {
    id: 'gate5',
    gateNumber: 5,
    question: 'Do you require beverage assistance to tolerate family gatherings?',
    yesText: 'Yes',
    noText: 'No',
    correctAnswer: true, // YES passes
    passMessage: '✅ GATES PASSED.\n\nChrist. You made it through the filter.\n\nNow the actual quiz. 10 questions. Each answer gets a personalised insult.\n\nTry not to take it personally. (You will.)',
    cullReason: '❌ FILTERED. Liar or alien. Either way, fuck off.',
    shareText: 'I failed The Culling for claiming to enjoy my family when sober.',
  },
];

export function getGateById(gateId: string): Gate | undefined {
  return GATES.find(g => g.id === gateId);
}

export function getGateByNumber(gateNumber: number): Gate | undefined {
  return GATES.find(g => g.gateNumber === gateNumber);
}

export function checkGateAnswer(gateId: string, answer: boolean): { passed: boolean; passMessage?: string; cullReason?: string; shareText?: string } {
  const gate = getGateById(gateId);
  if (!gate) {
    return { passed: false, cullReason: 'Invalid gate' };
  }

  const passed = answer === gate.correctAnswer;
  return {
    passed,
    passMessage: passed ? gate.passMessage : undefined,
    cullReason: passed ? undefined : gate.cullReason,
    shareText: passed ? undefined : gate.shareText,
  };
}

export const TOTAL_GATES = GATES.length;
