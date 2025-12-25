import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { theme } from '../../config/theme';
import { Search, Mail, Phone, Calendar } from 'lucide-react';
import { api } from '../../services/api';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_admin: boolean;
  created_at: string;
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.adminGetUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.first_name.toLowerCase().includes(search.toLowerCase()) ||
      user.last_name.toLowerCase().includes(search.toLowerCase())
  );

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
            Utilisateurs
          </h1>
          <p
            style={{
              ...theme.body.large,
              color: theme.colors.text.secondary,
            }}
          >
            Gérer les comptes utilisateurs
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
            placeholder="Rechercher par nom ou email..."
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
              backgroundColor: theme.colors.background.primary,
              borderRadius: theme.borderRadius.lg,
              boxShadow: theme.shadow.card,
              overflow: 'hidden',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: theme.colors.background.secondary,
                      borderBottom: `1px solid ${theme.colors.border.light}`,
                    }}
                  >
                    <th
                      style={{
                        ...theme.body.base,
                        fontWeight: theme.typography.fontWeight.medium,
                        padding: theme.spacing.lg,
                        textAlign: 'left',
                      }}
                    >
                      Utilisateur
                    </th>
                    <th
                      style={{
                        ...theme.body.base,
                        fontWeight: theme.typography.fontWeight.medium,
                        padding: theme.spacing.lg,
                        textAlign: 'left',
                      }}
                    >
                      Contact
                    </th>
                    <th
                      style={{
                        ...theme.body.base,
                        fontWeight: theme.typography.fontWeight.medium,
                        padding: theme.spacing.lg,
                        textAlign: 'left',
                      }}
                    >
                      Rôle
                    </th>
                    <th
                      style={{
                        ...theme.body.base,
                        fontWeight: theme.typography.fontWeight.medium,
                        padding: theme.spacing.lg,
                        textAlign: 'left',
                      }}
                    >
                      Inscription
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: `1px solid ${theme.colors.border.light}`,
                      }}
                    >
                      <td style={{ padding: theme.spacing.lg }}>
                        <div>
                          <div
                            style={{
                              ...theme.body.base,
                              fontWeight: theme.typography.fontWeight.medium,
                              marginBottom: theme.spacing.xs,
                            }}
                          >
                            {user.first_name} {user.last_name}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: theme.spacing.lg }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                            <Mail size={14} color={theme.colors.text.light} />
                            <span style={{ ...theme.body.small, color: theme.colors.text.secondary }}>
                              {user.email}
                            </span>
                          </div>
                          {user.phone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                              <Phone size={14} color={theme.colors.text.light} />
                              <span style={{ ...theme.body.small, color: theme.colors.text.secondary }}>
                                {user.phone}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: theme.spacing.lg }}>
                        <span
                          style={{
                            ...theme.body.small,
                            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                            borderRadius: theme.borderRadius.md,
                            backgroundColor: user.is_admin ? theme.colors.primary[100] : theme.colors.background.secondary,
                            color: user.is_admin ? theme.colors.primary.main : theme.colors.text.secondary,
                            fontWeight: theme.typography.fontWeight.medium,
                          }}
                        >
                          {user.is_admin ? 'Admin' : 'Utilisateur'}
                        </span>
                      </td>
                      <td style={{ padding: theme.spacing.lg }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                          <Calendar size={14} color={theme.colors.text.light} />
                          <span style={{ ...theme.body.small, color: theme.colors.text.secondary }}>
                            {new Date(user.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
                <p style={{ ...theme.body.large, color: theme.colors.text.secondary }}>
                  Aucun utilisateur trouvé
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
