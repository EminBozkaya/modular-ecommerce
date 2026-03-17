import type { AdminUser } from '../types/adminUser';

interface AdminUsersTableProps {
    users: AdminUser[];
    searchQuery: string;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function AdminUsersTable({ users, searchQuery }: AdminUsersTableProps) {
    const filtered = searchQuery.trim()
        ? users.filter(
              (u) =>
                  u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  u.email.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : users;

    return (
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-white/5 border-b border-border">
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Ad Soyad</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">E-posta</th>
                            <th className="text-left py-3 px-4 text-muted-foreground font-medium">Kayıt Tarihi</th>
                            <th className="text-center py-3 px-4 text-muted-foreground font-medium">E-posta Onayı</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-muted-foreground">
                                    {searchQuery.trim() ? 'Aramanızla eşleşen kullanıcı bulunamadı.' : 'Henüz müşteri bulunmuyor.'}
                                </td>
                            </tr>
                        ) : (
                            filtered.map((user) => (
                                <tr key={user.id} className="border-b border-border hover:bg-accent transition-colors">
                                    <td className="py-3 px-4 font-medium text-foreground">{user.fullName}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{formatDate(user.createdAt)}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                user.isEmailConfirmed
                                                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                                    : 'bg-accent text-muted-foreground'
                                            }`}
                                        >
                                            {user.isEmailConfirmed ? 'Onaylı' : 'Onaysız'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="px-4 py-3 border-t border-border">
                <span className="text-sm text-muted-foreground">
                    {filtered.length} müşteri gösteriliyor
                </span>
            </div>
        </div>
    );
}
