import { supabaseAdmin } from '../../config/supabase';
import type { Conversation, Message, PaginatedResponse } from '@demoday/shared';
import { AppError } from '../../middlewares/errorHandler';

export async function getUserConversations(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('conversations')
    .select('*')
    .or(`participant_one.eq.${userId},participant_two.eq.${userId}`)
    .order('last_message_at', { ascending: false });

  if (error) throw new AppError(`Failed to fetch conversations: ${error.message}`, 500);
  return data as Conversation[];
}

export async function getConversationMessages(
  conversationId: string,
  cursor?: string,
  limit: number = 50,
): Promise<PaginatedResponse<Message>> {
  let query = supabaseAdmin
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;
  if (error) throw new AppError(`Failed to fetch messages: ${error.message}`, 500);

  const hasMore = (data?.length ?? 0) > limit;
  const messages = (data ?? []).slice(0, limit);

  return {
    data: messages as Message[],
    next_cursor: hasMore ? messages[messages.length - 1]?.created_at : null,
    has_more: hasMore,
  };
}

export async function createConversation(
  userId: string,
  targetUserId: string,
): Promise<Conversation> {
  // Check if conversation already exists
  const { data: existing } = await supabaseAdmin
    .from('conversations')
    .select('*')
    .or(
      `and(participant_one.eq.${userId},participant_two.eq.${targetUserId}),and(participant_one.eq.${targetUserId},participant_two.eq.${userId})`
    )
    .single();

  if (existing) return existing as Conversation;

  // Determine inbox tier — 'request' if users are not connected
  // TODO: Check Neo4j connection status in Phase 4
  const inboxTier = 'request';

  const { data, error } = await supabaseAdmin
    .from('conversations')
    .insert({
      participant_one: userId,
      participant_two: targetUserId,
      inbox_tier: inboxTier,
    })
    .select()
    .single();

  if (error) throw new AppError(`Failed to create conversation: ${error.message}`, 500);
  return data as Conversation;
}

export async function saveMessage(
  conversationId: string,
  senderId: string,
  messageText: string,
  mediaKind: string = 'text',
  richMediaUrl?: string,
): Promise<Message> {
  const { data, error } = await supabaseAdmin
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      message_text: messageText,
      media_kind: mediaKind,
      rich_media_url: richMediaUrl ?? null,
    })
    .select()
    .single();

  if (error) throw new AppError(`Failed to save message: ${error.message}`, 500);

  // Update conversation last_message_at
  await supabaseAdmin
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId);

  return data as Message;
}
