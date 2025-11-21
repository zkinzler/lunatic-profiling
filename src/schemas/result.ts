import { z } from 'zod';

  export const ArchetypeEnum = z.enum([
    'Quantum Magician',
    'Cosmic Jester',
    'Reality Hacker',
    'Dream Alchemist',
    'Chaos Pilot',
    'Shadow Sage',
    'Sacred Rebel',
    'Flow Shaman'
  ]);

  export const ArchetypeSchema = z.object({
    name: ArchetypeEnum,
    percentage: z.number().min(0).max(100),
  });

  export const OverlapSchema = z.object({
    archetypes: z.array(z.string()),
    similarity: z.number(),
  });

  export const ResultSchema = z.object({
    scores: z.record(z.string(), z.number()),
    percentages: z.record(z.string(), z.number().min(0).max(100)),
    topArchetypes: z.array(ArchetypeSchema).min(1).max(3),
    overlaps: z.array(OverlapSchema).default([]),
    asciiChart: z.string(),
    summary: z.string(),
    rawModelJson: z.record(z.string(), z.unknown()).optional(),
  });

  export type Archetype = z.infer<typeof ArchetypeSchema>;
  export type ResultType = z.infer<typeof ResultSchema>;