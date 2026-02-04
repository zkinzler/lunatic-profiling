// ============================================
// The Culling - Main Quiz Questions (A/B/C/D)
// ============================================

import type { GhostCode } from './ghosts';

export type AnswerChoice = 'A' | 'B' | 'C' | 'D';

export interface CullingQuestion {
  id: string;
  questionNumber: number;
  title: string;
  question: string;
  answers: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  // Mapping for Q1-5: A=DD, B=CA, C=OB, D=CD
  // Mapping for Q6-10: A=CD, B=CA, C=OB, D=DD
  ghostMapping: Record<AnswerChoice, GhostCode>;
}

export const CULLING_QUESTIONS: CullingQuestion[] = [
  // Questions 1-5: A=DD, B=CA, C=OB, D=CD
  {
    id: 'cq1',
    questionNumber: 1,
    title: 'WETHERSPOONS PINT SPILL',
    question: 'A drunk man in Wetherspoons on the way back from the bar trips and spills his pint all over your lap. What do you say next?',
    answers: {
      A: 'Well done! My unborn children just drowned in Carling.',
      B: 'For my next trick: Sit on the chocolate cake, pretend I\'ve shit myself too.',
      C: 'Don\'t worry mate, I always wear wet trousers in public.',
      D: 'The carpet will miss that more than I will.',
    },
    ghostMapping: { A: 'DD', B: 'CA', C: 'OB', D: 'CD' },
  },
  {
    id: 'cq2',
    questionNumber: 2,
    title: 'SEAGULL SHIT GREGGS BAG',
    question: 'A flock of seagulls see you walking along the beach and decide to play a game to see who can shit on you first. Bird shit starts landing around you like rain. What\'s your move?',
    answers: {
      A: 'Don\'t look up! This the real meaning of shit-faced!',
      B: 'Film an Instagram short, \'Singing in the Shit\'.',
      C: 'Pop up an umbrella and serenely ignore it. You\'re British after all!',
      D: 'Start collecting it in a Greggs bag. Tell a confused child it\'s \'local produced clotted cream from the seagull king.\'',
    },
    ghostMapping: { A: 'DD', B: 'CA', C: 'OB', D: 'CD' },
  },
  {
    id: 'cq3',
    questionNumber: 3,
    title: 'NHS APP "BIT OF A CUNT"',
    question: 'Your NHS app pings you with: "Our records indicate you\'re quite a cunt at times; please submit your latest smear test immediately." What\'s your response?',
    answers: {
      A: 'That\'s a better offer than I got at the NHS Christmas party.',
      B: 'Reply: \'Results attached.\' Send a photo of your middle finger resting on a Greggs sausage roll.',
      C: '"Fuck off Steve! How did you get them to send this?"',
      D: 'Can I request the doctor who sent it? I\'m looking for a professional opinion.',
    },
    ghostMapping: { A: 'DD', B: 'CA', C: 'OB', D: 'CD' },
  },
  {
    id: 'cq4',
    questionNumber: 4,
    title: 'TALKING DOG DILDO DELIVERY',
    question: 'Your neighbour\'s dog runs up to you and drops a big black dildo at your feet, then looks up and says: "You\'re screwed either way mate, so it may as well be me." How do you respond?',
    answers: {
      A: 'Take a selfie with the dog and dildo and post it on Instagram with the title: \'Scooby Don\'t!\'',
      B: 'Pick it up, hold it to your ear like a phone, and say \'She says she\'ll need it back by seven.\'',
      C: 'Tell the dog, \'Sorry mate, you\'re not my type.\'',
      D: 'Knock on next door, and say: \'I have your Deliverood order.\'',
    },
    ghostMapping: { A: 'DD', B: 'CA', C: 'OB', D: 'CD' },
  },
  {
    id: 'cq5',
    questionNumber: 5,
    title: 'CHICKS WITH DICKS ARREST',
    question: 'The barmaid at your local pub has called the police after overhearing you talk about "Chicks with dicks," which they found offensive. You are arrested by 5 armed officers under Clause 20 of the Employment Rights Bill, and read your rights. What\'s your next comment:',
    answers: {
      A: 'Claim you were misheard talking about Chicks with Wickes, and were talking about DIY.',
      B: 'Tell the officers you were just quoting from the barmaid\'s Grindr bio.',
      C: '"I was talking about my cock...the one in the garden with the hens."',
      D: 'Claim to be a chicken and that you are protected under the 2006 Animal Welfare Act, Section 4. Start clucking.',
    },
    ghostMapping: { A: 'DD', B: 'CA', C: 'OB', D: 'CD' },
  },
  // Questions 6-10: A=CD, B=CA, C=OB, D=DD
  {
    id: 'cq6',
    questionNumber: 6,
    title: 'HEATHROW PRONOUN ARREST',
    question: 'You arrive at Heathrow to find 23 armed officers pointing guns at you as you walk out of the plane. Your tweet about \'they/them\' being plural and grammatically incorrect for a pronoun has caused an influx of heart attacks in A&E departments because it\'s so offensive. You must be stopped. What\'s your move?',
    answers: {
      A: 'Assume the position. Ask if they\'d prefer the data extraction to be fast or forensic. Efficiency benefits us both.',
      B: '\'I identify as fucking terrified!\' and see if they holster their pronouns.',
      C: 'Ask for your phone to call a lawyer. Tweet \'23 armed he/hims just she/her\'d me at Heathrow. Triggered.\'',
      D: '"Wow! When my friend told me there was a stripogram waiting for me, I had no idea this was what I was getting."',
    },
    ghostMapping: { A: 'CD', B: 'CA', C: 'OB', D: 'DD' },
  },
  {
    id: 'cq7',
    questionNumber: 7,
    title: 'FINAL JUDGEMENT BELL END VERDICT',
    question: 'You die and reach the final judgement for your life review. "You have been found guilty of being a bell end. How do you plead?"',
    answers: {
      A: 'I plead \'accurate.\' Your judgement merely confirms my success.',
      B: 'Guilty. Now get on with it, I have a barbecue to get to somewhere downstairs with all my friends!',
      C: 'I plead: Fuck the lot of you! It was fun!',
      D: '\'Found guilty\'? I was voted \'Most Likely To Be One\' at school. This is just paperwork.',
    },
    ghostMapping: { A: 'CD', B: 'CA', C: 'OB', D: 'DD' },
  },
  {
    id: 'cq8',
    questionNumber: 8,
    title: 'APPRENTICE FAILURE DEFENSE',
    question: 'You were project lead on The Apprentice. You lost. Your position is indefensible. Alan Sugar asks why he shouldn\'t fire you. What do you tell him.',
    answers: {
      A: 'I accept responsibility Alan, but there\'s bigger cunts here than me.',
      B: 'But I wasn\'t as bad as Spurs at the weekend. Let\'s face it, we all make mistakes.',
      C: 'I suppose a reference is out of the question?',
      D: 'I\'d sack Mohammed. This is not the profit you\'re looking for!',
    },
    ghostMapping: { A: 'CD', B: 'CA', C: 'OB', D: 'DD' },
  },
  {
    id: 'cq9',
    questionNumber: 9,
    title: 'MI5 BACKDOOR PRIVACY',
    question: 'You found a new tech company promoting privacy on social media, and it has over 10 million people using it. MI5 show up at your house and demand access to your back door. They have been told there may be paedophiles using it. What\'s your first response?',
    answers: {
      A: 'The last time this happened I was given a \'Jim\'ll Fix It\' badge.',
      B: 'You\'re clearly not from Rochdale.',
      C: 'I can assure you officer, there\'s been no paedo\'s near my back door.',
      D: 'Lovely timing. Shall I lube up the backdoor or will you lot just shove hard?',
    },
    ghostMapping: { A: 'CD', B: 'CA', C: 'OB', D: 'DD' },
  },
  {
    id: 'cq10',
    questionNumber: 10,
    title: 'IKEIR FLATPACK CABINETS',
    question: 'You get hired as a marketing manager at a new UK startup - IKEIR. They only sell flatpack cabinets that come with many loose screws, and all the tools. What\'s your Strapline?',
    answers: {
      A: 'Massive tools from a master toolmaker.',
      B: 'Build it once, blame it forever.',
      C: 'Harder wood than a Ukrainian rent boy.',
      D: 'Comes with more screws than most UK prisons.',
    },
    ghostMapping: { A: 'CD', B: 'CA', C: 'OB', D: 'DD' },
  },
];

export function getQuestionById(questionId: string): CullingQuestion | undefined {
  return CULLING_QUESTIONS.find(q => q.id === questionId);
}

export function getQuestionByNumber(questionNumber: number): CullingQuestion | undefined {
  return CULLING_QUESTIONS.find(q => q.questionNumber === questionNumber);
}

export function getGhostFromAnswer(questionId: string, answer: AnswerChoice): GhostCode | null {
  const question = getQuestionById(questionId);
  if (!question) return null;
  return question.ghostMapping[answer];
}

export const TOTAL_QUESTIONS = CULLING_QUESTIONS.length;
