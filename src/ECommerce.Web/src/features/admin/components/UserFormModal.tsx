import { useState, useEffect } from 'react';
import type { AdminUser } from '../types/adminUser';
import { X } from 'lucide-react';

interface UserFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: UserFormData) => void;
    user?: AdminUser | null;
    loading?: boolean;
}

export interface UserFormData {
    fullName: string;
    email: string;
    role: 'Customer' | 'Admin';
    isActive: boolean;
}

const initialFormData: UserFormData = {
    fullName: '',
    email: '',
    role: 'Customer',
    isActive: true,
};

export default function UserFormModal({
    open,
    onClose,
    onSubmit,
    user,
    loading,
}: UserFormModalProps) {
    const [form, setForm] = useState<UserFormData>(initialFormData);

    useEffect(() => {
        if (user) {
            setForm({
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                isActive: user.isActive ?? true,
            });
        } else {
            setForm(initialFormData);
        }
    }, [user, open]);

    if (!open) return null;

    const isEdit = !!user;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setForm((prev) => ({
            ...prev,
            [name]: finalValue,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-24 pb-10 px-4"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'fadeInUp 0.25s ease-out' }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{ background: '#1B5E3F', color: 'white' }}
                >
                    <h2 className="text-lg font-semibold">
                        {user?.isDeleted ? 'Müşteriyi Geri Yükle ve Düzenle' : (isEdit ? 'Müşteriyi Düzenle' : 'Yeni Müşteri Ekle')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                        <input
                            name="fullName"
                            value={form.fullName}
                            onChange={(e) => {
                                handleChange(e);
                                e.target.setCustomValidity('');
                            }}
                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Lütfen bu alanı doldurun.')}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                            style={{ '--tw-ring-color': '#1B5E3F' } as React.CSSProperties}
                            placeholder="Ad ve soyadı girin"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => {
                                handleChange(e);
                                e.target.setCustomValidity('');
                            }}
                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Lütfen geçerli bir e-posta adresi girin.')}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                            style={{ '--tw-ring-color': '#1B5E3F' } as React.CSSProperties}
                            placeholder="ornek@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                            style={{ '--tw-ring-color': '#1B5E3F' } as React.CSSProperties}
                        >
                            <option value="Customer">Müşteri</option>
                            <option value="Admin">Yönetici</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={form.isActive}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B5E3F]"></div>
                        </label>
                        <div>
                            <span className="block text-sm font-semibold text-gray-900">Hesap Aktif</span>
                            <span className="block text-xs text-gray-500">Bu kullanıcı sisteme giriş yapabilecek mi?</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
                            style={{ background: '#1B5E3F' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#164A32')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = '#1B5E3F')}
                        >
                            {loading ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Ekle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
