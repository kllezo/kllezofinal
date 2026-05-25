-- ═══════════════════════════════════════════════════════════════════════════
-- KLLEZO — Applications Table Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable UUID extension (already enabled in Supabase by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── CREATE TABLE ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.applications (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at    TIMESTAMPTZ NOT NULL    DEFAULT NOW(),

  -- Contact
  full_name     TEXT        NOT NULL,
  business_name TEXT        NOT NULL,
  email         TEXT        NOT NULL,
  phone         TEXT        NOT NULL,

  -- Socials
  website       TEXT,
  instagram     TEXT,

  -- Form selections
  purpose       TEXT        NOT NULL,   -- comma-separated: content,website,ai,all
  stage         TEXT        NOT NULL,   -- starting | traction | scaling | established
  bottleneck    TEXT,                   -- optional: attention | conversion | closing | disconnected
  service       TEXT,                   -- primary service
  services      TEXT[],                 -- array of selected services
  budget        TEXT,                   -- budget range
  timeline      TEXT,                   -- project timeline

  -- Open text / goals
  details       TEXT,
  goals         TEXT,

  -- Internal status (managed by Kllezo team)
  status        TEXT        NOT NULL    DEFAULT 'pending'  -- pending | reviewed | accepted | rejected
    CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),

  -- Metadata
  source        TEXT                    DEFAULT 'website'
);

-- ─── INDEXES ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_status     ON public.applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_email      ON public.applications (email);

-- ─── ENABLE ROW LEVEL SECURITY ──────────────────────────────────────────────
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- ─── RLS POLICIES ───────────────────────────────────────────────────────────

-- 1. Allow anyone (anonymous visitors) to INSERT new applications
--    (needed so the website contact form works without authentication)
CREATE POLICY "Allow public insert"
  ON public.applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 2. BLOCK all reads by anonymous users (no one can scrape submissions)
--    Only authenticated admin users with service_role can SELECT rows.
CREATE POLICY "Block public select"
  ON public.applications
  FOR SELECT
  TO anon
  USING (false);

-- 3. BLOCK all updates and deletes from anonymous users
CREATE POLICY "Block public update"
  ON public.applications
  FOR UPDATE
  TO anon
  USING (false);

CREATE POLICY "Block public delete"
  ON public.applications
  FOR DELETE
  TO anon
  USING (false);

-- ─── COMMENTS ───────────────────────────────────────────────────────────────
COMMENT ON TABLE  public.applications                IS 'Application form submissions from the Kllezo website.';
COMMENT ON COLUMN public.applications.purpose        IS 'Comma-separated list of selected services: content, website, ai, all';
COMMENT ON COLUMN public.applications.stage          IS 'Business stage: starting, traction, scaling, established';
COMMENT ON COLUMN public.applications.bottleneck     IS 'Biggest problem: attention, conversion, closing, disconnected';
COMMENT ON COLUMN public.applications.status         IS 'Internal review status managed by the Kllezo team';
