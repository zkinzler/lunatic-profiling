import { z } from 'zod';

// Archetype codes enum
export const ArchetypeCodeEnum = z.enum([
  'VN', 'CTD', 'YO', 'SO', 'DL', 'MM', 'TMZ', 'CS', 'BN'
]);
export type ArchetypeCodeType = z.infer<typeof ArchetypeCodeEnum>;

// Trait codes enum
export const TraitCodeEnum = z.enum(['BST', 'CPR', 'AE', 'BS']);
export type TraitCodeType = z.infer<typeof TraitCodeEnum>;

// Individual archetype result
export const ArchetypeResultSchema = z.object({
  code: ArchetypeCodeEnum,
  name: z.string(),
  pubLegend: z.string(),
  score: z.number(),
  percentage: z.number().min(0).max(100),
});
export type ArchetypeResult = z.infer<typeof ArchetypeResultSchema>;

// Hybrid profile detection
export const HybridProfileSchema = z.object({
  detected: z.boolean(),
  primary: ArchetypeCodeEnum.optional(),
  secondary: ArchetypeCodeEnum.optional(),
  hybridName: z.string().optional(),
  percentageDiff: z.number().optional(),
  description: z.string().optional(),
});
export type HybridProfile = z.infer<typeof HybridProfileSchema>;

// Trait scores
export const TraitScoresSchema = z.object({
  BST: z.number(),
  CPR: z.number(),
  AE: z.number(),
  BS: z.number(),
});
export type TraitScoresType = z.infer<typeof TraitScoresSchema>;

// Theme scores for specialization tracking
export const ThemeScoresSchema = z.record(z.string(), z.number());
export type ThemeScoresType = z.infer<typeof ThemeScoresSchema>;

// Overlap detection (for similar archetypes)
export const OverlapSchema = z.object({
  archetypes: z.array(ArchetypeCodeEnum),
  similarity: z.number(),
});
export type Overlap = z.infer<typeof OverlapSchema>;

// Chaos pattern analysis
export const ChaosPatternSchema = z.enum([
  'front_loaded',    // >40% first options (A/B)
  'escalating',      // >40% last options (F/G/H)
  'ping_pong',       // Frequently both first AND last
  'contained',       // >50% middle options (C/D/E)
  'adaptive',        // No single pattern >40%
]);
export type ChaosPattern = z.infer<typeof ChaosPatternSchema>;

// Resistance clearance levels
export const ResistanceClearanceSchema = z.enum([
  'Probationary Lunatic',
  'Operative Grade II',
  'Senior Chaos Agent',
  'Director of Strategic Weirdness',
  'Supreme Chaos Chancellor',
]);
export type ResistanceClearance = z.infer<typeof ResistanceClearanceSchema>;

// Full Lunacy Blueprint
export const LunacyBlueprintSchema = z.object({
  // Primary and secondary archetypes
  primaryArchetype: ArchetypeResultSchema,
  secondaryArchetype: ArchetypeResultSchema.optional(),

  // Hybrid detection
  hybridProfile: HybridProfileSchema,

  // All scores
  allArchetypeScores: z.record(ArchetypeCodeEnum, z.number()),
  allArchetypePercentages: z.record(ArchetypeCodeEnum, z.number()),

  // Trait scores
  traitScores: TraitScoresSchema,
  traitPercentages: TraitScoresSchema,

  // Theme/specialization
  themeScores: ThemeScoresSchema,
  specialization: z.string().optional(),

  // Blueprint narrative sections
  coreDriver: z.string(),
  superpower: z.string(),
  kryptonite: z.string(),
  repressedShadow: z.string(),
  internalConflict: z.string(),
  finalForm: z.string(),
  signatureMove: z.string(),
  chaosPartner: z.string(),

  // Computed stats
  britishnessQuotient: z.number(),
  britishnessInterpretation: z.string(),
  resistanceClearanceLevel: ResistanceClearanceSchema,
  resistanceClearancePoints: z.number(),
  chaosPattern: ChaosPatternSchema,
  chaosPatternDescription: z.string(),

  // Visual elements
  asciiChart: z.string(),

  // LLM-generated summary
  summary: z.string(),

  // Raw model response for debugging
  rawModelJson: z.record(z.string(), z.unknown()).optional(),

  // Shareable stat
  shareableStat: z.string().optional(),
});
export type LunacyBlueprint = z.infer<typeof LunacyBlueprintSchema>;

// Phase transition results
export const PhaseTransitionSchema = z.object({
  phase: z.number().min(1).max(2),
  topArchetypes: z.array(ArchetypeResultSchema).max(3),
  emergingTraits: z.array(z.object({
    trait: TraitCodeEnum,
    score: z.number(),
    percentage: z.number(),
    isHigh: z.boolean(),
  })),
  transitionMessage: z.string(),
  damageProfile: z.string().optional(), // Only for phase 2 transition
});
export type PhaseTransition = z.infer<typeof PhaseTransitionSchema>;

