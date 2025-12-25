import { useEffect, useState } from 'react';
import { Sparkles, Truck, Award, Heart } from 'lucide-react';
import { theme } from '../config/theme';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { supabase, Product } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';

interface HomePageProps {
  onNavigate?: (page: string) => void;
  onViewProduct?: (product: Product) => void;
}

export function HomePage({ onNavigate, onViewProduct }: HomePageProps) {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('is_featured', true)
        .limit(6);

      if (error) throw error;
      setFeaturedProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section
        style={{
          backgroundColor: theme.colors.background.sage,
          padding: `${theme.spacing['4xl']} ${theme.spacing.lg}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            maxWidth: theme.container.maxWidth,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: theme.spacing['3xl'],
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                ...theme.heading.h1,
                fontSize: '3.5rem',
                marginBottom: theme.spacing.lg,
                fontStyle: 'italic',
              }}
            >
              NOVÉDEN
            </h1>
            <h2
              style={{
                ...theme.heading.h2,
                fontSize: '2.5rem',
                marginBottom: theme.spacing.md,
                fontStyle: 'italic',
              }}
            >
              la beauté authentique
            </h2>
            <p
              style={{
                fontFamily: theme.typography.fontFamily.body,
                fontSize: theme.typography.fontSize.xl,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing['2xl'],
                letterSpacing: theme.typography.letterSpacing.wide,
                textTransform: 'uppercase',
              }}
            >
              CHEVEUX & PEAUX
            </p>
            <Button
              variant="primary"
              size="large"
              onClick={() => onNavigate?.('shop')}
            >
              Découvrir nos produits
            </Button>
          </div>
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
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              ...theme.heading.h2,
              marginBottom: theme.spacing.lg,
            }}
          >
            Mère Nature
          </h2>
          <p
            style={{
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.text.secondary,
              lineHeight: theme.typography.lineHeight.body,
              maxWidth: '800px',
              margin: `0 auto ${theme.spacing['3xl']}`,
            }}
          >
            Chez Novéden, nous remettons la nature au cœur de la beauté. Nous croyons qu'une belle peau, et de doux cheveux tout au
            fait qu'à travers une démarche globale, écologique et respectueuse de la nature. Nos soins 100 % naturels et nos compléments
            alimentaires agissent en parfaite synergie pour hydrater, nourrir, revitaler, et sublimer la peau et les cheveux. Et c'est naturel !
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: theme.spacing.xl,
              marginTop: theme.spacing['3xl'],
            }}
          >
            {[
              {
                icon: Sparkles,
                title: 'Excellence',
                description: 'Des actifs sélectionnés pour leur efficacité et leur tolérance',
              },
              {
                icon: Truck,
                title: 'Livraison Gratuit',
                description: 'Livraison offerte en Belgique dès 65€ d\'achat',
              },
              {
                icon: Award,
                title: 'Qualité Premium',
                description: 'Laboratoire Français et Belge',
              },
              {
                icon: Heart,
                title: 'Engagement',
                description: 'Des formules naturelles et efficaces pour des résultats visibles',
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  padding: theme.spacing.xl,
                  backgroundColor: theme.colors.background.sage,
                  borderRadius: theme.borderRadius.lg,
                  transition: theme.transition.normal,
                }}
              >
                <feature.icon
                  size={48}
                  color={theme.colors.primary.main}
                  style={{ margin: `0 auto ${theme.spacing.md}` }}
                />
                <h3
                  style={{
                    ...theme.heading.h5,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontFamily: theme.typography.fontFamily.body,
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary,
                    lineHeight: theme.typography.lineHeight.body,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          backgroundColor: theme.colors.background.secondary,
          padding: `${theme.spacing['4xl']} ${theme.spacing.lg}`,
        }}
      >
        <div
          style={{
            maxWidth: theme.container.maxWidth,
            margin: '0 auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: theme.spacing['3xl'] }}>
            <h2
              style={{
                ...theme.heading.h2,
                marginBottom: theme.spacing.lg,
              }}
            >
              Nos produits phares
            </h2>
            <p
              style={{
                fontFamily: theme.typography.fontFamily.body,
                fontSize: theme.typography.fontSize.lg,
                color: theme.colors.text.secondary,
                lineHeight: theme.typography.lineHeight.body,
              }}
            >
              Découvrez notre collection de soins capillaires, soins de peau, compléments alimentaires et accessoires parfaits pour votre bien-être
            </p>
          </div>

          {loading ? (
            <div
              style={{
                textAlign: 'center',
                padding: theme.spacing['3xl'],
                color: theme.colors.text.secondary,
              }}
            >
              Chargement des produits...
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: theme.spacing.xl,
                  marginBottom: theme.spacing['2xl'],
                }}
              >
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={onViewProduct}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
              <div style={{ textAlign: 'center' }}>
                <Button
                  variant="primary"
                  size="large"
                  onClick={() => onNavigate?.('shop')}
                >
                  Voir tous les produits
                </Button>
              </div>
            </>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: theme.spacing['3xl'],
                color: theme.colors.text.secondary,
              }}
            >
              Aucun produit à afficher pour le moment.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
