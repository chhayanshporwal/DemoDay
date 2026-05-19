/** Generic paginated response using cursor-based pagination */
export interface PaginatedResponse<T> {
    data: T[];
    next_cursor: string | null;
    has_more: boolean;
}
/** Standard API error response */
export interface ApiError {
    error: string;
    code: number;
    details?: string;
}
/** Standard API success response for mutations */
export interface ApiSuccess<T = void> {
    success: true;
    data: T;
    message?: string;
}
/** Query params for cursor-based feed pagination */
export interface FeedQueryParams {
    cursor?: string;
    limit?: number;
}
/** Query params for the explore/discover grid */
export interface ExploreQueryParams {
    roles?: string[];
    tech_stack?: string[];
    min_cgpa?: number;
    open_to_work?: boolean;
    cursor?: string;
    limit?: number;
}
/** Connection request payload for POST /api/network/connect */
export interface ConnectPayload {
    target_user_id: string;
}
//# sourceMappingURL=api.d.ts.map