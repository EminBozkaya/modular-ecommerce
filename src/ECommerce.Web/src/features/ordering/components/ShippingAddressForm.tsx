import type { ShippingAddress } from '../types/order';

interface ShippingAddressFormProps {
    value: ShippingAddress;
    onChange: (address: ShippingAddress) => void;
    disabled?: boolean;
    /** When true, hides the card wrapper and header (used when embedded inside a parent card) */
    hideHeader?: boolean;
}

const inputClass =
    'w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[var(--color-ebrar-green)] focus:bg-white focus:ring-2 focus:ring-[var(--color-ebrar-green)]/20 disabled:cursor-not-allowed disabled:opacity-50';

const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5';

export function ShippingAddressForm({ value, onChange, disabled, hideHeader }: ShippingAddressFormProps) {
    const handleChange =
        (field: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange({ ...value, [field]: e.target.value });
        };

    const fields = (
        <div className="space-y-4">
            <div>
                <label className={labelClass}>
                    Ad Soyad <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={value.fullName}
                    onChange={handleChange('fullName')}
                    disabled={disabled}
                    className={inputClass}
                    placeholder="Ali Yilmaz"
                />
            </div>

            <div>
                <label className={labelClass}>
                    Adres <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={value.addressLine1}
                    onChange={handleChange('addressLine1')}
                    disabled={disabled}
                    className={inputClass}
                    placeholder="Sokak, Mahalle, Kapi No"
                />
            </div>

            <div>
                <label className={labelClass}>Adres Satiri 2</label>
                <input
                    type="text"
                    value={value.addressLine2 || ''}
                    onChange={handleChange('addressLine2')}
                    disabled={disabled}
                    className={inputClass}
                    placeholder="Kat, Daire (istege bagli)"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelClass}>
                        Sehir <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={value.city}
                        onChange={handleChange('city')}
                        disabled={disabled}
                        className={inputClass}
                        placeholder="Istanbul"
                    />
                </div>
                <div>
                    <label className={labelClass}>
                        Posta Kodu <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={value.postalCode}
                        onChange={handleChange('postalCode')}
                        disabled={disabled}
                        className={inputClass}
                        placeholder="34000"
                    />
                </div>
            </div>

            <div>
                <label className={labelClass}>
                    Ulke <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={value.country}
                    onChange={handleChange('country')}
                    disabled={disabled}
                    className={inputClass}
                    placeholder="Turkiye"
                />
            </div>
        </div>
    );

    if (hideHeader) {
        return fields;
    }

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-ebrar-green)] text-white text-xs font-bold shrink-0">
                    1
                </div>
                <h2 className="text-base font-semibold text-gray-900">Teslimat Adresi</h2>
            </div>
            {fields}
        </div>
    );
}
