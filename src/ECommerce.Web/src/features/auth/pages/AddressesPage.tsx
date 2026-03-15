import { useState } from 'react';
import { MapPin, Plus, Home, Briefcase, Trash2, Edit2, Star, X, Check } from 'lucide-react';
import { useAddresses, useAddAddress, useUpdateAddress, useDeleteAddress, useSetDefaultAddress } from '../hooks/useAddresses';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import type { UserAddress, AddUserAddressRequest, UpdateUserAddressRequest } from '../types/address';
import { useTranslation } from 'react-i18next';

// ─── Inline address form ───────────────────────────────────────────────────────

interface AddressFormState {
    title: string;
    fullName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

const emptyForm: AddressFormState = {
    title: '',
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    country: 'Türkiye',
    isDefault: false,
};

const inputClass =
    'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[var(--color-ebrar-green)] focus:bg-white focus:ring-2 focus:ring-[var(--color-ebrar-green)]/20';
const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1';

interface AddressFormProps {
    initial?: AddressFormState;
    onSave: (data: AddressFormState) => void;
    onCancel: () => void;
    isSaving: boolean;
}

function AddressForm({ initial = emptyForm, onSave, onCancel, isSaving }: AddressFormProps) {
    const [form, setForm] = useState<AddressFormState>(initial);
    const { t } = useTranslation('auth');
    const { t: tc } = useTranslation('common');
    const set = (field: keyof AddressFormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const isValid = form.title && form.fullName && form.addressLine1 && form.city && form.postalCode && form.country;

    return (
        <div className="space-y-3 rounded-2xl border border-[var(--color-ebrar-green)]/30 bg-[var(--color-ebrar-green)]/5 p-5">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelClass}>{t('addresses.form.titleField')}</label>
                    <input className={inputClass} value={form.title} onChange={set('title')} placeholder={t('addresses.form.titlePlaceholder')} />
                </div>
                <div>
                    <label className={labelClass}>{t('addresses.form.fullName')}</label>
                    <input className={inputClass} value={form.fullName} onChange={set('fullName')} placeholder={t('addresses.form.fullNamePlaceholder')} />
                </div>
            </div>
            <div>
                <label className={labelClass}>{t('addresses.form.addressLine1')}</label>
                <input className={inputClass} value={form.addressLine1} onChange={set('addressLine1')} placeholder={t('addresses.form.addressPlaceholder')} />
            </div>
            <div>
                <label className={labelClass}>{t('addresses.form.addressLine2')}</label>
                <input className={inputClass} value={form.addressLine2} onChange={set('addressLine2')} placeholder={t('addresses.form.address2Placeholder')} />
            </div>
            <div className="grid grid-cols-3 gap-3">
                <div>
                    <label className={labelClass}>{t('addresses.form.city')}</label>
                    <input className={inputClass} value={form.city} onChange={set('city')} placeholder={t('addresses.form.cityPlaceholder')} />
                </div>
                <div>
                    <label className={labelClass}>{t('addresses.form.postalCode')}</label>
                    <input className={inputClass} value={form.postalCode} onChange={set('postalCode')} placeholder={t('addresses.form.postalPlaceholder')} />
                </div>
                <div>
                    <label className={labelClass}>{t('addresses.form.country')}</label>
                    <input className={inputClass} value={form.country} onChange={set('country')} placeholder={t('addresses.form.countryPlaceholder')} />
                </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
                    className="rounded accent-[var(--color-ebrar-green)]"
                />
                {t('addresses.form.setAsDefault')}
            </label>
            <div className="flex gap-2 pt-1">
                <button
                    type="button"
                    onClick={() => onSave(form)}
                    disabled={isSaving || !isValid}
                    className="flex items-center gap-1.5 rounded-xl bg-[var(--color-ebrar-green)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-[var(--color-ebrar-green-dark)] transition-colors"
                >
                    {isSaving ? <LoadingSpinner size="sm" /> : <Check className="h-4 w-4" />}
                    {tc('buttons.save')}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    <X className="h-4 w-4" />
                    {tc('buttons.cancel')}
                </button>
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AddressesPage() {
    const { data: addresses, isLoading, isError, refetch } = useAddresses();
    const addMutation = useAddAddress();
    const updateMutation = useUpdateAddress();
    const deleteMutation = useDeleteAddress();
    const setDefaultMutation = useSetDefaultAddress();
    const { t } = useTranslation('auth');

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleAdd = async (form: AddressFormState) => {
        const req: AddUserAddressRequest = {
            title: form.title,
            fullName: form.fullName,
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2 || undefined,
            city: form.city,
            postalCode: form.postalCode,
            country: form.country,
            isDefault: form.isDefault,
        };
        await addMutation.mutateAsync(req);
        setShowAddForm(false);
    };

    const handleUpdate = async (id: string, form: AddressFormState) => {
        const req: UpdateUserAddressRequest = {
            title: form.title,
            fullName: form.fullName,
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2 || undefined,
            city: form.city,
            postalCode: form.postalCode,
            country: form.country,
        };
        await updateMutation.mutateAsync({ id, req });
        setEditingId(null);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm(t('addresses.deleteConfirm'))) return;
        await deleteMutation.mutateAsync(id);
    };

    const handleSetDefault = async (id: string) => {
        await setDefaultMutation.mutateAsync(id);
    };

    if (isLoading) {
        return (
            <div className="flex h-[40vh] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto px-4 py-12">
                <ErrorMessage message={t('addresses.loadError')} onRetry={() => refetch()} />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-[var(--color-ebrar-green)] flex items-center justify-center text-white shadow-lg">
                            <MapPin className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 font-serif">
                                {t('addresses.title')} <span className="text-[var(--color-ebrar-green)]">{t('addresses.titleHighlight')}</span>
                            </h1>
                            <p className="text-sm text-gray-500">
                                {t('addresses.subtitle')}
                            </p>
                        </div>
                    </div>

                    {!showAddForm && (
                        <button
                            onClick={() => { setShowAddForm(true); setEditingId(null); }}
                            className="flex items-center justify-center gap-2 bg-[var(--color-ebrar-green)] text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-green-900/10 hover:bg-[var(--color-ebrar-green-dark)] transition-all active:scale-95"
                        >
                            <Plus className="h-5 w-5" />
                            {t('addresses.addNew')}
                        </button>
                    )}
                </div>

                {/* Add form */}
                {showAddForm && (
                    <div className="mb-6">
                        <AddressForm
                            onSave={handleAdd}
                            onCancel={() => setShowAddForm(false)}
                            isSaving={addMutation.isPending}
                        />
                    </div>
                )}

                {/* Address list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses?.map((addr: UserAddress) => (
                        <div key={addr.id}>
                            {editingId === addr.id ? (
                                <AddressForm
                                    initial={{
                                        title: addr.title,
                                        fullName: addr.fullName,
                                        addressLine1: addr.addressLine1,
                                        addressLine2: addr.addressLine2 ?? '',
                                        city: addr.city,
                                        postalCode: addr.postalCode,
                                        country: addr.country,
                                        isDefault: addr.isDefault,
                                    }}
                                    onSave={(form) => handleUpdate(addr.id, form)}
                                    onCancel={() => setEditingId(null)}
                                    isSaving={updateMutation.isPending}
                                />
                            ) : (
                                <div className="group bg-white rounded-3xl p-6 shadow-xl shadow-black/5 border border-gray-100 hover:border-[var(--color-ebrar-green)] transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-[var(--color-ebrar-green)]">
                                                {addr.title.toLowerCase().includes('iş') || addr.title.toLowerCase().includes('is')
                                                    ? <Briefcase className="h-5 w-5" />
                                                    : <Home className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{addr.title}</h3>
                                                {addr.isDefault && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-ebrar-green)]">
                                                        {t('addresses.default')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {!addr.isDefault && (
                                                <button
                                                    title={t('addresses.makeDefault')}
                                                    onClick={() => handleSetDefault(addr.id)}
                                                    disabled={setDefaultMutation.isPending}
                                                    className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
                                                >
                                                    <Star className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => { setEditingId(addr.id); setShowAddForm(false); }}
                                                className="p-2 text-gray-400 hover:text-[var(--color-ebrar-green)] hover:bg-[var(--color-ebrar-green)]/10 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(addr.id)}
                                                disabled={deleteMutation.isPending}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-gray-800">{addr.fullName}</p>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            {addr.addressLine1}
                                            {addr.addressLine2 && <>, {addr.addressLine2}</>}
                                            <br />
                                            {addr.city}, {addr.postalCode} — {addr.country}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {!showAddForm && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-3xl p-10 text-gray-400 hover:border-[var(--color-ebrar-green)] hover:text-[var(--color-ebrar-green)] transition-all bg-white/40"
                        >
                            <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center">
                                <Plus className="h-6 w-6" />
                            </div>
                            <span className="text-sm font-bold">{t('addresses.addAnother')}</span>
                        </button>
                    )}
                </div>

                {addresses?.length === 0 && !showAddForm && (
                    <p className="text-center text-gray-400 mt-8 text-sm">
                        {t('addresses.noAddresses')}
                    </p>
                )}
            </div>
        </div>
    );
}
