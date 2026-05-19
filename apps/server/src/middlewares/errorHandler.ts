import { Request, Response, NextFunction } from 'express';
import type { ApiError } from '@demoday/shared';

// ---------------------------------------------------------------------------
// Custom AppError class for throwing typed errors
// ---------------------------------------------------------------------------
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: string;

  constructor(message: string, statusCode = 500, details?: string) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// ---------------------------------------------------------------------------
// Global error handler middleware — must be registered last
// ---------------------------------------------------------------------------
export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const details = err instanceof AppError ? err.details : undefined;

  // Log full stack in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('🔴 Error:', err);
  }

  const body: ApiError = {
    error: err.message || 'Internal Server Error',
    code: statusCode,
    ...(details && { details }),
  };

  res.status(statusCode).json(body);
}

// ---------------------------------------------------------------------------
// Async wrapper so we don't need try/catch in every route handler
// ---------------------------------------------------------------------------
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
