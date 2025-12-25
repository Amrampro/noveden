import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { theme } from '../../config/theme';
import { Search, Trash2, Calendar, Eye } from 'lucide-react';
import { api } from '../../services/api';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image_url?: string;
  published_at: string;
  views?: number;
  categories?: { name: string };
}

export function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await api.adminGetBlogPosts();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ?`)) {
      return;
    }

    try {
      await api.adminDeleteBlogPost(id);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Erreur lors de la suppression de l\'article');
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
        <div style={{ marginBottom: theme.spacing.xl }}>
          <h1
            style={{
              ...theme.heading.h2,
              marginBottom: theme.spacing.md,
            }}
          >
            Blog
          </h1>
          <p
            style={{
              ...theme.body.large,
              color: theme.colors.text.secondary,
            }}
          >
            Gérer les articles du blog
          </p>
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
            placeholder="Rechercher des articles..."
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
            {filteredPosts.map((post) => (
              <div
                key={post.id}
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
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    style={{
                      width: '120px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: theme.borderRadius.md,
                    }}
                  />
                )}

                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      ...theme.heading.h5,
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p
                      style={{
                        ...theme.body.base,
                        color: theme.colors.text.secondary,
                        marginBottom: theme.spacing.sm,
                      }}
                    >
                      {post.excerpt.substring(0, 150)}
                      {post.excerpt.length > 150 ? '...' : ''}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center', flexWrap: 'wrap' }}>
                    {post.categories && (
                      <span
                        style={{
                          ...theme.body.small,
                          padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                          backgroundColor: theme.colors.primary[100],
                          color: theme.colors.primary[700],
                          borderRadius: theme.borderRadius.md,
                        }}
                      >
                        {post.categories.name}
                      </span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                      <Calendar size={14} color={theme.colors.text.light} />
                      <span style={{ ...theme.body.small, color: theme.colors.text.secondary }}>
                        {new Date(post.published_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {post.views !== undefined && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                        <Eye size={14} color={theme.colors.text.light} />
                        <span style={{ ...theme.body.small, color: theme.colors.text.secondary }}>
                          {post.views} vues
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(post.id, post.title)}
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
            ))}

            {filteredPosts.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: theme.spacing.xl,
                  backgroundColor: theme.colors.background.primary,
                  borderRadius: theme.borderRadius.lg,
                }}
              >
                <p style={{ ...theme.body.large, color: theme.colors.text.secondary }}>
                  Aucun article trouvé
                </p>
              </div>
            )}
          </div>
        )}
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
