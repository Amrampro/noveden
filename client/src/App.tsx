import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminBlogPage } from './pages/admin/AdminBlogPage';
import { AdminFAQPage } from './pages/admin/AdminFAQPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminThemePage } from './pages/admin/AdminThemePage';
import { theme } from './config/theme';
import { Product, BlogPost } from './lib/supabase';
import { loadAndApplyTheme } from './utils/loadTheme';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    loadAndApplyTheme().then(() => {
      setThemeLoaded(true);
    });
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setCurrentPage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleViewProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewBlogPost = (post: BlogPost) => {
    setSelectedBlogSlug(post.slug);
    setCurrentPage('blog-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: string) => {
    window.location.hash = page;
    setCurrentPage(page);
    setSelectedProductId(null);
    setSelectedBlogSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} onViewProduct={handleViewProduct} />;
      case 'shop':
      case 'boutique':
        return <ShopPage onViewProduct={handleViewProduct} />;
      case 'about':
      case 'à propos':
        return <AboutPage />;
      case 'blog':
        return <BlogPage onViewBlogPost={handleViewBlogPost} />;
      case 'blog-detail':
        return selectedBlogSlug ? (
          <BlogDetailPage slug={selectedBlogSlug} onNavigate={handleNavigate} />
        ) : (
          <BlogPage onViewBlogPost={handleViewBlogPost} />
        );
      case 'faq':
        return <FAQPage />;
      case 'contact':
        return <ContactPage />;
      case 'cart':
      case 'panier':
        return <CartPage onNavigate={handleNavigate} />;
      case 'login':
      case 'connexion':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'signup':
      case 'inscription':
        return <SignupPage onNavigate={handleNavigate} />;
      case 'product-detail':
        return selectedProductId ? (
          <ProductDetailPage productId={selectedProductId} onNavigate={handleNavigate} />
        ) : (
          <HomePage onNavigate={handleNavigate} onViewProduct={handleViewProduct} />
        );
      case 'admin':
        return <AdminDashboardPage />;
      case 'admin-users':
        return <AdminUsersPage />;
      case 'admin-products':
        return <AdminProductsPage />;
      case 'admin-blog':
        return <AdminBlogPage />;
      case 'admin-faq':
        return <AdminFAQPage />;
      case 'admin-coupons':
        return <AdminCouponsPage />;
      case 'admin-theme':
        return <AdminThemePage />;
      default:
        return <HomePage onNavigate={handleNavigate} onViewProduct={handleViewProduct} />;
    }
  };

  const isAdminPage = currentPage.startsWith('admin');

  if (!themeLoaded) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAF8'
      }}>
        <p style={{ fontSize: '1.125rem', color: '#545F4F' }}>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.colors.background.primary }}>
      {!isAdminPage && <Header currentPage={currentPage} onNavigate={handleNavigate} />}
      <main>{renderPage()}</main>
      {!isAdminPage && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}

export default App;
