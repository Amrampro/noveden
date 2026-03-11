// client/src/components/Header.tsx
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  Leaf,
  User,
  LogOut,
  Settings,
  UserCheck,
} from "lucide-react";
import { theme } from "../config/theme";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSiteParams } from "../contexts/SiteParamsContext";

interface HeaderProps {}

export function Header({}: HeaderProps) {
  const { getCartCount } = useCart();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const siteState = useSiteParams() as any;
  const parameters =
    siteState?.parameters ?? siteState?.data ?? siteState?.siteParams ?? null;

  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  // Detect scroll to add shadow/effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    { label: "Fidélité", to: "/fidelity" },
    { label: "Ambassadeurs", to: "/ambassadors" },
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

  const navbarLogo = String(parameters?.logo_navbar || "").trim();
  const promotionalText = String(parameters?.promotional_text || "").trim();

  return (
    <>
      {/* --- TOP PROMO BAR --- */}
      {promotionalText && (
        <div
          style={{
            backgroundColor: theme.colors.background.secondary,
            borderBottom: `1px solid ${theme.colors.border.light}`,
            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
            overflow: "hidden",
          }}
        >
          <div className="marquee">
            <span className="marquee-text">{promotionalText}</span>
          </div>
        </div>
      )}

      {/* --- MAIN HEADER --- */}
      <header
        style={{
          backgroundColor: scrolled
            ? "rgba(255, 255, 255, 0.95)"
            : theme.colors.background.primary,
          backdropFilter: scrolled ? "blur(10px)" : "none",
          boxShadow: scrolled || mobileMenuOpen ? theme.shadow.md : "none",
          borderBottom: mobileMenuOpen
            ? "none"
            : `1px solid ${theme.colors.border.light}`,
          position: "sticky",
          top: 0,
          zIndex: 1000,
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: theme.container.maxWidth,
            margin: "0 auto",
            padding: `${theme.spacing.md} ${theme.spacing.lg}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* 1. LOGO */}
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
              zIndex: 1002,
            }}
          >
            {navbarLogo ? (
              <img
                src={navbarLogo}
                alt="Logo"
                className="header-logo"
                style={{ width: "auto", objectFit: "contain" }}
              />
            ) : (
              <Leaf
                className="header-logo-icon"
                color={theme.colors.primary.main}
              />
            )}
          </Link>

          {/* 2. DESKTOP NAVIGATION */}
          <nav className="desktop-nav">
            <ul
              style={{
                display: "flex",
                gap: theme.spacing.xl,
                listStyle: "none",
                margin: 0,
                padding: 0,
                alignItems: "center",
              }}
            >
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="nav-link"
                    style={{
                      fontFamily: theme.typography.fontFamily.body,
                      fontSize: theme.typography.fontSize.sm,
                      color: isActive(item.to)
                        ? theme.colors.primary.main
                        : theme.colors.text.primary,
                      fontWeight: isActive(item.to) ? 600 : 400,
                      textDecoration: "none",
                      paddingBottom: "4px",
                      borderBottom: isActive(item.to)
                        ? `2px solid ${theme.colors.primary.main}`
                        : "2px solid transparent",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 3. ICONS & ACTIONS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.md,
              zIndex: 1002,
            }}
          >
            {/* Cart Icon */}
            <Link
              to={"/cart"}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: "relative",
                color: theme.colors.text.primary,
                display: "flex",
                alignItems: "center",
              }}
              title="Panier"
            >
              <ShoppingCart size={22} strokeWidth={1.5} />
              {getCartCount() > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -8,
                    backgroundColor: theme.colors.primary.main,
                    color: "#fff",
                    borderRadius: "50%",
                    minWidth: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.65rem",
                    fontWeight: "bold",
                    padding: "0 4px",
                  }}
                >
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Desktop User Actions */}
            <div
              className="desktop-actions"
              style={{
                display: "flex",
                gap: theme.spacing.md,
                alignItems: "center",
              }}
            >
              {user ? (
                <>
                  {/* {user.is_admin && (
                <Link
                  to="/admin"
                  title="Admin"
                  style={{ color: theme.colors.text.primary }}
                >
                  <Settings size={20} strokeWidth={1.5} />
                </Link>
              )} */}
                  <Link
                    to="/account"
                    title="Compte"
                    style={{ color: theme.colors.text.primary }}
                  >
                    <UserCheck size={20} strokeWidth={1.5} />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: theme.colors.text.primary,
                    }}
                    title="Déconnexion"
                  >
                    <LogOut size={20} strokeWidth={1.5} />
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  title="Connexion"
                  style={{ color: theme.colors.text.primary }}
                >
                  <User size={22} strokeWidth={1.5} />
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                marginLeft: theme.spacing.xs,
              }}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X size={24} color={theme.colors.text.primary} />
              ) : (
                <Menu size={24} color={theme.colors.text.primary} />
              )}
            </button>
          </div>
        </div>

        {/* --- MOBILE MENU DROPDOWN --- */}
        <div
          className={mobileMenuOpen ? "mobile-menu open" : "mobile-menu"}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: theme.colors.background.primary,
            borderBottom: `1px solid ${theme.colors.border.light}`,
            boxShadow: theme.shadow.lg,
            padding: mobileMenuOpen
              ? `${theme.spacing.lg} ${theme.spacing.lg}`
              : 0,
            maxHeight: mobileMenuOpen ? "100vh" : "0",
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            opacity: mobileMenuOpen ? 1 : 0,
            visibility: mobileMenuOpen ? "visible" : "hidden",
            zIndex: 999,
          }}
        >
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing.lg,
              listStyle: "none",
              margin: 0,
              padding: 0,
              textAlign: "center",
            }}
          >
            {navItems.map((item) => (
              <li key={item.to}>
                <button
                  onClick={() => handleMobileNav(item.to)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    fontFamily: theme.typography.fontFamily.body,
                    fontSize: theme.typography.fontSize.lg,
                    color: isActive(item.to)
                      ? theme.colors.primary.main
                      : theme.colors.text.primary,
                    fontWeight: isActive(item.to) ? 600 : 400,
                    cursor: "pointer",
                    padding: theme.spacing.xs,
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}

            <hr
              style={{
                width: "100%",
                border: `1px solid ${theme.colors.border.light}`,
                margin: "8px 0",
              }}
            />

            {/* Mobile Auth Actions */}
            {user ? (
              <li
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                {user.is_admin && (
                  <button
                    onClick={() => handleMobileNav("/admin")}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                    }}
                  >
                    <Settings size={18} /> Admin
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1rem",
                    color: theme.colors.error || "red",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                  }}
                >
                  <LogOut size={18} /> Déconnexion
                </button>
              </li>
            ) : (
              <li>
                <button
                  onClick={() => handleMobileNav("/auth")}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.1rem",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    cursor: "pointer",
                  }}
                >
                  <User size={20} /> Connexion / Inscription
                </button>
              </li>
            )}
          </ul>
        </div>
      </header>

      {/* --- CSS MEDIA QUERIES + MARQUEE --- */}
      <style>{`
        /* Desktop Default */
        .desktop-nav { display: block; }
        .desktop-actions { display: flex; }
        .mobile-menu-toggle { display: none !important; }

        /* Logo Sizing */
        .header-logo { height: 100px; }
        .header-logo-icon { width: 64px; height: 64px; }

        /* Hover effect for desktop links */
        .nav-link:hover {
          color: ${theme.colors.primary.main} !important;
        }

        /* Marquee (single text) */
        .marquee {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
        }

        .marquee-text {
          display: inline-block;
          padding-left: 100%;
          animation: marqueeMove 25s linear infinite;
          font-size: 0.75rem;
          font-weight: 500;
          color: ${theme.colors.text.secondary};
          font-family: ${theme.typography.fontFamily.body};
          letter-spacing: 0.02em;
        }

        @keyframes marqueeMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }

        /* Mobile Breakpoint */
        @media (max-width: 1023px) {
          .desktop-nav { display: none !important; }
          .desktop-actions { display: none !important; }
          .mobile-menu-toggle { display: block !important; }

          .header-logo { height: 50px; }
          .header-logo-icon { width: 40px; height: 40px; }
        }
      `}</style>
    </>
  );
}
