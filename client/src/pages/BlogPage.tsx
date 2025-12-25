import { useEffect, useState } from 'react';
import { Clock, Eye } from 'lucide-react';
import { theme } from '../config/theme';
import { Button } from '../components/Button';
import { supabase, BlogPost } from '../lib/supabase';

interface BlogPageProps {
  onViewBlogPost?: (post: BlogPost) => void;
}

export function BlogPage({ onViewBlogPost }: BlogPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const categories = ['Tous les articles', 'Accessoires Beauté', 'Cheveux', 'Peaux'];

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((post) => post.category === selectedCategory));
    }
  }, [selectedCategory, posts]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
      setFilteredPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryValue = (label: string): string => {
    if (label === 'Tous les articles') return 'all';
    if (label === 'Accessoires Beauté') return 'Article Vedette';
    return label;
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
            Blog
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
            Découvrez nos conseils beauté et nos articles sur les soins naturels
          </p>
        </div>
      </section>

      <section
        style={{
          backgroundColor: theme.colors.background.primary,
          padding: `${theme.spacing['2xl']} ${theme.spacing.lg}`,
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
              display: 'flex',
              flexWrap: 'wrap',
              gap: theme.spacing.md,
              justifyContent: 'center',
              marginBottom: theme.spacing['2xl'],
            }}
          >
            {categories.map((category) => {
              const categoryValue = getCategoryValue(category);
              return (
                <Button
                  key={category}
                  variant={selectedCategory === categoryValue ? 'primary' : 'outline'}
                  onClick={() => setSelectedCategory(categoryValue)}
                >
                  {category}
                </Button>
              );
            })}
          </div>

          {loading ? (
            <div
              style={{
                textAlign: 'center',
                padding: theme.spacing['4xl'],
                color: theme.colors.text.secondary,
                fontFamily: theme.typography.fontFamily.body,
              }}
            >
              Chargement des articles...
            </div>
          ) : filteredPosts.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: theme.spacing.xl,
              }}
            >
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => onViewBlogPost?.(post)}
                  style={{
                    backgroundColor: theme.colors.background.primary,
                    borderRadius: theme.borderRadius.lg,
                    overflow: 'hidden',
                    boxShadow: theme.shadow.card,
                    transition: theme.transition.normal,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = theme.shadow.hover;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = theme.shadow.card;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {post.image_url && (
                    <div
                      style={{
                        width: '100%',
                        height: '240px',
                        backgroundColor: theme.colors.background.secondary,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          top: theme.spacing.md,
                          left: theme.spacing.md,
                          backgroundColor: theme.colors.primary.main,
                          color: theme.colors.text.inverse,
                          padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: theme.typography.fontSize.xs,
                          fontWeight: theme.typography.fontWeight.medium,
                          fontFamily: theme.typography.fontFamily.body,
                        }}
                      >
                        {post.category}
                      </span>
                      <img
                        src={post.image_url}
                        alt={post.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  )}

                  <div style={{ padding: theme.spacing.lg }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing.md,
                        marginBottom: theme.spacing.md,
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.text.light,
                        fontFamily: theme.typography.fontFamily.body,
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                        <Clock size={14} />
                        {post.reading_time} min
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                        <Eye size={14} />
                        {post.views}
                      </span>
                      <span>
                        {new Date(post.published_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3
                      style={{
                        ...theme.heading.h4,
                        fontSize: theme.typography.fontSize.xl,
                        marginBottom: theme.spacing.sm,
                      }}
                    >
                      {post.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.text.secondary,
                        lineHeight: theme.typography.lineHeight.body,
                        marginBottom: theme.spacing.md,
                      }}
                    >
                      {post.excerpt}
                    </p>

                    <Button variant="outline" size="small">
                      Lire l'article
                    </Button>
                  </div>
                </article>
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
              Aucun article disponible dans cette catégorie.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
