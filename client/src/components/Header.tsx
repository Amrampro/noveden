// client/src/components/Header.tsx
import { useState } from "react";
import { Menu, X, ShoppingCart, Leaf, User, LogOut, Settings } from "lucide-react";
import { theme } from "../config/theme";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";


interface HeaderProps {}

export function Header({}: HeaderProps) {
  const { getCartCount } = useCart();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const navItems: { label: string; to: string }[] = [
    { label: "Accueil", to: "/" },
    { label: "Boutique", to: "/shop" },
    { label: "À propos", to: "/about" },
    { label: "Blog", to: "/blog" },
    { label: "FAQ", to: "/faqs" },
    { label: "Contact", to: "/contact" },
  ];

  const isActive = (to: string) => {
    if (to === "/") return pathname === "/";
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  const handleMobileNav = (to: string) => {
    navigate(to);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div
        style={{
          backgroundColor: theme.colors.background.secondary,
          borderBottom: `1px solid ${theme.colors.border.light}`,
          padding: `${theme.spacing.xs} 0`,
        }}
      >
        <div
          style={{
            maxWidth: theme.container.maxWidth,
            margin: "0 auto",
            padding: `0 ${theme.spacing.lg}`,
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.secondary,
            textAlign: "center",
            fontFamily: theme.typography.fontFamily.body,
          }}
        >
          99% d&apos;ingrédients d&apos;origine naturelle · Made in France-Belgique · Livraison gratuite en Belgique à partir
          de 65€ d&apos;achat · Paiement sécurisé
        </div>
      </div>

      <header
        style={{
          backgroundColor: theme.colors.background.primary,
          boxShadow: theme.shadow.sm,
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            maxWidth: theme.container.maxWidth,
            margin: "0 auto",
            padding: `${theme.spacing.lg} ${theme.spacing.lg}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link
              to="/"
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.sm,
                color: theme.colors.text.primary,
              }}
            >
              <Leaf size={32} color={theme.colors.primary.main} />
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    ...theme.heading.h3,
                    fontSize: theme.typography.fontSize["2xl"],
                    marginBottom: 0,
                  }}
                >
                  Novéden
                </div>
                <div
                  style={{
                    fontFamily: theme.typography.fontFamily.primary,
                    fontSize: theme.typography.fontSize.xs,
                    fontStyle: "italic",
                    color: theme.colors.text.secondary,
                  }}
                >
                  la beauté authentique
                </div>
              </div>
            </Link>

            <nav style={{ display: "none" }} className="desktop-nav">
              <ul
                style={{
                  display: "flex",
                  gap: theme.spacing.xl,
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                }}
              >
                {navItems.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      style={{
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.base,
                        color: isActive(item.to) ? theme.colors.primary.main : theme.colors.text.primary,
                        fontWeight: isActive(item.to)
                          ? theme.typography.fontWeight.semibold
                          : theme.typography.fontWeight.normal,
                        textDecoration: "none",
                        cursor: "pointer",
                        transition: theme.transition.fast,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.colors.primary.main;
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive(item.to)) {
                          e.currentTarget.style.color = theme.colors.text.primary;
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.md }}>
              {/* Cart */}
              <Link
                to={"/cart"}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  position: "relative",
                }}
                aria-label="Panier"
              >
                <ShoppingCart size={24} color={theme.colors.text.primary} />
                {getCartCount() > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      backgroundColor: theme.colors.primary.main,
                      color: theme.colors.text.inverse,
                      borderRadius: theme.borderRadius.full,
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.bold,
                    }}
                  >
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* Admin */}
              {user?.is_admin && (
                <Link
                  to={"/admin"}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing.xs,
                    color: theme.colors.primary.main,
                    fontFamily: theme.typography.fontFamily.body,
                    fontSize: theme.typography.fontSize.sm,
                  }}
                  aria-label="Admin"
                  title="Panneau d'administration"
                >
                  <Settings size={20} />
                </Link>
              )}

              {/* Auth */}
              {user ? (
                <button
                  onClick={handleSignOut}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing.xs,
                    color: theme.colors.text.primary,
                    fontFamily: theme.typography.fontFamily.body,
                    fontSize: theme.typography.fontSize.sm,
                  }}
                  aria-label="Déconnexion"
                  title={`${user?.first_name || ""} ${user?.last_name || ""}`.trim()}
                >
                  <LogOut size={20} /> Déconnexion
                </button>
              ) : (
                <Link
                  to="/auth"
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing.xs,
                    color: theme.colors.text.primary,
                    fontFamily: theme.typography.fontFamily.body,
                    fontSize: theme.typography.fontSize.sm,
                  }}
                  aria-label="Connexion"
                >
                  <User size={20} /> Connexion
                </Link>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
                className="mobile-menu-toggle"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={24} color={theme.colors.text.primary} /> : <Menu size={24} color={theme.colors.text.primary} />}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          {mobileMenuOpen && (
            <nav
              style={{
                marginTop: theme.spacing.lg,
                paddingTop: theme.spacing.lg,
                borderTop: `1px solid ${theme.colors.border.light}`,
              }}
              className="mobile-nav"
            >
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: theme.spacing.md,
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                }}
              >
                {navItems.map((item) => (
                  <li key={item.to}>
                    <button
                      onClick={() => handleMobileNav(item.to)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.lg,
                        color: isActive(item.to) ? theme.colors.primary.main : theme.colors.text.primary,
                        fontWeight: isActive(item.to)
                          ? theme.typography.fontWeight.semibold
                          : theme.typography.fontWeight.normal,
                        cursor: "pointer",
                        border: "none",
                        background: "none",
                        padding: theme.spacing.sm,
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}

                {user?.is_admin && (
                  <li>
                    <button
                      onClick={() => handleMobileNav("/admin")}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.lg,
                        color: isActive("/admin") ? theme.colors.primary.main : theme.colors.text.primary,
                        fontWeight: isActive("/admin")
                          ? theme.typography.fontWeight.semibold
                          : theme.typography.fontWeight.normal,
                        cursor: "pointer",
                        border: "none",
                        background: "none",
                        padding: theme.spacing.sm,
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing.xs,
                      }}
                    >
                      <Settings size={20} />
                      Admin
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          )}
        </div>
      </header>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: block !important;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
