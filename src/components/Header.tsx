import { useState } from 'react';
import { Menu, X, ShoppingCart, Leaf } from 'lucide-react';
import { theme } from '../config/theme';
import { useCart } from '../contexts/CartContext';

interface HeaderProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function Header({ currentPage = 'home', onNavigate }: HeaderProps) {
  const { getCartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Accueil', value: 'home' },
    { label: 'Boutique', value: 'shop' },
    { label: 'À propos', value: 'about' },
    { label: 'Blog', value: 'blog' },
    { label: 'FAQ', value: 'faq' },
    { label: 'Contact', value: 'contact' },
  ];

  const handleNavClick = (page: string) => {
    onNavigate?.(page);
    setMobileMenuOpen(false);
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
            margin: '0 auto',
            padding: `0 ${theme.spacing.lg}`,
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.secondary,
            textAlign: 'center',
            fontFamily: theme.typography.fontFamily.body,
          }}
        >
          99% d'ingrédients d'origine naturelle · Made in France-Belgique · Livraison gratuite en Belgique à partir de 65€ d'achat · Paiement sécurisé
        </div>
      </div>

      <header
        style={{
          backgroundColor: theme.colors.background.primary,
          boxShadow: theme.shadow.sm,
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            maxWidth: theme.container.maxWidth,
            margin: '0 auto',
            padding: `${theme.spacing.lg} ${theme.spacing.lg}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <button
              onClick={() => handleNavClick('home')}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
              }}
            >
              <Leaf size={32} color={theme.colors.primary.main} />
              <div style={{ textAlign: 'left' }}>
                <div
                  style={{
                    ...theme.heading.h3,
                    fontSize: theme.typography.fontSize['2xl'],
                    marginBottom: 0,
                  }}
                >
                  Novéden
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: theme.typography.fontSize.xs,
                    fontStyle: 'italic',
                    color: theme.colors.text.secondary,
                  }}
                >
                  la beauté authentique
                </div>
              </div>
            </button>

            <nav
              style={{
                display: 'none',
              }}
              className="desktop-nav"
            >
              <ul
                style={{
                  display: 'flex',
                  gap: theme.spacing.xl,
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                }}
              >
                {navItems.map((item) => (
                  <li key={item.value}>
                    <button
                      onClick={() => handleNavClick(item.value)}
                      style={{
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.base,
                        color:
                          currentPage === item.value
                            ? theme.colors.primary.main
                            : theme.colors.text.primary,
                        fontWeight:
                          currentPage === item.value
                            ? theme.typography.fontWeight.semibold
                            : theme.typography.fontWeight.normal,
                        textDecoration: 'none',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        transition: theme.transition.fast,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.colors.primary.main;
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== item.value) {
                          e.currentTarget.style.color = theme.colors.text.primary;
                        }
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
              <button
                onClick={() => {
                  onNavigate?.('cart');
                  setMobileMenuOpen(false);
                }}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                aria-label="Panier"
              >
                <ShoppingCart size={24} color={theme.colors.text.primary} />
                {getCartCount() > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: theme.colors.primary.main,
                      color: theme.colors.text.inverse,
                      borderRadius: theme.borderRadius.full,
                      width: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.bold,
                    }}
                  >
                    {getCartCount()}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                }}
                className="mobile-menu-toggle"
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
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing.md,
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                }}
              >
                {navItems.map((item) => (
                  <li key={item.value}>
                    <button
                      onClick={() => handleNavClick(item.value)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        fontFamily: theme.typography.fontFamily.body,
                        fontSize: theme.typography.fontSize.lg,
                        color:
                          currentPage === item.value
                            ? theme.colors.primary.main
                            : theme.colors.text.primary,
                        fontWeight:
                          currentPage === item.value
                            ? theme.typography.fontWeight.semibold
                            : theme.typography.fontWeight.normal,
                        textDecoration: 'none',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        padding: theme.spacing.sm,
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
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
