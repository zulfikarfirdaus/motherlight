-- Motherlight Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- DOCTORS TABLE
-- ============================================================
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  category TEXT NOT NULL, -- 'obgyn', 'anak', 'lainnya', 'terapi'
  bio TEXT DEFAULT '',
  note TEXT DEFAULT '',
  schedule JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_doctors_category ON doctors(category);

-- ============================================================
-- ALBUMS TABLE
-- ============================================================
CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  thumbnail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for slug lookups
CREATE INDEX idx_albums_slug ON albums(slug);

-- ============================================================
-- PHOTOS TABLE
-- ============================================================
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for album queries
CREATE INDEX idx_photos_album_id ON photos(album_id);
CREATE INDEX idx_photos_position ON photos(album_id, position);

-- ============================================================
-- OPERATING HOURS TABLE (optional, but good for flexibility)
-- ============================================================
CREATE TABLE operating_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day TEXT NOT NULL,
  hours TEXT NOT NULL,
  position INTEGER DEFAULT 0
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE operating_hours ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read access" ON doctors FOR SELECT USING (true);
CREATE POLICY "Public read access" ON albums FOR SELECT USING (true);
CREATE POLICY "Public read access" ON photos FOR SELECT USING (true);
CREATE POLICY "Public read access" ON operating_hours FOR SELECT USING (true);

-- Admin write access (you'll need to set up authentication)
-- For now, we'll allow authenticated users to write
CREATE POLICY "Authenticated write access" ON doctors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON albums FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON photos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated write access" ON operating_hours FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true);

-- Storage policies for gallery bucket
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Authenticated upload access" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'gallery' AND auth.role() = 'authenticated'
);
CREATE POLICY "Authenticated delete access" ON storage.objects FOR DELETE USING (
  bucket_id = 'gallery' AND auth.role() = 'authenticated'
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_albums_updated_at BEFORE UPDATE ON albums
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
