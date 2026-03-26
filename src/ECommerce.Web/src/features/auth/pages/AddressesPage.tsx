import { useState } from 'react';
import { MapPin, Plus, Home, Briefcase, Trash2, Edit2, Star, X, Check } from 'lucide-react';
import { useAddresses, useAddAddress, useUpdateAddress, useDeleteAddress, useSetDefaultAddress } from '../hooks/useAddresses';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { ErrorMessage } from '../../../components/shared/ErrorMessage';
import type { UserAddress, AddUserAddressRequest, UpdateUserAddressRequest } from '../types/address';
import { useTranslation } from 'react-i18next';
import { CityDistrictSelect } from '../../../components/shared/CityDistrictSelect';
import ConfirmModal from '../../admin/components/ConfirmModal';

// ─── Inline address form ───────────────────────────────────────────────────────

interface AddressFormState {
    title: string;
    fullName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    district: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    cityId: number | null;
    districtId: number | null;
}

const emptyForm: AddressFormState = {
    title: '',
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    postalCode: '',
    country: 'Türkiye',
    isDefault: false,
    cityId: null,
    districtId: null,
};

const inputClass =
    'w-full rounded-xl border border-border bg-gray-50/50 dark:bg-white/10 px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-[var(--brand-primary)] focus:bg-card focus:ring-2 focus:ring-[var(--brand-primary)]/10';
