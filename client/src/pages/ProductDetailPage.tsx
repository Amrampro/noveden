import { useEffect, useState } from 'react';
import { ArrowLeft, Star, ShoppingCart, Check, ThumbsUp } from 'lucide-react';
import { theme } from '../config/theme';
import { Button } from '../components/Button';
import { ProductImageGallery } from '../components/ProductImageGallery';
import { Product, ProductReview, ProductImage } from '../lib/types';
import { api } from '../services/api';
import { useCart } from '../contexts/CartContext';

interface ProductDetailPageProps {
  productId: string;
  onNavigate?: (page: string) => void;
}

export function ProductDetailPage({ productId, onNavigate }: ProductDetailPageProps) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    customer_name: '',
    customer_email: '',
    rating: 5,
    title: '',
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProductDetails();
    fetchProductImages();
    fetchReviews();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('id', productId)
        .maybeSingle();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductImages = async () => {
    try {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('display_order');

      if (error) throw error;
      setProductImages(data || []);
    } catch (error) {
      console.error('Error fetching product images:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessage('Les avis produits seront bientôt disponibles !');
      setReviewForm({
        customer_name: '',
        customer_email: '',
        rating: 5,
        title: '',
        comment: '',
      });
      setShowReviewForm(false);
    } catch (error) {
      setMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally{
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, size: number = 20) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            fill={star <= rating ? theme.colors.accent.main : 'none'}
            color={star <= rating ? theme.colors.accent.main : theme.colors.text.light}
          />
        ))}
      </div>
    );
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div
        style={{
          padding: theme.spacing['4xl'],
          textAlign: 'center',
          fontFamily: theme.typography.fontFamily.body,
          color: theme.colors.text.secondary,
        }}
      >
        Chargement...
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{
          padding: theme.spacing['4xl'],
          textAlign: 'center',
        }}
      >
        <h2 style={{ ...theme.heading.h2, marginBottom: theme.spacing.lg }}>Produit non trouvé</h2>
        <Button variant="primary" onClick={() => onNavigate?.('shop')}>
          Retour à la boutique
        </Button>
      </div>
    );
  }

  const distribution = getRatingDistribution();

  return (
    <div>
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
          <button
            onClick={() => onNavigate?.('shop')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.primary.main,
              marginBottom: theme.spacing.xl,
            }}
          >
            <ArrowLeft size={20} />
            Retour à la boutique
          </button>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: theme.spacing['3xl'],
              marginBottom: theme.spacing['4xl'],
            }}
          >
            <div>
              <ProductImageGallery
                images={
                  productImages.length > 0
                    ? productImages
                    : product.image_url
                    ? [
                        {
                          id: 'fallback',
                          product_id: product.id,
                          image_url: product.image_url,
                          alt_text: product.name,
                          display_order: 0,
                          is_primary: true,
                          created_at: product.created_at,
                        },
                      ]
                    : []
                }
                productName={product.name}
                isNew={product.is_new}
              />
            </div>

            <div>
              {product.categories && (
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: theme.colors.primary[100],
                    color: theme.colors.primary[700],
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.xs,
                    fontWeight: theme.typography.fontWeight.medium,
                    fontFamily: theme.typography.fontFamily.body,
                    marginBottom: theme.spacing.md,
                  }}
                >
                  {product.categories.name}
                </span>
              )}

              <h1
                style={{
                  ...theme.heading.h1,
                  fontSize: theme.typography.fontSize['4xl'],
                  marginBottom: theme.spacing.md,
                }}
              >
                {product.name}
              </h1>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.md,
                  marginBottom: theme.spacing.lg,
                }}
              >
                {renderStars(Math.round(product.average_rating), 24)}
                <span
                  style={{
                    fontFamily: theme.typography.fontFamily.body,
                    fontSize: theme.typography.fontSize.base,
                    color: theme.colors.text.secondary,
                  }}
                >
                  {product.average_rating.toFixed(1)} ({product.review_count}{' '}
                  {product.review_count === 1 ? 'avis' : 'avis'})
                </span>
              </div>

              <div style={{ marginBottom: theme.spacing.xl }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
                  <span
                    style={{
                      fontFamily: theme.typography.fontFamily.body,
                      fontSize: theme.typography.fontSize['3xl'],
                      fontWeight: theme.typography.fontWeight.bold,
                      color: theme.colors.text.primary,
                    }}
                  >
                    {product.price.toFixed(2)} €
                  </span>
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <span
                      style={{
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.lg,
                        color: theme.colors.text.light,
                        textDecoration: 'line-through',
                      }}
                    >
                      {product.compare_at_price.toFixed(2)} €
                    </span>
                  )}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.sm,
                  }}
                >
                  {product.stock_status === 'in_stock' && (
                    <>
                      <Check size={16} color={theme.colors.status.success} />
                      <span
                        style={{
                          fontFamily: theme.typography.fontFamily.body,
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.status.success,
                          fontWeight: theme.typography.fontWeight.medium,
                        }}
                      >
                        En stock
                      </span>
                    </>
                  )}
                  {product.stock_status === 'limited' && (
                    <span
                      style={{
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.status.warning,
                        fontWeight: theme.typography.fontWeight.medium,
                      }}
                    >
                      Stock limité
                    </span>
                  )}
                  {product.stock_status === 'out_of_stock' && (
                    <span
                      style={{
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.status.error,
                        fontWeight: theme.typography.fontWeight.medium,
                      }}
                    >
                      Rupture de stock
                    </span>
                  )}
                </div>
              </div>

              <p
                style={{
                  fontFamily: theme.typography.fontFamily.body,
                  fontSize: theme.typography.fontSize.lg,
                  color: theme.colors.text.secondary,
                  lineHeight: theme.typography.lineHeight.body,
                  marginBottom: theme.spacing.xl,
                }}
              >
                {product.description}
              </p>

              <Button
                variant="primary"
                size="large"
                fullWidth
                disabled={product.stock_status === 'out_of_stock'}
                onClick={() => {
                  addToCart(product);
                  setAddedToCart(true);
                  setTimeout(() => setAddedToCart(false), 2000);
                }}
                style={{ marginBottom: theme.spacing.md }}
              >
                {addedToCart ? (
                  <>
                    <Check size={20} style={{ marginRight: theme.spacing.sm }} />
                    Ajouté au panier !
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} style={{ marginRight: theme.spacing.sm }} />
                    Ajouter au panier
                  </>
                )}
              </Button>

              {product.benefits && product.benefits.length > 0 && (
                <div style={{ marginTop: theme.spacing.xl }}>
                  <h3
                    style={{
                      ...theme.heading.h4,
                      marginBottom: theme.spacing.md,
                    }}
                  >
                    Avantages
                  </h3>
                  <ul
                    style={{
                      listStyle: 'none',
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    {product.benefits.map((benefit, index) => (
                      <li
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: theme.spacing.sm,
                          marginBottom: theme.spacing.sm,
                          fontFamily: theme.typography.fontFamily.body,
                          fontSize: theme.typography.fontSize.base,
                          color: theme.colors.text.secondary,
                        }}
                      >
                        <Check size={20} color={theme.colors.status.success} style={{ flexShrink: 0, marginTop: '2px' }} />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {product.ingredients && (
            <div
              style={{
                backgroundColor: theme.colors.background.secondary,
                padding: theme.spacing.xl,
                borderRadius: theme.borderRadius.lg,
                marginBottom: theme.spacing.xl,
              }}
            >
              <h3
                style={{
                  ...theme.heading.h4,
                  marginBottom: theme.spacing.md,
                }}
              >
                Ingrédients
              </h3>
              <p
                style={{
                  fontFamily: theme.typography.fontFamily.body,
                  fontSize: theme.typography.fontSize.base,
                  color: theme.colors.text.secondary,
                  lineHeight: theme.typography.lineHeight.body,
                }}
              >
                {product.ingredients}
              </p>
            </div>
          )}

          {product.usage && (
            <div
              style={{
                backgroundColor: theme.colors.background.secondary,
                padding: theme.spacing.xl,
                borderRadius: theme.borderRadius.lg,
                marginBottom: theme.spacing['3xl'],
              }}
            >
              <h3
                style={{
                  ...theme.heading.h4,
                  marginBottom: theme.spacing.md,
                }}
              >
                Mode d'emploi
              </h3>
              <p
                style={{
                  fontFamily: theme.typography.fontFamily.body,
                  fontSize: theme.typography.fontSize.base,
                  color: theme.colors.text.secondary,
                  lineHeight: theme.typography.lineHeight.body,
                }}
              >
                {product.usage}
              </p>
            </div>
          )}

          <div id="reviews">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: theme.spacing.xl,
                flexWrap: 'wrap',
                gap: theme.spacing.md,
              }}
            >
              <h2 style={{ ...theme.heading.h2 }}>Avis clients</h2>
              <Button variant="primary" onClick={() => setShowReviewForm(!showReviewForm)}>
                {showReviewForm ? 'Annuler' : 'Écrire un avis'}
              </Button>
            </div>

            {showReviewForm && (
              <div
                style={{
                  backgroundColor: theme.colors.background.secondary,
                  padding: theme.spacing.xl,
                  borderRadius: theme.borderRadius.lg,
                  marginBottom: theme.spacing.xl,
                }}
              >
                <h3
                  style={{
                    ...theme.heading.h4,
                    marginBottom: theme.spacing.lg,
                  }}
                >
                  Partagez votre avis
                </h3>
                <form onSubmit={handleSubmitReview}>
                  <div style={{ marginBottom: theme.spacing.lg }}>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.medium,
                        color: theme.colors.text.primary,
                        marginBottom: theme.spacing.sm,
                      }}
                    >
                      Note
                    </label>
                    <div style={{ display: 'flex', gap: theme.spacing.xs }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          <Star
                            size={32}
                            fill={star <= reviewForm.rating ? theme.colors.accent.main : 'none'}
                            color={star <= reviewForm.rating ? theme.colors.accent.main : theme.colors.text.light}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: theme.spacing.lg }}>
                    <label
                      htmlFor="review-name"
                      style={{
                        display: 'block',
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.medium,
                        color: theme.colors.text.primary,
                        marginBottom: theme.spacing.sm,
                      }}
                    >
                      Nom
                    </label>
                    <input
                      type="text"
                      id="review-name"
                      value={reviewForm.customer_name}
                      onChange={(e) => setReviewForm({ ...reviewForm, customer_name: e.target.value })}
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
                    />
                  </div>

                  <div style={{ marginBottom: theme.spacing.lg }}>
                    <label
                      htmlFor="review-email"
                      style={{
                        display: 'block',
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.medium,
                        color: theme.colors.text.primary,
                        marginBottom: theme.spacing.sm,
                      }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="review-email"
                      value={reviewForm.customer_email}
                      onChange={(e) => setReviewForm({ ...reviewForm, customer_email: e.target.value })}
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
                    />
                  </div>

                  <div style={{ marginBottom: theme.spacing.lg }}>
                    <label
                      htmlFor="review-title"
                      style={{
                        display: 'block',
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.medium,
                        color: theme.colors.text.primary,
                        marginBottom: theme.spacing.sm,
                      }}
                    >
                      Titre de l'avis
                    </label>
                    <input
                      type="text"
                      id="review-title"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
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
                    />
                  </div>

                  <div style={{ marginBottom: theme.spacing.lg }}>
                    <label
                      htmlFor="review-comment"
                      style={{
                        display: 'block',
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.medium,
                        color: theme.colors.text.primary,
                        marginBottom: theme.spacing.sm,
                      }}
                    >
                      Votre avis
                    </label>
                    <textarea
                      id="review-comment"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      required
                      rows={5}
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
                    />
                  </div>

                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'Envoi en cours...' : 'Publier l\'avis'}
                  </Button>

                  {message && (
                    <p
                      style={{
                        marginTop: theme.spacing.md,
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.sm,
                        color: message.includes('erreur')
                          ? theme.colors.status.error
                          : theme.colors.status.success,
                      }}
                    >
                      {message}
                    </p>
                  )}
                </form>
              </div>
            )}

            {reviews.length > 0 ? (
              <>
                <div
                  style={{
                    backgroundColor: theme.colors.background.secondary,
                    padding: theme.spacing.xl,
                    borderRadius: theme.borderRadius.lg,
                    marginBottom: theme.spacing.xl,
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      gap: theme.spacing.xl,
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '3rem',
                          fontWeight: theme.typography.fontWeight.bold,
                          fontFamily: theme.typography.fontFamily.body,
                          color: theme.colors.text.primary,
                          marginBottom: theme.spacing.xs,
                        }}
                      >
                        {product.average_rating.toFixed(1)}
                      </div>
                      {renderStars(Math.round(product.average_rating), 24)}
                      <div
                        style={{
                          fontFamily: theme.typography.fontFamily.body,
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.text.secondary,
                          marginTop: theme.spacing.xs,
                        }}
                      >
                        {product.review_count} avis
                      </div>
                    </div>

                    <div>
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div
                          key={rating}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'auto 1fr auto',
                            gap: theme.spacing.sm,
                            alignItems: 'center',
                            marginBottom: theme.spacing.xs,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: theme.typography.fontFamily.body,
                              fontSize: theme.typography.fontSize.sm,
                              color: theme.colors.text.secondary,
                            }}
                          >
                            {rating} ★
                          </span>
                          <div
                            style={{
                              height: '8px',
                              backgroundColor: theme.colors.border.light,
                              borderRadius: theme.borderRadius.full,
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${
                                  reviews.length > 0 ? (distribution[rating as keyof typeof distribution] / reviews.length) * 100 : 0
                                }%`,
                                backgroundColor: theme.colors.accent.main,
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontFamily: theme.typography.fontFamily.body,
                              fontSize: theme.typography.fontSize.sm,
                              color: theme.colors.text.secondary,
                              minWidth: '30px',
                              textAlign: 'right',
                            }}
                          >
                            {distribution[rating as keyof typeof distribution]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      style={{
                        backgroundColor: theme.colors.background.secondary,
                        padding: theme.spacing.xl,
                        borderRadius: theme.borderRadius.lg,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: theme.spacing.md,
                          flexWrap: 'wrap',
                          gap: theme.spacing.md,
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.xs }}>
                            {renderStars(review.rating, 18)}
                            {review.is_verified_purchase && (
                              <span
                                style={{
                                  backgroundColor: theme.colors.status.success,
                                  color: theme.colors.text.inverse,
                                  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                                  borderRadius: theme.borderRadius.md,
                                  fontSize: theme.typography.fontSize.xs,
                                  fontWeight: theme.typography.fontWeight.medium,
                                  fontFamily: theme.typography.fontFamily.body,
                                }}
                              >
                                Achat vérifié
                              </span>
                            )}
                          </div>
                          <h4
                            style={{
                              ...theme.heading.h5,
                              fontSize: theme.typography.fontSize.lg,
                              marginBottom: theme.spacing.xs,
                            }}
                          >
                            {review.title}
                          </h4>
                          <p
                            style={{
                              fontFamily: theme.typography.fontFamily.body,
                              fontSize: theme.typography.fontSize.sm,
                              color: theme.colors.text.light,
                            }}
                          >
                            Par {review.customer_name} le{' '}
                            {new Date(review.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <p
                        style={{
                          fontFamily: theme.typography.fontFamily.body,
                          fontSize: theme.typography.fontSize.base,
                          color: theme.colors.text.secondary,
                          lineHeight: theme.typography.lineHeight.body,
                          marginBottom: theme.spacing.md,
                        }}
                      >
                        {review.comment}
                      </p>

                      <button
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: theme.spacing.xs,
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          fontFamily: theme.typography.fontFamily.body,
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.text.light,
                        }}
                      >
                        <ThumbsUp size={16} />
                        Utile ({review.helpful_count})
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div
                style={{
                  backgroundColor: theme.colors.background.secondary,
                  padding: theme.spacing['3xl'],
                  borderRadius: theme.borderRadius.lg,
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontFamily: theme.typography.fontFamily.body,
                    fontSize: theme.typography.fontSize.lg,
                    color: theme.colors.text.secondary,
                  }}
                >
                  Aucun avis pour le moment. Soyez le premier à laisser votre avis !
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
