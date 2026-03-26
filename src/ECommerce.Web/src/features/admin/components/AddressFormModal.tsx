import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Search } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useAddressSchema, type AddressFormData } from '@/lib/validations/admin.schema';
import { getUsers, type AdminAddress, type AdminUser } from '../api/adminApi';
import { useTranslation } from 'react-i18next';

interface AddressFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: AddressFormData) => void;
    address?: AdminAddress | null;
    loading?: boolean;
}

export default function AddressFormModal({
    open,
    onClose,
    onSubmit,
    address,
    loading,
}: AddressFormModalProps) {
    const { t } = useTranslation('admin');
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const addressSchema = useAddressSchema();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            userId: '',
            title: '',
            fullName: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            postalCode: '',
            country: t('forms.labels.defaultCountry'),
            isActive: true,
        },
    });

    const isEdit = !!address;
    const selectedUserId = watch('userId');

    useEffect(() => {
        if (open && !isEdit) {
            setUsersLoading(true);
            getUsers().then(data => {
                setUsers(data);
                setUsersLoading(false);
            }).catch(err => {
                console.error('Kullanıcılar yüklenemedi:', err);
                setUsersLoading(false);
            });
        }
    }, [open, isEdit]);

    useEffect(() => {
        if (address) {
            reset({
                userId: address.userId || '',
                title: address.title,
                fullName: address.fullName,
                addressLine1: address.addressLine1,
                addressLine2: address.addressLine2 || '',
                city: address.city,
                postalCode: address.postalCode,
                country: address.country,
                isActive: address.isActive,
            });
        } else {
            reset({
                userId: '',
                title: '',
                fullName: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                postalCode: '',
                country: 'Türkiye',
                isActive: true,
            });
        }
    }, [address, open, reset]);

    const filteredUsers = searchTerm.trim()
        ? users.filter(u =>
            u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 10)
        : [];


    if (!open) return null;

    const modalTitle = address?.isDeleted
        ? t('modals.address.titleRestore')
        : isEdit
        ? t('modals.address.titleEdit')
        : t('modals.address.titleAdd');

    const inputClass = (hasError: boolean) =>
        `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-colors bg-background text-foreground ${
            hasError
                ? 'border-red-400 focus:ring-red-400/30 bg-red-50/30 dark:bg-red-900/10'
                : 'border-border focus:ring-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)]'
        }`;

    const errorMsg = (msg: string | undefined) =>
        msg ? <p className="mt-1 text-xs font-semibold text-red-600 font-inter">{msg}</p> : null;

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto pt-24 pb-10 px-4"
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
                    {!isEdit && (
                        <div className="space-y-2 p-3 bg-gray-50 dark:bg-white/10 rounded-lg border border-border">
                            <label className="block text-sm font-semibold text-foreground">{t('forms.labels.userSelect')} *</label>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <input
                                    type="text"
                                    className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
                                    placeholder="Kullanıcı ara (ad veya e-posta)..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="max-h-40 overflow-y-auto space-y-1 mt-2 custom-scrollbar">
                                {usersLoading ? (
                                    <p className="text-xs text-center py-2 text-muted-foreground italic font-medium font-inter">Kullanıcılar yükleniyor...</p>
                                ) : !searchTerm.trim() ? (
                                    <p className="text-xs text-center py-2 text-muted-foreground italic font-medium font-inter">Aramak için yazın...</p>
                                ) : filteredUsers.length > 0 ? (
                                    filteredUsers.map(u => (
                                        <button
                                            key={u.id}
                                            type="button"
                                            onClick={() => {
                                                setValue('userId', u.id, { shouldValidate: true });
                                                setSearchTerm(u.fullName);
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 font-inter ${
                                                selectedUserId === u.id
                                                    ? 'bg-[var(--brand-primary)] text-white shadow-md transform scale-[1.01]'
                                                    : 'hover:bg-accent text-foreground hover:text-[var(--brand-primary)]'
                                            }`}
                                        >
                                            <div className="font-semibold">{u.fullName}</div>
                                            <div className={`text-xs ${selectedUserId === u.id ? 'text-green-100' : 'text-muted-foreground'}`}>{u.email}</div>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-xs text-center py-2 text-muted-foreground italic font-medium font-inter">Kullanıcı bulunamadı.</p>
                                )}
                            </div>
                            {errorMsg(errors.userId?.message)}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">{t('forms.labels.addressTitle')} *</label>
                        <input
                            {...register('title')}
                            className={inputClass(!!errors.title)}
                            placeholder={t('forms.placeholders.addressTitle')}
                        />
                        {errorMsg(errors.title?.message)}
                    </div>

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
                        <label className="block text-sm font-medium text-foreground mb-1">{t('forms.labels.line1')} *</label>
                        <input
                            {...register('addressLine1')}
                            className={inputClass(!!errors.addressLine1)}
                            placeholder={t('forms.placeholders.line1')}
                        />
                        {errorMsg(errors.addressLine1?.message)}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">{t('forms.labels.line2')}</label>
                        <input
                            {...register('addressLine2')}
                            className={inputClass(!!errors.addressLine2)}
                            placeholder={t('forms.placeholders.line2')}
                        />
                        {errorMsg(errors.addressLine2?.message)}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">{t('forms.labels.city')} *</label>
                            <input
                                {...register('city')}
                                className={inputClass(!!errors.city)}
                                placeholder={t('forms.placeholders.city')}
                            />
                            {errorMsg(errors.city?.message)}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">{t('forms.labels.postalCode')} *</label>
                            <input
                                {...register('postalCode')}
                                className={inputClass(!!errors.postalCode)}
                                placeholder={t('forms.placeholders.postalCode')}
                            />
                            {errorMsg(errors.postalCode?.message)}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">{t('forms.labels.country')} *</label>
                        <input
                            {...register('country')}
                            className={inputClass(!!errors.country)}
                            placeholder={t('forms.placeholders.country')}
                        />
                        {errorMsg(errors.country?.message)}
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/10 rounded-lg border border-border">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('isActive')}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 dark:bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
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
                        >
                            {loading ? t('buttons.saving') : isEdit ? t('modals.orderStatus.confirm') : t('common:add')}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
