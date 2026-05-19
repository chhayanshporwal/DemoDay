-- ==========================================
-- DemoDay: Social Interactions Migration
-- Add comments, saves, reposts, and visibility toggles
-- ==========================================

-- 1. ALTER posts TABLE to support reposting and display options
ALTER TABLE posts ADD COLUMN IF NOT EXISTS parent_post_id UUID REFERENCES posts(id) ON DELETE CASCADE;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS repost_commentary TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS hide_likes_count BOOLEAN DEFAULT false NOT NULL;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS hide_comments_count BOOLEAN DEFAULT false NOT NULL;

-- 2. CREATE post_comments TABLE
CREATE TABLE IF NOT EXISTS post_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. CREATE post_saves TABLE
CREATE TABLE IF NOT EXISTS post_saves (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (post_id, user_id)
);

-- 4. ENABLE RLS ON NEW TABLES
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_saves ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICIES FOR post_comments
CREATE POLICY "Comments are viewable by everyone"
ON post_comments FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can comment"
ON post_comments FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own comments"
ON post_comments FOR DELETE
USING (auth.uid() = author_id);

-- 6. RLS POLICIES FOR post_saves
CREATE POLICY "Users can view their own saves"
ON post_saves FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can save posts"
ON post_saves FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave posts"
ON post_saves FOR DELETE
USING (auth.uid() = user_id);

-- 7. TRIGGERS TO AUTO-UPDATE COMMENTS COUNT
CREATE OR REPLACE FUNCTION handle_comment_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_comment_change ON post_comments;
CREATE TRIGGER on_comment_change
AFTER INSERT OR DELETE ON post_comments
FOR EACH ROW EXECUTE FUNCTION handle_comment_change();

-- 8. TRIGGERS TO AUTO-UPDATE LIKES COUNT (for completeness)
CREATE OR REPLACE FUNCTION handle_like_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_like_change ON post_likes;
CREATE TRIGGER on_like_change
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW EXECUTE FUNCTION handle_like_change();
