import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { theme as defaultTheme } from '../config/theme';

interface ThemeSettings {
  [key: string]: string;
}

interface ThemeContextType {
  theme: typeof defaultTheme;
  themeSettings: ThemeSettings;
  refreshTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({});
  const [customTheme, setCustomTheme] = useState(defaultTheme);

  const loadThemeSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('theme_settings')
        .select('key, value');

      if (error) {
        console.error('Error loading theme settings:', error);
        return;
      }

      const settings: ThemeSettings = {};
      data.forEach((setting) => {
        settings[setting.key] = setting.value;
      });

      setThemeSettings(settings);
      applyTheme(settings);
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const applyTheme = (settings: ThemeSettings) => {
    const updatedTheme = { ...defaultTheme };

    if (settings.primary_main) updatedTheme.colors.primary.main = settings.primary_main;
    if (settings.primary_light) updatedTheme.colors.primary.light = settings.primary_light;
    if (settings.primary_dark) updatedTheme.colors.primary.dark = settings.primary_dark;
    if (settings.secondary_main) updatedTheme.colors.secondary.main = settings.secondary_main;
    if (settings.secondary_light) updatedTheme.colors.secondary.light = settings.secondary_light;
    if (settings.secondary_dark) updatedTheme.colors.secondary.dark = settings.secondary_dark;
    if (settings.accent_main) updatedTheme.colors.accent.main = settings.accent_main;
    if (settings.accent_light) updatedTheme.colors.accent.light = settings.accent_light;
    if (settings.accent_dark) updatedTheme.colors.accent.dark = settings.accent_dark;
    if (settings.background_primary) updatedTheme.colors.background.primary = settings.background_primary;
    if (settings.background_secondary) updatedTheme.colors.background.secondary = settings.background_secondary;
    if (settings.text_primary) updatedTheme.colors.text.primary = settings.text_primary;
    if (settings.text_secondary) updatedTheme.colors.text.secondary = settings.text_secondary;
    if (settings.success_main) updatedTheme.colors.success.main = settings.success_main;
    if (settings.error_main) updatedTheme.colors.error.main = settings.error_main;
    if (settings.warning_main) updatedTheme.colors.warning.main = settings.warning_main;
    if (settings.font_family_primary) updatedTheme.typography.fontFamily.primary = `'${settings.font_family_primary}', serif`;
    if (settings.font_family_secondary) updatedTheme.typography.fontFamily.secondary = `'${settings.font_family_secondary}', sans-serif`;
    if (settings.button_border_radius) updatedTheme.button.primary.borderRadius = settings.button_border_radius;
    if (settings.border_radius_md) updatedTheme.borderRadius.md = settings.border_radius_md;
    if (settings.border_radius_lg) updatedTheme.borderRadius.lg = settings.border_radius_lg;

    setCustomTheme(updatedTheme);
  };

  useEffect(() => {
    loadThemeSettings();
  }, []);

  const value: ThemeContextType = {
    theme: customTheme,
    themeSettings,
    refreshTheme: loadThemeSettings,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    return {
      theme: defaultTheme,
      themeSettings: {},
      refreshTheme: async () => {},
    };
  }
  return context;
}
