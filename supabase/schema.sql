-- ==============================================================================
-- PinSpace - Complete PostgreSQL & Supabase Database Schema
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy search indexing

-- ==============================================================================
-- 2. Tables Schema
-- ==============================================================================

-- PROFILES TABLE
-- Extends Supabase auth.users with public profile metadata
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30)
);

-- PINS TABLE
CREATE TABLE IF NOT EXISTS public.pins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  destination_url TEXT,
  aspect_ratio TEXT DEFAULT 'medium',
  category TEXT DEFAULT 'all',
  tags TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT title_not_empty CHECK (char_length(TRIM(title)) > 0),
  CONSTRAINT image_url_not_empty CHECK (char_length(TRIM(image_url)) > 0)
);

-- BOARDS TABLE
CREATE TABLE IF NOT EXISTS public.boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_private BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT board_name_not_empty CHECK (char_length(TRIM(name)) > 0)
);

-- BOARD_PINS JUNCTION TABLE
-- Connects Pins to Boards with duplicate prevention
CREATE TABLE IF NOT EXISTS public.board_pins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  pin_id UUID NOT NULL REFERENCES public.pins(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT unique_board_pin UNIQUE (board_id, pin_id)
);

-- ==============================================================================
-- 3. Indexes for High-Performance Queries
-- ==============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Pins indexes
CREATE INDEX IF NOT EXISTS idx_pins_user_id ON public.pins(user_id);
CREATE INDEX IF NOT EXISTS idx_pins_created_at ON public.pins(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pins_category ON public.pins(category);
CREATE INDEX IF NOT EXISTS idx_pins_tags ON public.pins USING GIN (tags);
-- Full-text search index for pin title & description
CREATE INDEX IF NOT EXISTS idx_pins_search ON public.pins USING GIN (
  to_tsvector('english', title || ' ' || COALESCE(description, ''))
);

-- Boards indexes
CREATE INDEX IF NOT EXISTS idx_boards_user_id ON public.boards(user_id);
CREATE INDEX IF NOT EXISTS idx_boards_created_at ON public.boards(created_at DESC);

-- Board Pins indexes
CREATE INDEX IF NOT EXISTS idx_board_pins_board_id ON public.board_pins(board_id);
CREATE INDEX IF NOT EXISTS idx_board_pins_pin_id ON public.board_pins(pin_id);

-- ==============================================================================
-- 4. Automatic User Profile Creation Trigger
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_username TEXT;
BEGIN
  -- Generate unique fallback username from email if not provided in metadata
  extracted_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTR(NEW.id::text, 1, 4)
  );

  INSERT INTO public.profiles (id, username, full_name, avatar_url, bio, website)
  VALUES (
    NEW.id,
    extracted_username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
    COALESCE(NEW.raw_user_meta_data->>'bio', ''),
    COALESCE(NEW.raw_user_meta_data->>'website', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate auth trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 5. Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable RLS on every table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_pins ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Anyone can view public profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Authenticated users can insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Authenticated users can update only their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- PINS POLICIES
-- ------------------------------------------------------------------------------
-- Public users can view published pins
DROP POLICY IF EXISTS "Public can view all pins" ON public.pins;
CREATE POLICY "Public can view all pins"
  ON public.pins FOR SELECT
  USING (true);

-- Authenticated users can create pins
DROP POLICY IF EXISTS "Authenticated users can create pins" ON public.pins;
CREATE POLICY "Authenticated users can create pins"
  ON public.pins FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND auth.uid() = user_id
  );

-- Only author can update own pin
DROP POLICY IF EXISTS "Authors can update own pins" ON public.pins;
CREATE POLICY "Authors can update own pins"
  ON public.pins FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Only author can delete own pin
DROP POLICY IF EXISTS "Authors can delete own pins" ON public.pins;
CREATE POLICY "Authors can delete own pins"
  ON public.pins FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- BOARDS POLICIES
-- ------------------------------------------------------------------------------
-- Public users can view public boards; creators can view all their boards (including secret)
DROP POLICY IF EXISTS "View public or own boards" ON public.boards;
CREATE POLICY "View public or own boards"
  ON public.boards FOR SELECT
  USING (
    is_private = false
    OR auth.uid() = user_id
  );

-- Authenticated users can create boards
DROP POLICY IF EXISTS "Authenticated users can create boards" ON public.boards;
CREATE POLICY "Authenticated users can create boards"
  ON public.boards FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND auth.uid() = user_id
  );

-- Only board owner can update their board
DROP POLICY IF EXISTS "Owners can update own boards" ON public.boards;
CREATE POLICY "Owners can update own boards"
  ON public.boards FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Only board owner can delete their board
DROP POLICY IF EXISTS "Owners can delete own boards" ON public.boards;
CREATE POLICY "Owners can delete own boards"
  ON public.boards FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- BOARD_PINS POLICIES
-- ------------------------------------------------------------------------------
-- Board pins are viewable if the parent board is accessible
DROP POLICY IF EXISTS "View pins in accessible boards" ON public.board_pins;
CREATE POLICY "View pins in accessible boards"
  ON public.board_pins FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE boards.id = board_pins.board_id
        AND (boards.is_private = false OR boards.user_id = auth.uid())
    )
  );

-- Only the board owner can save pins to their board
DROP POLICY IF EXISTS "Board owners can insert pins to board" ON public.board_pins;
CREATE POLICY "Board owners can insert pins to board"
  ON public.board_pins FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE boards.id = board_pins.board_id
        AND boards.user_id = auth.uid()
    )
  );

-- Only the board owner can remove pins from their board
DROP POLICY IF EXISTS "Board owners can delete pins from board" ON public.board_pins;
CREATE POLICY "Board owners can delete pins from board"
  ON public.board_pins FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE boards.id = board_pins.board_id
        AND boards.user_id = auth.uid()
    )
  );

-- ==============================================================================
-- 6. Supabase Storage Configuration (pin-images bucket)
-- ==============================================================================

-- Create bucket if storage schema exists
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'pin-images',
    'pin-images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  )
  ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
EXCEPTION
  WHEN OTHERS THEN
    -- In environments where storage schema is managed separately
    NULL;
END $$;

-- Storage RLS Policies
-- Public read access for images
DROP POLICY IF EXISTS "Public Read pin-images" ON storage.objects;
CREATE POLICY "Public Read pin-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pin-images');

-- Authenticated users can upload images
DROP POLICY IF EXISTS "Authenticated users upload pin-images" ON storage.objects;
CREATE POLICY "Authenticated users upload pin-images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pin-images'
    AND auth.role() = 'authenticated'
  );

-- Users can delete their own uploaded images
DROP POLICY IF EXISTS "Users can delete own pin-images" ON storage.objects;
CREATE POLICY "Users can delete own pin-images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'pin-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
