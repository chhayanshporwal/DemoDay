// ==========================================
// Post & Media Types
// Maps directly to PostgreSQL schema (Document 2)
// ==========================================

export type MediaType = 'reel' | 'carousel';

export interface Post {
  id: string;
  author_id: string;
  title: string;
  description: string | null;
  media_type: MediaType;
  media_urls: string[];
  tech_stack: string[];
  likes_count: number;
  comments_count: number;
  parent_post_id: string | null;
  repost_commentary: string | null;
  hide_likes_count: boolean;
  hide_comments_count: boolean;
  created_at: string;
}

/** Extended post with author info for feed rendering */
export interface FeedPost extends Post {
  author: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
    headline: string | null;
    role_type: string;
  };
  is_liked: boolean;
  is_saved: boolean;
  parent_post: FeedPost | null;
}

export interface PostLike {
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  author_id: string;
  comment_text: string;
  created_at: string;
  author?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
    headline: string | null;
    role_type: string;
  };
}

/** Payload for POST /api/studio/posts */
export interface CreatePostPayload {
  title: string;
  description?: string;
  media_type: MediaType;
  media_urls: string[];
  tech_stack: string[];
  parent_post_id?: string;
  repost_commentary?: string;
  hide_likes_count?: boolean;
  hide_comments_count?: boolean;
}

/** Response from GET /api/studio/signature */
export interface CloudinarySignature {
  signature: string;
  timestamp: number;
  cloud_name: string;
  api_key: string;
  upload_preset?: string;
}

