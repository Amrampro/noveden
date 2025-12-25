import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { theme } from '../../config/theme';
import { Button } from '../../components/Button';
import { Palette, Save, RotateCcw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ThemeSetting {
  id: string;
  key: string;
  value: string;
  category: string;
  description?: string;
}

export function AdminThemePage() {
  const [settings, setSettings] = useState<ThemeSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('theme_settings')
        .select('*')
        .order('category')
        .order('key');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error loading theme settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(settings.map(s => s.key === key ? { ...s, value } : s));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');

      for (const setting of settings) {
        const { error } = await supabase
          .from('theme_settings')
          .update({ value: setting.value })
          .eq('key', setting.key);

        if (error) throw error;
      }

      setMessage('Thème enregistré avec succès');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error saving theme:', error);
      setMessage('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Êtes-vous sûr de vouloir réinitialiser le thème par défaut ?')) {
      return;
    }

    const defaultSettings = {
      primary_main: '#A8B89F',
      primary_light: '#C8D5BF',
      primary_dark: '#8A9B82',
      secondary_main: '#2C3E2D',
      secondary_light: '#455645',
      secondary_dark: '#1A2419',
      accent_main: '#D4A574',
      accent_light: '#E8C9A5',
      accent_dark: '#B58951',
      background_primary: '#FFFFFF',
      background_secondary: '#F9FAF8',
      text_primary: '#2C3E2D',
      text_secondary: '#545F4F',
      success_main: '#6D9B6E',
      error_main: '#C86B6B',
      warning_main: '#D4A574',
      font_family_primary: 'Playfair Display',
      font_family_secondary: 'Inter',
      button_border_radius: '0.375rem',
      border_radius_md: '0.375rem',
      border_radius_lg: '0.5rem',
    };

    setSettings(settings.map(s => ({
      ...s,
      value: defaultSettings[s.key as keyof typeof defaultSettings] || s.value
    })));
  };

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, ThemeSetting[]>);

  const categoryLabels: Record<string, string> = {
    colors: 'Couleurs',
    typography: 'Typographie',
    buttons: 'Boutons',
    general: 'Général',
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: theme.spacing.xl, textAlign: 'center' }}>
          <p style={{ ...theme.body.large, color: theme.colors.text.secondary }}>
            Chargement...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: theme.spacing.xl }}>
          <div>
            <h1
              style={{
                ...theme.heading.h2,
                marginBottom: theme.spacing.md,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.md,
              }}
            >
              <Palette size={32} color={theme.colors.primary.main} />
              Configuration du thème
            </h1>
            <p
              style={{
                ...theme.body.large,
                color: theme.colors.text.secondary,
              }}
            >
              Personnalisez les couleurs et styles de votre site
            </p>
          </div>
          <div style={{ display: 'flex', gap: theme.spacing.md }}>
            <Button variant="secondary" onClick={handleReset}>
              <RotateCcw size={20} style={{ marginRight: theme.spacing.xs }} />
              Réinitialiser
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save size={20} style={{ marginRight: theme.spacing.xs }} />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </div>

        {message && (
          <div
            style={{
              padding: theme.spacing.md,
              backgroundColor: message.includes('succès') ? theme.colors.success[50] : theme.colors.error[50],
              color: message.includes('succès') ? theme.colors.success.main : theme.colors.error.main,
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing.xl,
              ...theme.body.base,
            }}
          >
            {message}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing['2xl'] }}>
          {Object.entries(groupedSettings).map(([category, categorySettings]) => (
            <div
              key={category}
              style={{
                backgroundColor: theme.colors.background.primary,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.xl,
                boxShadow: theme.shadow.card,
              }}
            >
              <h2
                style={{
                  ...theme.heading.h4,
                  marginBottom: theme.spacing.lg,
                  paddingBottom: theme.spacing.md,
                  borderBottom: `2px solid ${theme.colors.border.light}`,
                }}
              >
                {categoryLabels[category] || category}
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: theme.spacing.lg }}>
                {categorySettings.map((setting) => (
                  <div key={setting.key}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: theme.spacing.sm,
                        ...theme.body.base,
                        fontWeight: theme.typography.fontWeight.medium,
                      }}
                    >
                      {setting.description || setting.key}
                    </label>
                    {setting.key.includes('color') || setting.key.includes('background') || setting.key.includes('text') || setting.key.includes('success') || setting.key.includes('error') || setting.key.includes('warning') ? (
                      <div style={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center' }}>
                        <input
                          type="color"
                          value={setting.value}
                          onChange={(e) => handleChange(setting.key, e.target.value)}
                          style={{
                            width: '60px',
                            height: '40px',
                            border: `1px solid ${theme.colors.border.light}`,
                            borderRadius: theme.borderRadius.md,
                            cursor: 'pointer',
                          }}
                        />
                        <input
                          type="text"
                          value={setting.value}
                          onChange={(e) => handleChange(setting.key, e.target.value)}
                          style={{
                            flex: 1,
                            padding: theme.spacing.md,
                            borderRadius: theme.borderRadius.md,
                            border: `1px solid ${theme.colors.border.light}`,
                            ...theme.body.base,
                          }}
                        />
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={setting.value}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        style={{
                          width: '100%',
                          padding: theme.spacing.md,
                          borderRadius: theme.borderRadius.md,
                          border: `1px solid ${theme.colors.border.light}`,
                          ...theme.body.base,
                        }}
                      />
                    )}
                    {setting.description && (
                      <p style={{ ...theme.body.small, color: theme.colors.text.secondary, marginTop: theme.spacing.xs }}>
                        Clé: {setting.key}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </AdminLayout>
  );
}
