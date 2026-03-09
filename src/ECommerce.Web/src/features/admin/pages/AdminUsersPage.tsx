import { useState } from 'react';
import { Search } from 'lucide-react';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { AdminUsersTable } from '../components/AdminUsersTable';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';

export default function AdminUsersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const { data: users, isLoading, isError } = useAdminUsers();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6" style={{ color: '#1B5E3F' }}>Müşteriler</h1>

            {/* Search */}
            <div className="mb-4 relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Ad veya e-posta ile ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E3F]/30 focus:border-[#1B5E3F]"
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
            ) : isError ? (
                <p className="text-red-600">Müşteri listesi yüklenirken bir hata oluştu.</p>
            ) : users ? (
                <AdminUsersTable users={users} searchQuery={searchQuery} />
            ) : null}
        </div>
    );
}
