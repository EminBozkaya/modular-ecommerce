import { useEffect, useState } from 'react';
import { useCities, useDistricts } from '../../hooks/useLocation';
import { TURKEY_COUNTRY_ID, TURKEY_NAME } from '../../api/locationApi';
import { useTranslation } from 'react-i18next';

interface CityDistrictSelectProps {
    country: string;
    cityValue: string;
    districtValue: string;
    onCityChange: (name: string) => void;
    onDistrictChange: (name: string) => void;
    onCityIdChange?: (id: number | null) => void;
    onDistrictIdChange?: (id: number | null) => void;
    disabled?: boolean;
    hasErrorCity?: boolean;
    hasErrorDistrict?: boolean;
    labelClass: string;
    inputClass: (hasError: boolean) => string;
}

const isTurkey = (country: string) =>
    country.trim().toLowerCase() === TURKEY_NAME.toLowerCase() ||
    country.trim().toLowerCase() === 'turkey';

export function CityDistrictSelect({
    country,
    cityValue,
    districtValue,
    onCityChange,
    onDistrictChange,
    onCityIdChange,
    onDistrictIdChange,
    disabled,
    hasErrorCity,
    hasErrorDistrict,
    labelClass,
    inputClass,
}: CityDistrictSelectProps) {
    const { t } = useTranslation('checkout');
    const showDropdowns = isTurkey(country);

    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

    const { data: cities } = useCities(showDropdowns ? TURKEY_COUNTRY_ID : null);
    const { data: districts } = useDistricts(selectedCityId);

    // When cities load, try to match existing cityValue to find the cityId
    useEffect(() => {
        if (cities && cityValue) {
            const match = cities.find(c => c.name === cityValue);
            if (match) {
                setSelectedCityId(match.id);
                onCityIdChange?.(match.id);
            }
        }
    }, [cities, cityValue]);

    // Reset district when city changes
    const handleCityChange = (cityId: number, cityName: string) => {
        setSelectedCityId(cityId);
        onCityChange(cityName);
        onCityIdChange?.(cityId);
        onDistrictChange('');
        onDistrictIdChange?.(null);
    };

    const selectClass = (hasError: boolean) =>
        `w-full rounded-xl border px-4 py-2.5 text-sm text-foreground outline-none transition-all bg-gray-50/50 dark:bg-white/10 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            hasError
                ? 'border-red-400 bg-red-50/30 dark:bg-red-900/10 focus:border-red-500 focus:ring-red-500/20'
                : 'border-border focus:border-[var(--brand-primary)] focus:ring-[var(--brand-primary)]/10'
        }`;

    const errorClass = 'mt-1.5 text-xs font-semibold text-red-600 ml-0.5';

    if (!showDropdowns) {
        // Non-Turkey: plain text input
        return (
            <div>
                <label className={labelClass}>
                    {t('shipping.city')} <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={cityValue}
                    onChange={e => onCityChange(e.target.value)}
                    disabled={disabled}
                    className={inputClass(!!hasErrorCity)}
                />
                {hasErrorCity && <p className={errorClass} role="alert">{t('shipping.city')}</p>}
            </div>
        );
    }

    return (
        <>
            {/* City dropdown */}
            <div>
                <label className={labelClass}>
                    {t('shipping.city')} <span className="text-red-400">*</span>
                </label>
                <select
                    value={selectedCityId ?? ''}
                    onChange={e => {
                        const id = Number(e.target.value);
                        const city = cities?.find(c => c.id === id);
                        if (city) handleCityChange(city.id, city.name);
                    }}
                    disabled={disabled || !cities}
                    className={selectClass(!!hasErrorCity)}
                >
                    <option value="" className="bg-card text-foreground">{t('shipping.citySelect')}</option>
                    {cities?.map(c => (
                        <option key={c.id} value={c.id} className="bg-card text-foreground">{c.name}</option>
                    ))}
                </select>
                {hasErrorCity && <p className={errorClass} role="alert">{t('shipping.city')}</p>}
            </div>

            {/* District dropdown — shown after city selected */}
            {selectedCityId && (
                <div>
                    <label className={labelClass}>
                        {t('shipping.district')}
                    </label>
                    <select
                        value={districts?.find(d => d.name === districtValue)?.id ?? ''}
                        onChange={e => {
                            const id = Number(e.target.value);
                            const district = districts?.find(d => d.id === id);
                            if (district) {
                                onDistrictChange(district.name);
                                onDistrictIdChange?.(district.id);
                            }
                        }}
                        disabled={disabled || !districts}
                        className={selectClass(!!hasErrorDistrict)}
                    >
                        <option value="" className="bg-card text-foreground">{t('shipping.districtSelect')}</option>
                        {districts?.map(d => (
                            <option key={d.id} value={d.id} className="bg-card text-foreground">{d.name}</option>
                        ))}
                    </select>
                </div>
            )}
        </>
    );
}
