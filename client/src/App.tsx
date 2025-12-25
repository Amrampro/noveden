import { useState } from 'react';
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
import { theme } from './config/theme';
import { Product, BlogPost } from './lib/supabase';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);

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
      default:
        return <HomePage onNavigate={handleNavigate} onViewProduct={handleViewProduct} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.colors.background.primary }}>
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main>{renderPage()}</main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
