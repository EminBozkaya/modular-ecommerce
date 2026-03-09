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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Ad Soyad</th>
                            <th className="text-left py-3 px-4 text-gray-500 font-medium">E-posta</th>
                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Kayıt Tarihi</th>
                            <th className="text-center py-3 px-4 text-gray-500 font-medium">E-posta Onayı</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500">
                                    {searchQuery.trim() ? 'Aramanızla eşleşen kullanıcı bulunamadı.' : 'Henüz müşteri bulunmuyor.'}
                                </td>
                            </tr>
                        ) : (
                            filtered.map((user) => (
                                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 font-medium text-gray-900">{user.fullName}</td>
                                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                                    <td className="py-3 px-4 text-gray-600">{formatDate(user.createdAt)}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                user.isEmailConfirmed
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-500'
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
            <div className="px-4 py-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                    {filtered.length} müşteri gösteriliyor
                </span>
            </div>
        </div>
    );
}