const labelClass = 'text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 mb-2 block';

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

    const inputClassFn = (hasError: boolean) =>
        `w-full rounded-xl border px-4 py-3 text-sm text-foreground outline-none transition-all focus:bg-card focus:ring-2 ${
            hasError
                ? 'border-red-400 bg-red-50/30 dark:bg-red-900/10 focus:border-red-500 focus:ring-red-500/20'
                : 'border-border bg-gray-50/50 dark:bg-white/10 focus:border-[var(--brand-primary)] focus:ring-[var(--brand-primary)]/10'
        }`;

    const isValid = form.title && form.fullName && form.addressLine1 && form.city && form.postalCode && form.country;

    return (
        <div className="bg-card rounded-3xl shadow-xl shadow-black/5 border border-border overflow-hidden p-8 animate-fadeInUp">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>{t('addresses.form.titleField')}</label>
                        <input className={inputClass} value={form.title} onChange={set('title')} />
                    </div>
                    <div>
                        <label className={labelClass}>{t('addresses.form.fullName')}</label>
                        <input className={inputClass} value={form.fullName} onChange={set('fullName')} />
                    </div>
                </div>
                <div>
                    <label className={labelClass}>{t('addresses.form.addressLine1')}</label>
                    <input className={inputClass} value={form.addressLine1} onChange={set('addressLine1')} />
                </div>
                <div>
                    <label className={labelClass}>{t('addresses.form.addressLine2')}</label>
                    <input className={inputClass} value={form.addressLine2} onChange={set('addressLine2')} />
                </div>
                <div>
                    <label className={labelClass}>{t('addresses.form.country')}</label>
                    <input className={inputClass} value={form.country} onChange={set('country')} />
                </div>
                <CityDistrictSelect
                    country={form.country}
                    cityValue={form.city}
                    districtValue={form.district}
                    onCityChange={name => setForm(prev => ({ ...prev, city: name, district: '' }))}
                    onDistrictChange={name => setForm(prev => ({ ...prev, district: name }))}
                    onCityIdChange={id => setForm(prev => ({ ...prev, cityId: id }))}
                    onDistrictIdChange={id => setForm(prev => ({ ...prev, districtId: id }))}
                    labelClass={labelClass}
                    inputClass={inputClassFn}
                />
                <div>
                    <label className={labelClass}>{t('addresses.form.postalCode')}</label>
                    <input className={inputClass} value={form.postalCode} onChange={set('postalCode')} />
                </div>

                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={form.isDefault}
                                onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border transition-all checked:bg-[var(--brand-primary)] checked:border-[var(--brand-primary)]"
                            />
                            <Check className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                            {t('addresses.form.setAsDefault')}
                        </span>
                    </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => onSave(form)}
                        disabled={isSaving || !isValid}
                        className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[var(--brand-primary)] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-black/5 hover:bg-[var(--brand-primary-dark)] transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSaving ? <LoadingSpinner size="sm" /> : <Check className="h-5 w-5" />}
                        {tc('buttons.save')}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-border px-6 py-4 text-sm font-bold text-muted-foreground hover:bg-accent transition-all active:scale-[0.98]"
                    >
                        <X className="h-5 w-5" />
                        {tc('buttons.cancel')}
                    </button>
                </div>
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
    const { t: tc } = useTranslation('common');

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

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
            cityId: form.cityId ?? undefined,
            districtId: form.districtId ?? undefined,
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
            cityId: form.cityId ?? undefined,
            districtId: form.districtId ?? undefined,
        };
        await updateMutation.mutateAsync({ id, req });
        setEditingId(null);
    };

    const handleDelete = (id: string) => {
        setDeletingId(id);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        await deleteMutation.mutateAsync(deletingId);
        setDeletingId(null);
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
                        <div className="h-16 w-16 rounded-2xl bg-[var(--brand-primary)] flex items-center justify-center text-white shadow-lg">
                            <MapPin className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-foreground font-serif">
                                {t('addresses.title')} <span className="text-[var(--brand-primary)]">{t('addresses.titleHighlight')}</span>
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {t('addresses.subtitle')}
                            </p>
                        </div>
                    </div>

                    {!showAddForm && (
                        <button
                            onClick={() => { setShowAddForm(true); setEditingId(null); }}
                            className="flex items-center justify-center gap-2 bg-[var(--brand-primary)] text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-black/5 hover:bg-[var(--brand-primary-dark)] transition-all active:scale-95"
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
                                        district: addr.districtName ?? addr.district ?? '',
                                        postalCode: addr.postalCode,
                                        country: addr.country,
                                        isDefault: addr.isDefault,
                                        cityId: addr.cityId ?? null,
                                        districtId: addr.districtId ?? null,
                                    }}
                                    onSave={(form) => handleUpdate(addr.id, form)}
                                    onCancel={() => setEditingId(null)}
                                    isSaving={updateMutation.isPending}
                                />
                            ) : (
                                <div className="group bg-card rounded-3xl p-6 shadow-xl shadow-black/5 border border-border hover:border-[var(--brand-primary)] transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-[var(--brand-primary)]">
                                                {addr.title.toLowerCase().includes('iş') || addr.title.toLowerCase().includes('is')
                                                    ? <Briefcase className="h-5 w-5" />
                                                    : <Home className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-foreground">{addr.title}</h3>
                                                {addr.isDefault && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--brand-primary)]">
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
                                                    className="p-2 text-muted-foreground hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                                                >
                                                    <Star className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => { setEditingId(addr.id); setShowAddForm(false); }}
                                                className="p-2 text-gray-400 hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary-light)] rounded-lg transition-colors"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(addr.id)}
                                                disabled={deleteMutation.isPending}
                                                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-foreground">{addr.fullName}</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {addr.addressLine1}
                                            {addr.addressLine2 && <>, {addr.addressLine2}</>}
                                            <br />
                                            {(addr.districtName || addr.district) && <>{addr.districtName || addr.district}, </>}{addr.city}, {addr.postalCode} — {addr.country}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {!showAddForm && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-3xl p-10 text-muted-foreground hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all bg-background/40 group mb-6"
                        >
                            <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center transition-colors group-hover:bg-[var(--brand-primary-light)]">
                                <Plus className="h-6 w-6" />
                            </div>
                            <span className="text-sm font-bold">{t('addresses.addAnother')}</span>
                        </button>
                    )}
                </div>

                {addresses?.length === 0 && !showAddForm && (
                    <p className="text-center text-muted-foreground mt-8 text-sm">
                        {t('addresses.noAddresses')}
                    </p>
                )}
            </div>

            <ConfirmModal 
                open={!!deletingId} 
                title={tc('buttons.delete', { defaultValue: 'Sil' })} 
                message={t('addresses.deleteConfirm')} 
                variant="danger" 
                confirmText={tc('buttons.delete', { defaultValue: 'Sil' })} 
                onConfirm={confirmDelete} 
                onClose={() => setDeletingId(null)} 
                loading={deleteMutation.isPending} 
            />
        </div>
    );
}
