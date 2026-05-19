import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';
import { AppError } from './errorHandler';
import type { RoleType } from '@demoday/shared';

// ---------------------------------------------------------------------------
// Augment Express Request with our user payload
// ---------------------------------------------------------------------------
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export interface AuthUser {
  id: string;
  email: string;
  role_type: RoleType;
}

// ---------------------------------------------------------------------------
// verifyJWT middleware
// Extracts the Bearer token and validates it against Supabase Auth.
// ---------------------------------------------------------------------------
export async function verifyJWT(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Missing or malformed Authorization header', 401);
    }

    const token = authHeader.split(' ')[1];

    // Create a per-request Supabase client scoped to the user's token.
    // This lets Supabase verify the JWT against its own JWKS internally.
    const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new AppError('Invalid or expired token', 401);
    }

    // Attach the authenticated user to the request
    req.user = {
      id: user.id,
      email: user.email ?? '',
      role_type: (user.user_metadata?.role_type as RoleType) ?? 'creator',
    };

    next();
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// Role guard factory — restricts access to specific roles
// ---------------------------------------------------------------------------
export function requireRole(...roles: RoleType[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role_type)) {
      return next(
        new AppError(
          `Access denied. Required role: ${roles.join(' or ')}`,
          403,
        ),
      );
    }

    next();
  };
}

// ---------------------------------------------------------------------------
// optionalJWT middleware — allows access without token, but parses it if present
// ---------------------------------------------------------------------------
export async function optionalJWT(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];

    const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!error && user) {
      req.user = {
        id: user.id,
        email: user.email ?? '',
        role_type: (user.user_metadata?.role_type as RoleType) ?? 'creator',
      };
    }

    next();
  } catch (err) {
    // Silently ignore auth errors for optionalJWT and proceed as guest
    next();
  }
}

