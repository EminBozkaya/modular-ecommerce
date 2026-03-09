import type { ShippingAddress } from '../types/order';

interface ShippingAddressFormProps {
    value: ShippingAddress;
    onChange: (address: ShippingAddress) => void;
    disabled?: boolean;
}

export function ShippingAddressForm({ value, onChange, disabled }: ShippingAddressFormProps) {
    const handleChange = (field: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...value, [field]: e.target.value });
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Teslimat Adresi</h3>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                    Ad Soyad <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={value.fullName}
                    onChange={handleChange('fullName')}
                    disabled={disabled}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-muted"
                    placeholder="Ali Yilmaz"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                    Adres Satiri 1 <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={value.addressLine1}
                    onChange={handleChange('addressLine1')}
                    disabled={disabled}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-muted"
                    placeholder="Sokak, Mahalle, No"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                    Adres Satiri 2
                </label>
                <input
                    type="text"
                    value={value.addressLine2 || ''}
                    onChange={handleChange('addressLine2')}
                    disabled={disabled}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-muted"
                    placeholder="Kat, Daire (istege bagli)"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Sehir <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={value.city}
                        onChange={handleChange('city')}
                        disabled={disabled}
                        className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-muted"
                        placeholder="Istanbul"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Posta Kodu <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={value.postalCode}
                        onChange={handleChange('postalCode')}
                        disabled={disabled}
                        className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-muted"
                        placeholder="34000"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                    Ulke <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={value.country}
                    onChange={handleChange('country')}
                    disabled={disabled}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-muted"
                    placeholder="Turkiye"
                />
            </div>
        </div>
    );
}
