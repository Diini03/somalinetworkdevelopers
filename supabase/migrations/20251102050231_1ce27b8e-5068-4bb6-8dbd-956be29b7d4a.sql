-- Add cv column to candidates table
ALTER TABLE public.candidates ADD COLUMN cv text;

-- Create storage bucket for CVs
INSERT INTO storage.buckets (id, name, public) VALUES ('candidate-cvs', 'candidate-cvs', true);

-- Create policies for CV uploads
CREATE POLICY "CV files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'candidate-cvs');

CREATE POLICY "Admins can upload CVs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'candidate-cvs' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update CVs" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'candidate-cvs' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete CVs" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'candidate-cvs' AND has_role(auth.uid(), 'admin'::app_role));