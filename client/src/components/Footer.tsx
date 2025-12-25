import { useState } from 'react';
import { Leaf, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { theme } from '../config/theme';
import { Button } from './Button';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    setMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessage('Merci de votre inscription !');
      setEmail('');
    } catch (error) {
      setMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer>
      <div
        style={{
          backgroundColor: theme.colors.background.secondary,
          padding: `${theme.spacing['3xl']} 0 ${theme.spacing.md}`,
        }}
      >
        <div
          style={{
            maxWidth: theme.container.maxWidth,
            margin: '0 auto',
            padding: `0 ${theme.spacing.lg}`,
          }}
        >
          <div
            style={{
              textAlign: 'center',
              marginBottom: theme.spacing['3xl'],
            }}
          >
            <Mail size={48} color={theme.colors.primary.main} style={{ margin: '0 auto 1rem' }} />
            <h3
              style={{
                ...theme.heading.h3,
                marginBottom: theme.spacing.md,
              }}
            >
              Inscrivez-vous à la newsletter
            </h3>
            <p
              style={{
                fontFamily: theme.typography.fontFamily.body,
                fontSize: theme.typography.fontSize.base,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.xl,
                maxWidth: '600px',
                margin: `0 auto ${theme.spacing.xl}`,
              }}
            >
              Bénéficiez de 10% de réduction immédiate et recevez nos conseils, offres et nouveautés bien-être.
            </p>

            <form
              onSubmit={handleSubscribe}
              style={{
                display: 'flex',
                gap: theme.spacing.sm,
                maxWidth: '500px',
                margin: '0 auto',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <input
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  flex: '1 1 300px',
                  padding: theme.spacing.md,
                  borderRadius: theme.borderRadius.md,
                  border: `2px solid ${theme.colors.border.main}`,
                  fontFamily: theme.typography.fontFamily.body,
                  fontSize: theme.typography.fontSize.base,
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary.main;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.border.main;
                }}
              />
              <Button type="submit" disabled={isSubscribing} variant="primary">
                {isSubscribing ? "Inscription..." : "S'inscrire"}
              </Button>
            </form>
            {message && (
              <p
                style={{
                  marginTop: theme.spacing.md,
                  fontFamily: theme.typography.fontFamily.body,
                  fontSize: theme.typography.fontSize.sm,
                  color: message.includes('erreur') || message.includes('déjà')
                    ? theme.colors.status.error
                    : theme.colors.status.success,
                }}
              >
                {message}
              </p>
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: theme.spacing['2xl'],
              marginBottom: theme.spacing['2xl'],
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.lg }}>
                <Leaf size={32} color={theme.colors.primary.main} />
                <div>
                  <div
                    style={{
                      ...theme.heading.h4,
                      fontSize: theme.typography.fontSize.xl,
                      marginBottom: 0,
                    }}
                  >
                    Novéden
                  </div>
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: theme.typography.fontSize.sm,
                      fontStyle: 'italic',
                      color: theme.colors.text.secondary,
                    }}
                  >
                    la beauté authentique
                  </div>
                </div>
              </div>
              <p
                style={{
                  fontFamily: theme.typography.fontFamily.body,
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  lineHeight: theme.typography.lineHeight.body,
                }}
              >
                Inspirés de l'Éden, nos soins 100 % naturels allient plantes ayurvédiques, fruits, extraits végétaux et actifs issus de la science dermo-cosmétique, pour nourrir, fortifier et révéler la beauté naturelle de la peau et des cheveux.
              </p>
            </div>

            <div>
              <h4
                style={{
                  ...theme.heading.h5,
                  fontSize: theme.typography.fontSize.base,
                  marginBottom: theme.spacing.lg,
                  textTransform: 'uppercase',
                  letterSpacing: theme.typography.letterSpacing.wide,
                }}
              >
                Liens Légaux
              </h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {['Politique et processus de retour', 'Mentions Légale', 'FAQ'].map((item) => (
                  <li key={item} style={{ marginBottom: theme.spacing.sm }}>
                    <button
                      onClick={() => onNavigate?.(item === 'FAQ' ? 'faq' : 'home')}
                      style={{
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.text.secondary,
                        textDecoration: 'none',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: theme.transition.fast,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.colors.primary.main;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = theme.colors.text.secondary;
                      }}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4
                style={{
                  ...theme.heading.h5,
                  fontSize: theme.typography.fontSize.base,
                  marginBottom: theme.spacing.lg,
                  textTransform: 'uppercase',
                  letterSpacing: theme.typography.letterSpacing.wide,
                }}
              >
                Accueil
              </h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {['Accueil', 'Boutique', 'Blog', 'FAQ', 'Contact'].map((item) => (
                  <li key={item} style={{ marginBottom: theme.spacing.sm }}>
                    <button
                      onClick={() => onNavigate?.(item.toLowerCase())}
                      style={{
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.text.secondary,
                        textDecoration: 'none',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: theme.transition.fast,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.colors.primary.main;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = theme.colors.text.secondary;
                      }}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4
                style={{
                  ...theme.heading.h5,
                  fontSize: theme.typography.fontSize.base,
                  marginBottom: theme.spacing.lg,
                  textTransform: 'uppercase',
                  letterSpacing: theme.typography.letterSpacing.wide,
                }}
              >
                Suivez-Nous
              </h4>
              <div style={{ display: 'flex', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
                <a
                  href="#"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: theme.borderRadius.full,
                    backgroundColor: theme.colors.primary[100],
                    transition: theme.transition.fast,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.primary.main;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.primary[100];
                  }}
                >
                  <Facebook size={20} color={theme.colors.primary.main} />
                </a>
                <a
                  href="#"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: theme.borderRadius.full,
                    backgroundColor: theme.colors.primary[100],
                    transition: theme.transition.fast,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.primary.main;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.primary[100];
                  }}
                >
                  <Instagram size={20} color={theme.colors.primary.main} />
                </a>
                <a
                  href="#"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: theme.borderRadius.full,
                    backgroundColor: theme.colors.primary[100],
                    transition: theme.transition.fast,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.primary.main;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.primary[100];
                  }}
                >
                  <Twitter size={20} color={theme.colors.primary.main} />
                </a>
              </div>

              <div style={{ marginTop: theme.spacing.lg }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: theme.spacing.sm,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  <Mail size={16} color={theme.colors.primary.main} style={{ marginTop: '2px' }} />
                  <span
                    style={{
                      fontFamily: theme.typography.fontFamily.body,
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.text.secondary,
                    }}
                  >
                    Email: contact@noveden.com
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: theme.spacing.sm,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  <Phone size={16} color={theme.colors.primary.main} style={{ marginTop: '2px' }} />
                  <span
                    style={{
                      fontFamily: theme.typography.fontFamily.body,
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.text.secondary,
                    }}
                  >
                    Tel: +32 465 73 74 12
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: theme.spacing.sm,
                  }}
                >
                  <MapPin size={16} color={theme.colors.primary.main} style={{ marginTop: '2px' }} />
                  <span
                    style={{
                      fontFamily: theme.typography.fontFamily.body,
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.text.secondary,
                    }}
                  >
                    Adresse: Belgique
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: `1px solid ${theme.colors.border.main}`,
              paddingTop: theme.spacing.lg,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: theme.typography.fontFamily.body,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.secondary,
                margin: 0,
              }}
            >
              © 2025, Novéden. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
