import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { theme } from '../../config/theme';
import { Search, Trash2, HelpCircle, Plus, Edit } from 'lucide-react';
import { api } from '../../services/api';
import { Modal } from '../../components/Modal';
import { FAQForm } from '../../components/admin/FAQForm';
import { Button } from '../../components/Button';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
}

export function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const data = await api.adminGetFAQs();
      setFaqs(data.faqs || []);
    } catch (error) {
      console.error('Error loading FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, question: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer cette question ?\n"${question}"`)) {
      return;
    }

    try {
      await api.adminDeleteFAQ(id);
      setFaqs(faqs.filter((f) => f.id !== id));
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('Erreur lors de la suppression de la question');
    }
  };

  const handleCreate = () => {
    setEditingFAQ(null);
    setIsModalOpen(true);
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Partial<FAQ>) => {
    try {
      if (editingFAQ) {
        await api.adminUpdateFAQ(editingFAQ.id, data);
        await loadFAQs();
      } else {
        await api.adminCreateFAQ(data);
        await loadFAQs();
      }
      setIsModalOpen(false);
      setEditingFAQ(null);
    } catch (error) {
      console.error('Error saving FAQ:', error);
      throw error;
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: theme.spacing.xl }}>
          <div>
            <h1
              style={{
                ...theme.heading.h2,
                marginBottom: theme.spacing.md,
              }}
            >
              FAQ
            </h1>
            <p
              style={{
                ...theme.body.large,
                color: theme.colors.text.secondary,
              }}
            >
              Gérer les questions fréquentes
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus size={20} style={{ marginRight: theme.spacing.xs }} />
            Nouvelle question
          </Button>
        </div>

        <div
          style={{
            marginBottom: theme.spacing.xl,
            position: 'relative',
          }}
        >
          <Search
            size={20}
            style={{
              position: 'absolute',
              left: theme.spacing.md,
              top: '50%',
              transform: 'translateY(-50%)',
              color: theme.colors.text.light,
            }}
          />
          <input
            type="text"
            placeholder="Rechercher des questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: `${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md} 48px`,
              border: `1px solid ${theme.colors.border.main}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.base,
              fontFamily: theme.typography.fontFamily.body,
              backgroundColor: theme.colors.background.primary,
            }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
            <p style={{ ...theme.body.large, color: theme.colors.text.secondary }}>
              Chargement...
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: theme.spacing.lg,
            }}
          >
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                style={{
                  backgroundColor: theme.colors.background.primary,
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow.card,
                  padding: theme.spacing.lg,
                  display: 'flex',
                  gap: theme.spacing.lg,
                  alignItems: 'start',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: theme.borderRadius.md,
                    backgroundColor: theme.colors.primary[50],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <HelpCircle size={24} color={theme.colors.primary.main} />
                </div>

                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      ...theme.heading.h5,
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    {faq.question}
                  </h3>
                  <p
                    style={{
                      ...theme.body.base,
                      color: theme.colors.text.secondary,
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    {faq.answer}
                  </p>
                  {faq.category && (
                    <span
                      style={{
                        ...theme.body.small,
                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                        backgroundColor: theme.colors.primary[100],
                        color: theme.colors.primary[700],
                        borderRadius: theme.borderRadius.md,
                      }}
                    >
                      {faq.category}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                  <button
                    onClick={() => handleEdit(faq)}
                    style={{
                      padding: theme.spacing.md,
                      border: `1px solid ${theme.colors.primary.main}`,
                      backgroundColor: 'transparent',
                      color: theme.colors.primary.main,
                      borderRadius: theme.borderRadius.md,
                      cursor: 'pointer',
                      transition: theme.transition.fast,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.primary[50];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(faq.id, faq.question)}
                    style={{
                      padding: theme.spacing.md,
                      border: `1px solid ${theme.colors.error.main}`,
                      backgroundColor: 'transparent',
                      color: theme.colors.error.main,
                      borderRadius: theme.borderRadius.md,
                      cursor: 'pointer',
                      transition: theme.transition.fast,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.error[50];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: theme.spacing.xl,
                  backgroundColor: theme.colors.background.primary,
                  borderRadius: theme.borderRadius.lg,
                }}
              >
                <p style={{ ...theme.body.large, color: theme.colors.text.secondary }}>
                  Aucune question trouvée
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFAQ(null);
        }}
        title={editingFAQ ? 'Modifier la question' : 'Nouvelle question'}
        maxWidth="700px"
      >
        <FAQForm
          faq={editingFAQ || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingFAQ(null);
          }}
        />
      </Modal>

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
