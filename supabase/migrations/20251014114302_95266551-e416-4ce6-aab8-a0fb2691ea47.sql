-- Create storage bucket for candidate photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('candidate-photos', 'candidate-photos', true);

-- Create storage policies for candidate photos
CREATE POLICY "Anyone can view candidate photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'candidate-photos');

CREATE POLICY "Admins can upload candidate photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'candidate-photos' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update candidate photos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'candidate-photos' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete candidate photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'candidate-photos' 
  AND has_role(auth.uid(), 'admin'::app_role)
);