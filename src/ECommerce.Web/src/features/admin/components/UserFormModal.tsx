import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AdminUser } from '../types/adminUser';
import { X } from 'lucide-react';
import { useAdminUserSchema, type AdminUserFormData } from '@/lib/validations/admin.schema';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation('admin');
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

    const modalTitle = user?.isDeleted
        ? t('modals.user.titleRestore')
        : isEdit
        ? t('modals.user.titleEdit')
        : t('modals.user.titleAdd');

    const inputClass = (hasError: boolean) =>
        `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-colors bg-background text-foreground ${
            hasError
                ? 'border-red-400 focus:ring-red-400/30 bg-red-50/30 dark:bg-red-900/10'
                : 'border-border focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)]'
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
                className="bg-card rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'fadeInUp 0.25s ease-out' }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{ background: 'var(--brand-surface)', color: 'white' }}
                >
                    <h2 className="text-lg font-semibold">{modalTitle}</h2>
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
                        <label className="block text-sm font-medium text-foreground mb-1">{t('forms.labels.fullName')} *</label>
                        <input
                            {...register('fullName')}
                            className={inputClass(!!errors.fullName)}
                            placeholder={t('forms.placeholders.fullName')}
                        />
                        {errorMsg(errors.fullName?.message)}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">{t('forms.labels.email')} *</label>
                        <input
                            type="email"
                            {...register('email')}
                            className={inputClass(!!errors.email)}
                            placeholder={t('forms.placeholders.email')}
                        />
                        {errorMsg(errors.email?.message)}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">{t('forms.labels.role')} *</label>
                        <select
                            {...register('role')}
                            className={inputClass(!!errors.role)}
                        >
                            <option value="Customer">{t('forms.labels.roleCustomer')}</option>
                            <option value="Admin">{t('forms.labels.roleAdmin')}</option>
                        </select>
                        {errorMsg(errors.role?.message)}
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/10 rounded-lg border border-border">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('isActive')}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
                        </label>
                        <div>
                            <span className="block text-sm font-semibold text-foreground">{t('forms.labels.isActive')}</span>
                            <span className="block text-xs text-muted-foreground">{t('forms.labels.isActiveHint')}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-foreground bg-accent hover:bg-accent/80 rounded-lg transition-colors"
                        >
                            {t('modals.orderStatus.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
                            style={{ background: 'var(--brand-primary)' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--brand-primary-dark)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--brand-primary)')}
                        >
                            {loading ? t('buttons.saving') : isEdit ? t('modals.orderStatus.confirm') : t('common:add')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
