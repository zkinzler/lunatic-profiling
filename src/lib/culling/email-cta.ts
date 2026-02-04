// ============================================
// The Culling - Frank Kern Style Email CTA Escalation
// ============================================

export interface EmailCtaContent {
  stage: number;
  headline: string;
  body: string;
  yesButtonText: string;
  noButtonText: string;
  dismissed?: boolean;
}

/**
 * Email CTA stages:
 * 0 - Initial ask
 * 1 - After first "No" (escalate)
 * 2 - After second "No" (final attempt)
 * 3 - Email captured (thank you)
 */
export const EMAIL_CTA_STAGES: EmailCtaContent[] = [
  {
    stage: 0,
    headline: "You've proven you're not entirely basic.",
    body: `Most people who take this quiz are culled within seconds. You made it through. That means something. We're building something for people like you - the ones who get it. Drop your email and we'll tell you when it's ready. No spam. No bullshit. Just occasional brilliance from one weirdo to another.`,
    yesButtonText: "Fine, take my email",
    noButtonText: "Hard pass",
  },
  {
    stage: 1,
    headline: "Playing hard to get? Cute.",
    body: `Look, we get it. Your inbox is a wasteland of newsletters you never read. But here's the thing - we're not selling you anything. We're collecting the strange ones. The ones who see through the normal facade. One email. Maybe two per month. Each one written specifically for minds that work like yours. But hey, if you want to miss out on being part of something actually interesting for once in your digital life...`,
    yesButtonText: "Okay okay, you win",
    noButtonText: "Still no",
  },
  {
    stage: 2,
    headline: "Last chance, ghost.",
    body: `This is it. The final ask. After this, you vanish into the algorithmic void, just another face in the culled masses. We won't beg. Begging is for people who need validation. We just want to know: are you one of the rare ones who follows through? Or do you fade into the background like everyone who said they'd "do it later"? No pressure. Except all the pressure. Because this is actually your last chance.`,
    yesButtonText: "FINE. Here's my email.",
    noButtonText: "Goodbye forever",
    dismissed: false,
  },
  {
    stage: 3,
    headline: "Welcome to the inside.",
    body: `You did it. You're in. Not because you clicked a button, but because you recognized that sometimes the weird thing is the right thing. We'll be in touch. Not often. Not desperately. Just... when we have something worth your attention. Which, if we're being honest, is more than most of your inbox can say.`,
    yesButtonText: "",
    noButtonText: "",
  },
];

export function getEmailCtaContent(stage: number): EmailCtaContent {
  if (stage >= EMAIL_CTA_STAGES.length) {
    return EMAIL_CTA_STAGES[EMAIL_CTA_STAGES.length - 1];
  }
  return EMAIL_CTA_STAGES[stage];
}

export function getNextStage(currentStage: number, saidYes: boolean): number {
  if (saidYes) {
    return 3; // Email captured
  }

  // After stage 2 "no", they're dismissed (stage stays at 2 but marked as dismissed)
  if (currentStage >= 2) {
    return 2; // Stay at 2, but track dismissed state separately
  }

  return currentStage + 1;
}

export function isEmailCaptured(stage: number): boolean {
  return stage === 3;
}

export function isDismissed(stage: number): boolean {
  return stage >= 2; // They said no at stage 2, which is the final
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

// Generate thank you message variations
const THANK_YOU_MESSAGES = [
  "The void acknowledges your submission.",
  "You've made a questionable but intriguing decision.",
  "Welcome to the fold, fellow lunatic.",
  "Your email has been catalogued. The ghosts are pleased.",
  "The chaos network expands by one.",
];

export function getThankYouMessage(): string {
  return THANK_YOU_MESSAGES[Math.floor(Math.random() * THANK_YOU_MESSAGES.length)];
}
