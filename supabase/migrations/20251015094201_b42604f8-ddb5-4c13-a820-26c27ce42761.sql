-- Add certifications column to store certification image URLs
ALTER TABLE public.candidates
ADD COLUMN certifications text[] DEFAULT '{}';

-- Update experience column to jsonb for structured data
-- First, create a temporary column
ALTER TABLE public.candidates
ADD COLUMN experience_new jsonb DEFAULT '[]'::jsonb;

-- Migrate existing text experience to new format
UPDATE public.candidates
SET experience_new = jsonb_build_array(
  jsonb_build_object(
    'startYear', NULL,
    'endYear', NULL,
    'company', '',
    'description', experience
  )
)
WHERE experience IS NOT NULL AND experience != '';

-- Drop old column and rename new one
ALTER TABLE public.candidates
DROP COLUMN experience;

ALTER TABLE public.candidates
RENAME COLUMN experience_new TO experience;

-- Update the not null constraint
ALTER TABLE public.candidates
ALTER COLUMN experience SET NOT NULL;