import { z } from 'zod';

// ============================================
// API Input Validation Schemas
// ============================================

/**
 * Session start request validation
 * POST /api/user/start
 */
export const StartSessionSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email too long')
    .transform((e) => e.toLowerCase().trim()),
});
export type StartSessionInput = z.infer<typeof StartSessionSchema>;

/**
 * Save answer request validation
 * POST /api/quiz/save
 */
export const SaveAnswerSchema = z.object({
  sessionId: z
    .string()
    .min(1, 'Session ID is required')
    .max(50, 'Invalid session ID'),
  questionId: z
    .string()
    .min(1, 'Question ID is required')
    .max(10, 'Invalid question ID'),
  answers: z
    .array(z.string().max(10, 'Invalid answer ID'))
    .min(1, 'At least one answer is required')
    .max(3, 'Maximum 3 answers allowed'),
});
export type SaveAnswerInput = z.infer<typeof SaveAnswerSchema>;

/**
 * Roast request validation
 * POST /api/quiz/roast
 */
export const RoastRequestSchema = z.object({
  questionId: z
    .string()
    .min(1, 'Question ID is required')
    .max(10, 'Invalid question ID'),
  answerId: z
    .string()
    .min(1, 'Answer ID is required')
    .max(10, 'Invalid answer ID'),
  answerHistory: z
    .array(
      z.object({
        questionId: z.string(),
        answerId: z.string(),
      })
    )
    .max(24, 'Too many answer history entries')
    .optional(),
});
export type RoastRequestInput = z.infer<typeof RoastRequestSchema>;

/**
 * Phase transition request validation
 * POST /api/quiz/transition
 */
export const TransitionRequestSchema = z.object({
  sessionId: z
    .string()
    .min(1, 'Session ID is required')
    .max(50, 'Invalid session ID'),
  phase: z
    .number()
    .int()
    .min(1, 'Phase must be at least 1')
    .max(2, 'Phase must be at most 2'),
});
export type TransitionRequestInput = z.infer<typeof TransitionRequestSchema>;

/**
 * Grade request validation
 * POST /api/quiz/grade
 */
export const GradeRequestSchema = z.object({
  sessionId: z
    .string()
    .min(1, 'Session ID is required')
    .max(50, 'Invalid session ID'),
});
export type GradeRequestInput = z.infer<typeof GradeRequestSchema>;

/**
 * Email request validation
 * POST /api/quiz/email
 */
export const EmailRequestSchema = z.object({
  sessionId: z
    .string()
    .min(1, 'Session ID is required')
    .max(50, 'Invalid session ID'),
});
export type EmailRequestInput = z.infer<typeof EmailRequestSchema>;

/**
 * Session ID param validation (for dynamic routes)
 */
export const SessionIdParamSchema = z.object({
  sessionId: z
    .string()
    .min(1, 'Session ID is required')
    .max(50, 'Invalid session ID'),
});
export type SessionIdParamInput = z.infer<typeof SessionIdParamSchema>;

/**
 * Public ID param validation (for share routes)
 */
export const PublicIdParamSchema = z.object({
  publicId: z
    .string()
    .min(1, 'Public ID is required')
    .max(50, 'Invalid public ID'),
});
export type PublicIdParamInput = z.infer<typeof PublicIdParamSchema>;

// ============================================
// Validation Helper Functions
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
 * Uses discriminated union for proper type narrowing
 */
export function validateInput<T>(
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

/**
 * Validate and throw on error (for use in API routes)
 */
export function validateOrThrow<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): T {
  return schema.parse(input);
}
