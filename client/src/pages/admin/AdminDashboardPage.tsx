import { AdminLayout } from '../../components/AdminLayout';
import { theme } from '../../config/theme';
import { Users, Package, BookOpen, Tag, TrendingUp, ShoppingCart } from 'lucide-react';

export function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
        <div style={{ marginBottom: theme.spacing['2xl'] }}>
          <h1
            style={{
              ...theme.heading.h2,
              marginBottom: theme.spacing.sm,
            }}
          >
            Tableau de bord
          </h1>
          <p
            style={{
              ...theme.body.large,
              color: theme.colors.text.secondary,
            }}
          >
            Bienvenue dans le panneau d'administration
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: theme.spacing.xl,
            marginBottom: theme.spacing['2xl'],
          }}
        >
          <StatCard
            icon={<Users size={28} />}
            title="Utilisateurs"
            description="Gérer les comptes utilisateurs"
            color={theme.colors.primary.main}
            link="admin-users"
          />
          <StatCard
            icon={<Package size={28} />}
            title="Produits"
            description="Gérer le catalogue de produits"
            color={theme.colors.accent.main}
            link="admin-products"
          />
          <StatCard
            icon={<BookOpen size={28} />}
            title="Articles de blog"
            description="Gérer le contenu du blog"
            color={theme.colors.status.info}
            link="admin-blog"
          />
          <StatCard
            icon={<Tag size={28} />}
            title="Coupons"
            description="Gérer les codes promo"
            color={theme.colors.status.success}
            link="admin-coupons"
          />
        </div>
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

function StatCard({ icon, title, description, color, link }: { icon: React.ReactNode; title: string; description: string; color: string; link: string }) {
  return (
    <button
      onClick={() => window.location.hash = link}
      style={{
        backgroundColor: theme.colors.background.primary,
        padding: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadow.card,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.md,
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        width: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = theme.shadow.card;
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: theme.borderRadius.lg,
          backgroundColor: color + '15',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          ...theme.heading.h5,
          marginTop: theme.spacing.sm,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          ...theme.body.base,
          color: theme.colors.text.secondary,
        }}
      >
        {description}
      </p>
    </button>
  );
}
