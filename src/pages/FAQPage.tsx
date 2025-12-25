import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { theme } from '../config/theme';
import { supabase, FAQ } from '../lib/supabase';

export function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setFaqs(data || []);
      if (data && data.length > 0) {
        setOpenIndex(0);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
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
            Foire aux Questions
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
            Toutes les réponses à vos questions sur nos produits et services
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
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          {loading ? (
            <div
              style={{
                textAlign: 'center',
                padding: theme.spacing['4xl'],
                color: theme.colors.text.secondary,
                fontFamily: theme.typography.fontFamily.body,
              }}
            >
              Chargement des questions...
            </div>
          ) : faqs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  style={{
                    backgroundColor: theme.colors.background.secondary,
                    borderRadius: theme.borderRadius.lg,
                    overflow: 'hidden',
                    border: `2px solid ${
                      openIndex === index ? theme.colors.primary.main : theme.colors.border.light
                    }`,
                    transition: theme.transition.normal,
                  }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    style={{
                      width: '100%',
                      padding: theme.spacing.lg,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: theme.spacing.md,
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        ...theme.heading.h5,
                        fontSize: theme.typography.fontSize.base,
                        fontWeight: theme.typography.fontWeight.semibold,
                        color: theme.colors.text.primary,
                      }}
                    >
                      {faq.question}
                    </span>
                    {openIndex === index ? (
                      <ChevronUp size={24} color={theme.colors.primary.main} style={{ flexShrink: 0 }} />
                    ) : (
                      <ChevronDown size={24} color={theme.colors.text.secondary} style={{ flexShrink: 0 }} />
                    )}
                  </button>

                  {openIndex === index && (
                    <div
                      style={{
                        padding: `0 ${theme.spacing.lg} ${theme.spacing.lg}`,
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.base,
                        color: theme.colors.text.secondary,
                        lineHeight: theme.typography.lineHeight.body,
                        borderTop: `1px solid ${theme.colors.border.light}`,
                        paddingTop: theme.spacing.lg,
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: theme.spacing['4xl'],
                color: theme.colors.text.secondary,
                fontFamily: theme.typography.fontFamily.body,
              }}
            >
              Aucune question disponible pour le moment.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
