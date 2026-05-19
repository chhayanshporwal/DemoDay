export type InboxTier = 'primary' | 'general' | 'request';
export type MediaKind = 'text' | 'image' | 'voice' | 'code' | 'document';
export interface Conversation {
    id: string;
    participant_one: string;
    participant_two: string;
    inbox_tier: InboxTier;
    last_message_at: string;
}
/** Conversation with preview info for inbox list */
export interface ConversationPreview extends Conversation {
    other_user: {
        id: string;
        username: string;
        full_name: string;
        avatar_url: string | null;
        role_type: string;
    };
    last_message: {
        message_text: string | null;
        media_kind: MediaKind;
        created_at: string;
    } | null;
    unread_count: number;
}
export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    message_text: string | null;
    rich_media_url: string | null;
    media_kind: MediaKind;
    is_read: boolean;
    created_at: string;
}
/** Client → Server: join a conversation room */
export interface JoinConversationEvent {
    conversation_id: string;
}
/** Client → Server: send a new message */
export interface SendMessageEvent {
    conversation_id: string;
    receiver_id: string;
    message_text: string;
    media_kind: MediaKind;
    rich_media_url?: string;
}
/** Server → Client: receive a new message */
export interface ReceiveMessageEvent extends Message {
    sender: {
        username: string;
        avatar_url: string | null;
    };
}
/** Server → Client: cold outreach notification */
export interface MessageRequestEvent {
    conversation_id: string;
    sender: {
        id: string;
        username: string;
        full_name: string;
        avatar_url: string | null;
        role_type: string;
    };
    preview_text: string;
}
//# sourceMappingURL=messaging.d.ts.map