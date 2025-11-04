-- Add AI scoring columns to candidates table
ALTER TABLE public.candidates 
ADD COLUMN IF NOT EXISTS ai_score INTEGER,
ADD COLUMN IF NOT EXISTS ai_score_updated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS profile_completeness INTEGER DEFAULT 0;

-- Create index for faster sorting by AI score
CREATE INDEX IF NOT EXISTS idx_candidates_ai_score ON public.candidates(ai_score DESC NULLS LAST);

-- Create contact_submissions table to track all contact form submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email_sent_successfully BOOLEAN NOT NULL DEFAULT false,
  error_message TEXT
);

-- Enable RLS on contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Admins can view all contact submissions
CREATE POLICY "Admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can insert contact submissions (public form)
CREATE POLICY "Anyone can insert contact submissions"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- Create index for faster lookups by candidate
CREATE INDEX IF NOT EXISTS idx_contact_submissions_candidate_id ON public.contact_submissions(candidate_id);

-- Create index for sorting by sent_at
CREATE INDEX IF NOT EXISTS idx_contact_submissions_sent_at ON public.contact_submissions(sent_at DESC);