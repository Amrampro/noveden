// client/src/pages/HomePage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Truck,
  Award,
  Heart,
  Leaf,
  ShieldCheck,
  ArrowRight,
  Newspaper,
  Tag,
} from "lucide-react";
import { theme } from "../config/theme";
import { Button } from "../components/Button";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../lib/types";
import { useCart } from "../contexts/CartContext";
import { productService, type ProductCategory } from "../services/productService";
import { blogService, type BlogPost } from "../services/blogService";
import { PageBanner } from "../components/PageBanner";

interface HomePageProps {
  onNavigate?: (page: string) => void;
  onViewProduct?: (product: Product) => void;
  onViewPost?: (post: BlogPost) => void;
}

export function HomePage({ onNavigate, onViewProduct, onViewPost }: HomePageProps) {
  const { addToCart } = useCart();

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("all");

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    void fetchCategoriesAndProducts();
    void fetchLatestPosts();
  }, []);

  useEffect(() => {
    // when category changes, refresh featured list filtered by category
    void fetchFeaturedProducts(selectedCategorySlug === "all" ? undefined : selectedCategorySlug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategorySlug]);

  const fetchCategoriesAndProducts = async () => {
    try {
      setLoadingCategories(true);
      const { categories } = await productService.listCategories();
      setCategories(categories || []);
    } catch (error) {
      console.error("Error fetching product categories:", error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
      // initial products load (all)
      void fetchFeaturedProducts(undefined);
    }
  };

  const fetchFeaturedProducts = async (categorySlug?: string) => {
    try {
      setLoadingProducts(true);
      const { products } = await productService.listProducts({
        featured: true,
        category: categorySlug,
        limit: 24,
        offset: 0,
      });

      // Ensure we show max 6 (same spirit as old homepage)
      setFeaturedProducts((products || []).slice(0, 6));
    } catch (error) {
      console.error("Error fetching featured products:", error);
      setFeaturedProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchLatestPosts = async () => {
    try {
      const { posts } = await blogService.listPosts({ limit: 6, offset: 0 });
      setLatestPosts((posts || []).slice(0, 3));
    } catch (error) {
      console.error("Error fetching latest posts:", error);
      setLatestPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  const features = useMemo(
    () => [
      {
        icon: Leaf,
        title: "Nature & pureté",
        description:
          "Des formules inspirées du meilleur de la nature, pensées pour une routine simple et efficace.",
      },
      {
        icon: ShieldCheck,
        title: "Tolérance",
        description: "Des actifs sélectionnés pour leur douceur et leur efficacité au quotidien.",
      },
      {
        icon: Truck,
        title: "Livraison offerte",
        description: "Livraison gratuite en Belgique dès 65€ d’achat.",
      },
      {
        icon: Award,
        title: "Qualité premium",
        description: "Laboratoire Français & Belge, exigences élevées, résultats visibles.",
      },
    ],
    []
  );

  const sortedTopCategories = useMemo(() => {
    // Keep a stable order like your DB has display_order
    const copy = [...categories];
    copy.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || a.name.localeCompare(b.name));
    return copy.slice(0, 8);
  }, [categories]);

  return (
    <div>
      {/* <Header /> */}
      <PageBanner />

      {/* BRAND STORY */}
      <section
        style={{
          backgroundColor: theme.colors.background.sage,
          padding: `${theme.spacing["2xl"]} ${theme.spacing.lg}`,
        }}
      >
        <div
          style={{
            maxWidth: theme.container.maxWidth,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2 style={{ ...theme.heading.h2, marginBottom: theme.spacing.lg }}>Mère Nature</h2>

          <p
            style={{
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.text.secondary,
              lineHeight: theme.typography.lineHeight.body,
              maxWidth: "860px",
              margin: `0 auto ${theme.spacing["3xl"]}`,
            }}
          >
            Chez Novéden, nous remettons la nature au cœur de la beauté. Nos soins 100% naturels et nos compléments
            alimentaires agissent en synergie pour hydrater, nourrir, revitaliser et sublimer la peau et les cheveux.
            Une démarche globale, écologique et respectueuse. Et c’est naturel.
          </p>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section
        style={{
          backgroundColor: theme.colors.background.secondary,
          padding: `${theme.spacing["4xl"]} ${theme.spacing.lg}`,
        }}
      >
        <div style={{ maxWidth: theme.container.maxWidth, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: theme.spacing["3xl"] }}>
            <h2 style={{ ...theme.heading.h2, marginBottom: theme.spacing.lg }}>
              Nos produits phares
            </h2>

            {loadingCategories ? (
            <div style={{ textAlign: "center", color: theme.colors.text.secondary }}>
              Chargement des catégories...
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                gap: theme.spacing.sm,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setSelectedCategorySlug("all")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: theme.spacing.sm,
                  padding: "10px 14px",
                  borderRadius: theme.borderRadius.full,
                  border: `1px solid ${theme.colors.border.light}`,
                  backgroundColor:
                    selectedCategorySlug === "all"
                      ? theme.colors.primary.main
                      : theme.colors.background.primary,
                  color:
                    selectedCategorySlug === "all"
                      ? theme.colors.text.inverse
                      : theme.colors.text.primary,
                  cursor: "pointer",
                  fontFamily: theme.typography.fontFamily.body,
                  fontSize: theme.typography.fontSize.sm,
                  transition: theme.transition.normal,
                }}
              >
                <Tag size={16} />
                Tous
              </button>

              {sortedTopCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategorySlug(cat.slug)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: theme.spacing.sm,
                    padding: "10px 14px",
                    borderRadius: theme.borderRadius.full,
                    border: `1px solid ${theme.colors.border.light}`,
                    backgroundColor:
                      selectedCategorySlug === cat.slug
                        ? theme.colors.primary.main
                        : theme.colors.background.primary,
                    color:
                      selectedCategorySlug === cat.slug
                        ? theme.colors.text.inverse
                        : theme.colors.text.primary,
                    cursor: "pointer",
                    fontFamily: theme.typography.fontFamily.body,
                    fontSize: theme.typography.fontSize.sm,
                    transition: theme.transition.normal,
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
          </div>

          {loadingProducts ? (
            <div
              style={{
                textAlign: "center",
                padding: theme.spacing["3xl"],
                color: theme.colors.text.secondary,
              }}
            >
              Chargement des produits...
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: theme.spacing.xl,
                  marginBottom: theme.spacing["2xl"],
                }}
              >
                {featuredProducts.map((product) => {
                  const categoryBadges = (product.categories || []).slice(0, 2);
                  return (
                    <div key={product.id} style={{ position: "relative" }}>
                      {/* category badges overlay */}
                      {categoryBadges.length > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            display: "flex",
                            gap: theme.spacing.sm,
                            flexWrap: "wrap",
                            zIndex: 2,
                          }}
                        >
                          {categoryBadges.map((c) => (
                            <span
                              key={c.id}
                              style={{
                                fontFamily: theme.typography.fontFamily.body,
                                fontSize: theme.typography.fontSize.xs,
                                color: theme.colors.text.secondary,
                                backgroundColor: "rgba(255,255,255,0.85)",
                                border: `1px solid ${theme.colors.border.light}`,
                                padding: "6px 10px",
                                borderRadius: theme.borderRadius.full,
                                textTransform: "uppercase",
                                letterSpacing: theme.typography.letterSpacing.wide,
                                backdropFilter: "blur(6px)",
                              }}
                            >
                              {c.name}
                            </span>
                          ))}
                        </div>
                      )}

                      <ProductCard
                        product={product}
                        onAddToCart={addToCart}
                      />
                    </div>
                  );
                })}
              </div>

              <div style={{ textAlign: "center" }}>
                <Button variant="primary" size="large" onClick={() => navigate("/shop")}>
                  Voir tous les produits
                </Button>
              </div>
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: theme.spacing["3xl"],
                color: theme.colors.text.secondary,
              }}
            >
              {selectedCategorySlug === "all"
                ? "Aucun produit à afficher pour le moment."
                : "Aucun produit phare pour cette catégorie pour le moment."}
            </div>
          )}
        </div>
      </section>

<section
        style={{
          backgroundColor: theme.colors.background.primary,
          padding: `${theme.spacing["4xl"]} ${theme.spacing.lg}`,
        }}
      >
        <div
          style={{
            maxWidth: theme.container.maxWidth,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: theme.spacing.xl,
              marginTop: theme.spacing["3xl"],
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  padding: theme.spacing.xl,
                  backgroundColor: theme.colors.background.sage,
                  borderRadius: theme.borderRadius.lg,
                  transition: theme.transition.normal,
                  border: `1px solid ${theme.colors.border.light}`,
                }}
              >
                <feature.icon
                  size={48}
                  color={theme.colors.primary.main}
                  style={{ margin: `0 auto ${theme.spacing.md}` }}
                />
                <h3 style={{ ...theme.heading.h5, marginBottom: theme.spacing.sm }}>{feature.title}</h3>
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

      {/* CONTENT / BLOG TEASER */}
      <section
        style={{
          backgroundColor: theme.colors.background.primary,
          padding: `${theme.spacing["4xl"]} ${theme.spacing.lg}`,
        }}
      >
        <div style={{ maxWidth: theme.container.maxWidth, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: theme.spacing["3xl"] }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: theme.spacing.sm,
                padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                borderRadius: theme.borderRadius.full,
                backgroundColor: theme.colors.background.sage,
                border: `1px solid ${theme.colors.border.light}`,
                marginBottom: theme.spacing.lg,
              }}
            >
              <Newspaper size={18} color={theme.colors.primary.main} />
              <span
                style={{
                  fontFamily: theme.typography.fontFamily.body,
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.secondary,
                  textTransform: "uppercase",
                  letterSpacing: theme.typography.letterSpacing.wide,
                }}
              >
                Conseils & routines
              </span>
            </div>

            <h2 style={{ ...theme.heading.h2, marginBottom: theme.spacing.lg }}>
              Inspirez votre routine beauté
            </h2>
            <p
              style={{
                fontFamily: theme.typography.fontFamily.body,
                fontSize: theme.typography.fontSize.lg,
                color: theme.colors.text.secondary,
                lineHeight: theme.typography.lineHeight.body,
                margin: 0,
              }}
            >
              Des articles simples et utiles pour mieux comprendre votre peau et vos cheveux, et choisir les bons soins.
            </p>
          </div>

          {loadingPosts ? (
            <div
              style={{
                textAlign: "center",
                padding: theme.spacing["2xl"],
                color: theme.colors.text.secondary,
              }}
            >
              Chargement des articles...
            </div>
          ) : latestPosts.length ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: theme.spacing.xl,
                  marginBottom: theme.spacing["2xl"],
                }}
              >
                {latestPosts.map((post) => (
                  <article
                    key={post.id}
                    style={{
                      backgroundColor: theme.colors.background.secondary,
                      borderRadius: theme.borderRadius.lg,
                      border: `1px solid ${theme.colors.border.light}`,
                      overflow: "hidden",
                      transition: theme.transition.normal,
                    }}
                  >
                    {post.image_url ? (
                      <div
                        style={{
                          height: 180,
                          backgroundImage: `url(${post.image_url})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: 180,
                          backgroundColor: theme.colors.background.sage,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Sparkles size={28} color={theme.colors.primary.main} />
                      </div>
                    )}

                    <div style={{ padding: theme.spacing.lg }}>
                      <h3 style={{ ...theme.heading.h5, marginBottom: theme.spacing.sm }}>
                        {post.title}
                      </h3>

                      <p
                        style={{
                          fontFamily: theme.typography.fontFamily.body,
                          fontSize: theme.typography.fontSize.sm,
                          color: theme.colors.text.secondary,
                          lineHeight: theme.typography.lineHeight.body,
                          marginBottom: theme.spacing.lg,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {post.excerpt || "Découvrez nos conseils pour une routine simple, naturelle et efficace."}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: theme.typography.fontFamily.body,
                            fontSize: theme.typography.fontSize.sm,
                            color: theme.colors.text.secondary,
                          }}
                        >
                          {post.reading_time ?? 5} min
                        </span>

                        <button
                          onClick={() => onViewPost?.(post)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: theme.spacing.sm,
                            background: "transparent",
                            border: "none",
                            color: theme.colors.primary.main,
                            cursor: "pointer",
                            fontFamily: theme.typography.fontFamily.body,
                            fontSize: theme.typography.fontSize.sm,
                          }}
                        >
                          Lire <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div style={{ textAlign: "center" }}>
                <Button variant="secondary" size="large" onClick={() => navigate("/blog")}>
                  Voir tous les articles
                </Button>
              </div>
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: theme.spacing["2xl"],
                color: theme.colors.text.secondary,
              }}
            >
              Aucun article pour le moment.
            </div>
          )}
        </div>
      </section>

      {/* CTA STRIP */}
      <section
        style={{
          backgroundColor: theme.colors.background.sage,
          padding: `${theme.spacing["3xl"]} ${theme.spacing.lg}`,
        }}
      >
        <div
          style={{
            maxWidth: theme.container.maxWidth,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: theme.spacing.xl,
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 260 }}>
            <h3 style={{ ...theme.heading.h4, marginBottom: theme.spacing.sm }}>
              Une routine simple. Des résultats visibles.
            </h3>
            <p
              style={{
                fontFamily: theme.typography.fontFamily.body,
                fontSize: theme.typography.fontSize.md,
                color: theme.colors.text.secondary,
                lineHeight: theme.typography.lineHeight.body,
                margin: 0,
              }}
            >
              Choisissez vos essentiels Novéden et commencez dès aujourd’hui.
            </p>
          </div>

          <div style={{ display: "flex", gap: theme.spacing.md, flexWrap: "wrap" }}>
            <button style={{...theme.button.primary}} onClick={() => navigate("/shop")}>
              Aller à la boutique
            </button>
            <button style={{...theme.button.outline}} onClick={() => navigate("/contact")}>
              Nous contacter
            </button>
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
}
