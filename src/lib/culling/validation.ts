// ============================================
// The Culling - Zod Validation Schemas
// ============================================

import { z } from 'zod';

// ============================================
// Session Schemas
// ============================================

/**
 * Start a new Culling session
 * POST /api/culling/start
 */
export const CullingStartSchema = z.object({
  // No email required at start for The Culling
  // Email is captured at the end via CTA
});
export type CullingStartInput = z.infer<typeof CullingStartSchema>;

/**
 * Session ID parameter validation
 */
export const CullingSessionIdSchema = z.object({
  sessionId: z
    .string()
    .min(1, 'Session ID is required')
    .max(50, 'Invalid session ID'),
});
export type CullingSessionIdInput = z.infer<typeof CullingSessionIdSchema>;

/**
 * Public ID parameter validation (for share routes)
 */
export const CullingPublicIdSchema = z.object({
  publicId: z
    .string()
    .min(1, 'Public ID is required')
    .max(50, 'Invalid public ID'),
});
export type CullingPublicIdInput = z.infer<typeof CullingPublicIdSchema>;

// ============================================
// Gate Schemas
// ============================================

/**
 * Submit a gate answer
 * POST /api/culling/gate
 */
export const CullingGateSchema = z.object({
  sessionId: z
    .string()
    .min(1, 'Session ID is required')
    .max(50, 'Invalid session ID'),
  gateId: z
    .string()
    .min(1, 'Gate ID is required')
    .max(10, 'Invalid gate ID'),
  answer: z.boolean({ message: 'Answer must be a boolean (true for YES, false for NO)' }),
});
export type CullingGateInput = z.infer<typeof CullingGateSchema>;

// ============================================
// Question Schemas
// ============================================

/**
 * Valid answer choices for main questions
 */
export const AnswerChoiceSchema = z.enum(['A', 'B', 'C', 'D']);
export type AnswerChoiceInput = z.infer<typeof AnswerChoiceSchema>;

/**
 * Submit a main question answer
 * POST /api/culling/answer
 */
export const CullingAnswerSchema = z.object({
  sessionId: z
    .string()
    .min(1, 'Session ID is required')
    .max(50, 'Invalid session ID'),
  questionId: z
    .string()
    .min(1, 'Question ID is required')
    .max(10, 'Invalid question ID'),
  answer: AnswerChoiceSchema,
});
export type CullingAnswerInput = z.infer<typeof CullingAnswerSchema>;

// ============================================
// Grade Schema
// ============================================

/**
 * Grade the completed quiz
 * POST /api/culling/grade
 */
export const CullingGradeSchema = z.object({
  sessionId: z
    .string()
    .min(1, 'Session ID is required')
    .max(50, 'Invalid session ID'),
});
export type CullingGradeInput = z.infer<typeof CullingGradeSchema>;

// ============================================
// Email CTA Schema
// ============================================

/**
 * Email CTA actions
 * POST /api/culling/email
 */
export const CullingEmailSchema = z.object({
  sessionId: z
    .string()
    .min(1, 'Session ID is required')
    .max(50, 'Invalid session ID'),
  action: z.enum(['yes', 'no'], { message: 'Action must be "yes" or "no"' }),
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email too long')
    .optional()
    .transform((e) => e?.toLowerCase().trim()),
});
export type CullingEmailInput = z.infer<typeof CullingEmailSchema>;

// ============================================
// Validation Helper
// ============================================

export type ValidationSuccess<T> = {
  success: true;
  data: T;
};

export type ValidationFailure = {
  success: false;
  data?: undefined;
  error: string;
  details?: z.ZodIssue[];
};

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

/**
 * Validate input against a schema and return a typed result
 */
export function validateCullingInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): ValidationResult<T> {
  const result = schema.safeParse(input);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const firstError = result.error.issues[0];
  return {
    success: false,
    error: firstError?.message || 'Validation failed',
    details: result.error.issues,
  };
}
