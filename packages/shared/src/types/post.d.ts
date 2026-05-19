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
}
export interface PostLike {
    post_id: string;
    user_id: string;
    created_at: string;
}
/** Payload for POST /api/studio/posts */
export interface CreatePostPayload {
    title: string;
    description?: string;
    media_type: MediaType;
    media_urls: string[];
    tech_stack: string[];
}
/** Response from GET /api/studio/signature */
export interface CloudinarySignature {
    signature: string;
    timestamp: number;
    cloud_name: string;
    api_key: string;
    upload_preset?: string;
}
//# sourceMappingURL=post.d.ts.map