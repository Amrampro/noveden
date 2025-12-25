import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Product } from "../lib/types";
import { Button } from "./Button";
import { theme } from "../config/theme";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const navigate = useNavigate();

  const formattedPrice = Number(product.price).toFixed(2);
  const hasDiscount =
    product.compare_at_price &&
    Number(product.compare_at_price) > Number(product.price);

  const renderStars = (rating: number) => (
    <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          fill={star <= Math.round(rating) ? theme.colors.accent.main : "none"}
          color={
            star <= Math.round(rating)
              ? theme.colors.accent.main
              : theme.colors.text.light
          }
        />
      ))}
    </div>
  );

  return (
    <div
      onClick={() => navigate(`/products/${product.slug}`)}
      style={{
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.lg,
        overflow: "hidden",
        boxShadow: theme.shadow.card,
        transition: theme.transition.normal,
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = theme.shadow.hover;
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = theme.shadow.card;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* IMAGE */}
      <div
        style={{
          width: "100%",
          aspectRatio: "1",
          backgroundColor: theme.colors.background.secondary,
          position: "relative",
        }}
      >
        {product.is_new && (
          <span
            style={{
              position: "absolute",
              top: theme.spacing.md,
              left: theme.spacing.md,
              backgroundColor: theme.colors.primary.main,
              color: theme.colors.text.inverse,
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
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
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.colors.text.light,
            }}
          >
            Pas d'image
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div
        style={{
          padding: theme.spacing.lg,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* CATEGORY */}
        {product.categories?.length > 0 && (
          <span
            style={{
              backgroundColor: theme.colors.primary[100],
              color: theme.colors.primary[700],
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.xs,
              marginBottom: theme.spacing.sm,
              alignSelf: "flex-start",
            }}
          >
            {product.categories[0].name}
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
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.xs,
              marginBottom: theme.spacing.sm,
            }}
          >
            {renderStars(product.average_rating)}
            <span
              style={{
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
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing.md,
            }}
          >
            {product.short_description.length > 80
              ? product.short_description.slice(0, 80) + "..."
              : product.short_description}
          </p>
        )}

        <div style={{ marginBottom: theme.spacing.md }}>
          <span
            style={{
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.bold,
            }}
          >
            {formattedPrice} €
          </span>
          {hasDiscount && (
            <span
              style={{
                marginLeft: theme.spacing.sm,
                fontSize: theme.typography.fontSize.sm,
                textDecoration: "line-through",
                color: theme.colors.text.light,
              }}
            >
              {Number(product.compare_at_price).toFixed(2)} €
            </span>
          )}
        </div>

        <Button
          variant="primary"
          fullWidth
          disabled={product.stock_status === "out_of_stock"}
          onClick={(e) => {
            e.stopPropagation(); // 🔥 clé
            onAddToCart?.(product);
          }}
        >
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
}
