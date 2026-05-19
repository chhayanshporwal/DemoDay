import { supabaseAdmin } from '../../config/supabase';
import type { UserSyncPayload, UserProfileUpdatePayload, User, UserProfile } from '@demoday/shared';
import { AppError } from '../../middlewares/errorHandler';

export async function syncUser(userId: string, payload: UserSyncPayload): Promise<User> {
  const username = payload.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 30);

  const { data, error } = await supabaseAdmin
    .from('users')
    .upsert({
      id: userId,
      username,
      full_name: payload.full_name,
      role_type: payload.role_type,
      avatar_url: payload.avatar_url || null,
      tech_stack: payload.tech_stack || [],
    }, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw new AppError(`Failed to sync user: ${error.message}`, 500);
  return data as User;
}

export async function updateProfile(userId: string, updates: UserProfileUpdatePayload): Promise<User> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new AppError(`Failed to update profile: ${error.message}`, 500);
  return data as User;
}

export async function getPortfolio(userId: string): Promise<UserProfile> {
  // Fetch user with institution join
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('*, institutions(*)')
    .eq('id', userId)
    .single();

  if (error || !user) throw new AppError('User not found', 404);

  // Aggregate stats
  const { count: postCount } = await supabaseAdmin
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', userId);

  const { data: likesData } = await supabaseAdmin
    .from('posts')
    .select('likes_count')
    .eq('author_id', userId);

  const totalLikes = likesData?.reduce((sum, p) => sum + (p.likes_count || 0), 0) ?? 0;

  return {
    ...user,
    institution: user.institutions ?? null,
    total_likes: totalLikes,
    post_count: postCount ?? 0,
    connection_count: 0, // TODO: Query Neo4j for connection count
    verified_badges: [], // TODO: Implement verification system
  } as UserProfile;
}
