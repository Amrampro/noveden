import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { theme } from '../../config/theme';
import { Search, Plus, Edit, Trash2, Package } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { ProductForm } from '../../components/admin/ProductForm';
import { Product } from '../../lib/supabase';

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.adminGetProducts({ search });
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) {
      return;
    }

    try {
      await api.adminDeleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erreur lors de la suppression du produit');
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Partial<Product>) => {
    try {
      if (editingProduct) {
        await api.adminUpdateProduct(editingProduct.id, data);
        await loadProducts();
      } else {
        await api.adminCreateProduct(data);
        await loadProducts();
      }
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <AdminLayout>
      <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: theme.spacing.xl }}>
          <div>
            <h1
              style={{
                ...theme.heading.h2,
                marginBottom: theme.spacing.md,
              }}
            >
              Produits
            </h1>
            <p
              style={{
                ...theme.body.large,
                color: theme.colors.text.secondary,
              }}
            >
              Gérer le catalogue de produits
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus size={20} style={{ marginRight: theme.spacing.xs }} />
            Nouveau produit
          </Button>
        </div>

        <div
          style={{
            marginBottom: theme.spacing.xl,
            position: 'relative',
          }}
        >
          <Search
            size={20}
            style={{
              position: 'absolute',
              left: theme.spacing.md,
              top: '50%',
              transform: 'translateY(-50%)',
              color: theme.colors.text.light,
            }}
          />
          <input
            type="text"
            placeholder="Rechercher des produits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: `${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md} 48px`,
              border: `1px solid ${theme.colors.border.main}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.base,
              fontFamily: theme.typography.fontFamily.body,
              backgroundColor: theme.colors.background.primary,
            }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
            <p style={{ ...theme.body.large, color: theme.colors.text.secondary }}>
              Chargement...
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: theme.spacing.lg,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  backgroundColor: theme.colors.background.primary,
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadow.card,
                  padding: theme.spacing.lg,
                  display: 'flex',
                  gap: theme.spacing.lg,
                  alignItems: 'center',
                }}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: theme.borderRadius.md,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: theme.colors.background.secondary,
                      borderRadius: theme.borderRadius.md,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Package size={32} color={theme.colors.text.light} />
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      ...theme.heading.h5,
                      marginBottom: theme.spacing.xs,
                    }}
                  >
                    {product.name}
                  </h3>
                  <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
                    <span
                      style={{
                        ...theme.body.base,
                        fontWeight: theme.typography.fontWeight.medium,
                        color: theme.colors.primary.main,
                      }}
                    >
                      {Number(product.price).toFixed(2)} €
                    </span>
                    {product.categories && (
                      <span
                        style={{
                          ...theme.body.small,
                          padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                          backgroundColor: theme.colors.primary[100],
                          color: theme.colors.primary[700],
                          borderRadius: theme.borderRadius.md,
                        }}
                      >
                        {product.categories.name}
                      </span>
                    )}
                    <span
                      style={{
                        ...theme.body.small,
                        color: theme.colors.text.secondary,
                      }}
                    >
                      {product.stock_status === 'in_stock'
                        ? 'En stock'
                        : product.stock_status === 'limited'
                        ? 'Stock limité'
                        : 'Rupture de stock'}
                    </span>
                    {product.is_featured && (
                      <span
                        style={{
                          ...theme.body.small,
                          padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                          backgroundColor: theme.colors.accent[100],
                          color: theme.colors.accent.main,
                          borderRadius: theme.borderRadius.md,
                        }}
                      >
                        En vedette
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                  <button
                    onClick={() => handleEdit(product)}
                    style={{
                      padding: theme.spacing.md,
                      border: `1px solid ${theme.colors.primary.main}`,
                      backgroundColor: 'transparent',
                      color: theme.colors.primary.main,
                      borderRadius: theme.borderRadius.md,
                      cursor: 'pointer',
                      transition: theme.transition.fast,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.primary[50];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    style={{
                      padding: theme.spacing.md,
                      border: `1px solid ${theme.colors.error.main}`,
                      backgroundColor: 'transparent',
                      color: theme.colors.error.main,
                      borderRadius: theme.borderRadius.md,
                      cursor: 'pointer',
                      transition: theme.transition.fast,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.error[50];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            {products.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: theme.spacing.xl,
                  backgroundColor: theme.colors.background.primary,
                  borderRadius: theme.borderRadius.lg,
                }}
              >
                <p style={{ ...theme.body.large, color: theme.colors.text.secondary }}>
                  Aucun produit trouvé
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
        maxWidth="700px"
      >
        <ProductForm
          product={editingProduct || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
        />
      </Modal>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </AdminLayout>
  );
}
