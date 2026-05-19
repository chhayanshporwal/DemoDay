// ==========================================
// User & Institution Types
// Maps directly to PostgreSQL schema (Document 2)
// ==========================================

export type RoleType = 'creator' | 'recruiter' | 'institution';

export interface Institution {
  id: string;
  name: string;
  domain: string;
  verified: boolean;
}

export interface User {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  role_type: RoleType;
  headline: string | null;
  bio: string | null;
  current_cgpa: number | null;
  institution_id: string | null;
  open_to_work: boolean;
  tech_stack: string[];
  created_at: string;
}

/** Extended profile returned by GET /:id/portfolio */
export interface UserProfile extends User {
  institution: Institution | null;
  total_likes: number;
  post_count: number;
  connection_count: number;
  verified_badges: VerifiedBadge[];
}

export interface VerifiedBadge {
  type: 'university' | 'skill' | 'company';
  label: string;
  verified_at: string;
}

/** Payload for POST /api/users/sync */
export interface UserSyncPayload {
  email: string;
  full_name: string;
  role_type: RoleType;
  avatar_url?: string;
  tech_stack?: string[];
}

/** Payload for PATCH /api/users/:id/profile */
export interface UserProfileUpdatePayload {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  headline?: string;
  bio?: string;
  current_cgpa?: number;
  open_to_work?: boolean;
  institution_id?: string;
}
