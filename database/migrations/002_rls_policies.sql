-- ==========================================
-- DemoDay: Row Level Security Policies
-- Document 4 — Security Protocol
-- Execute in Supabase SQL Editor AFTER 001_init.sql
-- ==========================================

-- ==========================================
-- 1. ENABLE RLS ON ALL CORE TABLES
-- ==========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. USERS TABLE POLICIES
-- ==========================================

-- Anyone can view a public profile
CREATE POLICY "Public profiles are viewable by everyone"
ON users FOR SELECT
USING (true);

-- Users can only update their own profile data
CREATE POLICY "Users can update only their own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

-- Users can insert their own profile row (called during sync)
CREATE POLICY "Users can insert their own profile"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

-- ==========================================
-- 3. POSTS TABLE POLICIES
-- ==========================================

-- Posts are public for viewing
CREATE POLICY "Posts are viewable by everyone"
ON posts FOR SELECT
USING (true);

-- Only the author can create their own posts
CREATE POLICY "Authors can insert their own posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- Only the author can update their own posts
CREATE POLICY "Authors can update their own posts"
ON posts FOR UPDATE
USING (auth.uid() = author_id);

-- Only the author can delete their own posts
CREATE POLICY "Authors can delete their own posts"
ON posts FOR DELETE
USING (auth.uid() = author_id);

-- ==========================================
-- 4. POST LIKES POLICIES
-- ==========================================

-- Anyone can see likes
CREATE POLICY "Post likes are viewable by everyone"
ON post_likes FOR SELECT
USING (true);

-- Users can like posts (insert their own likes)
CREATE POLICY "Users can insert their own likes"
ON post_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can unlike posts (delete their own likes)
CREATE POLICY "Users can delete their own likes"
ON post_likes FOR DELETE
USING (auth.uid() = user_id);

-- ==========================================
-- 5. CONVERSATIONS POLICIES
-- ==========================================

-- Users can only see conversations they are part of
CREATE POLICY "Users can read their own conversations"
ON conversations FOR SELECT
USING (auth.uid() = participant_one OR auth.uid() = participant_two);

-- Users can create conversations they are part of
CREATE POLICY "Users can create conversations they participate in"
ON conversations FOR INSERT
WITH CHECK (auth.uid() = participant_one OR auth.uid() = participant_two);

-- ==========================================
-- 6. MESSAGES POLICIES
-- ==========================================

-- Users can read messages in conversations they belong to
CREATE POLICY "Users can read messages in their conversations"
ON messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM conversations c
        WHERE c.id = messages.conversation_id
        AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())
    )
);

-- Users can send messages (insert) in conversations they belong to
CREATE POLICY "Users can send messages in their conversations"
ON messages FOR INSERT
WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
        SELECT 1 FROM conversations c
        WHERE c.id = conversation_id
        AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())
    )
);

-- ==========================================
-- 7. INSTITUTIONS POLICIES
-- ==========================================

-- Institutions are publicly viewable
CREATE POLICY "Institutions are viewable by everyone"
ON institutions FOR SELECT
USING (true);
