-- Create hero_news table for the "What's happening" section
CREATE TABLE IF NOT EXISTS hero_news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  alt_text TEXT NOT NULL,
  image_url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_hero_news_position ON hero_news(position);
CREATE INDEX IF NOT EXISTS idx_hero_news_active ON hero_news(is_active);

-- Enable RLS
ALTER TABLE hero_news ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active news
CREATE POLICY "Anyone can view active hero news"
  ON hero_news
  FOR SELECT
  USING (is_active = true);

-- Policy: Admins can view all news
CREATE POLICY "Admins can view all hero news"
  ON hero_news
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can insert news
CREATE POLICY "Admins can insert hero news"
  ON hero_news
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can update news
CREATE POLICY "Admins can update hero news"
  ON hero_news
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can delete news
CREATE POLICY "Admins can delete hero news"
  ON hero_news
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_hero_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_hero_news_updated_at_trigger
  BEFORE UPDATE ON hero_news
  FOR EACH ROW
  EXECUTE FUNCTION update_hero_news_updated_at();

-- Insert default news items
INSERT INTO hero_news (title, alt_text, image_url, position) VALUES
  ('Puff n Paint', 'A group of people painting on canvases in a relaxed atmosphere', '/assets/hero-images/1.png', 1),
  ('Comedy Night', 'A comedian performing on a stage to an audience', '/assets/hero-images/2.png', 2),
  ('Tattoo Artists', 'A tattoo artist working on a client''s arm', '/assets/hero-images/3.png', 3),
  ('Bachelorette Parties', 'A group of friends celebrating a bachelorette party', '/assets/hero-images/4.png', 4)
ON CONFLICT DO NOTHING;
