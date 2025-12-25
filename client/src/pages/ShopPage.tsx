import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { theme } from '../config/theme';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { Product, Category } from '../lib/types';
import { useCart } from '../contexts/CartContext';
import { api } from '../services/api';

interface ShopPageProps {
  onViewProduct?: (product: Product) => void;
}

export function ShopPage({ onViewProduct }: ShopPageProps) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const { categories: data } = await api.getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory !== 'all') {
        params.category = categories.find(c => c.id === selectedCategory)?.slug;
      }

      const { products: data } = await api.getProducts(params);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <section
        style={{
          backgroundColor: theme.colors.background.sage,
          padding: `${theme.spacing['3xl']} ${theme.spacing.lg}`,
        }}
      >
        <div
          style={{
            maxWidth: theme.container.maxWidth,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              ...theme.heading.h1,
              marginBottom: theme.spacing.lg,
            }}
          >
            Boutique
          </h1>
          <p
            style={{
              fontFamily: theme.typography.fontFamily.body,
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.text.secondary,
              maxWidth: '700px',
              margin: '0 auto',
            }}
          >
            Découvrez notre collection complète de produits naturels pour la beauté
          </p>
        </div>
      </section>

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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.xl,
              marginBottom: theme.spacing['2xl'],
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: theme.spacing.md,
                justifyContent: 'center',
              }}
            >
              <Button
                variant={selectedCategory === 'all' ? 'primary' : 'outline'}
                onClick={() => setSelectedCategory('all')}
              >
                Tous les produits
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'primary' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%', position: 'relative' }}>
              <Search
                size={20}
                color={theme.colors.text.light}
                style={{
                  position: 'absolute',
                  left: theme.spacing.md,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: `${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md} 3rem`,
                  borderRadius: theme.borderRadius.lg,
                  border: `2px solid ${theme.colors.border.main}`,
                  fontFamily: theme.typography.fontFamily.body,
                  fontSize: theme.typography.fontSize.base,
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary.main;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.border.main;
                }}
              />
            </div>
          </div>

          {loading ? (
            <div
              style={{
                textAlign: 'center',
                padding: theme.spacing['4xl'],
                color: theme.colors.text.secondary,
                fontFamily: theme.typography.fontFamily.body,
              }}
            >
              Chargement des produits...
            </div>
          ) : filteredProducts.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: theme.spacing.xl,
              }}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={onViewProduct}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: theme.spacing['4xl'],
                color: theme.colors.text.secondary,
                fontFamily: theme.typography.fontFamily.body,
              }}
            >
              {searchQuery
                ? 'Aucun produit ne correspond à votre recherche.'
                : 'Aucun produit disponible dans cette catégorie.'}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
