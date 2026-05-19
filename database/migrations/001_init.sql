-- ==========================================
-- DemoDay: Initial Database Schema
-- Document 2 — PostgreSQL (Supabase)
-- Execute in Supabase SQL Editor
-- ==========================================

-- Enable UUID extension for secure, unguessable primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. USERS & INSTITUTIONS
-- ==========================================

CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) UNIQUE NOT NULL,
    domain VARCHAR(50) UNIQUE NOT NULL,
    verified BOOLEAN DEFAULT false
);

CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    role_type VARCHAR(20) NOT NULL CHECK (role_type IN ('creator', 'recruiter', 'institution')),
    headline VARCHAR(160),
    bio TEXT,
    current_cgpa NUMERIC(4,2),
    institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
    open_to_work BOOLEAN DEFAULT true,
    tech_stack TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- 2. MEDIA ENGINE (REELS & CAROUSELS)
-- ==========================================

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('reel', 'carousel')),
    media_urls TEXT[] NOT NULL,
    tech_stack TEXT[] DEFAULT '{}',
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE post_likes (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);

-- ==========================================
-- 3. THE TIERED INBOX (MESSAGING)
-- ==========================================

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_one UUID REFERENCES users(id),
    participant_two UUID REFERENCES users(id),
    inbox_tier VARCHAR(15) DEFAULT 'request' CHECK (inbox_tier IN ('primary', 'general', 'request')),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(participant_one, participant_two)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    message_text TEXT,
    rich_media_url TEXT,
    media_kind VARCHAR(20) DEFAULT 'text' CHECK (media_kind IN ('text', 'image', 'voice', 'code', 'document')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- 4. PERFORMANCE INDEXES
-- ==========================================

CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_messages_conv ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_users_role ON users(role_type);
CREATE INDEX idx_users_institution ON users(institution_id);
CREATE INDEX idx_conversations_participants ON conversations(participant_one, participant_two);
