import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// ============================================
// Custom Error Classes
// ============================================

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 'RATE_LIMIT_EXCEEDED', 429);
    this.name = 'RateLimitError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
    this.name = 'ConflictError';
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service temporarily unavailable') {
    super(message, 'SERVICE_UNAVAILABLE', 503);
    this.name = 'ServiceUnavailableError';
  }
}

// ============================================
// Error Response Interface
// ============================================

export interface ErrorResponse {
  error: string;
  code: string;
  requestId?: string;
  details?: unknown;
}

// ============================================
// Error Handler Utilities
// ============================================

/**
 * Generate a unique request ID for tracking
 */
export function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Convert any error to an AppError
 */
export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof ZodError) {
    const firstError = error.issues[0];
    return new ValidationError(
      firstError?.message || 'Validation failed',
      error.issues
    );
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'INTERNAL_ERROR', 500);
  }

  return new AppError('An unexpected error occurred', 'UNKNOWN_ERROR', 500);
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  error: unknown,
  requestId?: string
): NextResponse<ErrorResponse> {
  const appError = normalizeError(error);

  const response: ErrorResponse = {
    error: appError.message,
    code: appError.code,
  };

  if (requestId) {
    response.requestId = requestId;
  }

  // Only include details in non-production or for validation errors
  if (
    process.env.NODE_ENV !== 'production' ||
    appError instanceof ValidationError
  ) {
    if (appError.details) {
      response.details = appError.details;
    }
  }

  return NextResponse.json(response, { status: appError.statusCode });
}

/**
 * Wrap an API handler with error handling
 */
export function withErrorHandling<T>(
  handler: (requestId: string) => Promise<T>
): Promise<T | NextResponse<ErrorResponse>> {
  const requestId = generateRequestId();

  return handler(requestId).catch((error) => {
    console.error(`[${requestId}] Unhandled error:`, error);
    return createErrorResponse(error, requestId);
  });
}
