import { Request, Response, NextFunction } from 'express';

// ---------------------------------------------------------------------------
// Fields to redact for non-recruiter roles
// ---------------------------------------------------------------------------
const REDACTED_FIELDS = ['current_cgpa'];

/**
 * Recursively walk a JSON-serializable value and replace sensitive fields
 * with `null` (or a sentinel like "[REDACTED]").
 */
function redactFields(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map(redactFields);
  }

  if (data !== null && typeof data === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (REDACTED_FIELDS.includes(key)) {
        result[key] = null; // Redact sensitive field
      } else {
        result[key] = redactFields(value);
      }
    }
    return result;
  }

  return data;
}

// ---------------------------------------------------------------------------
// Middleware: intercept res.json() to apply masking before sending
// ---------------------------------------------------------------------------
export function maskUserDataMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Only apply masking if the caller is NOT a recruiter
  const isRecruiter = req.user?.role_type === 'recruiter';

  if (isRecruiter) {
    // Recruiters see full data — skip masking
    return next();
  }

  // Monkey-patch res.json to intercept the payload
  const originalJson = res.json.bind(res);

  res.json = function maskedJson(body?: any): Response {
    const maskedBody = redactFields(body);
    return originalJson(maskedBody);
  };

  next();
}
