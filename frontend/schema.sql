-- GlobalLens A1 - Database Schema
-- Run this in Vercel Postgres SQL editor

CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  original_url TEXT,
  image_url TEXT,
  source TEXT,
  published_at TEXT,
  category TEXT DEFAULT 'MACRO',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_source ON articles(source);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

-- Cleanup: Delete articles older than 30 days (run periodically)
-- DELETE FROM articles WHERE created_at < NOW() - INTERVAL '30 days';
