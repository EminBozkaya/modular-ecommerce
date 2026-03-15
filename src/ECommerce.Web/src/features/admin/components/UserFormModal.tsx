import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AdminUser } from '../types/adminUser';
import { X } from 'lucide-react';
import { useAdminUserSchema, type AdminUserFormData } from '@/lib/validations/admin.schema';

interface UserFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: UserFormData) => void;
    user?: AdminUser | null;
    loading?: boolean;
}

// UserFormData artık admin.schema.ts'ten gelir — geriye dönük uyumluluk için re-export
export type UserFormData = AdminUserFormData;

export default function UserFormModal({
    open,
    onClose,
    onSubmit,
    user,
    loading,
}: UserFormModalProps) {
    const adminUserSchema = useAdminUserSchema();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AdminUserFormData>({
        resolver: zodResolver(adminUserSchema),
        defaultValues: {
            fullName: '',
            email: '',
            role: 'Customer',
            isActive: true,
        },
    });

    useEffect(() => {
        if (user) {
            reset({
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                isActive: user.isActive ?? true,
            });
        } else {
            reset({
                fullName: '',
                email: '',
                role: 'Customer',
                isActive: true,
            });
        }
    }, [user, open, reset]);

    if (!open) return null;

    const isEdit = !!user;

    const inputClass = (hasError: boolean) =>
        `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-colors ${
            hasError
                ? 'border-red-400 focus:ring-red-400/30 bg-red-50/30'
                : 'border-gray-300 focus:ring-[#1B5E3F]/30 focus:border-[#1B5E3F]'
        }`;

    const errorMsg = (msg: string | undefined) =>
        msg ? <p className="mt-1 text-xs font-semibold text-red-600" role="alert">{msg}</p> : null;

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
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4" noValidate>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                        <input
                            {...register('fullName')}
                            className={inputClass(!!errors.fullName)}
                            placeholder="Ad ve soyadı girin"
                        />
                        {errorMsg(errors.fullName?.message)}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                        <input
                            type="email"
                            {...register('email')}
                            className={inputClass(!!errors.email)}
                            placeholder="ornek@email.com"
                        />
                        {errorMsg(errors.email?.message)}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
                        <select
                            {...register('role')}
                            className={inputClass(!!errors.role)}
                        >
                            <option value="Customer">Müşteri</option>
                            <option value="Admin">Yönetici</option>
                        </select>
                        {errorMsg(errors.role?.message)}
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('isActive')}
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
