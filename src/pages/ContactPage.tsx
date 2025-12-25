import { Mail, Phone, MapPin } from 'lucide-react';
import { theme } from '../config/theme';
import { Button } from '../components/Button';
import { useState } from 'react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    setTimeout(() => {
      setMessage('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <section
        style={{
          backgroundColor: theme.colors.background.sage,
          padding: `${theme.spacing['3xl']} ${theme.spacing.lg}`,
        }}
      >
        <div
          style={{
            maxWidth: theme.container.maxWidth,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              ...theme.heading.h1,
              marginBottom: theme.spacing.lg,
            }}
          >
            Contact
          </h1>
          <p
            style={{
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.text.secondary,
              maxWidth: '700px',
              margin: '0 auto',
            }}
          >
            Nous sommes là pour répondre à toutes vos questions
          </p>
        </div>
      </section>

      <section
        style={{
          backgroundColor: theme.colors.background.primary,
          padding: `${theme.spacing['4xl']} ${theme.spacing.lg}`,
        }}
      >
        <div
          style={{
            maxWidth: theme.container.maxWidth,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: theme.spacing['3xl'],
            }}
          >
            <div>
              <h2
                style={{
                  ...theme.heading.h3,
                  marginBottom: theme.spacing.xl,
                }}
              >
                Envoyez-nous un message
              </h2>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: theme.spacing.lg }}>
                  <label
                    htmlFor="name"
                    style={{
                      display: 'block',
                      fontFamily: theme.typography.fontFamily.body,
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.primary,
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
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
                </div>

                <div style={{ marginBottom: theme.spacing.lg }}>
                  <label
                    htmlFor="email"
                    style={{
                      display: 'block',
                      fontFamily: theme.typography.fontFamily.body,
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.primary,
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
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
                </div>

                <div style={{ marginBottom: theme.spacing.lg }}>
                  <label
                    htmlFor="subject"
                    style={{
                      display: 'block',
                      fontFamily: theme.typography.fontFamily.body,
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.primary,
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    Sujet
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
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
                </div>

                <div style={{ marginBottom: theme.spacing.lg }}>
                  <label
                    htmlFor="message"
                    style={{
                      display: 'block',
                      fontFamily: theme.typography.fontFamily.body,
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.primary,
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    style={{
                      width: '100%',
                      padding: theme.spacing.md,
                      borderRadius: theme.borderRadius.md,
                      border: `2px solid ${theme.colors.border.main}`,
                      fontFamily: theme.typography.fontFamily.body,
                      fontSize: theme.typography.fontSize.base,
                      outline: 'none',
                      resize: 'vertical',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.primary.main;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.border.main;
                    }}
                  />
                </div>

                <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </Button>

                {message && (
                  <p
                    style={{
                      marginTop: theme.spacing.md,
                      fontFamily: theme.typography.fontFamily.body,
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.status.success,
                      textAlign: 'center',
                    }}
                  >
                    {message}
                  </p>
                )}
              </form>
            </div>

            <div>
              <h2
                style={{
                  ...theme.heading.h3,
                  marginBottom: theme.spacing.xl,
                }}
              >
                Nos coordonnées
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xl }}>
                <div
                  style={{
                    display: 'flex',
                    gap: theme.spacing.md,
                    padding: theme.spacing.lg,
                    backgroundColor: theme.colors.background.secondary,
                    borderRadius: theme.borderRadius.lg,
                  }}
                >
                  <Mail size={24} color={theme.colors.primary.main} style={{ flexShrink: 0, marginTop: '4px' }} />
                  <div>
                    <h3
                      style={{
                        ...theme.heading.h5,
                        fontSize: theme.typography.fontSize.base,
                        marginBottom: theme.spacing.xs,
                      }}
                    >
                      Email
                    </h3>
                    <p
                      style={{
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.base,
                        color: theme.colors.text.secondary,
                      }}
                    >
                      contact@noveden.com
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: theme.spacing.md,
                    padding: theme.spacing.lg,
                    backgroundColor: theme.colors.background.secondary,
                    borderRadius: theme.borderRadius.lg,
                  }}
                >
                  <Phone size={24} color={theme.colors.primary.main} style={{ flexShrink: 0, marginTop: '4px' }} />
                  <div>
                    <h3
                      style={{
                        ...theme.heading.h5,
                        fontSize: theme.typography.fontSize.base,
                        marginBottom: theme.spacing.xs,
                      }}
                    >
                      Téléphone
                    </h3>
                    <p
                      style={{
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.base,
                        color: theme.colors.text.secondary,
                      }}
                    >
                      +32 465 73 74 12
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: theme.spacing.md,
                    padding: theme.spacing.lg,
                    backgroundColor: theme.colors.background.secondary,
                    borderRadius: theme.borderRadius.lg,
                  }}
                >
                  <MapPin size={24} color={theme.colors.primary.main} style={{ flexShrink: 0, marginTop: '4px' }} />
                  <div>
                    <h3
                      style={{
                        ...theme.heading.h5,
                        fontSize: theme.typography.fontSize.base,
                        marginBottom: theme.spacing.xs,
                      }}
                    >
                      Adresse
                    </h3>
                    <p
                      style={{
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.base,
                        color: theme.colors.text.secondary,
                      }}
                    >
                      Belgique
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: theme.spacing['2xl'],
                  padding: theme.spacing.xl,
                  backgroundColor: theme.colors.background.sage,
                  borderRadius: theme.borderRadius.lg,
                }}
              >
                <h3
                  style={{
                    ...theme.heading.h5,
                    marginBottom: theme.spacing.md,
                  }}
                >
                  Heures d'ouverture
                </h3>
                <p
                  style={{
                    fontFamily: theme.typography.fontFamily.body,
                    fontSize: theme.typography.fontSize.base,
                    color: theme.colors.text.secondary,
                    lineHeight: theme.typography.lineHeight.body,
                  }}
                >
                  Lundi - Vendredi: 9h00 - 18h00
                  <br />
                  Samedi: 10h00 - 16h00
                  <br />
                  Dimanche: Fermé
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
