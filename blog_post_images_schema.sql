-- ============================================
-- BLOG POST IMAGES TABLE
-- Run this in Supabase SQL Editor
-- Stores additional images for blog posts
-- ============================================

-- Create blog_post_images table
CREATE TABLE IF NOT EXISTS public.blog_post_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to update updated_at on blog_post_images
DROP TRIGGER IF EXISTS blog_post_images_updated_at_trigger ON public.blog_post_images;
CREATE TRIGGER blog_post_images_updated_at_trigger
  BEFORE UPDATE ON public.blog_post_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on blog_post_images table
ALTER TABLE public.blog_post_images ENABLE ROW LEVEL SECURITY;

-- Public can view images for published blog posts (no TO clause = public access)
CREATE POLICY "Public can view images for published posts"
  ON public.blog_post_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.blog_posts
      WHERE blog_posts.id = blog_post_images.blog_post_id
      AND blog_posts.published = true
    )
  );

-- Admins can view all images
CREATE POLICY "Admins can view all blog post images"
  ON public.blog_post_images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can insert images
CREATE POLICY "Admins can insert blog post images"
  ON public.blog_post_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can update images
CREATE POLICY "Admins can update blog post images"
  ON public.blog_post_images FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can delete images
CREATE POLICY "Admins can delete blog post images"
  ON public.blog_post_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- INDEXES for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_blog_post_images_post_id ON public.blog_post_images(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_images_display_order ON public.blog_post_images(blog_post_id, display_order);

-- ============================================
-- DONE!
-- ============================================

-- Verify table was created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) as column_count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'blog_post_images';

COMMENT ON TABLE public.blog_post_images IS 'Stores additional images for blog posts';
