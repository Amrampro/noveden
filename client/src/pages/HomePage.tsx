// client/src/pages/HomePage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Award, Leaf, ShieldCheck, ArrowRight, Tag, X } from "lucide-react";
import { theme } from "../config/theme";
import { Button } from "../components/Button";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../lib/types";
import { useCart } from "../contexts/CartContext";
import { productService, type ProductCategory } from "../services/productService";
import { blogService, type BlogPost } from "../services/blogService";
import { PageBanner } from "../components/PageBanner";
import { useSiteParams } from "../contexts/SiteParamsContext";
import promoimg from "../assets/img/promoimage.jpg";

export function HomePage() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // États pour les données
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("all");

  // États de chargement
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Modal promo (affichage + animations)
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);

  const siteState = useSiteParams() as any;
  const parameters = siteState?.parameters ?? siteState?.data ?? siteState?.siteParams ?? null;
  const home_text = String(parameters?.home_text || "").trim();

  const closeModal = () => {
    setIsModalClosing(true);
    window.setTimeout(() => {
      setShowModal(false);
      setIsModalClosing(false);
      setIsModalOpen(false);
    }, 250); // doit matcher les transitions CSS
  };

  useEffect(() => {
    void fetchCategoriesAndProducts();
    void fetchLatestPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
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
      void fetchFeaturedProducts(undefined);
    }
  };

  // Bloquer le scroll quand la modale est ouverte
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  // Afficher la modale après 10 secondes avec animation d'entrée
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowModal(true);
      requestAnimationFrame(() => setIsModalOpen(true));
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const fetchFeaturedProducts = async (categorySlug?: string) => {
    try {
      setLoadingProducts(true);
      const { products } = await productService.listProducts({
        featured: true,
        category: categorySlug,
        limit: 24,
        offset: 0,
      });
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
    const copy = [...categories];
    copy.sort(
      (a, b) =>
        (a.display_order ?? 0) - (b.display_order ?? 0) || a.name.localeCompare(b.name)
    );
    return copy.slice(0, 8);
  }, [categories]);

  return (
    <div style={{ position: "relative" }}>
      <PageBanner />

      {/* BRAND STORY */}
      <section
        style={{
          backgroundColor: theme.colors.background.sage,
          padding: `${theme.spacing["2xl"]} ${theme.spacing.lg}`,
        }}
      >
        <div style={{ maxWidth: theme.container.maxWidth, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ ...theme.heading.h2, marginBottom: theme.spacing.lg }}>Mère Nature</h2>
          <p
            style={{
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.text.secondary,
              lineHeight: theme.typography.lineHeight.body,
              maxWidth: "860px",
              margin: `0 auto ${theme.spacing["3xl"]}`,
              whiteSpace: "pre-line",
            }}
          >
            {home_text}
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
            <h2 style={{ ...theme.heading.h2, marginBottom: theme.spacing.lg }}>Nos produits phares</h2>

            {loadingCategories ? (
              <div style={{ textAlign: "center", color: theme.colors.text.secondary }}>
                Chargement...
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
                    transition: theme.transition.normal,
                  }}
                >
                  <Tag size={16} /> Tous
                </button>

                {sortedTopCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategorySlug(cat.slug)}
                    style={{
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
            <div style={{ textAlign: "center", padding: theme.spacing["3xl"] }}>
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
                {featuredProducts.map((product) => (
                  <div key={product.id} style={{ position: "relative" }}>
                    <ProductCard product={product} onAddToCart={addToCart} />
                  </div>
                ))}
              </div>

              <div style={{ textAlign: "center" }}>
                <Button variant="primary" size="large" onClick={() => navigate("/shop")}>
                  Voir tous les produits
                </Button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: theme.spacing["3xl"] }}>
              Aucun produit à afficher.
            </div>
          )}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section
        style={{
          backgroundColor: theme.colors.background.primary,
          padding: `${theme.spacing["4xl"]} ${theme.spacing.lg}`,
        }}
      >
        <div style={{ maxWidth: theme.container.maxWidth, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: theme.spacing.xl,
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  padding: theme.spacing.xl,
                  backgroundColor: theme.colors.background.sage,
                  borderRadius: theme.borderRadius.lg,
                  border: `1px solid ${theme.colors.border.light}`,
                }}
              >
                <feature.icon
                  size={48}
                  color={theme.colors.secondary.main}
                  style={{ margin: `0 auto ${theme.spacing.md}` }}
                />
                <h3 style={{ ...theme.heading.h5, marginBottom: theme.spacing.sm }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG TEASER */}
      <section
        style={{
          backgroundColor: theme.colors.background.primary,
          padding: `${theme.spacing["4xl"]} ${theme.spacing.lg}`,
        }}
      >
        <div style={{ maxWidth: theme.container.maxWidth, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: theme.spacing["3xl"] }}>
            <h2 style={{ ...theme.heading.h2 }}>Inspirez votre routine beauté</h2>
          </div>

          {loadingPosts ? (
            <div style={{ textAlign: "center" }}>Chargement des articles...</div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: theme.spacing.xl,
              }}
            >
              {latestPosts.map((post) => (
                <article
                  key={post.id}
                  style={{
                    backgroundColor: theme.colors.background.secondary,
                    borderRadius: theme.borderRadius.lg,
                    overflow: "hidden",
                    border: `1px solid ${theme.colors.border.light}`,
                  }}
                >
                  <div
                    style={{
                      height: 180,
                      backgroundImage: `url(${post.image_url || ""})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: theme.colors.background.sage,
                    }}
                  />
                  <div style={{ padding: theme.spacing.lg }}>
                    <h3 style={{ ...theme.heading.h5, marginBottom: theme.spacing.sm }}>{post.title}</h3>
                    <button
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      style={{
                        background: "none",
                        border: "none",
                        color: theme.colors.primary.main,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      Lire <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MODAL PROMO (animée + responsive) */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor:
              isModalOpen && !isModalClosing ? "rgba(0, 0, 0, 0.75)" : "rgba(0, 0, 0, 0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: theme.spacing.lg,
            backdropFilter: isModalOpen && !isModalClosing ? "blur(4px)" : "blur(0px)",
            transition: "background-color 250ms ease, backdrop-filter 250ms ease",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "520px",
              maxHeight: "calc(100vh - 32px)",
              backgroundColor: "white",
              borderRadius: theme.borderRadius.lg,
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              transform:
                isModalOpen && !isModalClosing
                  ? "translateY(0px) scale(1)"
                  : "translateY(16px) scale(0.98)",
              opacity: isModalOpen && !isModalClosing ? 1 : 0,
              transition: "transform 250ms ease, opacity 250ms ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "white",
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                color: theme.colors.text.primary,
              }}
              aria-label="Fermer"
            >
              <X size={20} />
            </button>

            <div
              style={{
                maxHeight: "calc(100vh - 32px)",
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <img
                src={promoimg}
                alt="Promotion exceptionnelle"
                style={{ width: "100%", height: "auto", display: "block" }}
              />

              <div
                style={{
                  padding: theme.spacing.lg,
                  textAlign: "center",
                  backgroundColor: theme.colors.background.secondary,
                }}
              >
                <Button
                  variant="primary"
                  size="large"
                  onClick={() => {
                    closeModal();
                    window.setTimeout(() => navigate("/shop"), 180);
                  }}
                >
                  J'en profite 🎁
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}