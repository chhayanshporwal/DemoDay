import { supabaseAdmin } from '../../config/supabase';
import { config } from '../../config/env';
import type { CreatePostPayload, Post, CloudinarySignature, PaginatedResponse, FeedPost } from '@demoday/shared';
import { AppError } from '../../middlewares/errorHandler';

export async function generateUploadSignature(mediaType: string): Promise<CloudinarySignature> {
  // TODO: Implement Cloudinary signed upload in Phase 3
  // For now, return a placeholder signature
  const timestamp = Math.round(Date.now() / 1000);

  if (!config.cloudinaryApiKey) {
    throw new AppError('Cloudinary not configured. Set CLOUDINARY_* environment variables.', 503);
  }

  return {
    signature: 'placeholder_signature',
    timestamp,
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
  };
}

export async function createPost(authorId: string, payload: CreatePostPayload): Promise<Post> {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .insert({
      author_id: authorId,
      title: payload.title,
      description: payload.description ?? null,
      media_type: payload.media_type,
      media_urls: payload.media_urls,
      tech_stack: payload.tech_stack,
    })
    .select()
    .single();

  if (error) throw new AppError(`Failed to create post: ${error.message}`, 500);
  return data as Post;
}

export async function getFeed(
  cursor?: string,
  limit: number = 10,
): Promise<PaginatedResponse<FeedPost>> {
  let query = supabaseAdmin
    .from('posts')
    .select('*, users!posts_author_id_fkey(id, username, full_name, avatar_url, headline, role_type)')
    .order('created_at', { ascending: false })
    .limit(limit + 1); // Fetch one extra to determine hasMore

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) throw new AppError(`Failed to fetch feed: ${error.message}`, 500);

  const hasMore = (data?.length ?? 0) > limit;
  const posts = (data ?? []).slice(0, limit);
  const nextCursor = hasMore ? posts[posts.length - 1]?.created_at : null;

  return {
    data: posts.map((post: Record<string, unknown>) => ({
      ...post,
      author: post.users,
      is_liked: false, // TODO: Check against post_likes with current user
      is_saved: false, // TODO: Implement saved posts
    })) as FeedPost[],
    next_cursor: nextCursor,
    has_more: hasMore,
  };
}
