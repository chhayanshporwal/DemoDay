// ==========================================
// Zustand Store — DemoDay
// 4 slices: Auth, UIState, Chat, Feed
// Uses immer middleware for immutable updates
// ==========================================

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { User, ConversationPreview, Message, FeedPost } from '@demoday/shared';

// ---- Slice Types ----

interface AuthSlice {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setAuthLoading: (loading: boolean) => void;
  logout: () => void;
}

interface UIStateSlice {
  sidebarCollapsed: boolean;
  colorMode: 'light' | 'dark';
  mobileNavOpen: boolean;
  globalLoading: boolean;
  toastQueue: ToastMessage[];
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setColorMode: (mode: 'light' | 'dark') => void;
  toggleMobileNav: () => void;
  setGlobalLoading: (loading: boolean) => void;
  pushToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

export interface ToastMessage {
  id: string;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ChatSlice {
  conversations: ConversationPreview[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  unreadTotal: number;
  setConversations: (conversations: ConversationPreview[]) => void;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  setUnreadTotal: (count: number) => void;
  incrementUnread: () => void;
}

interface FeedSlice {
  posts: FeedPost[];
  nextCursor: string | null;
  hasMore: boolean;
  isLoadingFeed: boolean;
  setPosts: (posts: FeedPost[]) => void;
  appendPosts: (posts: FeedPost[], nextCursor: string | null, hasMore: boolean) => void;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  setFeedLoading: (loading: boolean) => void;
  resetFeed: () => void;
}

// ---- Combined Store Type ----

export type StoreState = AuthSlice & UIStateSlice & ChatSlice & FeedSlice;

// ---- Store ----

let toastCounter = 0;

export const useStore = create<StoreState>()(
  immer((set) => ({
    // ======== Auth Slice ========
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
    setUser: (user) =>
      set((state) => {
        state.user = user;
        state.isAuthenticated = !!user;
      }),
    setAccessToken: (token) =>
      set((state) => {
        state.accessToken = token;
      }),
    setAuthLoading: (loading) =>
      set((state) => {
        state.isLoading = loading;
      }),
    logout: () =>
      set((state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      }),

    // ======== UIState Slice ========
    sidebarCollapsed: false,
    colorMode: (typeof window !== 'undefined' && localStorage.getItem('demoday-theme') === 'dark')
      ? 'dark'
      : 'light',
    mobileNavOpen: false,
    globalLoading: false,
    toastQueue: [],
    toggleSidebar: () =>
      set((state) => {
        state.sidebarCollapsed = !state.sidebarCollapsed;
      }),
    setSidebarCollapsed: (collapsed) =>
      set((state) => {
        state.sidebarCollapsed = collapsed;
      }),
    setColorMode: (mode) =>
      set((state) => {
        state.colorMode = mode;
        if (typeof window !== 'undefined') {
          localStorage.setItem('demoday-theme', mode);
        }
      }),
    toggleMobileNav: () =>
      set((state) => {
        state.mobileNavOpen = !state.mobileNavOpen;
      }),
    setGlobalLoading: (loading) =>
      set((state) => {
        state.globalLoading = loading;
      }),
    pushToast: (toast) =>
      set((state) => {
        state.toastQueue.push({ ...toast, id: `toast-${++toastCounter}` });
      }),
    dismissToast: (id) =>
      set((state) => {
        state.toastQueue = state.toastQueue.filter((t) => t.id !== id);
      }),

    // ======== Chat Slice ========
    conversations: [],
    activeConversationId: null,
    messages: {},
    unreadTotal: 0,
    setConversations: (conversations) =>
      set((state) => {
        state.conversations = conversations;
      }),
    setActiveConversation: (id) =>
      set((state) => {
        state.activeConversationId = id;
      }),
    addMessage: (conversationId, message) =>
      set((state) => {
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = [];
        }
        state.messages[conversationId].push(message);
      }),
    setMessages: (conversationId, messages) =>
      set((state) => {
        state.messages[conversationId] = messages;
      }),
    setUnreadTotal: (count) =>
      set((state) => {
        state.unreadTotal = count;
      }),
    incrementUnread: () =>
      set((state) => {
        state.unreadTotal += 1;
      }),

    // ======== Feed Slice ========
    posts: [],
    nextCursor: null,
    hasMore: true,
    isLoadingFeed: false,
    setPosts: (posts) =>
      set((state) => {
        state.posts = posts;
      }),
    appendPosts: (posts, nextCursor, hasMore) =>
      set((state) => {
        state.posts.push(...posts);
        state.nextCursor = nextCursor;
        state.hasMore = hasMore;
      }),
    toggleLike: (postId) =>
      set((state) => {
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          post.is_liked = !post.is_liked;
          post.likes_count += post.is_liked ? 1 : -1;
        }
      }),
    toggleSave: (postId) =>
      set((state) => {
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          post.is_saved = !post.is_saved;
        }
      }),
    setFeedLoading: (loading) =>
      set((state) => {
        state.isLoadingFeed = loading;
      }),
    resetFeed: () =>
      set((state) => {
        state.posts = [];
        state.nextCursor = null;
        state.hasMore = true;
      }),
  }))
);

export default useStore;
