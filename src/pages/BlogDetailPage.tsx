import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import { theme } from '../config/theme';
import { Button } from '../components/Button';
import { supabase, BlogPost } from '../lib/supabase';

interface BlogDetailPageProps {
  slug: string;
  onNavigate?: (page: string) => void;
}

export function BlogDetailPage({ slug, onNavigate }: BlogDetailPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPost();
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <h1
            key={index}
            style={{
              ...theme.heading.h2,
              marginTop: theme.spacing['2xl'],
              marginBottom: theme.spacing.xl,
            }}
          >
            {line.substring(2)}
          </h1>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2
            key={index}
            style={{
              ...theme.heading.h3,
              marginTop: theme.spacing.xl,
              marginBottom: theme.spacing.md,
            }}
          >
            {line.substring(3)}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3
            key={index}
            style={{
              ...theme.heading.h4,
              marginTop: theme.spacing.lg,
              marginBottom: theme.spacing.sm,
            }}
          >
            {line.substring(4)}
          </h3>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h4
            key={index}
            style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              marginTop: theme.spacing.md,
              marginBottom: theme.spacing.sm,
              fontFamily: theme.typography.fontFamily.heading,
            }}
          >
            {line.substring(5)}
          </h4>
        );
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p
            key={index}
            style={{
              ...theme.body.large,
              fontWeight: theme.typography.fontWeight.semibold,
              marginTop: theme.spacing.md,
              marginBottom: theme.spacing.sm,
            }}
          >
            {line.substring(2, line.length - 2)}
          </p>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li
            key={index}
            style={{
              ...theme.body.base,
              marginLeft: theme.spacing.xl,
              marginBottom: theme.spacing.xs,
            }}
          >
            {line.substring(2)}
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        return (
          <li
            key={index}
            style={{
              ...theme.body.base,
              marginLeft: theme.spacing.xl,
              marginBottom: theme.spacing.xs,
              listStyleType: 'decimal',
            }}
          >
            {line.replace(/^\d+\.\s/, '')}
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={index} style={{ height: theme.spacing.md }} />;
      }
      return (
        <p
          key={index}
          style={{
            ...theme.body.base,
            marginBottom: theme.spacing.md,
          }}
        >
          {line}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: theme.typography.fontFamily.body,
        }}
      >
        Chargement...
      </div>
    );
  }

  if (!post) {
    return (
      <div
        style={{
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing.xl,
          fontFamily: theme.typography.fontFamily.body,
        }}
      >
        <p style={{ ...theme.body.large, color: theme.colors.text.light }}>
          Article non trouvé
        </p>
        <Button variant="outline" onClick={() => onNavigate?.('blog')}>
          <ArrowLeft size={20} style={{ marginRight: theme.spacing.sm }} />
          Retour au blog
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `${theme.spacing['2xl']} ${theme.spacing.lg}`,
          fontFamily: theme.typography.fontFamily.body,
        }}
      >
        <Button
          variant="outline"
          onClick={() => onNavigate?.('blog')}
          style={{ marginBottom: theme.spacing.xl }}
        >
          <ArrowLeft size={20} style={{ marginRight: theme.spacing.sm }} />
          Retour au blog
        </Button>

        <article>
          <header style={{ marginBottom: theme.spacing['2xl'] }}>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: theme.colors.primary[100],
                color: theme.colors.primary[700],
                padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                marginBottom: theme.spacing.md,
              }}
            >
              {post.category}
            </div>

            <h1
              style={{
                ...theme.heading.h1,
                marginBottom: theme.spacing.lg,
              }}
            >
              {post.title}
            </h1>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.xl,
                marginBottom: theme.spacing.xl,
                flexWrap: 'wrap',
              }}
            >
              {post.author_name && post.author_avatar && (
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                  <img
                    src={post.author_avatar}
                    alt={post.author_name}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: theme.borderRadius.full,
                      objectFit: 'cover',
                    }}
                  />
                  <p
                    style={{
                      fontSize: theme.typography.fontSize.base,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.primary,
                    }}
                  >
                    {post.author_name}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                <Calendar size={16} color={theme.colors.text.light} />
                <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.light }}>
                  {formatDate(post.published_at)}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                <Clock size={16} color={theme.colors.text.light} />
                <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.light }}>
                  {post.reading_time} min
                </span>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, flexWrap: 'wrap' }}>
                <Tag size={16} color={theme.colors.text.light} />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      backgroundColor: theme.colors.background.secondary,
                      color: theme.colors.text.secondary,
                      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: theme.typography.fontSize.xs,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {post.image_url && (
            <div
              style={{
                width: '100%',
                height: '500px',
                marginBottom: theme.spacing['2xl'],
                borderRadius: theme.borderRadius.lg,
                overflow: 'hidden',
              }}
            >
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

          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: 1.8,
            }}
          >
            {renderContent(post.content)}
          </div>
        </article>

        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            marginTop: theme.spacing['4xl'],
            paddingTop: theme.spacing['2xl'],
            borderTop: `1px solid ${theme.colors.border.light}`,
            textAlign: 'center',
          }}
        >
          <Button variant="primary" onClick={() => onNavigate?.('blog')}>
            Voir plus d'articles
          </Button>
        </div>
      </div>
    </div>
  );
}
