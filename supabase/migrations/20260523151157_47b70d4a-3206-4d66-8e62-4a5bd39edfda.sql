-- ============================================================
-- SECURITY HARDENING MIGRATION
-- 1) Protect candidate PII (email, salary, cv) from public access
-- 2) Lock down contact_submissions inserts to backend only
-- 3) Make CV bucket private (photos remain public for profile display)
-- ============================================================

-- ---- 1. CANDIDATES TABLE ACCESS CONTROL ----

-- Remove overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view candidates" ON public.candidates;

-- Only admins can read the full candidates table directly (includes email, salary, cv)
CREATE POLICY "Admins can view all candidate data"
ON public.candidates
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public-safe function that returns sanitized candidate list (no email/salary/cv)
CREATE OR REPLACE FUNCTION public.get_public_candidates()
RETURNS TABLE (
  id uuid,
  name text,
  title text,
  photo text,
  skills text[],
  location text,
  qualification text,
  bio text,
  availability text,
  linkedin text,
  github text,
  portfolio text,
  experience jsonb,
  certifications text[],
  ai_score integer,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, name, title, photo, skills, location, qualification, bio,
         availability, linkedin, github, portfolio, experience, certifications,
         ai_score, created_at
  FROM public.candidates
  ORDER BY ai_score DESC NULLS LAST, created_at DESC;
$$;

-- Public-safe function for a single candidate detail page
CREATE OR REPLACE FUNCTION public.get_public_candidate(_id uuid)
RETURNS TABLE (
  id uuid,
  name text,
  title text,
  photo text,
  skills text[],
  location text,
  qualification text,
  bio text,
  availability text,
  linkedin text,
  github text,
  portfolio text,
  experience jsonb,
  certifications text[],
  ai_score integer,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, name, title, photo, skills, location, qualification, bio,
         availability, linkedin, github, portfolio, experience, certifications,
         ai_score, created_at
  FROM public.candidates
  WHERE id = _id;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_candidates() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_candidate(uuid) TO anon, authenticated;

-- Helper for backend: get a signed CV URL is handled in edge function,
-- but we also expose a small helper that returns just the cv path for admins.

-- ---- 2. CONTACT SUBMISSIONS LOCKDOWN ----

-- Remove permissive public insert; only backend (service role) will insert
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.contact_submissions;

-- ---- 3. STORAGE: CV BUCKET PRIVATE ----

-- Make CV bucket private (photos kept public since they are profile pictures meant for display)
UPDATE storage.buckets SET public = false WHERE id = 'candidate-cvs';

-- Drop any prior permissive CV policies
DROP POLICY IF EXISTS "CVs are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Public CV access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view candidate CVs" ON storage.objects;

-- Admins can fully manage CVs
CREATE POLICY "Admins manage candidate CVs"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'candidate-cvs' AND has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'candidate-cvs' AND has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can read CVs (via signed URLs from edge function for tighter control later)
CREATE POLICY "Authenticated users can read CVs"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'candidate-cvs');
