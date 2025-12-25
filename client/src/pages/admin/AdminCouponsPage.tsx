import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { theme } from '../../config/theme';
import { Search, Trash2, Tag, Calendar, Percent } from 'lucide-react';
import { api } from '../../services/api';

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: string;
  min_purchase_amount?: string;
  max_discount_amount?: string;
  usage_limit?: number;
  usage_count?: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

export function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await api.adminGetCoupons();
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error('Error loading coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le coupon "${code}" ?`)) {
      return;
    }

    try {
      await api.adminDeleteCoupon(id);
      setCoupons(coupons.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Erreur lors de la suppression du coupon');
    }
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(search.toLowerCase())
  );

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  return (
    <AdminLayout>
      <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
        <div style={{ marginBottom: theme.spacing.xl }}>
          <h1
            style={{
              ...theme.heading.h2,
              marginBottom: theme.spacing.md,
            }}
          >
            Coupons
          </h1>
          <p
            style={{
              ...theme.body.large,
              color: theme.colors.text.secondary,
            }}
          >
            Gérer les codes promotionnels
          </p>
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
            placeholder="Rechercher des coupons..."
            value={search}
            onChange={(e) => setSearch(e.target.value.toUpperCase())}
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
            {filteredCoupons.map((coupon) => {
              const expired = isExpired(coupon.valid_until);
              const usageLimitReached = coupon.usage_limit && coupon.usage_count && coupon.usage_count >= coupon.usage_limit;

              return (
                <div
                  key={coupon.id}
                  style={{
                    backgroundColor: theme.colors.background.primary,
                    borderRadius: theme.borderRadius.lg,
                    boxShadow: theme.shadow.card,
                    padding: theme.spacing.lg,
                    display: 'flex',
                    gap: theme.spacing.lg,
                    alignItems: 'start',
                    opacity: expired || usageLimitReached || !coupon.is_active ? 0.6 : 1,
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: theme.borderRadius.md,
                      backgroundColor: theme.colors.status.success + '20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Tag size={24} color={theme.colors.status.success} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.sm }}>
                      <h3
                        style={{
                          ...theme.heading.h5,
                        }}
                      >
                        {coupon.code}
                      </h3>
                      {!coupon.is_active && (
                        <span
                          style={{
                            ...theme.body.small,
                            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                            backgroundColor: theme.colors.text.light + '20',
                            color: theme.colors.text.secondary,
                            borderRadius: theme.borderRadius.md,
                          }}
                        >
                          Inactif
                        </span>
                      )}
                      {expired && (
                        <span
                          style={{
                            ...theme.body.small,
                            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                            backgroundColor: theme.colors.error[100],
                            color: theme.colors.error.main,
                            borderRadius: theme.borderRadius.md,
                          }}
                        >
                          Expiré
                        </span>
                      )}
                      {usageLimitReached && (
                        <span
                          style={{
                            ...theme.body.small,
                            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                            backgroundColor: theme.colors.error[100],
                            color: theme.colors.error.main,
                            borderRadius: theme.borderRadius.md,
                          }}
                        >
                          Limite atteinte
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: theme.spacing.lg, marginBottom: theme.spacing.sm, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                        <Percent size={16} color={theme.colors.status.success} />
                        <span style={{ ...theme.body.base, fontWeight: theme.typography.fontWeight.medium }}>
                          {coupon.discount_type === 'percentage'
                            ? `${coupon.discount_value}%`
                            : `${Number(coupon.discount_value).toFixed(2)} €`}
                        </span>
                      </div>

                      {coupon.min_purchase_amount && (
                        <span style={{ ...theme.body.small, color: theme.colors.text.secondary }}>
                          Min: {Number(coupon.min_purchase_amount).toFixed(2)} €
                        </span>
                      )}

                      {coupon.usage_limit && (
                        <span style={{ ...theme.body.small, color: theme.colors.text.secondary }}>
                          Utilisations: {coupon.usage_count || 0}/{coupon.usage_limit}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                        <Calendar size={14} color={theme.colors.text.light} />
                        <span style={{ ...theme.body.small, color: theme.colors.text.secondary }}>
                          Du {new Date(coupon.valid_from).toLocaleDateString('fr-FR')} au{' '}
                          {new Date(coupon.valid_until).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(coupon.id, coupon.code)}
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
              );
            })}

            {filteredCoupons.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: theme.spacing.xl,
                  backgroundColor: theme.colors.background.primary,
                  borderRadius: theme.borderRadius.lg,
                }}
              >
                <p style={{ ...theme.body.large, color: theme.colors.text.secondary }}>
                  Aucun coupon trouvé
                </p>
              </div>
            )}
          </div>
        )}
      </div>

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
