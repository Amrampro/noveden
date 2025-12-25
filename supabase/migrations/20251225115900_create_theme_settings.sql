/*
  # Theme Settings Configuration

  1. New Tables
    - `theme_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique) - Setting key (e.g., 'primary_color', 'font_family')
      - `value` (text) - Setting value
      - `category` (text) - Category (colors, typography, buttons, spacing, etc.)
      - `description` (text) - Description of the setting
      - `updated_at` (timestamp)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `theme_settings` table
    - Add policy for public read access
    - Add policy for admin write access

  3. Initial Data
    - Insert default theme settings from the current theme
*/

CREATE TABLE IF NOT EXISTS theme_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  category text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read theme settings"
  ON theme_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify theme settings"
  ON theme_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

INSERT INTO theme_settings (key, value, category, description) VALUES
  ('primary_main', '#A8B89F', 'colors', 'Main primary color'),
  ('primary_light', '#C8D5BF', 'colors', 'Light primary color'),
  ('primary_dark', '#8A9B82', 'colors', 'Dark primary color'),
  ('secondary_main', '#2C3E2D', 'colors', 'Main secondary color'),
  ('secondary_light', '#455645', 'colors', 'Light secondary color'),
  ('secondary_dark', '#1A2419', 'colors', 'Dark secondary color'),
  ('accent_main', '#D4A574', 'colors', 'Main accent color'),
  ('accent_light', '#E8C9A5', 'colors', 'Light accent color'),
  ('accent_dark', '#B58951', 'colors', 'Dark accent color'),
  ('background_primary', '#FFFFFF', 'colors', 'Primary background color'),
  ('background_secondary', '#F9FAF8', 'colors', 'Secondary background color'),
  ('text_primary', '#2C3E2D', 'colors', 'Primary text color'),
  ('text_secondary', '#545F4F', 'colors', 'Secondary text color'),
  ('success_main', '#6D9B6E', 'colors', 'Success color'),
  ('error_main', '#C86B6B', 'colors', 'Error color'),
  ('warning_main', '#D4A574', 'colors', 'Warning color'),
  ('font_family_primary', 'Playfair Display', 'typography', 'Primary font family for headings'),
  ('font_family_secondary', 'Inter', 'typography', 'Secondary font family for body text'),
  ('button_border_radius', '0.375rem', 'buttons', 'Button border radius'),
  ('border_radius_md', '0.375rem', 'general', 'Medium border radius'),
  ('border_radius_lg', '0.5rem', 'general', 'Large border radius')
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION update_theme_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER theme_settings_updated_at
  BEFORE UPDATE ON theme_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_theme_settings_timestamp();
