import { Star } from 'lucide-react';
import { Product } from '../lib/supabase';
import { Button } from './Button';
import { theme } from '../config/theme';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const formattedPrice = product.price.toFixed(2);
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;

  const renderStars = (rating: number) => {
    return (
      <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            fill={star <= Math.round(rating) ? theme.colors.accent.main : 'none'}
            color={star <= Math.round(rating) ? theme.colors.accent.main : theme.colors.text.light}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        boxShadow: theme.shadow.card,
        transition: theme.transition.normal,
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={() => onViewDetails?.(product)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = theme.shadow.hover;
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = theme.shadow.card;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '1',
          backgroundColor: theme.colors.background.secondary,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {product.is_new && (
          <span
            style={{
              position: 'absolute',
              top: theme.spacing.md,
              left: theme.spacing.md,
              backgroundColor: theme.colors.primary.main,
              color: theme.colors.text.inverse,
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              fontFamily: theme.typography.fontFamily.body,
              zIndex: 10,
            }}
          >
            Nouveau
          </span>
        )}
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.text.light,
            }}
          >
            Pas d'image
          </div>
        )}
      </div>

      <div style={{ padding: theme.spacing.lg, flex: 1, display: 'flex', flexDirection: 'column' }}>
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
              marginBottom: theme.spacing.sm,
              alignSelf: 'flex-start',
            }}
          >
            {product.categories.name}
          </span>
        )}

        <h3
          style={{
            ...theme.heading.h5,
            fontSize: theme.typography.fontSize.lg,
            marginBottom: theme.spacing.sm,
            flex: 1,
          }}
        >
          {product.name}
        </h3>

        {product.review_count > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.xs,
              marginBottom: theme.spacing.sm,
            }}
          >
            {renderStars(product.average_rating)}
            <span
              style={{
                fontFamily: theme.typography.fontFamily.body,
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.light,
              }}
            >
              ({product.review_count})
            </span>
          </div>
        )}

        {product.short_description && (
          <p
            style={{
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              lineHeight: theme.typography.lineHeight.body,
              marginBottom: theme.spacing.md,
            }}
          >
            {product.short_description.length > 80
              ? product.short_description.substring(0, 80) + '...'
              : product.short_description}
          </p>
        )}

        <div style={{ marginBottom: theme.spacing.md }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
            <span
              style={{
                fontFamily: theme.typography.fontFamily.body,
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.text.primary,
              }}
            >
              {formattedPrice} €
            </span>
            {hasDiscount && (
              <span
                style={{
                  fontFamily: theme.typography.fontFamily.body,
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.light,
                  textDecoration: 'line-through',
                }}
              >
                {product.compare_at_price?.toFixed(2)} €
              </span>
            )}
          </div>
          <span
            style={{
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.secondary,
            }}
          >
            {product.stock_status === 'in_stock'
              ? 'En stock'
              : product.stock_status === 'limited'
              ? 'Stock limité'
              : 'Rupture de stock'}
          </span>
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product);
          }}
          disabled={product.stock_status === 'out_of_stock'}
        >
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
}
