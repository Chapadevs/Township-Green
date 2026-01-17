-- Create storage bucket for hero news images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hero-news',
  'hero-news',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for hero-news bucket

-- Policy: Anyone can view images (bucket is public)
CREATE POLICY "Anyone can view hero news images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'hero-news');

-- Policy: Admins can upload images
CREATE POLICY "Admins can upload hero news images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'hero-news'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can update images
CREATE POLICY "Admins can update hero news images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'hero-news'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can delete images
CREATE POLICY "Admins can delete hero news images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'hero-news'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
