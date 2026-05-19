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
      parent_post_id: payload.parent_post_id ?? null,
      repost_commentary: payload.repost_commentary ?? null,
      hide_likes_count: payload.hide_likes_count ?? false,
      hide_comments_count: payload.hide_comments_count ?? false,
    })
    .select()
    .single();

  if (error) throw new AppError(`Failed to create post: ${error.message}`, 500);
  return data as Post;
}

function transformPost(post: any, currentUserId?: string): FeedPost | null {
  if (!post) return null;
  const isLiked = currentUserId ? post.post_likes?.some((l: any) => l.user_id === currentUserId) : false;
  const isSaved = currentUserId ? post.post_saves?.some((s: any) => s.user_id === currentUserId) : false;
  
  const parentPost = post.parent_post ? transformPost(post.parent_post, currentUserId) : null;
  
  return {
    id: post.id,
    author_id: post.author_id,
    title: post.title,
    description: post.description,
    media_type: post.media_type,
    media_urls: post.media_urls,
    tech_stack: post.tech_stack,
    likes_count: post.likes_count,
    comments_count: post.comments_count,
    parent_post_id: post.parent_post_id,
    repost_commentary: post.repost_commentary,
    hide_likes_count: post.hide_likes_count,
    hide_comments_count: post.hide_comments_count,
    created_at: post.created_at,
    author: post.users,
    is_liked: isLiked,
    is_saved: isSaved,
    parent_post: parentPost,
  };
}

export async function getFeed(
  currentUserId?: string,
  cursor?: string,
  limit: number = 10,
  authorId?: string,
): Promise<PaginatedResponse<FeedPost>> {
  let query = supabaseAdmin
    .from('posts')
    .select(`
      *,
      users!posts_author_id_fkey (id, username, full_name, avatar_url, headline, role_type),
      post_likes (user_id),
      post_saves (user_id),
      parent_post:posts!posts_parent_post_id_fkey (
        *,
        users!posts_author_id_fkey (id, username, full_name, avatar_url, headline, role_type)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (authorId) {
    query = query.eq('author_id', authorId);
  }

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;

  if (error) throw new AppError(`Failed to fetch feed: ${error.message}`, 500);

  const hasMore = (data?.length ?? 0) > limit;
  const posts = (data ?? []).slice(0, limit);
  const nextCursor = hasMore ? posts[posts.length - 1]?.created_at : null;

  return {
    data: posts.map((post: any) => transformPost(post, currentUserId)).filter(Boolean) as FeedPost[],
    next_cursor: nextCursor,
    has_more: hasMore,
  };
}

export async function toggleLikePost(userId: string, postId: string): Promise<{ liked: boolean }> {
  // Check if like exists
  const { data: existingLike } = await supabaseAdmin
    .from('post_likes')
    .select()
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existingLike) {
    const { error } = await supabaseAdmin
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) throw new AppError(`Failed to unlike post: ${error.message}`, 500);
    return { liked: false };
  } else {
    const { error } = await supabaseAdmin
      .from('post_likes')
      .insert({ post_id: postId, user_id: userId });

    if (error) throw new AppError(`Failed to like post: ${error.message}`, 500);
    return { liked: true };
  }
}

export async function toggleSavePost(userId: string, postId: string): Promise<{ saved: boolean }> {
  // Check if save exists
  const { data: existingSave } = await supabaseAdmin
    .from('post_saves')
    .select()
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existingSave) {
    const { error } = await supabaseAdmin
      .from('post_saves')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) throw new AppError(`Failed to unsave post: ${error.message}`, 500);
    return { saved: false };
  } else {
    const { error } = await supabaseAdmin
      .from('post_saves')
      .insert({ post_id: postId, user_id: userId });

    if (error) throw new AppError(`Failed to save post: ${error.message}`, 500);
    return { saved: true };
  }
}

export async function addComment(userId: string, postId: string, commentText: string): Promise<any> {
  // Check if commenting is turned off
  const { data: post, error: postError } = await supabaseAdmin
    .from('posts')
    .select('hide_comments_count')
    .eq('id', postId)
    .single();

  if (postError || !post) {
    throw new AppError('Post not found', 404);
  }

  if (post.hide_comments_count) {
    throw new AppError('Commenting is disabled on this post', 400);
  }

  const { data: newComment, error } = await supabaseAdmin
    .from('post_comments')
    .insert({
      post_id: postId,
      author_id: userId,
      comment_text: commentText,
    })
    .select(`
      *,
      author:users!post_comments_author_id_fkey (id, username, full_name, avatar_url, headline, role_type)
    `)
    .single();

  if (error) throw new AppError(`Failed to add comment: ${error.message}`, 500);
  return newComment;
}

export async function getComments(postId: string): Promise<any[]> {
  const { data, error } = await supabaseAdmin
    .from('post_comments')
    .select(`
      *,
      author:users!post_comments_author_id_fkey (id, username, full_name, avatar_url, headline, role_type)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw new AppError(`Failed to fetch comments: ${error.message}`, 500);
  return data ?? [];
}

export async function repostPost(userId: string, postId: string, commentary?: string): Promise<Post> {
  // Fetch original post details
  const { data: originalPost, error: fetchError } = await supabaseAdmin
    .from('posts')
    .select()
    .eq('id', postId)
    .single();

  if (fetchError || !originalPost) {
    throw new AppError('Original post not found', 404);
  }

  // Create the repost post
  const { data: repost, error } = await supabaseAdmin
    .from('posts')
    .insert({
      author_id: userId,
      title: originalPost.title,
      description: originalPost.description,
      media_type: originalPost.media_type,
      media_urls: originalPost.media_urls,
      tech_stack: originalPost.tech_stack,
      parent_post_id: originalPost.parent_post_id || originalPost.id, // Point directly to original source
      repost_commentary: commentary ?? null,
      hide_likes_count: false,
      hide_comments_count: false,
    })
    .select()
    .single();

  if (error) throw new AppError(`Failed to repost: ${error.message}`, 500);
  return repost as Post;
}

export async function updatePost(
  userId: string,
  postId: string,
  payload: { hide_likes_count?: boolean; hide_comments_count?: boolean },
): Promise<Post> {
  // First verify authorship
  const { data: post, error: fetchError } = await supabaseAdmin
    .from('posts')
    .select('author_id')
    .eq('id', postId)
    .single();

  if (fetchError || !post) {
    throw new AppError('Post not found', 404);
  }

  if (post.author_id !== userId) {
    throw new AppError('You are not authorized to update this post', 403);
  }

  const updatePayload: any = {};
  if (payload.hide_likes_count !== undefined) {
    updatePayload.hide_likes_count = payload.hide_likes_count;
  }
  if (payload.hide_comments_count !== undefined) {
    updatePayload.hide_comments_count = payload.hide_comments_count;
  }

  const { data: updated, error } = await supabaseAdmin
    .from('posts')
    .update(updatePayload)
    .eq('id', postId)
    .select()
    .single();

  if (error) throw new AppError(`Failed to update post: ${error.message}`, 500);
  return updated as Post;
}

export async function deletePost(userId: string, postId: string): Promise<{ success: boolean }> {
  // First verify authorship
  const { data: post, error: fetchError } = await supabaseAdmin
    .from('posts')
    .select('author_id')
    .eq('id', postId)
    .single();

  if (fetchError || !post) {
    throw new AppError('Post not found', 404);
  }

  if (post.author_id !== userId) {
    throw new AppError('You are not authorized to delete this post', 403);
  }

  const { error } = await supabaseAdmin
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) throw new AppError(`Failed to delete post: ${error.message}`, 500);
  return { success: true };
}

