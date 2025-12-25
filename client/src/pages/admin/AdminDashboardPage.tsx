import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { theme } from '../../config/theme';
import { Users, Package, BookOpen, Tag } from 'lucide-react';

export function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div>
        <h1
          style={{
            ...theme.heading.h2,
            marginBottom: theme.spacing.md,
          }}
        >
          Tableau de bord
        </h1>
        <p
          style={{
            ...theme.body.large,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.xl,
          }}
        >
          Bienvenue dans le panneau d'administration
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: theme.spacing.lg,
          }}
        >
          <StatCard
            icon={<Users size={32} />}
            title="Utilisateurs"
            description="Gérer les comptes utilisateurs"
            color={theme.colors.primary.main}
          />
          <StatCard
            icon={<Package size={32} />}
            title="Produits"
            description="Gérer le catalogue de produits"
            color={theme.colors.accent.main}
          />
          <StatCard
            icon={<BookOpen size={32} />}
            title="Articles de blog"
            description="Gérer le contenu du blog"
            color={theme.colors.status.info}
          />
          <StatCard
            icon={<Tag size={32} />}
            title="Coupons"
            description="Gérer les codes promo"
            color={theme.colors.status.success}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
  return (
    <div
      style={{
        backgroundColor: theme.colors.background.primary,
        padding: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadow.card,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.md,
      }}
    >
      <div style={{ color }}>{icon}</div>
      <h3
        style={{
          ...theme.heading.h5,
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
    </div>
  );
}
